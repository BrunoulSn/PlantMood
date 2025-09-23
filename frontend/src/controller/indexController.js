// Initialize app
let plants = JSON.parse(localStorage.getItem('plants')) || [];
let moodHistory = JSON.parse(localStorage.getItem('moodHistory')) || [];
let journalEntries = JSON.parse(localStorage.getItem('journalEntries')) || [];

const tips = [
    "Plantas felizes = pessoas felizes! Regue com amor hoje. 💚",
    "Que tal conversar com suas plantas? Elas adoram ouvir sua voz! 🗣️",
    "Um pouco de sol faz bem para você e suas plantas. ☀️",
    "Lembre-se: cuidar das plantas é uma forma de meditação. 🧘‍♀️",
    "Suas plantas crescem junto com seu bem-estar emocional! 🌱",
    "Hoje é um bom dia para replantar algo novo em sua vida. 🪴",
    "O verde das plantas acalma a mente e o coração. 💚"
];

// Set current date
document.getElementById('currentDate').textContent = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit'
});

// Set daily tip
const today = new Date().getDate();
document.getElementById('dailyTip').textContent = tips[today % tips.length];

// Load plants
function loadPlants() {
    const plantsList = document.getElementById('plantsList');
    if (plants.length === 0) {
        plantsList.innerHTML = `
                    <div class="text-center py-8 text-gray-500">
                        <div class="text-4xl mb-2">🌱</div>
                        <p>Adicione sua primeira planta!</p>
                        <button onclick="addPlant()" class="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                            Adicionar Planta
                        </button>
                    </div>
                `;
        return;
    }

    plantsList.innerHTML = plants.map((plant, index) => `
                <div class="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div class="flex items-center">
                        <span class="text-2xl mr-3">${plant.emoji}</span>
                        <div>
                            <div class="font-medium text-gray-800">${plant.name}</div>
                            <div class="text-xs text-gray-500">${plant.type || 'Planta'}</div>
                            <div class="text-sm text-gray-500">Última rega: ${plant.lastWatered}</div>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="waterPlant(${index})" class="bg-blue-100 hover:bg-blue-200 p-2 rounded-lg transition-colors">💧</button>
                        <button onclick="removePlant(${index})" class="bg-red-100 hover:bg-red-200 p-2 rounded-lg transition-colors">🗑️</button>
                    </div>
                </div>
            `).join('');
}

let selectedPlantType = { emoji: '🌱', type: 'Suculenta' };

function addPlant() {
    document.getElementById('addPlantModal').classList.remove('hidden');
    document.getElementById('plantName').value = '';

    // Reset selection
    document.querySelectorAll('.plant-type-btn').forEach(btn => {
        btn.classList.remove('border-green-500', 'bg-green-50');
        btn.classList.add('border-gray-200');
    });

    // Select first option by default
    const firstBtn = document.querySelector('.plant-type-btn');
    firstBtn.classList.remove('border-gray-200');
    firstBtn.classList.add('border-green-500', 'bg-green-50');
    selectedPlantType = {
        emoji: firstBtn.dataset.emoji,
        type: firstBtn.dataset.type
    };
}

function closeAddPlant() {
    document.getElementById('addPlantModal').classList.add('hidden');
}

function saveNewPlant() {
    const plantName = document.getElementById('plantName').value.trim();

    if (!plantName) {
        showNotification('Por favor, digite um nome para sua planta! 🌱');
        return;
    }

    const newPlant = {
        name: plantName,
        emoji: selectedPlantType.emoji,
        type: selectedPlantType.type,
        lastWatered: 'Nunca',
        addedDate: new Date().toLocaleDateString('pt-BR')
    };

    plants.push(newPlant);
    localStorage.setItem('plants', JSON.stringify(plants));
    loadPlants();
    closeAddPlant();

    showNotification(`${selectedPlantType.emoji} ${plantName} adicionada ao seu jardim!`);
}

// Add event listeners for plant type selection
document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('click', function (e) {
        if (e.target.closest('.plant-type-btn')) {
            const btn = e.target.closest('.plant-type-btn');

            // Remove selection from all buttons
            document.querySelectorAll('.plant-type-btn').forEach(b => {
                b.classList.remove('border-green-500', 'bg-green-50');
                b.classList.add('border-gray-200');
            });

            // Add selection to clicked button
            btn.classList.remove('border-gray-200');
            btn.classList.add('border-green-500', 'bg-green-50');

            selectedPlantType = {
                emoji: btn.dataset.emoji,
                type: btn.dataset.type
            };
        }
    });
});

