"""Local-only transcript workspace. No persistence, cookies, or access logs."""
import json
import re
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse, parse_qs

ROOT = Path(__file__).parent / 'public'
HOST = '127.0.0.1:8765'

def video_id(value):
    value = value.strip()
    if re.fullmatch(r'[\w-]{11}', value):
        return value
    url = urlparse(value)
    if url.scheme not in ('https', 'http') or url.hostname not in ('youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be', 'www.youtube-nocookie.com'):
        raise ValueError('Introduz um link válido do YouTube.')
    parts = url.path.strip('/').split('/')
    candidate = parts[0] if url.hostname == 'youtu.be' else (parts[1] if len(parts) == 2 and parts[0] in ('shorts', 'embed', 'live') else parse_qs(url.query).get('v', [''])[0])
    if not re.fullmatch(r'[\w-]{11}', candidate):
        raise ValueError('Não foi possível identificar o vídeo neste link.')
    return candidate

class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def reply(self, status, data, kind='application/json; charset=utf-8'):
        raw = json.dumps(data, ensure_ascii=False).encode() if isinstance(data, dict) else data
        self.send_response(status)
        self.send_header('Content-Type', kind)
        self.send_header('Content-Length', str(len(raw)))
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Referrer-Policy', 'no-referrer')
        self.send_header('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; frame-ancestors 'none'; base-uri 'none'; form-action 'self'")
        self.end_headers()
        self.wfile.write(raw)

    def do_GET(self):
        if self.headers.get('Host') != HOST:
            return self.reply(403, {'error': 'Host não permitido.'})
        files = {'/': ('index.html', 'text/html; charset=utf-8'), '/app.js': ('app.js', 'text/javascript; charset=utf-8'), '/style.css': ('style.css', 'text/css; charset=utf-8')}
        entry = files.get(self.path)
        if self.path == '/theme.js':
            entry = ('theme.js', 'text/javascript; charset=utf-8')
        if self.path == '/i18n.js':
            entry = ('i18n.js', 'text/javascript; charset=utf-8')
        if not entry:
            return self.reply(404, {'error': 'Não encontrado.'})
        self.reply(200, (ROOT / entry[0]).read_bytes(), entry[1])

    def do_POST(self):
        if self.headers.get('Host') != HOST or self.headers.get('Origin') != 'http://' + HOST:
            return self.reply(403, {'error': 'Pedido externo bloqueado.'})
        if self.path != '/api/transcript':
            return self.reply(404, {'error': 'Não encontrado.'})
        try:
            size = int(self.headers.get('Content-Length', '0'))
            if not 0 < size <= 4096:
                raise ValueError('Pedido demasiado grande ou vazio.')
            body = json.loads(self.rfile.read(size))
            value = body.get('url', '')
            language = body.get('language', 'auto')
            if not isinstance(language, str) or not re.fullmatch(r'auto|[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})?', language):
                raise ValueError('Idioma inválido.')
            host = (urlparse(value).hostname or '').lower()
            if host in ('tiktok.com', 'www.tiktok.com', 'vm.tiktok.com', 'vt.tiktok.com', 'instagram.com', 'www.instagram.com'):
                from social import transcribe_social
                return self.reply(200, transcribe_social(value, language))
            ident = video_id(value)
            from youtube_transcript_api import YouTubeTranscriptApi
            from youtube_tracks import CaptionSession, select_track
            with CaptionSession() as session:
                tracks = list(YouTubeTranscriptApi(http_client=session).list(ident))
                track = select_track(tracks, language, session.caption_metadata)
                fetched = track.fetch()
                self.reply(200, {'videoId': ident, 'language': track.language, 'languageCode': track.language_code, 'generated': track.is_generated, 'segments': fetched.to_raw_data()})
        except ValueError as error:
            self.reply(400, {'error': str(error) or 'Pedido inválido.'})
        except (TypeError, AttributeError):
            self.reply(400, {'error': 'Verifica o link e o idioma.'})
        except ImportError:
            self.reply(503, {'error': 'Falta instalar a dependência. Executa: pip install -r requirements.txt'})
        except Exception:
            self.reply(502, {'error': 'Não foi possível aceder ao vídeo ou processar o áudio. A plataforma pode exigir login ou bloquear o acesso. Usa um vídeo público acessível ou importa SRT/VTT. Na primeira transcrição de TikTok/Reels é necessário descarregar o modelo local.'})

if __name__ == '__main__':
    print('Fio disponível em http://' + HOST, flush=True)
    ThreadingHTTPServer(('127.0.0.1', 8765), Handler).serve_forever()
