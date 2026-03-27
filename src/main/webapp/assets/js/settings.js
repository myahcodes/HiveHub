let currentAction = null;
document.addEventListener('DOMContentLoaded', () => {

    const hover_control = new Audio("/assets/audio/pop-on.mp3");
    const click_audio = new Audio("/assets/audio/classic-click.mp3");
    
    const options_effects = document.querySelectorAll(".option");
    options_effects.forEach(option => {
        option.addEventListener("mouseenter", () => {
            hover_control.currentTime = 0;
            hover_control.play();
        });
    });
    
    const panel = document.getElementById('settings-panel');
    const backdrop = document.getElementById('panel-backdrop');
    const panelTitle = document.getElementById('panel-title');
    const panelBody = document.getElementById('panel-body');
    const panelMessage = document.getElementById('panel-message');
    const panelClose = document.getElementById('panel-close');
    const panelCancel = document.getElementById('panel-cancel');
    const panelSave = document.getElementById('panel-save');
    
    function showPanel(title, bodyHTML, action) {
        panelTitle.textContent = title;
        panelBody.innerHTML = bodyHTML;
        panelMessage.textContent = '';
        currentAction = action;
        panel.classList.remove('hidden');
        backdrop.classList.remove('hidden');
    }
    
    function hidePanel() {
        panel.classList.add('hidden');
        backdrop.classList.add('hidden');
        currentAction = null;
    }
    
    panelClose.addEventListener('click', hidePanel);
    panelCancel.addEventListener('click', hidePanel);
    backdrop.addEventListener('click', hidePanel);
    
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', () => {
            click_audio.currentTime = 0;
            click_audio.play();
    
            const text = option.textContent.trim();
    
            if (text === 'Display name') {
                showPanel('Update Display Name', `
                    <input type="text" id="field-firstName" placeholder="First name" />
                    <input type="text" id="field-lastName" placeholder="Last name" />
                `, 'updateProfile');
            } else if (text === 'Update email/user') {
                showPanel('Update Email & Username', `
                    <input type="text" id="field-username" placeholder="New username" />
                    <input type="text" id="field-email" placeholder="New email" />
                `, 'updateEmailUser');
            } else if (text === 'Change password') {
                showPanel('Change Password', `
                    <input type="password" id="field-currentPassword" placeholder="Current password" />
                    <input type="password" id="field-newPassword" placeholder="New password" />
                    <input type="password" id="field-confirmPassword" placeholder="Confirm new password" />
                `, 'updatePassword');
            }
        });
    });
    
    document.getElementById('settings-panel').addEventListener('click', async (e) => {
        if (!e.target || e.target.id !== 'panel-save') return;
        
        const formData = new FormData();
    
        if (currentAction === 'updateProfile') {
            const firstName = document.getElementById('field-firstName').value.trim();
            const lastName = document.getElementById('field-lastName').value.trim();
            if (!firstName && !lastName) {
                panelMessage.textContent = 'Please enter a value to update.';
                panelMessage.style.color = 'red';
                return;
            }
            formData.append('action', 'updateProfile');
            formData.append('firstName', firstName);
            formData.append('lastName', lastName);
    
        } else if (currentAction === 'updateEmailUser') {
            const username = document.getElementById('field-username').value.trim();
            const email = document.getElementById('field-email').value.trim();
    
            if (!username && !email) {
                panelMessage.textContent = 'Please enter a username or email.';
                panelMessage.style.color = 'red';
                return;
            }
    
            if (username) {
                const fd = new FormData();
                fd.append('action', 'updateUsername');
                fd.append('username', username);
                const res = await fetch('settings', { method: 'POST', body: fd });
                const data = await res.json();
                if (!data.success) {
                    panelMessage.textContent = data.error || 'Failed to update username.';
                    panelMessage.style.color = 'red';
                    return;
                }
            }
    
            if (email) {
                const fd = new FormData();
                fd.append('action', 'updateEmail');
                fd.append('email', email);
                const res = await fetch('settings', { method: 'POST', body: fd });
                const data = await res.json();
                if (!data.success) {
                    panelMessage.textContent = 'Failed to update email.';
                    panelMessage.style.color = 'red';
                    return;
                }
            }
    
            panelMessage.textContent = 'Updated successfully!';
            panelMessage.style.color = '#ffb84d';
            setTimeout(hidePanel, 1500);
            return;
    
        } else if (currentAction === 'updatePassword') {
            const newPass = document.getElementById('field-newPassword').value;
            const confirmPass = document.getElementById('field-confirmPassword').value;
    
            if (!newPass) {
                panelMessage.textContent = 'Please enter a new password.';
                panelMessage.style.color = 'red';
                return;
            }
    
            if (newPass !== confirmPass) {
                panelMessage.textContent = 'Passwords do not match.';
                panelMessage.style.color = 'red';
                return;
            }
    
            formData.append('action', 'updatePassword');
            formData.append('currentPassword', document.getElementById('field-currentPassword').value);
            formData.append('newPassword', newPass);
    
        } else {
            panelMessage.textContent = 'No action selected.';
            panelMessage.style.color = 'red';
            return;
        }
    
        try {
            const response = await fetch('settings', { method: 'POST', body: formData });
            const data = await response.json();
    
            if (data.success) {
                panelMessage.textContent = 'Saved successfully!';
                panelMessage.style.color = '#ffb84d';
                setTimeout(hidePanel, 1500);
            } else {
                panelMessage.textContent = data.error || 'Something went wrong.';
                panelMessage.style.color = 'red';
            }
        } catch (err) {
            console.error(err);
            panelMessage.textContent = 'Network error.';
            panelMessage.style.color = 'red';
        }
    });
    
    document.getElementById('logout_button').addEventListener('click', () => {
        click_audio.currentTime = 0;
        click_audio.play();
        setTimeout(() => {
            window.location.href = 'logout';
        }, 300);
    });

}); // end DOMContentLoaded
