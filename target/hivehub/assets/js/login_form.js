const hover_audio = new Audio("/assets/audio/pop-on.mp3");
const click_audio = new Audio("/assets/audio/click-sound.mp3");

const container = document.querySelector(".HH-authenticator");
const footer = document.querySelector(".HH-footer");

const form = document.createElement("form");
form.className = "signOn_form";
form.action = "login";   // ← posts to LoginServlet
form.method = "POST";    // ← POST request

const txt_username = document.createElement("input");
txt_username.type = "text";
txt_username.name = "username";        // ← servlet reads this
txt_username.placeholder = "Username, email";
txt_username.required = true;
txt_username.onfocus = () => {
    click_audio.currentTime = 0;
    click_audio.play();
};

const txt_password = document.createElement("input");
txt_password.type = "password";
txt_password.name = "password";        // ← servlet reads this
txt_password.placeholder = "Password";
txt_password.required = true;
txt_password.onfocus = () => {
    click_audio.currentTime = 0;
    click_audio.play();
};

const btn_Login = document.createElement("button");
btn_Login.textContent = "Login";
btn_Login.id = "login_button";
btn_Login.type = "submit";
btn_Login.style.cursor = "pointer";
btn_Login.style.color = "black";
btn_Login.style.backgroundColor = "#ffb84d";

const btn_signup = document.createElement("button");
btn_signup.textContent = "Sign Up";
btn_signup.id = "signup_button";
btn_signup.type = "button";            // ← prevent accidental form submit
btn_signup.style.cursor = "pointer";
btn_signup.style.color = "#ffb84d";
btn_signup.style.backgroundColor = "black";

form.appendChild(txt_username);
form.appendChild(txt_password);
form.appendChild(btn_Login);
form.appendChild(btn_signup);

container.insertBefore(form, footer);

btn_signup.addEventListener("click", function () {
    click_audio.currentTime = 0;
    click_audio.play();
    setTimeout(() => {
        window.location.href = "SignUp.html";
    }, 550);
});

btn_Login.addEventListener("click", function (event) {
    click_audio.currentTime = 0;
    click_audio.play();
    if (!form.checkValidity()) {
        event.preventDefault();
        alert("Please fill in all required fields.");
        return;
    }
    // ✅ Falls through and lets the form POST to LoginServlet
});
