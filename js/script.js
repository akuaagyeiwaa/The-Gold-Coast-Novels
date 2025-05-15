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
