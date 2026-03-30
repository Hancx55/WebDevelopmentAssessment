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

//validation for the payment details

const validateCardNumber = (num) => {
    let isValid = false;

    let regex = /^5[1-5]\d{14}$/;
    if (regex.test(num)) {
        isValid = true;
    }

    return isValid;
}

const validateDate = (month,year) => {

    currdate = new Date();
    m = currdate.getMonth()+1;
    y = currdate.getFullYear(); 

    let isValid = false;

    let regexMonth = /^([1-9]|1[0-2])$/;
    let regexYear = /^(19|20)\d{2}$/;

    if (regexMonth.test(month) && regexYear.test(year)) {

        month = parseInt(month);
        year = parseInt(year);

        if ((year > y) || (year == y && month >= m)) {
        isValid = true;
        }
    }

    return isValid;
}
console.log(validateDate("05","2026"));

const validateCVV = (cvv) => {
    let isValid = false;

    let regex= /^\d{3,4}$/;

    if (regex.test(cvv)) {
        isValid = true;
    }

    return isValid;
}

// continue button for payment form 

const continueBtn = document.getElementById("continue");

continueBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const cardNumber = document.getElementById("cardNumber").value;
    const expMonth = document.getElementById("expMonth").value;
    const expYear = document.getElementById("expYear").value;
    const cvv = document.getElementById("cvv").value;

    if (validateCardNumber(cardNumber) == false) {
        console.log("invalid card number");
        document.getElementById("validation").innerHTML = "Card number is invalid - try again";
    }
    else if (validateDate(expMonth, expYear) == false) {
        console.log("card has expired");
        document.getElementById("validation").innerHTML = "Card has expired -try again";
    }
    else if (validateCVV(cvv) == false) {
        console.log("invalid security code");
        document.getElementById("validation").innerHTML = "Invalid security code - try again";
    }
    else console.log("payment details valid");
})


