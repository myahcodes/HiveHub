
// make variables:

const next_month = document.querySelector(".next");
const prev_month = document.querySelector(".prev");
const current_month = document.querySelector("#MOY");
const show_details = document.querySelector("#toggle_button");

const Months =[
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

let new_month = 0;

// Function of enlargment:

next_month.addEventListener("mouseover", function () {
    // enlargen on hover:
    next_month.style.transform = "scale(1.2)";
});

next_month.addEventListener("mouseout", function () {
    //revert on mouse exit:
    next_month.style.transform = "scale(1)";
});

prev_month.addEventListener("mouseover", () => {
    //enlargen on hover:
    prev_month.style.transform = "scale(1.2)";
});

prev_month.addEventListener("mouseout", () => {
    //revert on mouse exit:
    prev_month.style.transform = "scale(1)";
});

// Function to change months:

next_month.addEventListener("click", function () {
    new_month++;

    // check if at the end of queue
    if (new_month > 11)
    {
        new_month = 0;
    }

    current_month.innerHTML = Months[new_month];

});

prev_month.addEventListener("click", function () {
    new_month--;

    // check if at beginning of queue
    if (new_month < 0) {
        new_month = 11;
    }

    current_month.innerHTML = Months[new_month];
});

// add details toggle:

show_details.addEventListener("mouseover", () => {
    // do things on hover here: 
})

show_details.addEventListener("click", () => {
    // reveal self here:
})