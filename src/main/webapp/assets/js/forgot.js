/*Create references to parent block and footer*/

const container = document.querySelector(".HH-authenticator");
const footer = document.querySelector(".HH-footer");

/*Create form*/

const form = document.createElement("form");
form.className = "signOn_form";

/*Email field*/

const txt_email = document.createElement("input");
txt_email.type = "text";
txt_email.placeholder = "Email";
txt_email.required = true;

/*Creation of Submit button*/

const btn_Submit = document.createElement("button");
btn_Submit.textContent = "Submit";
btn_Submit.id = "submit_button";
btn_Submit.type = "submit";

btn_Submit.style.color = " #ffb84d";
btn_Submit.style.backgroundColor = "black";

/*Creation of Login Button*/

const btn_Login = document.createElement("button");
btn_Login.textContent = "Login";
btn_Login.id = "login_button";

btn_Login.style.color = "black";
btn_Login.style.backgroundColor = "#ffb84d";

/*Creation of Signup Button*/

const btn_signup = document.createElement("button");
btn_signup.textContent = "Sign Up";
btn_signup.id = "signup_button";

btn_signup.style.color = " #ffb84d";
btn_signup.style.backgroundColor = "black";

/*Place buttons in the form*/

form.appendChild(txt_email);
form.appendChild(btn_Submit);
form.appendChild(btn_Login);
form.appendChild(btn_signup);

/*Place form in HH-authenticator block*/

container.insertBefore(form, footer);

/*Events*/
btn_signup.addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = "SignUp.html";
});

btn_Login.addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = "Login.html";
});

btn_Submit.addEventListener("click", function (event) {
    event.preventDefault();
    if (!form.checkValidity()) {
        return;
    }
  container.insertBefore(alert("If the email is registered, you will receive password reset instructions."),form);
});
