import os
import unittest
from unittest.mock import patch,MagicMock
from provider_api import provider_transcript,ProviderUnavailable

def response(status,data):
    r=MagicMock();r.status_code=status;r.json.return_value=data;return r

class ProviderTests(unittest.TestCase):
    @patch.dict(os.environ,{'SUPADATA_API_KEY':'unit-test-only'})
    def test_chunks_and_original_language(self):
        data={'lang':'pt','content':[{'text':'Olá','offset':1250,'duration':2000}]}
        with patch('provider_api.requests.Session') as session:
            client=session.return_value.__enter__.return_value
            client.get.return_value=response(200,data)
            result=provider_transcript('https://www.youtube.com/watch?v=7P_4cFZrjqI','auto','7P_4cFZrjqI')
            self.assertEqual(result['segments'][0]['start'],1.25)
            self.assertEqual(result['languageCode'],'pt')
            self.assertNotIn('lang',client.get.call_args.kwargs['params'])
            self.assertFalse(client.get.call_args.kwargs['allow_redirects'])

    @patch.dict(os.environ,{'SUPADATA_API_KEY':'unit-test-only'})
    def test_never_silently_substitute_explicit_language(self):
        with patch('provider_api.requests.Session') as session:
            session.return_value.__enter__.return_value.get.return_value=response(200,{'lang':'en','content':[]})
            with self.assertRaisesRegex(ProviderUnavailable,'idioma'):
                provider_transcript('https://www.youtube.com/watch?v=7P_4cFZrjqI','pt')

    @patch.dict(os.environ,{'SUPADATA_API_KEY':'unit-test-only'})
    def test_job_completion_and_no_paid_retry(self):
        with patch('provider_api.requests.Session') as session,patch('provider_api.time.sleep'):
            client=session.return_value.__enter__.return_value
            client.get.side_effect=[response(202,{'jobId':'job-1'}),response(200,{'status':'completed','result':{'lang':'pt','content':[{'text':'Teste','offset':0,'duration':1000}]}})]
            self.assertEqual(provider_transcript('https://www.tiktok.com/@test/video/123','auto')['segments'][0]['text'],'Teste')
        with patch('provider_api.requests.Session') as session:
            client=session.return_value.__enter__.return_value
            client.get.return_value=response(402,{})
            with self.assertRaisesRegex(ProviderUnavailable,'créditos'):
                provider_transcript('https://www.tiktok.com/@test/video/123','auto')
            self.assertEqual(client.get.call_count,1)

if __name__=='__main__':
    unittest.main()
