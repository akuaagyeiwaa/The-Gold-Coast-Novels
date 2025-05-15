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
function loadTheNovels() {
    const select = document.getElementById('ThenovelsSelect');
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

// === Novel-Based Tab Content Loader ===
function changeNovel() {
    const novel = document.getElementById('novelSelect').value;

    const content = {
        marita: {
            map: 'Map of Marita settings, including coastal trading routes.',
            timeline: 'Timeline of Marita’s events: migration, rebellion, reconciliation.',
            locations: '<li>Elmina</li><li>Cape Coast</li><li>Accra</li>',
            history: 'Marita reflects early 20th-century colonial resistance movements.'
        },
        'ethiopia-unbound': {
            map: 'Map showing locations referenced in Ethiopia Unbound.',
            timeline: 'Timeline exploring Marcus Garvey influences and pan-Africanism.',
            locations: '<li>Liberia</li><li>London</li><li>Gold Coast</li>',
            history: 'Explores early pan-African intellectual thought.'
        },
        'the-anglo-fanti': {
            map: 'Map of the Anglo-Fanti conflict regions.',
            timeline: 'Major events in Fanti and British interaction during colonization.',
            locations: '<li>Fanti Confederacy</li><li>Fort William</li><li>Anomabo</li>',
            history: 'Contextual background of the Anglo-Fanti War and alliances.'
        },
        eighteenpence: {
            map: 'Political geography of chiefs and land disputes.',
            timeline: 'Succession disputes and court battles in colonial Gold Coast.',
            locations: '<li>Kumasi</li><li>Accra</li><li>Saltpond</li>',
            history: 'Details of judicial systems and resistance through storytelling.'
        }
    };

    const novelData = content[novel];
    if (!novelData) return;

    document.getElementById('mapTab').innerHTML = `
        <div class="map-container"><p>${novelData.map}</p></div>`;

    document.getElementById('timelineTab').innerHTML = `
        <div class="timeline-container"><p>${novelData.timeline}</p></div>`;

    document.getElementById('locationsTab').innerHTML = `
        <ul class="location-list">${novelData.locations}</ul>`;

    document.getElementById('historicalTab').innerHTML = `
        <p>${novelData.history}</p>`;
}

// ... other functions like openTab(), toggleTheme(), changeNovel(), etc.
function openTab(evt, tabName) {
  // Hide all tab contents
  const tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach(content => content.classList.remove('active'));

  // Remove 'active' class from all tab buttons
  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach(button => button.classList.remove('active'));

  // Show the selected tab content
  document.getElementById(tabName).classList.add('active');

  // Add 'active' class to the clicked tab button
  evt.currentTarget.classList.add('active');

  // Store the active tab in localStorage
  localStorage.setItem('activeTab', tabName);
}

// Restore the active tab on page load
document.addEventListener('DOMContentLoaded', () => {
  const activeTab = localStorage.getItem('activeTab') || 'fulltext';
  const tabButton = document.querySelector(`.tab-button[onclick="openTab(event, '${activeTab}')"]`);
  if (tabButton) {
    tabButton.click();
  }
});


// === Photo Modal Viewer ===
function openModal(imageDiv) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const modalCaption = document.getElementById("modalCaption");

    const img = imageDiv.querySelector("img");
    modal.style.display = "block";
    modalImg.src = img.src;
    modalCaption.innerText = img.alt || "";
}

function closeModal() {
    document.getElementById("imageModal").style.display = "none";
}

