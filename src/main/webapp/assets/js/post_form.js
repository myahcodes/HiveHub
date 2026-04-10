import { Editor } from 'https://esm.sh/@tiptap/core';
import StarterKit from 'https://esm.sh/@tiptap/starter-kit';
import Placeholder from 'https://esm.sh/@tiptap/extension-placeholder';
import Link from 'https://esm.sh/@tiptap/extension-link';
import Image from 'https://esm.sh/@tiptap/extension-image';

lucide.createIcons();

// Emoji picker setup
const emojiTrigger = document.getElementById('emoji-trigger');
const pickerContainer = document.getElementById('emoji-picker-container');
const editorContainer = document.querySelector('.post-editor');

const picker = picmo.createPicker({
    rootElement: pickerContainer,
    showPreview: false,
    showSearch: true,
    theme: 'dark'
});

picker.addEventListener('emoji:select', (selection) => {
    editor.chain().focus().insertContent(selection.emoji).run();
    pickerContainer.classList.remove('show');
});

emojiTrigger.onclick = (e) => {
    e.stopPropagation();
    pickerContainer.classList.toggle('show');
    setTimeout(updatePickerWidth, 10);
};

document.addEventListener('click', (e) => {
    if (!pickerContainer.contains(e.target) && !emojiTrigger.contains(e.target)) {
        pickerContainer.classList.remove('show');
    }
});

function updatePickerWidth() {
    if (!editorContainer || !pickerContainer) return;
    pickerContainer.style.width = editorContainer.offsetWidth + 'px';
    const editorRect = editorContainer.getBoundingClientRect();
    const triggerRect = emojiTrigger.getBoundingClientRect();
    pickerContainer.style.left = (editorRect.left - triggerRect.left) + 'px';
}

window.addEventListener('resize', () => {
    if (pickerContainer.classList.contains('show')) updatePickerWidth();
});

// Editor setup
const editor = new Editor({
    element: document.querySelector('#editor-content'),
    extensions: [
        StarterKit,
        Placeholder.configure({
            placeholder: 'Text (optional)',
        }),
        Link.configure({ openOnClick: false }),
        Image,
    ],
    content: '',
    onUpdate() { updateToolbarState(); }
});

const commands = {
    undo: () => editor.chain().focus().undo().run(),
    redo: () => editor.chain().focus().redo().run(),
    bold: () => editor.chain().focus().toggleBold().run(),
    italic: () => editor.chain().focus().toggleItalic().run(),
    h1: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    h2: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    paragraph: () => editor.chain().focus().setParagraph().run(),
    bulletList: () => editor.chain().focus().toggleBulletList().run(),
    orderedList: () => editor.chain().focus().toggleOrderedList().run(),
};

document.querySelectorAll('[data-cmd]').forEach(btn => {
    btn.onclick = () => {
        const cmd = btn.getAttribute('data-cmd');
        if (commands[cmd]) commands[cmd]();
    };
});

function updateToolbarState() {
    document.querySelectorAll('[data-cmd]').forEach(btn => {
        const cmd = btn.getAttribute('data-cmd');
        const isActive = (cmd === 'h1' || cmd === 'h2')
            ? editor.isActive('heading', { level: parseInt(cmd[1]) })
            : editor.isActive(cmd);
        if (isActive) btn.classList.add('is-active');
        else btn.classList.remove('is-active');
    });
}

// Modal management
const backdrop = document.getElementById('modal-backdrop');
const linkModal = document.getElementById('link-modal');
const locationModal = document.getElementById('location-modal');
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

backdrop.addEventListener('click', hideAllModals);

// ========== TAG FEATURE ==========
const tagModal = document.getElementById('tag-modal');
const tagsContainer = document.getElementById('tag-list');
const tagButton = document.getElementById('tagging');
const customTagInput = document.getElementById('custom-tag-input');
let selectedTags = [];

function toggleTag(e) {
    e.currentTarget.classList.toggle('selected');
}

function attachTagToggleListeners() {
    document.querySelectorAll('.tag-opt').forEach(opt => {
        opt.removeEventListener('click', toggleTag);
        opt.addEventListener('click', toggleTag);
    });
}
attachTagToggleListeners();

tagButton.addEventListener('click', (e) => {
    e.stopPropagation();
    const tagOptions = tagModal.querySelectorAll('.tag-opt');
    tagOptions.forEach(opt => {
        const tag = opt.getAttribute('data-tag');
        if (selectedTags.includes(tag)) opt.classList.add('selected');
        else opt.classList.remove('selected');
    });
    showModal(tagModal);
});

function createCustomTagButton(tagName) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tag-opt custom-tag selected';
    btn.setAttribute('data-tag', tagName);
    btn.innerHTML = `${tagName} <span class="remove-modal-tag">&times;</span>`;

    btn.addEventListener('click', (e) => {
        if (!e.target.classList.contains('remove-modal-tag')) {
            e.currentTarget.classList.toggle('selected');
        }
    });

    btn.querySelector('.remove-modal-tag').addEventListener('click', (e) => {
        e.stopPropagation();
        btn.remove();
    });

    btn.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        const oldTag = btn.getAttribute('data-tag');
        const input = document.createElement('input');
        input.type = 'text';
        input.value = oldTag;
        input.className = 'tag-opt edit-input';
        input.style.width = btn.offsetWidth + 'px';

        btn.replaceWith(input);
        input.focus();

        const saveEdit = () => {
            const newVal = input.value.trim();
            if (newVal && newVal.length <= 20) {
                input.replaceWith(createCustomTagButton(newVal));
            } else {
                input.replaceWith(createCustomTagButton(oldTag));
            }
        };

        input.addEventListener('blur', saveEdit);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveEdit();
            }
        });
    });

    return btn;
}

