import unittest
from unittest.mock import patch
from cloud_api import app, RECENT, ACTIVE, ORIGIN

class CloudTests(unittest.TestCase):
    def setUp(self):
        self.client=app.test_client()
        RECENT.clear()
        self.headers={'Origin':ORIGIN}

    def test_health_and_cors(self):
        self.assertEqual(self.client.get('/health').status_code,200)
        response=self.client.options('/api/transcript',headers=self.headers)
        self.assertEqual(response.status_code,204)
        self.assertEqual(response.headers['Access-Control-Allow-Origin'],ORIGIN)
        self.assertEqual(response.headers['Cache-Control'],'no-store')

    def test_reject_untrusted_origin(self):
        r=self.client.post('/api/transcript',json={'url':'test'},headers={'Origin':'https://evil.example'})
        self.assertEqual(r.status_code,403)
        self.assertNotIn('Access-Control-Allow-Origin',r.headers)

    def test_in_memory_transcription(self):
        result={'language':'pt','segments':[{'start':0,'duration':1,'text':'Olá'}]}
        with patch('social.transcribe_social',return_value=result):
            r=self.client.post('/api/transcript',headers=self.headers,json={'url':'https://www.instagram.com/reel/example/','language':'auto'})
        self.assertEqual(r.status_code,200)
        self.assertEqual(r.json,result)

    def test_busy(self):
        ACTIVE.acquire()
        try:
            r=self.client.post('/api/transcript',json={},headers=self.headers)
            self.assertEqual(r.status_code,429)
        finally:
            ACTIVE.release()

    def test_invalid_and_oversized_body(self):
        self.assertEqual(self.client.post('/api/transcript',json=[],headers=self.headers).status_code,400)
        self.assertEqual(self.client.post('/api/transcript',json={'url':'x'*5000},headers=self.headers).status_code,413)

if __name__=='__main__':
    unittest.main()
