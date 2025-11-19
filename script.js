const dom = {
    languageBtn: document.getElementById('languageBtn'),
    translateBtn: document.getElementById('translateBtn'),
    sourceText: document.getElementById('sourceText'),
    charCount: document.getElementById('charCount'),
    dropZone: document.getElementById('dropZone'),
    filePicker: document.getElementById('filePicker'),
    micBtn: document.getElementById('micBtn'),
    stopMicBtn: document.getElementById('stopMicBtn'),
    micStatus: document.getElementById('micStatus'),
    agentLog: document.getElementById('agentLog'),
    agentState: document.getElementById('agentState'),
    sourceLang: document.getElementById('sourceLang'),
    targetLang: document.getElementById('targetLang'),
    googleKey: document.getElementById('googleKey'),
    speechKey: document.getElementById('speechKey'),
    speechProvider: document.getElementById('speechProvider'),
    resultText: document.getElementById('translatedText'),
    resultAudio: document.getElementById('translatedAudio'),
    speakBtn: document.getElementById('speakBtn'),
    downloadBtn: document.getElementById('downloadBtn'),
    languageChips: document.getElementById('languageChips'),
    languageDialog: document.getElementById('languageDialog'),
    dialogSource: document.getElementById('dialogSource'),
    dialogTarget: document.getElementById('dialogTarget'),
    closeDialog: document.getElementById('closeDialog'),
    saveLanguages: document.getElementById('saveLanguages')
};

const indiaLanguages = [
    { code: 'auto', label: 'Auto Detect' },
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'Hindi' },
    { code: 'te', label: 'Telugu' },
    { code: 'ta', label: 'Tamil' },
    { code: 'kn', label: 'Kannada' },
    { code: 'ml', label: 'Malayalam' },
    { code: 'bn', label: 'Bengali' },
    { code: 'gu', label: 'Gujarati' },
    { code: 'mr', label: 'Marathi' },
    { code: 'pa', label: 'Punjabi' },
    { code: 'ur', label: 'Urdu' },
    { code: 'or', label: 'Odia' },
    { code: 'as', label: 'Assamese' },
    { code: 'ne', label: 'Nepali' },
    { code: 'sd', label: 'Sindhi' },
    { code: 'ks', label: 'Kashmiri' },
    { code: 'sa', label: 'Sanskrit' }
];

const agent = (() => {
    const MAX_LOGS = 30;
    function log(message) {
        if (!dom.agentLog) return;
        const item = document.createElement('li');
        const time = new Date().toLocaleTimeString();
        item.innerHTML = `<strong>${time}</strong> — ${message}`;
        dom.agentLog.prepend(item);
        while (dom.agentLog.children.length > MAX_LOGS) {
            dom.agentLog.removeChild(dom.agentLog.lastChild);
        }
    }

    function setState(label) {
        if (dom.agentState) dom.agentState.textContent = label;
    }

    return { log, setState };
})();

let recognition = null;
let isMicActive = false;
const speechLocaleMap = {
    hi: 'hi-IN',
    te: 'te-IN',
    ta: 'ta-IN',
    kn: 'kn-IN',
    ml: 'ml-IN',
    bn: 'bn-IN',
    gu: 'gu-IN',
    mr: 'mr-IN',
    pa: 'pa-IN',
    ur: 'ur-IN',
    or: 'or-IN',
    as: 'as-IN',
    ne: 'ne-NP',
    sd: 'sd-IN',
    ks: 'ks-IN',
    sa: 'sa-IN'
};

function initLanguageSelects() {
    populateSelect(dom.sourceLang, true);
    populateSelect(dom.targetLang, false);
    populateSelect(dom.dialogSource, true);
    populateSelect(dom.dialogTarget, false);
    dom.sourceLang.value = 'auto';
    dom.dialogSource.value = 'auto';
    dom.targetLang.value = 'te';
    dom.dialogTarget.value = 'te';
    renderLanguageChips();
}

