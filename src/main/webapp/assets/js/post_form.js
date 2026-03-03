import { Editor } from 'https://esm.sh/@tiptap/core'
import StarterKit from 'https://esm.sh/@tiptap/starter-kit'
import Placeholder from 'https://esm.sh/@tiptap/extension-placeholder'
import Link from 'https://esm.sh/@tiptap/extension-link'
import Image from 'https://esm.sh/@tiptap/extension-image'

lucide.createIcons();

// Initialize Emoji Picker from emoji-mart
const pickerWrapper = document.getElementById('emoji-picker-wrapper');
const pickerElement = document.querySelector('em-emoji-picker');

pickerElement.addEventListener('emoji-select', (e) => {
    editor.chain().focus().insertContent(e.detail.native).run();
    pickerWrapper.classList.remove('show');
});

document.getElementById('emoji-trigger').onclick = (e) => {
    e.stopPropagation();
    pickerWrapper.classList.toggle('show');
};

document.addEventListener('click', (e) => {
    if (!pickerWrapper.contains(e.target) && e.target.id !== 'emoji-trigger') {
        pickerWrapper.classList.remove('show');
    }
});

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

document.getElementById('btn-link').onclick = () => {
    const url = window.prompt('URL');
    if (url) editor.chain().focus().setLink({ href: url }).run();
};

document.getElementById('btn-image').onclick = () => {
    const url = window.prompt('Image URL');
    if (url) editor.chain().focus().setImage({ src: url }).run();
};

document.getElementById('btn-location').onclick = () => {
    const loc = window.prompt('Location');
    if (loc) {
        editor.chain().focus().insertContent(`<span class="location-badge">?? ${loc}</span> `).run();
    }
};

document.getElementById('post-btn').onclick = () => {
    const title = document.getElementById('post-title').value;
    if (!title) return alert("Title required");
    const status = document.getElementById('post-status');
    status.classList.remove('hidden');
    setTimeout(() => status.classList.add('hidden'), 2000);
    console.log({ title, html: editor.getHTML() });
};