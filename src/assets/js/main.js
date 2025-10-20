/*Create references to parent block and footer*/

const container = document.querySelector(".HH-authenticator");
const footer = document.querySelector(".HH-footer");

/*Create form*/

const form = document.createElement("form");

/*Username field*/

const txt_username = document.createElement("input");
txt_username.type = "text";
txt_username.placeholder = "Username, email";

txt_username.style.display = "block";

txt_username.style.margin = "auto";

txt_username.color = "#ffb84d";
txt_username.placeholder.color = "#ffb84d";

txt_username.style.borderStyle = "solid";
txt_username.style.borderColor = "#ffb84d";

/*Password field*/

const txt_password = document.createElement("input");
txt_password.type = "password";
txt_password.placeholder = "Password";

txt_password.style.display = "block";

txt_password.style.margin = "auto";

txt_password.style.borderStyle = "solid";
txt_password.style.borderColor = "#ffb84d";

/*CSS and creation of Login Button*/

const btn_Login = document.createElement("button");
btn_Login.textContent = "Login";
btn_Login.type = "submit";

btn_Login.style.color = "black";

btn_Login.style.display = "block";

btn_Login.style.margin = "auto";
btn_Login.style.padding = "0.4cm 2.5cm 0.4cm 2.5cm";

/*CSS and creation of Signup Button*/

const btn_signup = document.createElement("button");
btn_signup.textContent = "Sign Up";

btn_signup.style.color = "#ffb84d";

btn_signup.style.display = "block";

btn_signup.style.margin = "auto";
btn_signup.style.padding = "0.4cm 2.5cm 0.4cm 2.5cm";

/*Place buttons in the form*/

form.appendChild(txt_username);
form.appendChild(txt_password);
form.appendChild(btn_Login);
form.appendChild(btn_signup);

/*Place form in HH-authenticator block*/

container.insertBefore(form, footer);