function populateSelect(select, allowAuto) {
    if (!select) return;
    select.innerHTML = '';
    indiaLanguages.forEach(lang => {
        if (!allowAuto && lang.code === 'auto') return;
        const option = document.createElement('option');
        option.value = lang.code;
        option.textContent = lang.label;
        select.appendChild(option);
    });
}

function renderLanguageChips() {
    if (!dom.languageChips) return;
    dom.languageChips.innerHTML = '';
    const sourceLabel = getLanguageLabel(dom.sourceLang.value);
    const targetLabel = getLanguageLabel(dom.targetLang.value);
    dom.languageChips.appendChild(createChip(`Source: ${sourceLabel}`));
    dom.languageChips.appendChild(createChip(`Target: ${targetLabel}`));
}

function getLanguageLabel(code) {
    const match = indiaLanguages.find(lang => lang.code === code);
    return match ? match.label : code;
}

function createChip(text) {
    const span = document.createElement('span');
    span.className = 'chip';
    span.textContent = text;
    return span;
}

function updateCharCount() {
    if (dom.charCount) {
        const length = dom.sourceText.value.trim().length;
        dom.charCount.textContent = `${length} characters`;
    }
}

function updateTranslateButton() {
    dom.translateBtn.disabled = dom.sourceText.value.trim().length === 0;
}

function appendToSource(text, label = 'input') {
    if (!text) return;
    const separator = dom.sourceText.value.trim() ? '\n\n' : '';
    dom.sourceText.value += `${separator}${text}`;
    agent.log(`Added ${label} (${text.length} chars) to workspace.`);
    updateCharCount();
    updateTranslateButton();
}

function openLanguageDialog() {
    dom.dialogSource.value = dom.sourceLang.value;
    dom.dialogTarget.value = dom.targetLang.value;
    if (typeof dom.languageDialog.showModal === 'function') {
        dom.languageDialog.showModal();
    } else {
        dom.languageDialog.setAttribute('open', 'true');
    }
}

function closeLanguageDialog() {
    if (typeof dom.languageDialog.close === 'function') {
        dom.languageDialog.close();
    } else {
        dom.languageDialog.removeAttribute('open');
    }
}

function wireDialogs() {
    dom.languageBtn.addEventListener('click', openLanguageDialog);
    dom.closeDialog.addEventListener('click', closeLanguageDialog);
    dom.saveLanguages.addEventListener('click', () => {
        dom.sourceLang.value = dom.dialogSource.value;
        dom.targetLang.value = dom.dialogTarget.value;
        renderLanguageChips();
        closeLanguageDialog();
        agent.log(`Languages locked to ${getLanguageLabel(dom.sourceLang.value)} ➜ ${getLanguageLabel(dom.targetLang.value)}.`);
        updateTranslateButton();
    });
}

function wireInputs() {
    dom.sourceText.addEventListener('input', () => {
        updateCharCount();
        updateTranslateButton();
    });

    dom.filePicker.addEventListener('change', (event) => {
        handleFiles(Array.from(event.target.files));
        event.target.value = '';
    });

    dom.dropZone.addEventListener('dragover', (event) => {
        event.preventDefault();
        dom.dropZone.classList.add('active');
    });

    dom.dropZone.addEventListener('dragleave', () => dom.dropZone.classList.remove('active'));

    dom.dropZone.addEventListener('drop', (event) => {
        event.preventDefault();
        dom.dropZone.classList.remove('active');
        handleFiles(Array.from(event.dataTransfer.files));
    });
}

async function handleFiles(files) {
    for (const file of files) {
        try {
            if (file.type.startsWith('text/') || /\.(txt|md|srt|vtt)$/i.test(file.name)) {
                const text = await file.text();
                appendToSource(text, file.name);
            } else if (file.type.startsWith('image/')) {
                await extractTextFromImage(file);
            } else if (file.type.startsWith('audio/')) {
                await transcribeAudioFile(file);
            } else {
                agent.log(`Unsupported file "${file.name}". Only image, text, and audio are accepted.`);
            }
        } catch (error) {
            console.error(error);
            agent.log(`Failed to ingest ${file.name}: ${error.message}`);
        }
    }
}

