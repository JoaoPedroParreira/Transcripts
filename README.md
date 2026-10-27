# Fio

Site local para extrair legendas do YouTube e transcrever voz de TikTok e Instagram Reels, pesquisar e exportar TXT, SRT e JSON. Design próprio, responsivo, em português. Sem contas, armazenamento de transcrições, cookies, analytics, fontes externas ou histórico. Apenas as preferências de tema claro/escuro e idioma da interface são guardadas no navegador. O exemplo está identificado e não simula uma extração real.

## Iniciar no Windows

Instala Python 3.10+ com a opção de adicionar ao PATH e abre `iniciar.bat`. Na primeira execução é criado um ambiente `.venv` e instalada a dependência. O navegador abre em http://127.0.0.1:8765. Mantém a janela do serviço aberta; Ctrl+C termina o serviço.

Alternativa:

```powershell
python -m venv .venv
.venv\Scripts\python.exe -m pip install -r requirements.txt
.venv\Scripts\python.exe -B server.py
```

## Privacidade e arquitetura

A interface comunica com um serviço Python no próprio computador. O serviço escuta apenas em 127.0.0.1 e valida Host e Origin; não expõe um proxy remoto. Os pedidos ao YouTube usam uma sessão em memória e não há logs de acesso. Não existe persistência de transcrições: os resultados ficam na memória do processo e do navegador até serem libertados. Os ficheiros só são criados pelo utilizador ao exportar. A instalação guarda código e dependências, não conteúdos dos vídeos.

O YouTube recebe os pedidos e o IP do utilizador, estando sujeito às suas próprias práticas. Não é uma aplicação offline nem uma garantia de anonimato ou de eliminação forense. A interface não carrega thumbnails, iframes ou fontes de terceiros. Clicar num tempo abre o YouTube explicitamente.

YouTube usa [youtube-transcript-api](https://github.com/jdepoix/youtube-transcript-api) para legendas existentes. TikTok e Instagram Reels usam yt-dlp para obter o vídeo público e faster-whisper para reconhecimento de voz local na CPU. Até 10 minutos / 80 MB por vídeo, uma transcrição de áudio de cada vez. O áudio é descarregado para BytesIO (RAM), sem ficheiros temporários. Não usamos cookies de autenticação nem contornamos login; restrições e bloqueios das plataformas podem impedir a extração. O modelo base (~150 MB) é descarregado para `.models` na primeira utilização e reutilizado; esse diretório só guarda o modelo, não conteúdos de utilizadores. O fornecedor do modelo recebe o pedido de descarga, mas não o áudio. O reconhecimento pode conter erros. Selecionar idioma define a língua da fala, não traduz. Pode ser necessário atualizar as dependências se as plataformas mudarem.

Importar SRT/VTT, pesquisar, copiar e exportar funciona no navegador, sem enviar os ficheiros ao serviço. Limite de importação: 5 MB. O parser aceita legendas comuns; não preserva estilos VTT.

## Publicação

Site: https://joaopedroparreira.github.io/Transcripts/
API: https://fio-transcripts-api.onrender.com

O GitHub Pages publica `docs/` do ramo `main`. Executa `node build-pages.cjs` depois de editar `public/`. A extração online fica na própria página: o navegador envia o link à API gratuita no Render e esta usa o plano Free da Supadata. Não exige computador local ligado.

Supadata Free: 100 créditos/mês partilhados pelo site, sem cartão nem recarregamento automático. Obter legendas custa normalmente 1 crédito; geração de áudio custa 2 créditos/minuto. Ao esgotar, a extração para. O Render Free pode demorar cerca de um minuto a arrancar após inatividade e tem os seus limites de utilização. Nenhum plano pago foi ativado nesta configuração.

O Fio não persiste vídeos nem transcrições. Os fornecedores podem manter os seus registos e cache de conteúdo público, como explicado na interface. Importação SRT/VTT, pesquisa e exportação continuam no navegador. A chave `SUPADATA_API_KEY` fica só nas variáveis privadas do Render. Nunca deve ser posta no GitHub, em `config.js` ou no navegador.

Vídeos com várias faixas e sem identificação da língua original requerem escolher o idioma explicitamente: a Supadata não garante que a primeira faixa seja a original. Não devolvemos uma faixa arbitrária em deteção automática. Vídeos privados, restritos ou sem acesso pela plataforma podem falhar.

Para desenvolvimento local continua disponível `iniciar.bat`; a versão local usa a ligação direta ao YouTube e o reconhecimento de voz instalado no computador.

## Idiomas

Interface em português, inglês, espanhol, francês, alemão e italiano. Na primeira visita segue `navigator.language` (variantes regionais usam a língua principal); línguas não disponíveis usam inglês. Uma escolha manual fica em `fio-locale`, sem guardar conteúdo. A mudança é imediata e preserva a transcrição.

O seletor de transcrição tem 99 línguas e pesquisa por nomes de línguas e países associados, incluindo nomes em português/inglês e na língua da interface. Os países servem como pistas de pesquisa, não definem localização nem variantes regionais de fala. YouTube depende de faixas disponíveis; Whisper usa a língua falada, com deteção automática incluindo vietnamita. A língua da interface é independente da língua do vídeo.
