import unittest
from types import SimpleNamespace
from youtube_tracks import select_track, AMBIGUOUS

def track(code, generated):
    return SimpleNamespace(language_code=code, is_generated=generated)

class SelectionTests(unittest.TestCase):
    def test_portuguese_source_beats_manual_english_translation(self):
        english, portuguese = track('en',False), track('pt',True)
        for tracks in [[english,portuguese],[portuguese,english]]:
            self.assertIs(select_track(tracks,'auto'),portuguese)

    def test_prefer_manual_only_after_matching_source_language(self):
        english, source, manual = track('en',False), track('pt',True), track('pt-BR',False)
        self.assertIs(select_track([english,source,manual],'auto'),manual)

    def test_vietnamese_source(self):
        source=track('vi',True)
        self.assertIs(select_track([track('en',False),source],'auto'),source)

    def test_multiple_audio_languages_use_associated_asr(self):
        en,pt=track('en',True),track('pt',True)
        metadata={'defaultAudioTrackIndex':1,'audioTracks':[{'captionTrackIndices':[0]},{'captionTrackIndices':[1]}],'captionTracks':[{'languageCode':'en','kind':'asr'},{'languageCode':'pt','kind':'asr'}]}
        self.assertIs(select_track([en,pt],'auto',metadata),pt)

    def test_original_audio_beats_localized_default(self):
        en,pt=track('en',True),track('pt',True)
        metadata={'defaultAudioTrackIndex':0,'audioTracks':[{'captionTrackIndices':[0]},{'captionTrackIndices':[1],'audioTrackType':'ORIGINAL'}],'captionTracks':[{'languageCode':'en','kind':'asr'},{'languageCode':'pt','kind':'asr'}]}
        self.assertIs(select_track([en,pt],'auto',metadata),pt)

    def test_reported_video_shared_caption_indices(self):
        en,pt,es=track('en',True),track('pt',True),track('es',True)
        metadata={'defaultAudioTrackIndex':0,'audioTracks':[{'audioTrackId':'pt-BR.4','captionTrackIndices':[1,0,2]},{'audioTrackId':'en-US.10','captionTrackIndices':[1,0,2]},{'audioTrackId':'es-US.10','captionTrackIndices':[1,0,2]}],'captionTracks':[{'languageCode':'en','kind':'asr'},{'languageCode':'pt','kind':'asr'},{'languageCode':'es','kind':'asr'}]}
        self.assertIs(select_track([en,pt,es],'auto',metadata),pt)

    def test_ambiguous_languages_do_not_pick_first(self):
        for tracks in [[track('en',True),track('pt',True)],[track('en',False),track('pt',False)],[track('en',False)]]:
            with self.assertRaisesRegex(ValueError,'confirmar'):
                select_track(tracks,'auto')

    def test_explicit_choice_still_works(self):
        en,pt=track('en',False),track('pt',True)
        self.assertIs(select_track([en,pt],'en'),en)
        self.assertIs(select_track([en,pt],'pt'),pt)

    def test_no_silent_substitution_when_original_captions_missing(self):
        metadata={'defaultAudioTrackIndex':0,'audioTracks':[{'audioTrackId':'pt-BR.4'}]}
        with self.assertRaisesRegex(ValueError,'confirmar'):
            select_track([track('en',True)],'auto',metadata)

if __name__ == '__main__':
    unittest.main()