async function extractTextFromImage(file) {
    if (!window.Tesseract) {
        agent.log('Tesseract not ready. Please reload to enable OCR.');
        return;
    }
    agent.setState('OCR in progress…');
    agent.log(`Running OCR for ${file.name}`);
    const { data } = await Tesseract.recognize(file, 'eng+hin+tam+tel+kan+mal+ben+guj+mar+pan+asm+ori+urd', {
        logger: info => {
            if (info.status === 'recognizing text') {
                agent.log(`OCR progress ${Math.round(info.progress * 100)}% for ${file.name}`);
            }
        },
        langPath: 'https://tessdata.projectnaptha.com/4.0.0'
    });
    appendToSource(data.text, `${file.name} OCR`);
    agent.setState('Idle');
}

async function transcribeAudioFile(file) {
    const key = dom.speechKey.value.trim();
    if (!key) {
        agent.log(`Audio "${file.name}" uploaded. Add a speech-to-text key to transcribe automatically or use the mic button.`);
        return;
    }
    const provider = dom.speechProvider.value;
    const endpoint = provider === 'openai'
        ? 'https://api.openai.com/v1/audio/transcriptions'
        : 'https://api.groq.com/openai/v1/audio/transcriptions';
    const model = provider === 'openai' ? 'whisper-1' : 'whisper-large-v3';
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('model', model);
    formData.append('response_format', 'json');
    agent.setState('Transcribing audio…');
    agent.log(`Uploading ${file.name} to ${provider.toUpperCase()} Whisper`);
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}` },
        body: formData
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Speech API error: ${text}`);
    }
    const data = await response.json();
    appendToSource(data.text, `${file.name} transcript`);
    agent.setState('Idle');
}

async function translateWorkspace() {
    const raw = dom.sourceText.value.trim();
    if (!raw) return;
    dom.translateBtn.disabled = true;
    agent.setState('Translating…');
    agent.log('Preparing request for Google Translate');
    try {
        const translated = await translateText(raw);
        dom.resultText.textContent = translated;
        agent.log('Translation completed.');
        renderLanguageChips();
        loadTtsAudio(translated);
    } catch (error) {
        console.error(error);
        agent.log(`Translation failed: ${error.message}`);
        dom.resultText.textContent = `⚠️ ${error.message}`;
    } finally {
        dom.translateBtn.disabled = dom.sourceText.value.trim().length === 0;
        agent.setState('Idle');
    }
}

async function translateText(text) {
    const source = dom.sourceLang.value;
    const target = dom.targetLang.value;
    const key = dom.googleKey.value.trim();
    if (!target) throw new Error('Select a target language.');

    if (key) {
        const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                q: text,
                target,
                source: source === 'auto' ? undefined : source,
                format: 'text'
            })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error?.message || 'Google API rejected the request.');
        }
        return data.data.translations.map(item => item.translatedText).join(' ');
    }

    const params = new URLSearchParams({
        client: 'gtx',
        sl: source === 'auto' ? 'auto' : source,
        tl: target,
        dt: 't',
        q: text
    });
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?${params.toString()}`);
    if (!response.ok) throw new Error('Public Google endpoint blocked the request.');
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('Unexpected Google response.');
    return data[0].map(item => item[0]).join('');
}

function loadTtsAudio(text) {
    if (!text) return;
    const url = buildTtsUrl(text, dom.targetLang.value);
    dom.resultAudio.setAttribute('crossorigin', 'anonymous');
    dom.resultAudio.setAttribute('referrerpolicy', 'no-referrer');
    dom.resultAudio.src = url;
    dom.resultAudio.onerror = () => {
        agent.log('Google voice stream blocked. Tap again to use device voice fallback.');
    };
    dom.speakBtn.disabled = false;
}

function buildTtsUrl(text, lang) {
    const chunk = text.slice(0, 190);
    return `https://translate.googleapis.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&q=${encodeURIComponent(chunk)}`;
}

