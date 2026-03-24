console.log("SignUp.js loaded successfully!");

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

/*Full name field*/
const txt_name = document.createElement("input");
txt_name.type = "text";
txt_name.placeholder = "Name";

/*Username field*/
const txt_username = document.createElement("input");
txt_username.type = "text";
txt_username.placeholder = "Username";
txt_username.required = true;

/*Password field*/
const txt_password = document.createElement("input");
txt_password.type = "password";
txt_password.placeholder = "Password";
txt_password.required = true;

/*Creation of Login Button*/
const btn_Login = document.createElement("button");
btn_Login.textContent = "Login";
btn_Login.id = "login_button";
btn_Login.style.color = " #ffb84d";
btn_Login.style.backgroundColor = "black";

/*Creation of Signup Button*/
const btn_signup = document.createElement("button");
btn_signup.textContent = "Sign Up";
btn_signup.id = "signup_button";
btn_signup.type = "submit";
btn_signup.style.color = "black";
btn_signup.style.backgroundColor = " #ffb84d";

btn_signup.onclick = function() {
    alert("Button was clicked!");
};
/*Place buttons in the form*/
form.appendChild(txt_email);
form.appendChild(txt_name);
form.appendChild(txt_username);
form.appendChild(txt_password);
form.appendChild(btn_signup);
form.appendChild(btn_Login);

/*Place form in HH-contents block*/
container.appendChild(form);

/*Sign Up button - Send data to RegisterServlet*/
btn_signup.addEventListener("click", function(event) {
    console.log("Sign up button clicked!");
    event.preventDefault();
    
    // Check form validity first
    if (!form.checkValidity()) {
        console.log("Form not valid");
        alert("Please fill in all required fields.");
        return;
    }
    
    console.log("Form is valid, creating FormData");
    
    // Create FormData and send to backend
    const formData = new FormData();
    formData.append('email', txt_email.value);
    formData.append('name', txt_name.value);
    formData.append('username', txt_username.value);
    formData.append('password', txt_password.value);
    
    console.log("FormData created:");
    console.log("Email:", txt_email.value);
    console.log("Name:", txt_name.value);
    console.log("Username:", txt_username.value);
    console.log("Password:", txt_password.value ? "***" : "empty");
    
    console.log("Sending fetch to /register");
    
    // Send to RegisterServlet
    fetch('/register', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log("Response received:", response);
        if (response.redirected) {
            // Successful registration - redirect to home
            console.log("Redirecting to:", response.url);
            window.location.href = response.url;
        } else {
            return response.text();
        }
    })
    .then(data => {
        if (data) {
            console.log("Response data:", data);
            alert('Registration failed. Username may already exist.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Registration failed. Please try again.');
    });
});

/*Login button - Redirect to login page*/
btn_Login.addEventListener("click", function(event) {
    event.preventDefault();
    window.location.href = "Login.html";
});
