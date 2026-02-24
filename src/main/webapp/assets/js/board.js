
// make variables:

const next_month = document.querySelector(".next");
const prev_month = document.querySelector(".prev");
const current_month = document.querySelector("#MOY");
const details_button = document.querySelector("#toggle_button");
const show_details = document.querySelector("#details-content")
const days_grid = document.querySelector(".calendar-grid");
const days_class = document.getElementsByClassName("days");

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

// Function of enlargement:

next_month.addEventListener("mouseover", function () {
    // enlargen on hover:
    next_month.style.transform = "scale(1.2)";
    document.body.style.cursor = "pointer";
});

next_month.addEventListener("mouseout", function () {
    //revert on mouse exit:
    next_month.style.transform = "scale(1)";
    document.body.style.cursor = "default";
});

prev_month.addEventListener("mouseover", () => {
    //enlargen on hover:
    prev_month.style.transform = "scale(1.2)";
    document.body.style.cursor = "pointer";
});

prev_month.addEventListener("mouseout", () => {
    //revert on mouse exit:
    prev_month.style.transform = "scale(1)";
    document.body.style.cursor = "default";
});

// Function to change months:

next_month.addEventListener("click", function () {
    new_month++;

    // check if at the end of queue
    if (new_month > 11)
    {
        new_month = 0;
    }

    // reset the days shown each click:

    for (let i = 0; i < days_class.length; i++) {
        days_class[i].style.display = "initial";
    }

    switch (new_month) {
        case 1: {
            //28 days
            days_grid.lastElementChild.style.display = "none";
            days_grid.lastElementChild.previousElementSibling.style.display = "none";
            days_grid.lastElementChild.previousElementSibling.previousElementSibling.style.display = "none";
        }
        case 3: days_grid.lastElementChild.style.display = "none"; //30 days
        case 5: days_grid.lastElementChild.style.display = "none"; //30 days
        case 8: days_grid.lastElementChild.style.display = "none"; //30 days
        case 10: days_grid.lastElementChild.style.display = "none"; //30 days
        default: // regular 31 days
    }

    current_month.innerHTML = Months[new_month];

});

prev_month.addEventListener("click", function () {
    new_month--;

    // check if at beginning of queue
    if (new_month <= 0)
    {
        new_month = 11;
    }

    // reset the days shown each click:

    for (let i = 0; i < days_class.length; i++) {
        days_class[i].style.display = "initial";
    }

    switch (new_month) {
        case 1: {
            //28 days
            days_grid.lastElementChild.style.display = "none";
            days_grid.lastElementChild.previousElementSibling.style.display = "none";
            days_grid.lastElementChild.previousElementSibling.previousElementSibling.style.display = "none";
        }
        case 3: days_grid.lastElementChild.style.display = "none"; //30 days
        case 5: days_grid.lastElementChild.style.display = "none"; //30 days
        case 8: days_grid.lastElementChild.style.display = "none"; //30 days
        case 10: days_grid.lastElementChild.style.display = "none"; //30 days
        default: days_grid.children.style.display = "default" // regular 31 days
    }

    current_month.innerHTML = Months[new_month];
});

// add details toggle:

details_button.addEventListener("mouseover", () => {
    // do things on hover here: 
    document.body.style.cursor = "pointer";
    details_button.style.backgroundColor = "#ffb84d";
});

details_button.addEventListener("mouseout", () =>
{
    document.body.style.cursor = "default";
    details_button.style.backgroundColor = "black";
});

details_button.addEventListener("click", () => {
    // reveal self here:
    show_details.style.overflow = "visible";
});