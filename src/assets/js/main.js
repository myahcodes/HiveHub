
/*Create button object for login and sign up*/

const btn_Login = document.createElement("button");
const btn_signup = document.createElement("button");
btn_Login.textContent = "Login";
btn_signup.textContent = "Sign Up";

/*Place both buttons in the HH-authenticator block*/
const container = document.querySelector(".HH-authenticator");
container.append(btn_Login);
container.append(btn_signup);



