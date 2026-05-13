window.onload = () => {
    //success page -> prints response
    successResponse();

    //basket -> creates and loads the ui for the basket
    shoppingBasket();

    //colour blind filter, applied to each page
    const filter = localStorage.getItem("colourMode");

    switch (filter) {
        case "red": 
            switchRed();
            break;
        case "green": 
            switchGreen();
            break;
        case "blue": 
            switchBlue();
            break;
        case "none": 
            switchNone();
            break;
    }
}



//inserts nav bar for all pages
document.addEventListener("DOMContentLoaded", () => {
    fetch("/Components/header.html")
    .then(response => response.text())
    .then(nav => {
        document.getElementById("navigation").innerHTML = nav;
        console.log("nav loaded");
            
        //side navigation button opens side nav
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


//insert footer for all pages
fetch("/Components/footer.html")
.then(response => response.text())
.then(footer => {
    document.getElementById("footer").innerHTML = footer;
    console.log("footer loaded");

    //footer colour blindness colour changer

    //each button changes the main colours of the screen
    document.getElementById("redBlind").addEventListener("click", () => {
        switchRed();
        localStorage.setItem("colourMode", "red");
    })
    document.getElementById("greenBlind").addEventListener("click", () => {
        switchGreen();
        localStorage.setItem("colourMode", "green");
    })
    document.getElementById("blueBlind").addEventListener("click", () => {
        switchBlue();
        localStorage.setItem("colourMode", "blue");
    })
    document.getElementById("noFilter").addEventListener("click", () => {
        switchNone();
        localStorage.setItem("colourMode", "none");
    })
})



// functions for colour changes
function switchRed() {
    document.documentElement.style.setProperty("--primary", "#1680B1");
    document.documentElement.style.setProperty("--secondary", "#004D91");
    document.documentElement.style.setProperty("--alt", "#90A3B3");
}

function switchGreen() {
    document.documentElement.style.setProperty("--primary", "#1C86B0");
    document.documentElement.style.setProperty("--secondary", "#005291");
    document.documentElement.style.setProperty("--alt", "#91A4B3");
}

function switchBlue() {
    document.documentElement.style.setProperty("--primary", "#5775D3");
    document.documentElement.style.setProperty("--secondary", "#0940BC");
    document.documentElement.style.setProperty("--alt", "#99A0BE");
}

function switchNone() {
    document.documentElement.style.setProperty("--primary", "#3E7CB1");
    document.documentElement.style.setProperty("--secondary", "#054A91");
    document.documentElement.style.setProperty("--alt", "#97a2b3");
}



//years and months drop down - payment details
const months = document.getElementById("expMonth");

//creates all 12 options for month selection
if (months) {
    for (let i=1; i<=12; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        months.appendChild(option);
    }
}

const years = document.getElementById("expYear");

//creates 15 options for the year selection
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

if (continueBtn) {
    continueBtn.addEventListener("click", (e) => {
        e.preventDefault();
        //collect data from user input
        const cardNumber = document.getElementById("cardNumber").value;
        const expMonth = document.getElementById("expMonth").value;
        const expYear = document.getElementById("expYear").value;
        const cvv = document.getElementById("cvv").value;

        //checking validation of each input
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
        else {
            //confirmed card
            console.log("payment details valid");

            //data sent to server
            requestServer(cardNumber, expMonth, expYear, cvv);
        }
    })
}



//sending request to server
function requestServer(cardNumber, expMonth, expYear, cvv) {

    //server connection
    const url = "https://mudfoot.doc.stu.mmu.ac.uk/node/api/creditcard";
    const data = {
        "master_card": cardNumber,
        "exp_year": expYear,
        "exp_month": expMonth,
        "cvv_code": cvv
    }

    fetch (url, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    //server response
    .then ((response) => {
        console.log(response.status);
        console.log(cardNumber.substring(12,16));
        //positive response (server accepted data)
        if(response.status === 200 || response.status === 201) {
            return response.json();
        }
        //negative response (error)
        else if (response.status === 400) {
            throw "400 BAD REQUEST";
        }
        //something else happened
        else { throw (response.status + ": something went wrong");
        }
    })
    .then ((resJson) => {
        //storing response from server and card number in local storage
        const msg = resJson["message"];
        const card = ("************" + cardNumber.substring(12,16))
        localStorage.setItem("serverResp", msg);
        localStorage.setItem("cardNum", card);
        alert(resJson["message"]);

        //resetting basket (items been bought)
        basket = [];
        basketSize = 0;
        total = 0;
        localStorage.setItem("basketSize", basketSize);
        localStorage.setItem("total", total);
        localStorage.setItem("basket", JSON.stringify(basket));

        //change page to success page
        window.location = "success.html";
    })
    //any other errors reported
    .catch((error) => {
        alert(error);
    })
}



//shopping basket functionality

//creating class for all books
class book {
    constructor(id, title, price, quantity, image) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.quantity = quantity;
        this.image = image;
    }
}

//objects for each book listed
const book1 = new book("book1","Minecraft Beginners Handbook", 10.99, 0, "Images/minecraftbook.jpg");
const book2 = new book("book2","The Hellbound Heart", 12, 0, "Images/hellraiserbook.jpg");
const book3 = new book("book3","Terraria Hardmode Survival Handbook", 5.99, 0, "Images/terrariabook.jpg");
const book4 = new book("book4","Diary Of A Wimpy Kid", 7.54, 0, "Images/diaryofawimpykidbook.jpg");

//array for the basket items
const addToBasket = Array.from(document.getElementsByClassName("addToBasket"));
let basket = [];
const books = [book1, book2, book3, book4];

let total = 0;



//event listener for each add to basket button
addToBasket.forEach((button) => {
    button.addEventListener("click", () => {
        //finding which book was pressed
        const item = button.getAttribute('id');
        console.log(button.getAttribute('id') + " was clicked"); // book x was clicked

        //get object of book clicked
        const itemObj = searchBooks(item);
        console.log(itemObj.title, "book found");

        //total price being calculated
        total += itemObj.price;
        total = Math.round(total * 100) / 100; //2decimalplaces
        console.log("£" + total);

        //checks if item already in bag (so quantity can increase if so)
        const inBag = searchBasket(item);

        if (inBag==false) {
            //new item added to basket
            itemObj.quantity += 1;
            basket.push(itemObj);
            
            console.log("new item added");
        }
        else { 
            //item quantity increased
            console.log("item duplicated");
            inBag.quantity += 1;
        }

        console.log(basket);
        let basketSize = basket.length;

        //storing for the page changes
        localStorage.setItem("basket", JSON.stringify(basket));
        localStorage.setItem("basketSize", basketSize);
        localStorage.setItem("total", total);


        console.log(basketSize + " = basket size");
    })
})



function searchBooks(id) {
    //searches for the book object based on the id of the add to basket button
    for (let i=0; i<books.length; i++) {
        if (id == books[i].id) {
            return books[i];
        }  
    }
    return false;
}

function searchBasket(id) {
    //checks if item is already in basket
    for (let i=0; i<basket.length; i++) {
        if (id == basket[i].id) {
            return basket[i];
        } 
    }
    return false;
}



function successResponse() {
//success page response
const serverResponse = document.getElementById("serverResponse");
const cardConfirm = document.getElementById("cardConfirm");

if (serverResponse) {
    serverResponse.innerHTML = localStorage.getItem("serverResp");
}
if (cardConfirm) {
    cardConfirm.innerHTML = ("your card number ends in " + localStorage.getItem("cardNum"));
} 
}



//shopping basket
function shoppingBasket() {
    // ui basket view for user
    const basketMain = document.getElementById("basketMain");
    const basket = JSON.parse(localStorage.getItem("basket"));
    let basketSize = (localStorage.getItem("basketSize"));
    const total = (localStorage.getItem("total"));

    if (basketMain) {
        console.log(basket);
        console.log(basketSize);
        
        //adds item article for each different book in basket
        for (let i=0; i<basketSize; i++) {
            fetch("/Components/bagItem.html")
            .then(response => response.text())
            .then(item => {
                const wrapper = document.createElement("div");
                wrapper.innerHTML = item;
                console.log(i + " loaded");

                //adding details
                wrapper.getElementsByClassName("image")[0].src = basket[i].image; 
                wrapper.getElementsByClassName("title")[0].textContent = basket[i].title;
                wrapper.getElementsByClassName("quantity")[0].textContent += basket[i].quantity;
                wrapper.getElementsByClassName("price")[0].textContent += basket[i].price;

                //adding it all to page
                basketMain.appendChild(wrapper);
                })
            }
            //overall price
            document.getElementById("total").innerHTML += total;
        }
}



//checkout button
const checkout = document.getElementById("checkout");

//page change to payment page
if (checkout) {
    checkout.addEventListener("click", () => {
        window.location.href = "pay.html";
    })
}


