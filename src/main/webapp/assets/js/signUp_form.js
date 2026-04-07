//cosmetic references:
const hover_audio = new Audio("/webapp/assets/audio/pop-on.mp3");
const click_audio = new Audio("/webapp/assets/audio/click-sound.mp3")

/*Create references to parent block and footer*/

const container = document.querySelector(".HH-contents");
const footer = document.querySelector(".HH-footer");

function buildApiUrl(path) {
    if (window.location.protocol === "file:") {
        return `http://localhost:8080/hivehub${path}`;
    }

    return path.replace(/^\//, "");
}

async function trySignup(payload) {
    const authResponse = await fetch(buildApiUrl("/api/auth/signup"), {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        body: payload.toString()
    });

    if (authResponse.status !== 404) {
        const data = await authResponse.json();
        if (!authResponse.ok || !data.ok) {
            throw new Error(data.message || "Sign up failed.");
        }
        return;
    }

    // Fallback for feature/mysql-integration flow.
    const formData = new FormData();
    formData.append("username", txt_username.value.trim());
    formData.append("password", txt_password.value);
    formData.append("email", txt_email.value.trim());
    formData.append("name", txt_name.value.trim());

    const legacyResponse = await fetch(buildApiUrl("/register"), {
        method: "POST",
        body: formData
    });

    if (legacyResponse.redirected) {
        window.location.href = legacyResponse.url;
        return;
    }

    if (!legacyResponse.ok) {
        throw new Error("Sign up failed.");
    }
}

/*Create form*/

const form = document.createElement("form");
form.className = "signOn_form";

/*Email field*/

const txt_email = document.createElement("input");
txt_email.type = "text";
txt_email.placeholder = "Email";
txt_email.required = true;
txt_email.name = "email";

txt_email.onfocus = () => {
    click_audio.currentTime = 0;
    click_audio.play();
};

/*Full name field*/

const txt_name = document.createElement("input");
txt_name.type = "text";
txt_name.placeholder = "Name";
txt_name.required = true;
txt_name.name = "name";

txt_name.onfocus = () => {
    click_audio.currentTime = 0;
    click_audio.play();
};

/*Username field*/

const txt_username = document.createElement("input");
txt_username.type = "text";
txt_username.placeholder = "Username";
txt_username.required = true;
txt_username.name = "username";

txt_username.onfocus = () => {
    click_audio.currentTime = 0;
    click_audio.play();
};

/*Password field*/

const txt_password = document.createElement("input");
txt_password.type = "password";
txt_password.placeholder = "Password";
txt_password.required = true;
txt_password.name = "password";

txt_password.onfocus = () => {
    click_audio.currentTime = 0;
    click_audio.play();
};

/*Creation of Login Button*/

const btn_Login = document.createElement("button");
btn_Login.textContent = "Login";
btn_Login.id = "login_button";
btn_Login.type = "button";

btn_Login.style.color = " #ffb84d";
btn_Login.style.backgroundColor = "black";
btn_Login.style.cursor = "pointer";

/*Creation of Signup Button*/

const btn_signup = document.createElement("button");
btn_signup.textContent = "Sign Up";
btn_signup.id = "signup_button";
btn_signup.type = "submit";

btn_signup.style.color = "black";
btn_signup.style.backgroundColor = " #ffb84d";
btn_signup.style.cursor = "pointer";

/*Place buttons in the form*/

form.appendChild(txt_email);
form.appendChild(txt_name);
form.appendChild(txt_username);
form.appendChild(txt_password);
form.appendChild(btn_signup);
form.appendChild(btn_Login);


/*Place form in HH-contents block*/

container.appendChild(form);

/*Move to the login page on clicking  SignUp button*/
btn_signup.addEventListener("click", function(event) {
    event.preventDefault();

    click_audio.currentTime = 0;
    click_audio.play();

    // Check form validity first
    if (!form.checkValidity()) {
        // If form is not valid, error prompt
        alert("Please fill in all required fields.");
        return;
    }

    const payload = new URLSearchParams({
        email: txt_email.value.trim(),
        name: txt_name.value.trim(),
        username: txt_username.value.trim(),
        password: txt_password.value
    });

    trySignup(payload)
        .then(() => {
            alert("Account created. Please log in.");
            window.location.href = "Login.html";
        })
        .catch((error) => {
            alert(error.message);
        });
});

btn_Login.addEventListener("click", function(event) {
    event.preventDefault();

    click_audio.currentTime = 0;
    click_audio.play();

    setTimeout(() => {
        window.location.href = "Login.html";
    }, 550); // equivalent to 5.5 milliseconds
});