function adjustInputWidth() {
    const valueLength = customTagInput.value.length || customTagInput.placeholder.length;
    customTagInput.style.width = `${Math.min(valueLength + 2, 22)}ch`;
}

customTagInput.addEventListener('input', () => {
    if (customTagInput.value.length > 20) {
        customTagInput.value = customTagInput.value.slice(0, 20);
    }
    adjustInputWidth();
    if (customTagInput.value.length === 20) {
        customTagInput.style.borderColor = '#ff4444';
        customTagInput.style.borderWidth = '2px';
    } else {
        customTagInput.style.borderColor = 'rgba(255, 184, 77, 0.5)';
        customTagInput.style.borderWidth = '1px';
    }
});

customTagInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const tagName = customTagInput.value.trim();
        if (!tagName || tagName.length > 20) return;
        const newTag = createCustomTagButton(tagName);
        const interestRow = document.getElementById('Interest-tags');
        interestRow.insertBefore(newTag, customTagInput);
        customTagInput.value = '';
        adjustInputWidth();
        customTagInput.style.borderColor = 'rgba(255, 184, 77, 0.5)';
        customTagInput.style.borderWidth = '1px';
    }
});

adjustInputWidth();

document.getElementById('tag-insert').addEventListener('click', () => {
    const selected = tagModal.querySelectorAll('.tag-opt.selected');
    selectedTags = Array.from(selected).map(opt => opt.getAttribute('data-tag'));
    updateTagsDisplay();
    hideAllModals();
});

document.getElementById('tag-cancel').addEventListener('click', hideAllModals);

function updateTagsDisplay() {
    tagsContainer.innerHTML = '';
    selectedTags.forEach(tag => {
        const pill = document.createElement('span');
        pill.className = 'tag-button';
        pill.innerHTML = `${tag} <span class="remove-tag" data-tag="${tag}">&times;</span>`;
        tagsContainer.appendChild(pill);
    });
    document.querySelectorAll('.remove-tag').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const tagToRemove = btn.getAttribute('data-tag');
            selectedTags = selectedTags.filter(t => t !== tagToRemove);
            updateTagsDisplay();
        });
    });
}

// ========== LINK BUTTON ==========
document.getElementById('btn-link').onclick = (e) => {
    e.stopPropagation();
    showModal(linkModal);
    document.getElementById('link-url').focus();
};

document.getElementById('link-insert').onclick = () => {
    const url = document.getElementById('link-url').value.trim();
    if (!url) return;
    editor.chain().focus().setLink({ href: url }).run();
    hideAllModals();
    document.getElementById('link-url').value = '';
};

document.getElementById('link-cancel').onclick = hideAllModals;

// ========== IMAGE/VIDEO BUTTON ==========
const hiddenFileInput = document.getElementById('hidden-file-input');
document.getElementById('btn-image').onclick = () => hiddenFileInput.click();

hiddenFileInput.addEventListener('change', () => {
    const file = hiddenFileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        const dataUrl = e.target.result;
        if (file.type.startsWith('image/')) {
            editor.chain().focus().setImage({ src: dataUrl }).run();
        } else if (file.type.startsWith('video/')) {
            editor.chain().focus().insertContent(`<video controls src="${dataUrl}" style="max-width:100%;"></video>`).run();
        }
    };
    reader.readAsDataURL(file);
    hiddenFileInput.value = '';
});

// ========== LOCATION BUTTON ==========
const countryButton = document.getElementById('country-button');
const countryList = document.getElementById('country-list');
let selectedCountry = '';

countryButton.addEventListener('click', (e) => {
    e.stopPropagation();
    countryList.classList.toggle('hidden');
});

countryList.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', () => {
        const value = li.getAttribute('data-value');
        const text = li.textContent;
        countryButton.textContent = text;
        countryButton.classList.remove('placeholder');
        selectedCountry = value;
        countryList.classList.add('hidden');
    });
});

document.addEventListener('click', (e) => {
    if (!countryButton.contains(e.target) && !countryList.contains(e.target)) {
        countryList.classList.add('hidden');
    }
});

document.getElementById('btn-location').onclick = (e) => {
    e.stopPropagation();
    showModal(locationModal);
};

document.getElementById('location-insert').onclick = () => {
    const street = document.getElementById('loc-street').value.trim();
    const city = document.getElementById('loc-city').value.trim();
    const state = document.getElementById('loc-state').value.trim();
    const zip = document.getElementById('loc-zip').value.trim();
    const parts = [street, city, state, zip].filter(p => p);
    if (parts.length === 0) return;
    const address = parts.join(', ');
    const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
    editor.chain().focus().insertContent(`<a href="${mapsUrl}" target="_blank" class="location-badge">📍 ${address}</a> `).run();
    hideAllModals();
    document.getElementById('loc-street').value = '';
    document.getElementById('loc-city').value = '';
    document.getElementById('loc-state').value = '';
    document.getElementById('loc-zip').value = '';
    countryButton.textContent = 'Country';
    countryButton.classList.add('placeholder');
    selectedCountry = '';
};

document.getElementById('location-cancel').onclick = hideAllModals;

// ========== POST BUTTON ==========
document.getElementById('post-btn').onclick = () => {
    const title = document.getElementById('post-title').value;

    const status = document.getElementById('post-status');
    status.classList.remove('hidden');

    console.log({
        title,
        html: editor.getHTML(),
        tags: selectedTags
    });

    setTimeout(() => {
        window.location.href = 'Home.html';
    }, 1000);
};