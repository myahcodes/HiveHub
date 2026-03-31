const searchbar = document.querySelector("#search-bar");

const items = [
    { setting: "Display", option: document.querySelector("#display-option"), parent: "profile"},
    { setting: "background", option: document.querySelector("#display-option"), parent: "profile" },
    { setting: "customization", option: document.querySelector("#display-option"), parent: "profile" },
    { setting: "icon", option: document.querySelector("#icon-option"), parent: "profile" },
    { setting: "password", option: document.querySelector("#password-option"), parent: "account" },
    { setting: "email", option: document.querySelector("#email-option"), parent: "account" },
    { setting: "account", option: document.querySelector(".Account-options"), parent: null },
    { setting: "bio", option: document.querySelector("#bio-option"), parent: "profile" },
    { setting: "visibility", option: document.querySelector("#visibility-container"), parent: "privacy" },
    { setting: "activity", option: document.querySelector("#event-option"), parent: "privacy" },
    { setting: "events", option: document.querySelector("#event-option"), parent: "privacy" },
    { setting: "event activity", option: document.querySelector("#event-option"), parent: "privacy" },
    { setting: "profile", option: document.querySelector(".Profile-options"), parent: null },
    { setting: "privacy", option: document.querySelector(".Privacy-options"), parent: null },
];

searchbar.addEventListener("input", () => {
    // filter through the items array as the user types: 

    const query = searchbar.value.toLowerCase();
    const match = items.filter(item =>
        item.setting.toLowerCase().includes(query)
    );
    const parent_case = match.filter(i => i.parent === null).map(i => i.setting.toLowerCase());
    const child_case = match.filter(i => i.parent !== null).map(i => i.parent);
    //re-render the search options based on input
    items.forEach(item => {
        if (!item.option) return;

        const partial_match = match.some(i => i.option === item.option);
        const parent_match = item.parent && parent_case.includes(item.parent);
        const child_match = item.parent === null && child_case.includes(item.setting.toLowerCase());

        if (partial_match || child_match || parent_match) {
            item.option.style.display = "";
        }
        else {
            item.option.style.display = "none";
        }
    });
});