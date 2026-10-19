"""Select source captions using audio/caption metadata, never list order."""
from requests import Session

AMBIGUOUS = 'Não foi possível confirmar o idioma original deste vídeo. Seleciona o idioma do vídeo para evitar devolver legendas noutra língua.'

class CaptionSession(Session):
    def __init__(self):
        super().__init__()
        self.caption_metadata = {}

    def request(self, *args, **kwargs):
        kwargs.setdefault('timeout', 20)
        response = super().request(*args, **kwargs)
        if '/youtubei/v1/player' in response.url and response.ok:
            try:
                renderer = response.json().get('captions', {}).get('playerCaptionsTracklistRenderer', {})
                if renderer.get('captionTracks'):
                    self.caption_metadata = renderer
            except (ValueError, AttributeError):
                pass
        return response

def base_language(code):
    return code.lower().split('-')[0]

def select_track(tracks, language, metadata=None):
    if not tracks:
        raise ValueError('Este vídeo não tem legendas disponíveis.')
    if language != 'auto':
        choices = [track for track in tracks if track.language_code == language or track.language_code.startswith(language + '-')]
        if not choices:
            raise ValueError('Não há legendas neste idioma. Experimenta a deteção automática.')
        return min(choices, key=lambda track: track.is_generated)

    metadata = metadata or {}
    captions = metadata.get('captionTracks', [])
    audio_tracks = metadata.get('audioTracks', [])
    # The audio-associated ASR track identifies the spoken language. A manual
    # caption may be a translation and must not win before language selection.
    audio_index = metadata.get('defaultAudioTrackIndex')
    original_audio = [audio for audio in audio_tracks if audio.get('audioTrackType') == 'ORIGINAL' or audio.get('isOriginal') is True]
    audio = original_audio[0] if len(original_audio) == 1 else (audio_tracks[audio_index] if isinstance(audio_index, int) and 0 <= audio_index < len(audio_tracks) else None)
    source_codes = set()
    if audio:
        audio_id = audio.get('audioTrackId', '').split('.')[0]
        if audio_id:
            matching = {base_language(track.language_code) for track in tracks if base_language(track.language_code) == base_language(audio_id)}
            if not matching:
                raise ValueError(AMBIGUOUS)
            source_codes = matching
        indices = audio.get('captionTrackIndices', [])
        if not source_codes:
            source_codes = {base_language(captions[index]['languageCode']) for index in indices if isinstance(index,int) and 0 <= index < len(captions) and captions[index].get('kind') == 'asr' and captions[index].get('languageCode')}
    if not source_codes:
        source_codes = {base_language(track.language_code) for track in tracks if track.is_generated}
    if len(source_codes) != 1:
        # A single manual language is not proof of the spoken language. Do not
        # silently return a translated manual track when source data is absent.
        raise ValueError(AMBIGUOUS)
    source_code = next(iter(source_codes))
    choices = [track for track in tracks if base_language(track.language_code) == source_code]
    if not choices:
        raise ValueError(AMBIGUOUS)
    return min(choices, key=lambda track: track.is_generated)
