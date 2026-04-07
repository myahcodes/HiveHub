const backdrop = document.getElementById('modal-backdrop');
const bizzyModal = document.getElementById('bizzy-modal');
let currentModal = null;

function hideAllModals() {
    if (currentModal) currentModal.classList.add('hidden');
    backdrop.classList.add('hidden');
    currentModal = null;
}

function showModal(modal) {
    if (currentModal) currentModal.classList.add('hidden');
    modal.classList.remove('hidden');
    backdrop.classList.remove('hidden');
    currentModal = modal;
}

document.getElementById('bizzy-trigger').addEventListener('click', (e) => {
    e.stopPropagation();
    showModal(bizzyModal);
});

backdrop.addEventListener('click', hideAllModals);

// Close button inside modal
const closeBtn = bizzyModal.querySelector('.close-modal');
if (closeBtn) closeBtn.addEventListener('click', hideAllModals);