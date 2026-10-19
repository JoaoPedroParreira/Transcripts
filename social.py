"""Local speech recognition. Downloaded media stays in memory."""
import io
import threading
from pathlib import Path
from urllib.parse import urlparse

LOCK = threading.Lock()
MODEL = None
MAX_BYTES = 80 * 1024 * 1024

def source_url(value):
    url = urlparse(value.strip())
    host = (url.hostname or '').lower()
    if url.scheme != 'https' or url.username or url.password or url.port not in (None, 443):
        raise ValueError('Usa um link HTTPS válido.')
    if host in ('tiktok.com', 'www.tiktok.com', 'vm.tiktok.com', 'vt.tiktok.com'):
        platform = 'TikTok'
    elif host in ('instagram.com', 'www.instagram.com') and url.path.startswith(('/reel/', '/reels/')):
        platform = 'Instagram Reels'
    else:
        raise ValueError('Usa um link de vídeo do TikTok ou de um Reel do Instagram.')
    return platform, url.geturl()

def transcribe_social(value, language):
    platform, url = source_url(value)
    if not LOCK.acquire(blocking=False):
        raise ValueError('Já está uma transcrição de áudio em curso. Aguarda e tenta novamente.')
    try:
        import yt_dlp
        import requests
        from faster_whisper import WhisperModel
        class QuietLogger:
            def debug(self, *args): pass
            def warning(self, *args): pass
            def error(self, *args): pass
        options = {'quiet': True, 'logger': QuietLogger(), 'noplaylist': True,
                   'skip_download': True, 'cachedir': False, 'socket_timeout': 20,
                   'retries': 1, 'extractor_retries': 1, 'format': 'bestaudio/best', 'playlistend': 1}
        with yt_dlp.YoutubeDL(options) as downloader:
            info = downloader.extract_info(url, download=False)
        if not info or info.get('_type') in ('playlist', 'multi_video'):
            raise ValueError('Cola o link de um único vídeo público.')
        if not info.get('duration') or info['duration'] > 600:
            raise ValueError('A transcrição local suporta vídeos com duração conhecida até 10 minutos.')
        media_url = info.get('url', '')
        if urlparse(media_url).scheme != 'https':
            raise ValueError('Não foi possível obter o áudio deste vídeo.')
        with io.BytesIO() as audio:
            with requests.get(media_url, headers=info.get('http_headers', {}), stream=True, timeout=(15, 30)) as response:
                response.raise_for_status()
                for chunk in response.iter_content(65536):
                    if audio.tell() + len(chunk) > MAX_BYTES:
                        raise ValueError('O vídeo ultrapassa o limite de 80 MB. Experimenta um vídeo mais curto.')
                    audio.write(chunk)
            audio.seek(0)
            global MODEL
            if MODEL is None:
                MODEL = WhisperModel('base', device='cpu', compute_type='int8', download_root=str(Path(__file__).parent / '.models'))
            segments, detected = MODEL.transcribe(audio, language=None if language == 'auto' else language, vad_filter=True, beam_size=3)
            result = [{'start': s.start, 'duration': max(0, s.end - s.start), 'text': s.text.strip()} for s in segments if s.text.strip()]
        if not result:
            raise ValueError('Não foi detetada fala neste vídeo.')
        return {'platform': platform, 'sourceUrl': url, 'language': detected.language,
                'generated': True, 'method': 'speech', 'segments': result}
    finally:
        LOCK.release()