function downloadTranslation() {
    const content = dom.resultText.textContent.trim();
    if (!content) {
        agent.log('No translation to download yet.');
        return;
    }
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `translation-${dom.targetLang.value}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    agent.log('Translation saved to disk.');
}

function setupMic() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        dom.micBtn.disabled = true;
        dom.stopMicBtn.disabled = true;
        dom.micStatus.textContent = 'Speech recognition not supported in this browser.';
        return;
    }
    recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onstart = () => {
        isMicActive = true;
        dom.micStatus.textContent = 'Listening… speak now.';
        dom.micBtn.disabled = true;
        dom.stopMicBtn.disabled = false;
        agent.setState('Listening…');
    };

    recognition.onerror = (event) => {
        agent.log(`Mic error: ${event.error}`);
        stopMic();
    };

    recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                transcript += `${event.results[i][0].transcript} `;
            }
        }
        if (transcript.trim()) {
            dom.micStatus.textContent = 'Speech captured. Tap translate when ready.';
            appendToSource(transcript.trim(), 'Live mic');
        }
    };

    recognition.onend = () => {
        isMicActive = false;
        dom.micBtn.disabled = false;
        dom.stopMicBtn.disabled = true;
        agent.setState('Idle');
        dom.micStatus.textContent = 'Mic idle.';
    };

    dom.micBtn.addEventListener('click', () => {
        if (isMicActive) return;
        try {
            recognition.start();
        } catch (error) {
            agent.log(`Mic failed to start: ${error.message}`);
        }
    });

    dom.stopMicBtn.addEventListener('click', stopMic);
}

function stopMic() {
    if (recognition && isMicActive) {
        recognition.stop();
    }
}

function wireActions() {
    dom.translateBtn.addEventListener('click', translateWorkspace);
    dom.speakBtn.addEventListener('click', handleSpeakRequest);
    dom.downloadBtn.addEventListener('click', downloadTranslation);
}

async function handleSpeakRequest() {
    const text = dom.resultText.textContent.trim();
    if (!text) {
        agent.log('Nothing to read yet.');
        return;
    }

    dom.speakBtn.disabled = true;
    setSpeakBtnLabel('🔊 Loading Google voice…');

    try {
        await dom.resultAudio.play();
        setSpeakBtnLabel('🔊 Playing via Google');
    } catch (error) {
        agent.log(`Google audio play failed (${error.name}). Switching to fallback voice.`);
        try {
            playWithSpeechSynthesis(text, dom.targetLang.value);
            setSpeakBtnLabel('🗣️ Playing via device voice');
            setTimeout(() => setSpeakBtnLabel('🔊 Play via Google Voice'), 1500);
        } catch (fallbackError) {
            agent.log(`Speech synthesis unavailable: ${fallbackError.message}`);
            alert('Audio playback is blocked in this browser.');
            setSpeakBtnLabel('🔇 Audio unavailable');
        }
    } finally {
        dom.speakBtn.disabled = false;
    }
}

function playWithSpeechSynthesis(text, langCode) {
    if (!('speechSynthesis' in window)) {
        throw new Error('Speech synthesis not supported.');
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.slice(0, 390));
    utterance.lang = speechLocaleMap[langCode] || langCode || 'en-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
}

function setSpeakBtnLabel(label) {
    dom.speakBtn.textContent = label;
}

dom.resultAudio.addEventListener('ended', () => {
    setSpeakBtnLabel('🔊 Play via Google Voice');
});

function init() {
    initLanguageSelects();
    wireDialogs();
    wireInputs();
    setupMic();
    wireActions();
    updateCharCount();
    updateTranslateButton();
    agent.log('Agent warmed up. Upload or speak to begin.');
}

document.addEventListener('DOMContentLoaded', init);

