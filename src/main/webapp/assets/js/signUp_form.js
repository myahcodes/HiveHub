/*Create references to parent block and footer*/

const container = document.querySelector(".HH-contents");
const footer = document.querySelector(".HH-footer");

/*Create form*/

const form = document.createElement("form");
form.className = "signOn_form";

/*Email field*/

const txt_email = document.createElement("input");
txt_email.type = "text";
txt_email.placeholder = "Email";
txt_email.required = true;
txt_email.name = "email";

/*Full name field*/

const txt_name = document.createElement("input");
txt_name.type = "text";
txt_name.placeholder = "Name";
txt_name.required = true;
txt_name.name = "name";

/*Username field*/

const txt_username = document.createElement("input");
txt_username.type = "text";
txt_username.placeholder = "Username";
txt_username.required = true;
txt_username.name = "username";

/*Password field*/

const txt_password = document.createElement("input");
txt_password.type = "password";
txt_password.placeholder = "Password";
txt_password.required = true;
txt_password.name = "password";

/*Creation of Login Button*/

const btn_Login = document.createElement("button");
btn_Login.textContent = "Login";
btn_Login.id = "login_button";
btn_Login.type = "button";

btn_Login.style.color = " #ffb84d";
btn_Login.style.backgroundColor = "black";

/*Creation of Signup Button*/

const btn_signup = document.createElement("button");
btn_signup.textContent = "Sign Up";
btn_signup.id = "signup_button";
btn_signup.type = "submit";

btn_signup.style.color = "black";
btn_signup.style.backgroundColor = " #ffb84d";

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

    fetch("api/auth/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        body: payload.toString()
    })
        .then(async (response) => {
            const data = await response.json();
            if (!response.ok || !data.ok) {
                throw new Error(data.message || "Sign up failed.");
            }
            alert("Account created. Please log in.");
            window.location.href = "Login.html";
        })
        .catch((error) => {
            alert(error.message);
        });
});

btn_Login.addEventListener("click", function(event) {
    event.preventDefault();
    window.location.href = "Login.html";
});
