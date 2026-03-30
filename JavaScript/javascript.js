//inserts nav bar for all pages

document.addEventListener("DOMContentLoaded", () => {
    fetch("/Components/header.html")
    .then(response => response.text())
    .then(nav => {
        document.getElementById("navigation").innerHTML = nav;
        console.log("nav loaded");
        
    //side navigation button
    const navBtn = document.getElementsByClassName('navBtn');
    const sideNav = document.getElementById('sideNav');

    Array.from(navBtn).forEach((btn) =>
        btn.addEventListener('click', () => {
            console.log("clicked");
            toggleEvent = sideNav.classList.toggle('open');
        })
    )

    })
})






//years and months drop down - payment details

const months = document.getElementById("expMonth");

if (months) {
    for (let i=1; i<=12; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        months.appendChild(option);
    }
}


const years = document.getElementById("expYear");

if (years) {
    for(let i=2020; i<=2035; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        years.appendChild(option);
    }
}