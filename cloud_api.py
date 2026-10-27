"""Free-tier API: in-memory processing, no transcript files or database."""
import os
import re
import threading
import time
from collections import deque
from urllib.parse import urlparse
from flask import Flask, jsonify, request
from werkzeug.exceptions import HTTPException
from server import video_id

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 4096
ORIGIN = os.environ.get('ALLOWED_ORIGIN', 'https://joaopedroparreira.github.io')
ACTIVE = threading.BoundedSemaphore(1)
RATE_LOCK = threading.Lock()
RECENT = deque()

@app.after_request
def privacy_headers(response):
    response.headers['Cache-Control'] = 'no-store'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['Vary'] = 'Origin'
    if request.headers.get('Origin') == ORIGIN:
        response.headers['Access-Control-Allow-Origin'] = ORIGIN
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response

@app.get('/health')
def health():
    return jsonify(status='ok')

@app.route('/api/transcript', methods=['POST', 'OPTIONS'])
def transcript():
    if request.headers.get('Origin') != ORIGIN:
        return jsonify(error='Origin not allowed.'), 403
    if request.method == 'OPTIONS':
        return '', 204
    with RATE_LOCK:
        now = time.monotonic()
        while RECENT and now - RECENT[0] >= 600:
            RECENT.popleft()
        if len(RECENT) >= 20:
            return jsonify(error='O serviço gratuito atingiu o limite temporário. Tenta novamente mais tarde.'), 429
    if not ACTIVE.acquire(blocking=False):
        return jsonify(error='O serviço gratuito está ocupado. Tenta novamente dentro de alguns minutos.'), 429
    try:
        body = request.get_json(silent=True)
        if not isinstance(body, dict):
            return jsonify(error='Pedido inválido.'), 400
        url, language = body.get('url', ''), body.get('language', 'auto')
        if not isinstance(url, str) or len(url) > 2048 or not isinstance(language, str) or not re.fullmatch(r'auto|[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})?', language):
            return jsonify(error='Verifica o link e o idioma.'), 400
        with RATE_LOCK:
            RECENT.append(time.monotonic())
        host = (urlparse(url).hostname or '').lower()
        if host in ('tiktok.com', 'www.tiktok.com', 'vm.tiktok.com', 'vt.tiktok.com', 'instagram.com', 'www.instagram.com'):
            from social import transcribe_social
            return jsonify(transcribe_social(url, language))
        ident = video_id(url)
        from youtube_transcript_api import YouTubeTranscriptApi
        from youtube_tracks import CaptionSession, select_track
        with CaptionSession() as session:
            tracks = list(YouTubeTranscriptApi(http_client=session).list(ident))
            track = select_track(tracks, language, session.caption_metadata)
            fetched = track.fetch()
            return jsonify(videoId=ident, language=track.language, languageCode=track.language_code,
                           generated=track.is_generated, segments=fetched.to_raw_data())
    except ValueError as error:
        return jsonify(error=str(error)), 400
    except HTTPException:
        raise
    except Exception as error:
        # Do not log URLs, caption contents, upstream tokens or request bodies.
        return jsonify(error='A plataforma não disponibilizou este vídeo ao servidor gratuito. Pode exigir login, não ter legendas ou bloquear acessos de alojamentos. Experimenta outro vídeo ou importa SRT/VTT.', errorCode=type(error).__name__), 502
    finally:
        ACTIVE.release()

@app.errorhandler(413)
def too_large(error):
    return jsonify(error='Pedido demasiado grande.'), 413
