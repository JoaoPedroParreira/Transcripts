import unittest
from types import SimpleNamespace
from unittest.mock import patch, MagicMock
import social

class SocialTests(unittest.TestCase):
    def test_platforms_and_invalid_hosts(self):
        self.assertEqual(social.source_url('https://vm.tiktok.com/example/')[0], 'TikTok')
        self.assertEqual(social.source_url('https://www.instagram.com/reel/example/')[0], 'Instagram Reels')
        for url in ['https://instagram.com.evil.com/reel/a/', 'http://www.tiktok.com/a', 'https://www.instagram.com/user/', 'https://user@www.tiktok.com/a']:
            with self.assertRaises(ValueError):
                social.source_url(url)

    def test_audio_pipeline_both_platforms(self):
        for url in ['https://www.tiktok.com/@example/video/123', 'https://www.instagram.com/reel/example/']:
            with self.subTest(url=url), patch('yt_dlp.YoutubeDL') as downloader, patch('requests.get') as get:
                downloader.return_value.__enter__.return_value.extract_info.return_value = {'duration': 12, 'url': 'https://media.example/video.mp4'}
                get.return_value.__enter__.return_value.iter_content.return_value = [b'audio']
                model = MagicMock()
                def infer(audio, **kwargs):
                    self.assertEqual(audio.read(), b'audio')
                    return iter([SimpleNamespace(start=0, end=2, text=' Olá mundo ')]), SimpleNamespace(language='pt')
                model.transcribe.side_effect = infer
                with patch.object(social, 'MODEL', model):
                    result = social.transcribe_social(url, 'auto')
                self.assertEqual(result['segments'][0]['text'], 'Olá mundo')
                self.assertEqual(result['method'], 'speech')
                self.assertFalse(social.LOCK.locked())

    def test_lock_released_after_extractor_failure(self):
        with patch('yt_dlp.YoutubeDL', side_effect=RuntimeError('blocked')):
            with self.assertRaises(RuntimeError):
                social.transcribe_social('https://www.instagram.com/reel/example/', 'auto')
        self.assertFalse(social.LOCK.locked())

if __name__ == '__main__':
    unittest.main()
