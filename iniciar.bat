@echo off
cd /d "%~dp0"
if not exist .venv\Scripts\python.exe (
  where python >nul 2>nul
  if errorlevel 1 goto sempython
  python -m venv .venv
  if errorlevel 1 goto erro
)
.venv\Scripts\python.exe -c "import youtube_transcript_api, yt_dlp, faster_whisper" >nul 2>nul
if errorlevel 1 (
  .venv\Scripts\python.exe -m pip install -r requirements.txt
  if errorlevel 1 goto erro
)
start "" http://127.0.0.1:8765
.venv\Scripts\python.exe -B server.py
pause
exit /b
:sempython
echo Instala Python 3.10 ou superior e ativa a opcao Add Python to PATH.
pause
exit /b 1
:erro
echo Nao foi possivel preparar o Python ou instalar as dependencias.
pause
exit /b 1
