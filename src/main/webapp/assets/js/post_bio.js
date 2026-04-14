import { Editor } from 'https://esm.sh/@tiptap/core'
import StarterKit from 'https://esm.sh/@tiptap/starter-kit'
import Placeholder from 'https://esm.sh/@tiptap/extension-placeholder'
import Link from 'https://esm.sh/@tiptap/extension-link'
import Image from 'https://esm.sh/@tiptap/extension-image'
import { createIcons, icons } from 'https://esm.sh/lucide'
import { createPicker } from 'https://cdn.jsdelivr.net/npm/picmo@latest/+esm'

// Emoji picker setup

/*const pickerContainer = document.getElementById('emoji-picker-container');
const picker = createPicker({
    rootElement: pickerContainer,
    showPreview: false,
    showSearch: true,
    theme: 'dark'
});

picker.addEventListener('emoji:select', (selection) => {
    editor.chain().focus().insertContent(selection.emoji).run();
    pickerContainer.classList.remove('show');
});

document.getElementById('emoji-trigger').onclick = (e) => {
    e.stopPropagation();
    pickerContainer.classList.toggle('show');
};

document.addEventListener('click', (e) => {
    if (!pickerContainer.contains(e.target) && !document.getElementById('emoji-trigger').contains(e.target)) {
        pickerContainer.classList.remove('show');
    }
});*/

let bioeditor = null;

// Editor setup

export function initBioEditor(createIconsBack = false) {
    if (bioeditor) return;

    const pickerContainer = document.getElementById("emoji-picker-container");
    const editor = document.querySelector("#editor-content");

    if (!editor || !pickerContainer) {
        console.warn("Editor element not found");
        return;
    }

    if (createIconsBack) {
        createIcons({ icons });
    }

    const picker = createPicker({
        rootElement: pickerContainer,
        showPreview: false,
        showSearch: true,
        theme: 'dark'
    });

    picker.addEventListener('emoji:select', (selection) => {
        bioeditor.chain().focus().insertContent(selection.emoji).run();
        pickerContainer.classList.remove('show');
    });

    document.getElementById('emoji-trigger').onClick = (e) => {
        e.stopPropagation();
        pickerContainer.classList.toggle('show');
    };

    bioeditor = new Editor({
        element: editor,
        extensions: [StarterKit,
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
        undo: () => bioeditor.chain().focus().undo().run(),
        redo: () => bioeditor.chain().focus().redo().run(),
        bold: () => bioeditor.chain().focus().toggleBold().run(),
        italic: () => bioeditor.chain().focus().toggleItalic().run(),
        h1: () => bioeditor.chain().focus().toggleHeading({ level: 1 }).run(),
        h2: () => bioeditor.chain().focus().toggleHeading({ level: 2 }).run(),
        paragraph: () => bioeditor.chain().focus().setParagraph().run(),
        bulletList: () => bioeditor.chain().focus().toggleBulletList().run(),
        orderedList: () => bioeditor.chain().focus().toggleOrderedList().run(),
    };

    // Open modal – sync selected state

  

    document.querySelectorAll('[data-cmd]').forEach(btn => {
        btn.onclick = (e) => {
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

    if (backdrop) { backdrop.addEventListener('click', hideAllModals); }

    // ========== LINK BUTTON ==========
    document.getElementById('btn-link').onclick = (e) => {
        e.stopPropagation();
        showModal(linkModal);
        document.getElementById('link-url').focus();
    };

    document.getElementById('link-insert').onclick = () => {
        const url = document.getElementById('link-url').value.trim();
        if (!url) return;
        bioeditor.chain().focus().setLink({ href: url }).run();
        hideAllModals();
        document.getElementById('link-url').value = '';
    };

    document.getElementById('link-cancel').onclick = hideAllModals;

    // ========== IMAGE/VIDEO BUTTON ==========
    const hiddenFileInput = document.getElementById('hidden-file-input');
    document.getElementById('btn-image').onclick = (e) => {
        e.stopPropagation();
        hiddenFileInput.click();
    };
    // Reads the selected file and embeds it directly into the editor as base64
    hiddenFileInput.addEventListener('change', () => {
        const file = hiddenFileInput.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            if (file.type.startsWith('image/')) {
                bioeditor.chain().focus().setImage({ src: dataUrl }).run();
            } else if (file.type.startsWith('video/')) {
                bioeditor.chain().focus().insertContent(`<video controls src="${dataUrl}" style="max-width:100%;"></video>`).run();
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
        // Use proper location emoji
        bioeditor.chain().focus().insertContent(`<a href="${mapsUrl}" target="_blank" class="location-badge">📍 ${address}</a> `).run();
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

    // ========== POST BUTTON (single, includes tags) ==========
    document.getElementById('post-btn').onclick = () => {
        const title = document.getElementById('post-title').value.trim();
        if (!title) {
            alert("Title required");
            return;
        }

        const body = editor.getHTML();

        // Build a form and submit it directly
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'post';

        const titleField = document.createElement('input');
        titleField.type = 'hidden';
        titleField.name = 'title';
        titleField.value = title;

        const bodyField = document.createElement('input');
        bodyField.type = 'hidden';
        bodyField.name = 'body';
        bodyField.value = body;


        form.appendChild(titleField);
        form.appendChild(bodyField);
        form.appendChild(tagsField);

        document.body.appendChild(form);
        form.submit();
    };

}

