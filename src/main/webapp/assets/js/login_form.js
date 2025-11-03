/*Create references to parent block and footer*/

const container = document.querySelector(".HH-authenticator");
const footer = document.querySelector(".HH-footer");

/*Create form*/

const form = document.createElement("form");
form.className = "signOn_form";
/*Username field*/

const txt_username = document.createElement("input");
txt_username.type = "text";
txt_username.placeholder = "Username, email";

/*Password field*/

const txt_password = document.createElement("input");
txt_password.type = "password";
txt_password.placeholder = "Password";

/*Creation of Login Button*/

const btn_Login = document.createElement("button");
btn_Login.textContent = "Login";
btn_Login.id = "login_button";
btn_Login.type = "submit";

btn_Login.style.color = "black";
btn_Login.style.backgroundColor = " #ffb84d";

/*Creation of Signup Button*/

const btn_signup = document.createElement("button");
btn_signup.textContent = "Sign Up";
btn_signup.id = "signup_button";

btn_signup.style.color = " #ffb84d";
btn_signup.style.backgroundColor = "black";

/*Place buttons in the form*/

form.appendChild(txt_username);
form.appendChild(txt_password);
form.appendChild(btn_Login);
form.appendChild(btn_signup);

/*Place form in HH-authenticator block*/

container.insertBefore(form, footer);

btn_signup.addEventListener("click", function(event) {
    window.location.href = "SignUp.html";
});

btn_Login.addEventListener("click", function(event) {
    form.submit();
    window.location.href = "Login.html";
});