function waterPlant(index) {
    plants[index].lastWatered = 'Agora mesmo';
    localStorage.setItem('plants', JSON.stringify(plants));
    loadPlants();
    showNotification(`${plants[index].emoji} ${plants[index].name} foi regada! 💧`);
}

function removePlant(index) {
    const plant = plants[index];
    plants.splice(index, 1);
    localStorage.setItem('plants', JSON.stringify(plants));
    loadPlants();
    showNotification(`${plant.emoji} ${plant.name} foi removida do jardim.`);
}

function selectMood(emoji, mood) {
    const moodEntry = {
        emoji: emoji,
        mood: mood,
        date: new Date().toLocaleDateString('pt-BR'),
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    moodHistory.push(moodEntry);
    localStorage.setItem('moodHistory', JSON.stringify(moodHistory));

    const feedback = document.getElementById('moodFeedback');
    const feedbackText = feedback.querySelector('p');

    const responses = {
        'Triste': 'Que tal regar uma planta? Cuidar da natureza pode melhorar seu humor! 🌱',
        'Ok': 'Um dia normal! Suas plantas estão aqui para te acompanhar. 🪴',
        'Bem': 'Ótimo! Você e suas plantas estão em sintonia hoje! 😊',
        'Ótimo': 'Que energia maravilhosa! Suas plantas sentem essa vibração positiva! ✨',
        'Incrível': 'Você está radiante! Suas plantas devem estar crescendo com essa energia! 🌟'
    };

    feedbackText.textContent = responses[mood];
    feedback.classList.remove('hidden');

    setTimeout(() => {
        feedback.classList.add('hidden');
    }, 5000);
}

function showJournal() {
    document.getElementById('journalModal').classList.remove('hidden');
}

function closeJournal() {
    document.getElementById('journalModal').classList.add('hidden');
    document.getElementById('journalText').value = '';
}

function saveJournal() {
    const text = document.getElementById('journalText').value.trim();
    if (text) {
        const entry = {
            text: text,
            date: new Date().toLocaleDateString('pt-BR'),
            time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };

        journalEntries.push(entry);
        localStorage.setItem('journalEntries', JSON.stringify(journalEntries));

        showNotification('Entrada do diário salva! 📝');
        closeJournal();
    }
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 left-4 right-4 bg-green-500 text-white p-3 rounded-lg shadow-lg z-50 max-w-sm mx-auto transform translate-y-[-100px] opacity-0 transition-all duration-300';
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateY(-100px)';
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

const sections = {
    index: `
        <!-- Conteúdo da Home (copie de homeSection) -->
        <div>
            <!-- Mood Check-in -->
            <!-- ... -->
            <!-- Minhas Plantas -->
            <!-- ... -->
            <!-- Dica do Dia -->
            <!-- ... -->
        </div>
    `,
    garden: `
        <div>
            <h2>Jardim</h2>
            <!-- Conteúdo do jardim -->
        </div>
    `,
    stats: `
        <div>
            <h2>Stats</h2>
            <!-- Conteúdo de estatísticas -->
        </div>
    `,
    profile: `
        <div>
            <h2>Perfil</h2>
            <!-- Conteúdo do perfil -->
        </div>
    `
};

function loadPage(button) {
    const page = button.getAttribute('data-page');
    const sections = ['homeSection', 'gardenSection', 'statsSection', 'profileSection'];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });

    const activeSection = document.getElementById(page + 'Section');
    if (activeSection) activeSection.classList.remove('hidden');

    updateNavigation(page);
}



// Função para atualizar o estado da navegação
function updateNavigation(page) {
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    const btn = document.querySelector(`.nav-item[onclick="loadPage('${page}')"]`);
    if (btn) btn.classList.add('active');
}


function clearData() {
    if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
        localStorage.clear();
        plants = [];
        moodHistory = [];
        journalEntries = [];
        showNotification('Todos os dados foram limpos!');
        showHome();
        loadPlants();
    }
}

function exportData() {
    const data = {
        plants: plants,
        moodHistory: moodHistory,
        journalEntries: journalEntries,
        exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'plantmood-data.json';
    link.click();

    URL.revokeObjectURL(url);
    showNotification('Dados exportados com sucesso! 📤');
}

// Initialize app
document.addEventListener('DOMContentLoaded', function () {
    // Set current date
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit'
    });

    // Set daily tip
    const today = new Date().getDate();
    document.getElementById('dailyTip').textContent = tips[today % tips.length];

    // Inicializa plantas
    loadPlants();
});