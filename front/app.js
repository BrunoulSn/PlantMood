function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
}

// Exemplo de uso nos botões
document.getElementById('btnHome').onclick = () => showSection('homeSection');
document.getElementById('btnGarden').onclick = () => showSection('gardenSection');
// etc.