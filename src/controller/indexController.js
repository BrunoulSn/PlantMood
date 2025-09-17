(function () {
    // Estado inicial
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

    // Data atual e dica do dia
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit'
    });

    const today = new Date().getDate();
    document.getElementById('dailyTip').textContent = tips[today % tips.length];

    let selectedPlantType = { emoji: '🌱', type: 'Suculenta' };

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

    function addPlant() {
        document.getElementById('addPlantModal').classList.remove('hidden');
        document.getElementById('plantName').value = '';

        document.querySelectorAll('.plant-type-btn').forEach(btn => {
            btn.classList.remove('border-green-500', 'bg-green-50');
            btn.classList.add('border-gray-200');
        });

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
            emoji,
            mood,
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

        setTimeout(() => feedback.classList.add('hidden'), 5000);
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
                text,
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
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 left-4 right-4 bg-green-500 text-white p-3 rounded-lg shadow-lg z-50 max-w-sm mx-auto transform translate-y-[-100px] opacity-0 transition-all duration-300';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateY(-100px)';
            notification.style.opacity = '0';
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    function showHome() {
        updateNavigation('home');
    }

    function showGarden() {
        updateNavigation('garden');
        document.getElementById('mainContent').innerHTML = `
            <div class="plant-card rounded-2xl p-6 mb-6 shadow-lg">
                <h2 class="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                    <span class="text-3xl mr-3">🌱</span>
                    Meu Jardim Virtual
                </h2>
                <div class="grid grid-cols-2 gap-4">
                    ${plants.map(plant => `
                        <div class="bg-gradient-to-br from-green-100 to-blue-100 p-4 rounded-xl text-center">
                            <div class="text-4xl mb-2">${plant.emoji}</div>
                            <div class="font-medium text-gray-800">${plant.name}</div>
                            <div class="text-xs text-gray-600 mt-1">Desde ${plant.addedDate}</div>
                        </div>
                    `).join('')}
                </div>
                ${plants.length === 0 ? '<div class="text-center py-8 text-gray-500"><div class="text-4xl mb-2">🌱</div><p>Seu jardim está vazio!</p></div>' : ''}
            </div>
        `;
    }

    function showStats() {
        updateNavigation('stats');
        const totalMoods = moodHistory.length;
        const totalJournals = journalEntries.length;
        const totalPlants = plants.length;

        document.getElementById('mainContent').innerHTML = `
            <div class="plant-card rounded-2xl p-6 mb-6 shadow-lg">
                <h2 class="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                    <span class="text-3xl mr-3">📊</span>
                    Suas Estatísticas
                </h2>
                <div class="space-y-4">
                    <div class="bg-gradient-to-r from-green-100 to-green-200 p-4 rounded-xl">
                        <div class="text-2xl font-bold text-green-800">${totalPlants}</div>
                        <div class="text-green-700">Plantas no jardim</div>
                    </div>
                    <div class="bg-gradient-to-r from-blue-100 to-blue-200 p-4 rounded-xl">
                        <div class="text-2xl font-bold text-blue-800">${totalMoods}</div>
                        <div class="text-blue-700">Check-ins de humor</div>
                    </div>
                    <div class="bg-gradient-to-r from-purple-100 to-purple-200 p-4 rounded-xl">
                        <div class="text-2xl font-bold text-purple-800">${totalJournals}</div>
                        <div class="text-purple-700">Entradas no diário</div>
                    </div>
                </div>
            </div>

            ${moodHistory.length > 0 ? `
            <div class="plant-card rounded-2xl p-6 mb-6 shadow-lg">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Últimos Humores</h3>
                <div class="space-y-2">
                    ${moodHistory.slice(-5).reverse().map(mood => `
                        <div class="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <div class="flex items-center">
                                <span class="text-xl mr-3">${mood.emoji}</span>
                                <span class="text-gray-700">${mood.mood}</span>
                            </div>
                            <span class="text-sm text-gray-500">${mood.date}</span>
                        </div>
                    `).join('')}
                </div>
            </div>` : ''}
        `;
    }

    function showProfile() {
        updateNavigation('profile');
        document.getElementById('mainContent').innerHTML = `
            <div class="plant-card rounded-2xl p-6 mb-6 shadow-lg">
                <h2 class="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                    <span class="text-3xl mr-3">👤</span>
                    Meu Perfil
                </h2>
                <div class="text-center mb-6">
                    <div class="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl text-white">
                        🌱
                    </div>
                    <h3 class="text-xl font-semibold text-gray-800">Jardineiro Digital</h3>
                    <p class="text-gray-600">Cuidando de plantas e emoções</p>
                </div>

                <div class="space-y-3">
                    <button onclick="clearData()" class="w-full bg-red-100 hover:bg-red-200 text-red-700 py-3 rounded-lg transition-colors">
                        🗑️ Limpar todos os dados
                    </button>
                    <button onclick="exportData()" class="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 py-3 rounded-lg transition-colors">
                        📤 Exportar dados
                    </button>
                </div>
            </div>

            <div class="plant-card rounded-2xl p-6 mb-6 shadow-lg">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Sobre o PlantMood</h3>
                <p class="text-gray-600 text-sm leading-relaxed">
                    O PlantMood combina o cuidado com plantas e o bem-estar emocional. 
                    Acompanhe seu humor diário enquanto cuida do seu jardim virtual. 
                    Plantas felizes, pessoas felizes! 🌱💚
                </p>
            </div>
        `;
    }

    function updateNavigation(active) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        const navItems = document.querySelectorAll('.nav-item');
        const activeIndex = { home: 0, garden: 1, stats: 2, profile: 3 }[active];
        if (navItems[activeIndex]) {
            navItems[activeIndex].classList.add('active');
        }
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
            plants,
            moodHistory,
            journalEntries,
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

    // Eventos DOM
    document.addEventListener('DOMContentLoaded', function () {
        document.addEventListener('click', function (e) {
            if (e.target.closest('.plant-type-btn')) {
                const btn = e.target.closest('.plant-type-btn');

                document.querySelectorAll('.plant-type-btn').forEach(b => {
                    b.classList.remove('border-green-500', 'bg-green-50');
                    b.classList.add('border-gray-200');
                });

                btn.classList.remove('border-gray-200');
                btn.classList.add('border-green-500', 'bg-green-50');

                selectedPlantType = {
                    emoji: btn.dataset.emoji,
                    type: btn.dataset.type
                };
            }
        });

        loadPlants();
    });

    // Expor apenas o necessário
    window.addPlant = addPlant;
    window.saveNewPlant = saveNewPlant;
    window.closeAddPlant = closeAddPlant;
    window.waterPlant = waterPlant;
    window.removePlant = removePlant;
    window.selectMood = selectMood;
    window.showJournal = showJournal;
    window.closeJournal = closeJournal;
    window.saveJournal = saveJournal;
    window.showHome = showHome;
    window.showGarden = showGarden;
    window.showStats = showStats;
    window.showProfile = showProfile;
    window.clearData = clearData;
    window.exportData = exportData;

})();
