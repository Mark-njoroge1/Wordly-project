const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultContainer = document.getElementById('result-container');
const errorMessage = document.getElementById('error-message');

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const word = searchInput.value.trim();
    if (word) {
        fetchWordData(word);
    }
});

async function fetchWordData(word) {
    const API_URL = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error("Word not found. Try another one!");
        }

        const data = await response.json();
        displayResults(data[0]);
    } catch (error) {
        showError(error.message);
    }
}

function displayResults(data) {
    errorMessage.classList.add('hidden');
    resultContainer.classList.remove('hidden');

    // Find the first available audio link
    const audioSrc = data.phonetics.find(p => p.audio)?.audio || '';

    resultContainer.innerHTML = `
        <div class="word-header">
            <div>
                <h2>${data.word}</h2>
                <p><em>${data.phonetic || ''}</em></p>
            </div>
            ${audioSrc ? `<button onclick="new Audio('${audioSrc}').play()">🔊 Play</button>` : ''}
        </div>
        <hr>
        <h3>${data.meanings[0].partOfSpeech}</h3>
        <p>${data.meanings[0].definitions[0].definition}</p>
        <p class="example">${data.meanings[0].definitions[0].example ? `"${data.meanings[0].definitions[0].example}"` : ''}</p>
        ${data.meanings[0].synonyms.length > 0 ? `<p class="synonyms">Synonyms: ${data.meanings[0].synonyms.slice(0, 3).join(', ')}</p>` : ''}
    `;
}

function showError(message) {
    resultContainer.classList.add('hidden');
    errorMessage.classList.remove('hidden');
    errorMessage.innerHTML = `<p style="color: red;">${message}</p>`;
}