// === Tabs ===
function openTab(evt, tabId) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.style.display = "none");

    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(button => button.classList.remove('active'));

    const selectedTab = document.getElementById(tabId);
    if (selectedTab) selectedTab.style.display = "block";

    evt.currentTarget.classList.add('active');
}

// === Read Aloud ===
function readAloud() {
    const target = document.getElementById('welcome-message');
    if (!target) return;

    const text = target.innerText.trim();
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    speechSynthesis.cancel(); // stop any previous
    speechSynthesis.speak(utterance);
}

// === Theme Toggle ===
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute("data-theme") || "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
}

// === Google Translate ===
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,fr,es,sw',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');
}

// === Initializer ===
document.addEventListener('DOMContentLoaded', () => {
    const defaultButton = document.querySelector('.tab-button');
    if (defaultButton) defaultButton.click();

    // Apply saved theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        document.documentElement.setAttribute("data-theme", savedTheme);
    }
});

// === Load Novel into Immersion Reader ===
function loadNovel() {
    const select = document.getElementById('novelSelect');
    const contentArea = document.getElementById('content-area');
    const loading = document.getElementById('loading');
    const selectedFile = select.value;

    if (!selectedFile) {
        contentArea.innerHTML = '<p>Please select a novel to begin reading...</p>';
        return;
    }

    loading.style.display = 'block';
    fetch(selectedFile)
        .then(response => {
            if (!response.ok) throw new Error('Network error');
            return response.text();
        })
        .then(html => {
            // Extract main content from the selected novel's HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const mainContent = doc.querySelector('main') || doc.body;
            contentArea.innerHTML = mainContent.innerHTML;
        })
        .catch(err => {
            contentArea.innerHTML = `<p>Error loading novel: ${err.message}</p>`;
        })
        .finally(() => {
            loading.style.display = 'none';
        });
}

// === Font Size Adjustment ===
let currentFontSize = 1.0;

function adjustFontSize(action) {
    const contentArea = document.getElementById('content-area');

    if (action === 'increase') currentFontSize += 0.1;
    else if (action === 'decrease') currentFontSize = Math.max(0.6, currentFontSize - 0.1);
    else currentFontSize = 1.0;

    contentArea.style.fontSize = currentFontSize + 'rem';
}

// === Read Aloud Toggle ===
let speechInstance = null;

function toggleReadAloud() {
    const content = document.getElementById('content-area');
    if (!content) return;

    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        return;
    }

    const text = content.innerText.trim();
    if (!text) return;

    speechInstance = new SpeechSynthesisUtterance(text);
    speechInstance.lang = 'en-US';
    speechSynthesis.speak(speechInstance);
}
