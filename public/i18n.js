/* Interface preferences only. Video text is never translated or persisted. */
const SITE_LANGUAGES = {pt:'Português',en:'English',es:'Español',fr:'Français',de:'Deutsch',it:'Italiano'};
function chooseLocale(saved, browserLanguage) {
  if (Object.hasOwn(SITE_LANGUAGES, saved)) return saved;
  const primary = String(browserLanguage || '').toLowerCase().split('-')[0];
  return Object.hasOwn(SITE_LANGUAGES, primary) ? primary : 'en';
}
let savedLocale;
try { savedLocale = localStorage.getItem('fio-locale'); } catch {}
let siteLocale = chooseLocale(savedLocale, navigator.language);
const translations = {};
function addTranslations(rows) {
  for (const row of rows.trim().split('\n')) {
    const [pt,en,es,fr,de,it] = row.split('|');
    translations[pt] = {pt,en,es,fr,de,it};
  }
}
addTranslations(`
Ferramenta|Tool|Herramienta|Outil|Werkzeug|Strumento
Como funciona|How it works|Cómo funciona|Comment ça marche|So funktioniert es|Come funziona
Privacidade ↗|Privacy ↗|Privacidad ↗|Confidentialité ↗|Datenschutz ↗|Privacy ↗
O teu espaço local|Your local workspace|Tu espacio local|Votre espace local|Dein lokaler Arbeitsbereich|Il tuo spazio locale
MENOS PLAY. MAIS IDEIAS.|LESS PLAY. MORE IDEAS.|MENOS PLAY. MÁS IDEAS.|MOINS DE PLAY. PLUS D’IDÉES.|WENIGER PLAY. MEHR IDEEN.|MENO PLAY. PIÙ IDEE.
O vídeo passa.|The video ends.|El vídeo pasa.|La vidéo passe.|Das Video endet.|Il video passa.
As palavras|The words|Las palabras|Les mots|Die Worte|Le parole
ficam.|remain.|quedan.|restent.|bleiben.|restano.
Transforma vídeos do YouTube, TikTok e Reels em texto que podes|Turn YouTube, TikTok and Reels videos into text you can|Convierte vídeos de YouTube, TikTok y Reels en texto que puedes|Transformez les vidéos YouTube, TikTok et Reels en texte à|Verwandle Videos von YouTube, TikTok und Reels in Text zum|Trasforma video di YouTube, TikTok e Reels in testo da
pesquisar, copiar e levar contigo. Só no teu computador.|search, copy and take with you. Only on your computer.|buscar, copiar y llevar contigo. Solo en tu ordenador.|rechercher, copier et emporter. Sur votre ordinateur.|Durchsuchen, Kopieren und Mitnehmen. Auf deinem Computer.|cercare, copiare e portare con te. Solo sul tuo computer.
↗ Sem conta|↗ No account|↗ Sin cuenta|↗ Sans compte|↗ Ohne Konto|↗ Senza account
◈ Sem histórico|◈ No history|◈ Sin historial|◈ Sans historique|◈ Ohne Verlauf|◈ Senza cronologia
✓ Sem complicações|✓ No fuss|✓ Sin complicaciones|✓ Sans complications|✓ Unkompliziert|✓ Senza complicazioni
Uma boa ideia|A good idea|Una buena idea|Une bonne idée|Eine gute Idee|Una buona idea
merece ficar escrita.|deserves to be written.|merece quedar escrita.|mérite d’être écrite.|verdient es, aufgeschrieben zu werden.|merita di essere scritta.
01 / ORIGEM|01 / SOURCE|01 / ORIGEN|01 / SOURCE|01 / QUELLE|01 / ORIGINE
◈ Sessão privada|◈ Private session|◈ Sesión privada|◈ Session privée|◈ Private Sitzung|◈ Sessione privata
Qual é o próximo vídeo?|What’s the next video?|¿Cuál es el próximo vídeo?|Quelle est la prochaine vidéo ?|Welches Video kommt als Nächstes?|Qual è il prossimo video?
Link do YouTube, TikTok ou Reels…|YouTube, TikTok or Reels link…|Enlace de YouTube, TikTok o Reels…|Lien YouTube, TikTok ou Reels…|YouTube-, TikTok- oder Reels-Link…|Link YouTube, TikTok o Reels…
Link do YouTube, TikTok ou Instagram Reels|YouTube, TikTok or Instagram Reels link|Enlace de YouTube, TikTok o Instagram Reels|Lien YouTube, TikTok ou Instagram Reels|YouTube-, TikTok- oder Instagram-Reels-Link|Link YouTube, TikTok o Instagram Reels
Extrair texto|Extract text|Extraer texto|Extraire le texte|Text extrahieren|Estrai testo
Extrair texto ↗|Extract text ↗|Extraer texto ↗|Extraire le texte ↗|Text extrahieren ↗|Estrai testo ↗
Idioma do vídeo|Video language|Idioma del vídeo|Langue de la vidéo|Videosprache|Lingua del video
Detetar automaticamente|Detect automatically|Detectar automáticamente|Détecter automatiquement|Automatisch erkennen|Rileva automaticamente
ou|or|o|ou|oder|oppure
importa um SRT / VTT ↗|import SRT / VTT ↗|importa SRT / VTT ↗|importer SRT / VTT ↗|SRT / VTT importieren ↗|importa SRT / VTT ↗
ⓘ YouTube: legendas. TikTok / Reels: voz local, até 10 min e 80 MB.|ⓘ YouTube: captions. TikTok / Reels: local speech recognition, up to 10 min and 80 MB.|ⓘ YouTube: subtítulos. TikTok / Reels: voz local, hasta 10 min y 80 MB.|ⓘ YouTube : sous-titres. TikTok / Reels : voix en local, jusqu’à 10 min et 80 Mo.|ⓘ YouTube: Untertitel. TikTok / Reels: lokale Spracherkennung, bis 10 Min. und 80 MB.|ⓘ YouTube: sottotitoli. TikTok / Reels: voce locale, fino a 10 min e 80 MB.
Explorar um exemplo →|Explore an example →|Explorar un ejemplo →|Explorer un exemple →|Beispiel ansehen →|Esplora un esempio →
02 / AS PALAVRAS|02 / THE WORDS|02 / LAS PALABRAS|02 / LES MOTS|02 / DIE WORTE|02 / LE PAROLE
A tua transcrição|Your transcript|Tu transcripción|Votre transcription|Dein Transkript|La tua trascrizione
Limpar sessão ×|Clear session ×|Borrar sesión ×|Effacer la session ×|Sitzung leeren ×|Cancella sessione ×
Pesquisar no texto…|Search the text…|Buscar en el texto…|Rechercher dans le texte…|Im Text suchen…|Cerca nel testo…
Pesquisar no texto|Search the text|Buscar en el texto|Rechercher dans le texte|Im Text suchen|Cerca nel testo
Tempos|Timestamps|Tiempos|Horodatages|Zeitmarken|Tempi
Copiar|Copy|Copiar|Copier|Kopieren|Copia
Formato de exportação|Export format|Formato de exportación|Format d’export|Exportformat|Formato di esportazione
Descarregar ↓|Download ↓|Descargar ↓|Télécharger ↓|Herunterladen ↓|Scarica ↓
Disponível apenas nesta sessão.|Available only in this session.|Disponible solo en esta sesión.|Disponible uniquement dans cette session.|Nur in dieser Sitzung verfügbar.|Disponibile solo in questa sessione.
DO LINK À TUA PRÓXIMA IDEIA|FROM A LINK TO YOUR NEXT IDEA|DEL ENLACE A TU PRÓXIMA IDEA|DU LIEN À VOTRE PROCHAINE IDÉE|VOM LINK ZUR NÄCHSTEN IDEE|DAL LINK ALLA TUA PROSSIMA IDEA
Cola. Extrai. Já está.|Paste. Extract. Done.|Pega. Extrae. Listo.|Collez. Extrayez. Voilà.|Einfügen. Extrahieren. Fertig.|Incolla. Estrai. Fatto.
Um link é tudo o que precisas. YouTube, TikTok ou Reels. Escolhe o idioma e transforma o vídeo em texto.|A link is all you need. YouTube, TikTok or Reels. Choose a language and turn video into text.|Solo necesitas un enlace. YouTube, TikTok o Reels. Elige el idioma y convierte el vídeo en texto.|Un lien suffit. YouTube, TikTok ou Reels. Choisissez la langue et transformez la vidéo en texte.|Ein Link genügt. YouTube, TikTok oder Reels. Wähle die Sprache und verwandle Video in Text.|Basta un link. YouTube, TikTok o Reels. Scegli la lingua e trasforma il video in testo.
Encontra o que interessa.|Find what matters.|Encuentra lo importante.|Trouvez l’essentiel.|Finde das Wesentliche.|Trova ciò che conta.
Pesquisa uma palavra, consulta os tempos e copia o texto sem perder o fio.|Search a word, check timestamps and copy the text without losing the thread.|Busca palabras, consulta los tiempos y copia el texto sin perder el hilo.|Recherchez un mot, consultez les temps et copiez le texte sans perdre le fil.|Suche ein Wort, prüfe Zeitmarken und kopiere den Text, ohne den Faden zu verlieren.|Cerca una parola, consulta i tempi e copia il testo senza perdere il filo.
Leva as palavras contigo.|Take the words with you.|Lleva las palabras contigo.|Emportez les mots.|Nimm die Worte mit.|Porta le parole con te.
Exporta em TXT, SRT ou JSON. Os ficheiros só são guardados quando decides descarregar.|Export as TXT, SRT or JSON. Files are saved only when you choose to download.|Exporta en TXT, SRT o JSON. Los archivos solo se guardan al descargar.|Exportez en TXT, SRT ou JSON. Les fichiers ne sont enregistrés que si vous les téléchargez.|Exportiere als TXT, SRT oder JSON. Dateien werden erst beim Herunterladen gespeichert.|Esporta in TXT, SRT o JSON. I file vengono salvati solo quando scegli di scaricarli.
As tuas ideias. O teu computador.|Your ideas. Your computer.|Tus ideas. Tu ordenador.|Vos idées. Votre ordinateur.|Deine Ideen. Dein Computer.|Le tue idee. Il tuo computer.
Sem base de dados, analytics ou cookies. Ao fechar ou atualizar, a sessão desaparece.|No database, analytics or cookies. Closing or refreshing clears the session.|Sin base de datos, analíticas ni cookies. Al cerrar o actualizar, la sesión desaparece.|Sans base de données, statistiques ni cookies. Fermer ou actualiser efface la session.|Keine Datenbank, Analyse oder Cookies. Schließen oder Neuladen leert die Sitzung.|Nessun database, analisi o cookie. Chiudere o ricaricare cancella la sessione.
Como protegemos os dados ↗|How we protect your data ↗|Cómo protegemos los datos ↗|Comment nous protégeons vos données ↗|So schützen wir Daten ↗|Come proteggiamo i dati ↗
Antes de carregar no play.|Before pressing play.|Antes de pulsar play.|Avant d’appuyer sur play.|Bevor du auf Play drückst.|Prima di premere play.
Funciona com todos os vídeos?|Does it work with every video?|¿Funciona con todos los vídeos?|Est-ce compatible avec toutes les vidéos ?|Funktioniert es mit jedem Video?|Funziona con tutti i video?
Os dados saem do meu computador?|Does data leave my computer?|¿Los datos salen de mi ordenador?|Les données quittent-elles mon ordinateur ?|Verlassen Daten meinen Computer?|I dati lasciano il mio computer?
Preciso de instalar alguma coisa?|Do I need to install anything?|¿Necesito instalar algo?|Faut-il installer quelque chose ?|Muss ich etwas installieren?|Devo installare qualcosa?
Do vídeo à ideia. Sem perder o fio.|From video to idea. Keep the thread.|Del vídeo a la idea. Sin perder el hilo.|De la vidéo à l’idée. Sans perdre le fil.|Vom Video zur Idee. Ohne den Faden zu verlieren.|Dal video all’idea. Senza perdere il filo.
Feito para ficar contigo. ↗|Made to stay with you. ↗|Hecho para quedarse contigo. ↗|Conçu pour rester avec vous. ↗|Gemacht, um bei dir zu bleiben. ↗|Fatto per restare con te. ↗
Fechar ×|Close ×|Cerrar ×|Fermer ×|Schließen ×|Chiudi ×
PRIVACIDADE, SEM RODAPÉS PEQUENINOS|PRIVACY, WITHOUT THE FINE PRINT|PRIVACIDAD, SIN LETRA PEQUEÑA|CONFIDENTIALITÉ, SANS PETITES LIGNES|DATENSCHUTZ OHNE KLEINGEDRUCKTES|PRIVACY, SENZA CLAUSOLE NASCOSTE
O controlo fica contigo.|You stay in control.|Tú tienes el control.|Vous gardez le contrôle.|Du behältst die Kontrolle.|Il controllo resta a te.
☀ Claro|☀ Light|☀ Claro|☀ Clair|☀ Hell|☀ Chiaro
☾ Escuro|☾ Dark|☾ Oscuro|☾ Sombre|☾ Dunkel|☾ Scuro
Ativar modo claro|Switch to light mode|Activar modo claro|Activer le mode clair|Hellen Modus aktivieren|Attiva il tema chiaro
Ativar modo escuro|Switch to dark mode|Activar modo oscuro|Activer le mode sombre|Dunklen Modus aktivieren|Attiva il tema scuro
Pesquisar idioma ou país…|Search language or country…|Buscar idioma o país…|Rechercher langue ou pays…|Sprache oder Land suchen…|Cerca lingua o paese…
Sem resultados.|No results.|Sin resultados.|Aucun résultat.|Keine Ergebnisse.|Nessun risultato.
Não foram encontrados resultados.|No results found.|No se encontraron resultados.|Aucun résultat trouvé.|Keine Ergebnisse gefunden.|Nessun risultato trovato.
Idioma do site|Site language|Idioma del sitio|Langue du site|Website-Sprache|Lingua del sito
palavras|words|palabras|mots|Wörter|parole
segmentos|segments|segmentos|segments|Segmente|segmenti
Texto copiado.|Text copied.|Texto copiado.|Texte copié.|Text kopiert.|Testo copiato.
Sessão limpa.|Session cleared.|Sesión borrada.|Session effacée.|Sitzung geleert.|Sessione cancellata.
Ficheiro preparado.|File ready.|Archivo listo.|Fichier prêt.|Datei bereit.|File pronto.
A obter legendas…|Getting transcript…|Obteniendo transcripción…|Récupération du texte…|Transkript wird geladen…|Recupero trascrizione…
Ficheiro local|Local file|Archivo local|Fichier local|Lokale Datei|File locale
Legendas automáticas|Automatic captions|Subtítulos automáticos|Sous-titres automatiques|Automatische Untertitel|Sottotitoli automatici
Texto importado ou legendas manuais|Imported text or manual captions|Texto importado o subtítulos manuales|Texte importé ou sous-titres manuels|Importierter Text oder manuelle Untertitel|Testo importato o sottotitoli manuali
Reconhecimento de voz local · pode conter erros|Local speech recognition · may contain errors|Reconocimiento de voz local · puede contener errores|Reconnaissance vocale locale · peut contenir des erreurs|Lokale Spracherkennung · kann Fehler enthalten|Riconoscimento vocale locale · può contenere errori
A consultar o YouTube a partir do teu computador…|Contacting YouTube from your computer…|Consultando YouTube desde tu ordenador…|Connexion à YouTube depuis votre ordinateur…|YouTube wird von deinem Computer abgefragt…|Connessione a YouTube dal tuo computer…
Não foi encontrado texto neste vídeo.|No text found in this video.|No se encontró texto en este vídeo.|Aucun texte trouvé dans cette vidéo.|Kein Text in diesem Video gefunden.|Nessun testo trovato in questo video.
Não foi possível obter a transcrição.|Could not get the transcript.|No se pudo obtener la transcripción.|Impossible d’obtenir la transcription.|Transkript konnte nicht geladen werden.|Impossibile ottenere la trascrizione.
Escolhe um ficheiro até 5 MB.|Choose a file up to 5 MB.|Elige un archivo de hasta 5 MB.|Choisissez un fichier de 5 Mo maximum.|Wähle eine Datei bis 5 MB.|Scegli un file fino a 5 MB.
Não foram encontradas legendas válidas neste SRT/VTT.|No valid captions found in this SRT/VTT.|No se encontraron subtítulos válidos en este SRT/VTT.|Aucun sous-titre valide dans ce SRT/VTT.|Keine gültigen Untertitel in dieser SRT/VTT-Datei.|Nessun sottotitolo valido in questo SRT/VTT.
Não foi possível copiar. Usa a opção Descarregar.|Could not copy. Use Download instead.|No se pudo copiar. Usa Descargar.|Copie impossible. Utilisez Télécharger.|Kopieren fehlgeschlagen. Nutze Herunterladen.|Impossibile copiare. Usa Scarica.
O pedido demorou demasiado. Tenta novamente ou importa um SRT/VTT.|The request timed out. Retry or import SRT/VTT.|La solicitud tardó demasiado. Reintenta o importa SRT/VTT.|La demande a expiré. Réessayez ou importez un SRT/VTT.|Zeitüberschreitung. Versuche es erneut oder importiere SRT/VTT.|Richiesta scaduta. Riprova o importa SRT/VTT.
Não foi possível contactar o serviço local. Inicia o Fio com iniciar.bat.|Cannot reach the local service. Start Fio with iniciar.bat.|No se puede contactar el servicio local. Inicia Fio con iniciar.bat.|Service local inaccessible. Lancez Fio avec iniciar.bat.|Lokaler Dienst nicht erreichbar. Starte Fio mit iniciar.bat.|Servizio locale non raggiungibile. Avvia Fio con iniciar.bat.
As transcrições ficam em memória. Só as preferências de tema e idioma do site são guardadas no navegador. Sem cookies, analytics ou histórico.|Transcripts stay in memory. Only theme and site-language preferences are saved in your browser. No cookies, analytics or history.|Las transcripciones quedan en memoria. Solo se guardan el tema y el idioma del sitio en el navegador. Sin cookies, analíticas ni historial.|Les transcriptions restent en mémoire. Seules les préférences de thème et de langue du site sont enregistrées dans le navigateur. Sans cookies, statistiques ni historique.|Transkripte bleiben im Arbeitsspeicher. Nur Design und Website-Sprache werden im Browser gespeichert. Keine Cookies, Analyse oder Verlauf.|Le trascrizioni restano in memoria. Solo tema e lingua del sito vengono salvati nel browser. Niente cookie, analisi o cronologia.
YouTube requer legendas acessíveis. TikTok e Reels usam reconhecimento de voz local até 10 minutos e 80 MB. Vídeos restritos ou bloqueados podem falhar. O reconhecimento pode conter erros.|YouTube requires accessible captions. TikTok and Reels use local speech recognition up to 10 minutes and 80 MB. Restricted or blocked videos may fail. Recognition may contain errors.|YouTube requiere subtítulos accesibles. TikTok y Reels usan reconocimiento local hasta 10 minutos y 80 MB. Los vídeos restringidos o bloqueados pueden fallar. Puede haber errores.|YouTube nécessite des sous-titres accessibles. TikTok et Reels utilisent la reconnaissance locale jusqu’à 10 minutes et 80 Mo. Les vidéos restreintes ou bloquées peuvent échouer. Des erreurs sont possibles.|YouTube benötigt zugängliche Untertitel. TikTok und Reels verwenden lokale Spracherkennung bis 10 Minuten und 80 MB. Gesperrte Videos können fehlschlagen. Erkennungsfehler sind möglich.|YouTube richiede sottotitoli accessibili. TikTok e Reels usano riconoscimento locale fino a 10 minuti e 80 MB. I video limitati o bloccati possono non funzionare. Sono possibili errori.
O serviço local contacta a plataforma do vídeo, que recebe o pedido e o teu IP. Áudio e transcrições não são enviados a serviços de transcrição. O modelo de voz (~150 MB) é descarregado na primeira utilização e guardado localmente.|The local service contacts the video platform, which receives the request and your IP. Audio and transcripts are not sent to transcription services. The voice model (~150 MB) is downloaded on first use and stored locally.|El servicio local contacta la plataforma, que recibe la solicitud y tu IP. El audio y el texto no se envían a servicios de transcripción. El modelo (~150 MB) se descarga al primer uso y se guarda localmente.|Le service local contacte la plateforme, qui reçoit la demande et votre IP. L’audio et le texte ne sont pas envoyés à un service de transcription. Le modèle (~150 Mo) est téléchargé au premier usage et conservé localement.|Der lokale Dienst kontaktiert die Videoplattform, die Anfrage und IP erhält. Audio und Transkripte werden nicht an Transkriptionsdienste gesendet. Das Modell (~150 MB) wird beim ersten Mal lokal gespeichert.|Il servizio locale contatta la piattaforma, che riceve richiesta e IP. Audio e trascrizioni non vengono inviati a servizi di trascrizione. Il modello (~150 MB) viene scaricato al primo uso e salvato localmente.
Inicia o serviço Python no teu computador e abre o site. Importar SRT/VTT, pesquisar e exportar funciona no navegador.|Start the Python service on your computer and open the site. SRT/VTT import, search and export run in your browser.|Inicia el servicio Python y abre el sitio. Importar SRT/VTT, buscar y exportar funciona en el navegador.|Lancez le service Python et ouvrez le site. Importation SRT/VTT, recherche et export fonctionnent dans le navigateur.|Starte den Python-Dienst und öffne die Website. SRT/VTT-Import, Suche und Export laufen im Browser.|Avvia il servizio Python e apri il sito. Importazione SRT/VTT, ricerca ed esportazione funzionano nel browser.
Descarregar guarda um ficheiro no teu dispositivo. Fechar ou atualizar limpa a sessão, sem garantia de eliminação forense. Não é um serviço offline nem anónimo.|Downloading saves a file on your device. Closing or refreshing clears the session, without a forensic-erasure guarantee. This is not an offline or anonymous service.|Descargar guarda un archivo en tu dispositivo. Cerrar o actualizar borra la sesión, sin garantía de borrado forense. No es un servicio sin conexión ni anónimo.|Télécharger enregistre un fichier sur votre appareil. Fermer ou actualiser efface la session, sans garantie d’effacement définitif de la mémoire. Ce service n’est ni hors ligne ni anonyme.|Herunterladen speichert eine Datei auf deinem Gerät. Schließen oder Neuladen leert die Sitzung, ohne Garantie forensischer Löschung. Der Dienst ist weder offline noch anonym.|Scaricare salva un file sul dispositivo. Chiudere o ricaricare cancella la sessione, senza garanzia di cancellazione forense. Non è un servizio offline o anonimo.
Tema aplicado. O navegador não permitiu guardar a preferência.|Theme applied. Your browser could not save the preference.|Tema aplicado. El navegador no permitió guardar la preferencia.|Thème appliqué. Le navigateur n’a pas pu enregistrer la préférence.|Design angewendet. Der Browser konnte die Einstellung nicht speichern.|Tema applicato. Il browser non ha salvato la preferenza.
Abrir vídeo original|Open original video|Abrir vídeo original|Ouvrir la vidéo originale|Originalvideo öffnen|Apri video originale
Abrir vídeo em|Open video at|Abrir vídeo en|Ouvrir la vidéo à|Video öffnen bei|Apri video a
Uma ideia de cada vez — exemplo|One idea at a time — example|Una idea a la vez — ejemplo|Une idée à la fois — exemple|Eine Idee nach der anderen — Beispiel|Un’idea alla volta — esempio
Português · exemplo ilustrativo, não extraído do YouTube|Portuguese · illustrative example, not extracted from YouTube|Portugués · ejemplo ilustrativo, no extraído de YouTube|Portugais · exemple illustratif, non extrait de YouTube|Portugiesisch · Beispiel, nicht von YouTube extrahiert|Portoghese · esempio illustrativo, non estratto da YouTube
Vídeo, pesquisa e exportação ficam na tua sessão. Não traduzimos automaticamente o conteúdo do vídeo ao mudar a língua do site.|Video, search and export stay in your session. Changing the site language does not translate video content.|Vídeo, búsqueda y exportación quedan en tu sesión. Cambiar el idioma del sitio no traduce el vídeo.|Vidéo, recherche et export restent dans la session. Changer la langue du site ne traduit pas la vidéo.|Video, Suche und Export bleiben in der Sitzung. Die Website-Sprache ändert nicht die Sprache des Videos.|Video, ricerca ed esportazione restano nella sessione. Cambiare lingua del sito non traduce il video.
No YouTube, escolhe uma faixa disponível. Em TikTok/Reels, escolhe a língua falada. Pesquisar países ajuda a encontrar o idioma, não define a localização.|On YouTube, choose an available caption track. For TikTok/Reels, choose the spoken language. Country search helps find a language, not set a location.|En YouTube, elige una pista disponible. En TikTok/Reels, elige la lengua hablada. Buscar países ayuda a encontrar el idioma, no cambia la ubicación.|Sur YouTube, choisissez une piste disponible. Pour TikTok/Reels, choisissez la langue parlée. Les pays aident à trouver une langue, sans définir de localisation.|Wähle auf YouTube eine verfügbare Untertitelspur. Bei TikTok/Reels die gesprochene Sprache. Länder helfen bei der Sprachsuche und legen keinen Standort fest.|Su YouTube scegli una traccia disponibile. Per TikTok/Reels scegli la lingua parlata. I paesi aiutano a trovare una lingua, non impostano la posizione.
O idioma do site não muda a língua do vídeo.|The site language does not change the video language.|El idioma del sitio no cambia el del vídeo.|La langue du site ne change pas celle de la vidéo.|Die Website-Sprache ändert nicht die Videosprache.|La lingua del sito non cambia quella del video.
Idioma inválido.|Invalid language.|Idioma no válido.|Langue non valide.|Ungültige Sprache.|Lingua non valida.
Não há legendas neste idioma. Experimenta a deteção automática.|No captions in this language. Try automatic detection.|No hay subtítulos en este idioma. Prueba la detección automática.|Aucun sous-titre dans cette langue. Essayez la détection automatique.|Keine Untertitel in dieser Sprache. Versuche die automatische Erkennung.|Nessun sottotitolo in questa lingua. Prova il rilevamento automatico.
Este vídeo não tem legendas disponíveis.|This video has no available captions.|Este vídeo no tiene subtítulos disponibles.|Cette vidéo n’a pas de sous-titres disponibles.|Dieses Video hat keine verfügbaren Untertitel.|Questo video non ha sottotitoli disponibili.
Introduz um link válido do YouTube.|Enter a valid YouTube link.|Introduce un enlace válido de YouTube.|Saisissez un lien YouTube valide.|Gib einen gültigen YouTube-Link ein.|Inserisci un link YouTube valido.
Não foi detetada fala neste vídeo.|No speech detected in this video.|No se detectó voz en este vídeo.|Aucune voix détectée dans cette vidéo.|Keine Sprache in diesem Video erkannt.|Nessuna voce rilevata in questo video.
Já está uma transcrição de áudio em curso. Aguarda e tenta novamente.|An audio transcription is already running. Wait and retry.|Ya hay una transcripción en curso. Espera y reintenta.|Une transcription est déjà en cours. Patientez et réessayez.|Eine Transkription läuft bereits. Warte und versuche es erneut.|Una trascrizione è già in corso. Attendi e riprova.
Não foi possível aceder ao vídeo ou processar o áudio. A plataforma pode exigir login ou bloquear o acesso. Usa um vídeo público acessível ou importa SRT/VTT. Na primeira transcrição de TikTok/Reels é necessário descarregar o modelo local.|Could not access the video or process audio. The platform may require login or block access. Use an accessible public video or import SRT/VTT. The first TikTok/Reels transcription needs to download the local model.|No se pudo acceder al vídeo o procesar el audio. La plataforma puede exigir acceso o bloquearlo. Usa un vídeo público accesible o importa SRT/VTT. El primer uso de TikTok/Reels descarga el modelo local.|Impossible d’accéder à la vidéo ou de traiter l’audio. La plateforme peut exiger une connexion ou bloquer l’accès. Utilisez une vidéo publique accessible ou importez SRT/VTT. Le premier usage TikTok/Reels télécharge le modèle local.|Videozugriff oder Audioverarbeitung fehlgeschlagen. Die Plattform kann Anmeldung verlangen oder den Zugriff sperren. Nutze ein zugängliches öffentliches Video oder importiere SRT/VTT. Beim ersten TikTok/Reels-Aufruf wird das lokale Modell geladen.|Impossibile accedere al video o elaborare l’audio. La piattaforma può richiedere accesso o bloccarlo. Usa un video pubblico accessibile o importa SRT/VTT. Il primo uso TikTok/Reels scarica il modello locale.
A obter e transcrever o áudio localmente. Pode demorar alguns minutos; na primeira vez é descarregado o modelo de voz (~150 MB). Mantém a página aberta.|Fetching and transcribing audio locally. This may take a few minutes; the voice model (~150 MB) downloads on first use. Keep this page open.|Obteniendo y transcribiendo audio localmente. Puede tardar unos minutos; el modelo (~150 MB) se descarga al primer uso. Mantén la página abierta.|Récupération et transcription de l’audio en local. Cela peut prendre quelques minutes ; le modèle (~150 Mo) se télécharge au premier usage. Gardez la page ouverte.|Audio wird lokal geladen und transkribiert. Das kann einige Minuten dauern; das Modell (~150 MB) wird beim ersten Mal geladen. Lass diese Seite geöffnet.|Recupero e trascrizione locale dell’audio. Può richiedere alcuni minuti; il modello (~150 MB) si scarica al primo uso. Lascia aperta la pagina.
`);
addTranslations(`
play → pause → pensar|play → pause → think|play → pausa → pensar|play → pause → penser|Play → Pause → Denken|play → pausa → pensare
Não foi possível confirmar o idioma original deste vídeo. Seleciona o idioma do vídeo para evitar devolver legendas noutra língua.|Could not confirm this video’s source language. Select the video language to avoid captions in another language.|No se pudo confirmar el idioma original. Selecciona el idioma del vídeo para evitar subtítulos en otra lengua.|Impossible de confirmer la langue d’origine. Choisissez la langue de la vidéo pour éviter des sous-titres dans une autre langue.|Die Ausgangssprache konnte nicht bestätigt werden. Wähle die Videosprache, um Untertitel in einer anderen Sprache zu vermeiden.|Impossibile confermare la lingua originale. Seleziona la lingua del video per evitare sottotitoli in un’altra lingua.
A transcrição local suporta vídeos com duração conhecida até 10 minutos.|Local transcription supports videos with a known duration up to 10 minutes.|La transcripción local admite vídeos de duración conocida hasta 10 minutos.|La transcription locale accepte les vidéos de durée connue jusqu’à 10 minutes.|Lokale Transkription unterstützt Videos mit bekannter Dauer bis 10 Minuten.|La trascrizione locale supporta video di durata nota fino a 10 minuti.
O vídeo ultrapassa o limite de 80 MB. Experimenta um vídeo mais curto.|The video exceeds 80 MB. Try a shorter video.|El vídeo supera 80 MB. Prueba uno más corto.|La vidéo dépasse 80 Mo. Essayez une vidéo plus courte.|Das Video überschreitet 80 MB. Versuche ein kürzeres Video.|Il video supera 80 MB. Prova un video più breve.
Usa um link HTTPS válido.|Use a valid HTTPS link.|Usa un enlace HTTPS válido.|Utilisez un lien HTTPS valide.|Verwende einen gültigen HTTPS-Link.|Usa un link HTTPS valido.
Usa um link de vídeo do TikTok ou de um Reel do Instagram.|Use a TikTok video or Instagram Reel link.|Usa un enlace de TikTok o de un Reel de Instagram.|Utilisez un lien TikTok ou un Reel Instagram.|Verwende einen TikTok-Video- oder Instagram-Reel-Link.|Usa un link TikTok o di un Reel Instagram.
Cola o link de um único vídeo público.|Paste a link to a single public video.|Pega un enlace a un único vídeo público.|Collez le lien d’une seule vidéo publique.|Füge den Link eines einzelnen öffentlichen Videos ein.|Incolla il link di un solo video pubblico.
Não foi possível obter o áudio deste vídeo.|Could not get audio from this video.|No se pudo obtener el audio de este vídeo.|Impossible d’obtenir l’audio de cette vidéo.|Audio dieses Videos konnte nicht geladen werden.|Impossibile ottenere l’audio di questo video.
Falta instalar a dependência. Executa: pip install -r requirements.txt|A dependency is missing. Run: pip install -r requirements.txt|Falta una dependencia. Ejecuta: pip install -r requirements.txt|Une dépendance manque. Exécutez : pip install -r requirements.txt|Eine Abhängigkeit fehlt. Ausführen: pip install -r requirements.txt|Manca una dipendenza. Esegui: pip install -r requirements.txt
Não foi possível identificar o vídeo neste link.|Could not identify a video in this link.|No se pudo identificar el vídeo en este enlace.|Impossible d’identifier la vidéo dans ce lien.|In diesem Link konnte kein Video erkannt werden.|Impossibile identificare il video in questo link.
Verifica o link e o idioma.|Check the link and language.|Revisa el enlace y el idioma.|Vérifiez le lien et la langue.|Prüfe den Link und die Sprache.|Controlla il link e la lingua.
`);
function t(text) { return translations[text]?.[siteLocale] || text; }
const originalText = new WeakMap();
const originalAttributes = new WeakMap();
function translatePage() {
  document.documentElement.lang = siteLocale;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.parentElement.closest('script,style,#segments,#metadata,#result-title,#status,#toast,.select-control,#site-language')) continue;
    if (!originalText.has(node)) originalText.set(node, node.textContent);
    const source = originalText.get(node);
    node.textContent = source.replace(source.trim(), t(source.trim()));
  }
  document.querySelectorAll('[placeholder],[aria-label]').forEach(element => {
    if (element.closest('.select-control')) return;
    if (!originalAttributes.has(element)) originalAttributes.set(element, {placeholder:element.getAttribute('placeholder'), 'aria-label':element.getAttribute('aria-label')});
    for (const [key,source] of Object.entries(originalAttributes.get(element))) if (source) element.setAttribute(key,t(source));
  });
  document.title = `Fio — ${t('Do vídeo à ideia. Sem perder o fio.')}`;
}
const VIDEO_LANGUAGES = [
  ['en','US GB AU NZ'],['zh','CN TW SG'],['de','DE AT CH'],['es','ES MX AR CO'],['ru','RU'],['ko','KR'],['fr','FR BE CA CH'],['ja','JP'],['pt','PT BR AO MZ'],['tr','TR'],['pl','PL'],['ca','ES'],['nl','NL BE'],['ar','SA EG AE MA'],['sv','SE'],['it','IT CH'],['id','ID'],['hi','IN'],['fi','FI'],['vi','VN'],['he','IL'],['uk','UA'],['el','GR CY'],['ms','MY'],['cs','CZ'],['ro','RO'],['da','DK'],['hu','HU'],['ta','IN LK'],['no','NO'],['th','TH'],['ur','PK'],['hr','HR'],['bg','BG'],['lt','LT'],['la','VA'],['mi','NZ'],['ml','IN'],['cy','GB'],['sk','SK'],['te','IN'],['fa','IR'],['lv','LV'],['bn','BD'],['sr','RS'],['az','AZ'],['sl','SI'],['kn','IN'],['et','EE'],['mk','MK'],['br','FR'],['eu','ES'],['is','IS'],['hy','AM'],['ne','NP'],['mn','MN'],['bs','BA'],['kk','KZ'],['sq','AL'],['sw','KE TZ'],['gl','ES'],['mr','IN'],['pa','IN PK'],['si','LK'],['km','KH'],['sn','ZW'],['yo','NG'],['so','SO'],['af','ZA'],['oc','FR'],['ka','GE'],['be','BY'],['tg','TJ'],['sd','PK'],['gu','IN'],['am','ET'],['yi','IL'],['lo','LA'],['uz','UZ'],['fo','FO'],['ht','HT'],['ps','AF'],['tk','TM'],['nn','NO'],['mt','MT'],['sa','IN'],['lb','LU'],['my','MM'],['bo','CN'],['tl','PH'],['mg','MG'],['as','IN'],['tt','RU'],['haw','US'],['ln','CD'],['ha','NG'],['ba','RU'],['jw','ID'],['su','ID']
];
const normalizeSearch = text => text.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLocaleLowerCase();
function languageDetails(code, regions) {
  if (code === 'auto') return {label:t('Detetar automaticamente'),countries:'',search:normalizeSearch(t('Detetar automaticamente')+' auto')};
  const names = new Intl.DisplayNames([siteLocale], {type:'language'});
  const countries = new Intl.DisplayNames([siteLocale], {type:'region'});
  const label = names.of(code);
  const regionList = regions.split(' ');
  const countryText = regionList.map(r => countries.of(r)).join(' · ');
  const aliases = [siteLocale,'pt','en'].flatMap(locale => {
    const ln = new Intl.DisplayNames([locale],{type:'language'});
    const rn = new Intl.DisplayNames([locale],{type:'region'});
    return [ln.of(code),...regionList.map(r => rn.of(r))];
  });
  return {label:label.charAt(0).toLocaleUpperCase()+label.slice(1),countries:countryText,search:normalizeSearch([code,...aliases].join(' '))};
}
function prepareLanguageOptions() {
  const video = document.getElementById('language'); video.replaceChildren();
  for (const [code,regions] of [['auto',''],...VIDEO_LANGUAGES]) {
    const option = document.createElement('option'); option.value=code; option.dataset.regions=regions; option.textContent=languageDetails(code,regions).label; video.append(option);
  }
  const site = document.getElementById('site-language');
  for (const [code,name] of Object.entries(SITE_LANGUAGES)) { const option=document.createElement('option'); option.value=code; option.textContent=name; site.append(option); }
  site.value=siteLocale;
}
prepareLanguageOptions();
translatePage();
