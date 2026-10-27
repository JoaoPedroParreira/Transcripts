"""Supadata adapter. The key is read only from the server environment."""
import math
import os
import re
import time
from urllib.parse import urlparse
import requests

class ProviderUnavailable(ValueError):
    pass

def provider_transcript(url, language, video_ident=None):
    key = os.environ.get('SUPADATA_API_KEY', '')
    if not key:
        raise ProviderUnavailable('O serviço de transcrição ainda não está configurado.')
    params = {'url':url, 'text':'false', 'mode':'auto'}
    if language != 'auto':
        params['lang'] = language
    with requests.Session() as session:
        session.headers['x-api-key'] = key
        response = session.get('https://api.supadata.ai/v1/transcript', params=params, timeout=(10,110), allow_redirects=False)
        data = read_response(response)
        if response.status_code == 202:
            job = data.get('jobId', '')
            if not re.fullmatch(r'[a-zA-Z0-9_-]{1,128}', job):
                raise ProviderUnavailable('O fornecedor devolveu um pedido inválido.')
            deadline = time.monotonic() + 420
            while time.monotonic() < deadline:
                time.sleep(2)
                response = session.get('https://api.supadata.ai/v1/transcript/'+job, timeout=(10,30), allow_redirects=False)
                data = read_response(response)
                if data.get('status') == 'failed':
                    raise ProviderUnavailable('O fornecedor não conseguiu transcrever este vídeo.')
                if data.get('status') == 'completed':
                    data = data.get('result',data)
                    break
            else:
                raise ProviderUnavailable('A transcrição demorou demasiado. Tenta um vídeo mais curto.')
    result_language = data.get('lang','')
    if language != 'auto' and result_language.lower().split('-')[0] != language.lower().split('-')[0]:
        raise ProviderUnavailable('Não há legendas neste idioma. Experimenta a deteção automática.')
    content = data.get('content')
    if not isinstance(content,list):
        raise ProviderUnavailable('O fornecedor não devolveu uma transcrição com tempos.')
    segments=[]
    for item in content:
        if not isinstance(item,dict) or not isinstance(item.get('text'),str):
            continue
        start,duration=float(item.get('offset',0))/1000,float(item.get('duration',0))/1000
        if math.isfinite(start) and math.isfinite(duration) and start >= 0 and duration >= 0 and item['text'].strip():
            segments.append({'text':item['text'],'start':start,'duration':duration})
    if not segments:
        raise ProviderUnavailable('Não foi encontrado texto neste vídeo.')
    host=urlparse(url).hostname or ''
    result={'language':result_language,'languageCode':result_language,'method':'provider','provider':'Supadata','segments':segments}
    if video_ident:
        result['videoId']=video_ident
    else:
        result['sourceUrl']=url
        result['platform']='Instagram Reels' if 'instagram.com' in host else 'TikTok'
    return result

def read_response(response):
    if response.status_code in (402,429):
        raise ProviderUnavailable('O serviço gratuito atingiu o limite de créditos ou de pedidos. Tenta novamente mais tarde.')
    if response.status_code in (401,403):
        raise ProviderUnavailable('O fornecedor não autorizou este pedido. Verifica a configuração ou a disponibilidade do vídeo.')
    if response.status_code not in (200,202):
        raise ProviderUnavailable('O fornecedor não disponibilizou este vídeo. Experimenta outro vídeo público.')
    return response.json()
