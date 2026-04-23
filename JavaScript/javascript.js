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

    fetch("/Components/footer.html")
    .then(response => response.text())
    .then(footer => {
        document.getElementById("footer").innerHTML = footer;
        console.log("footer loaded");
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
        else {
            console.log("payment details valid");
            requestServer(cardNumber, expMonth, expYear, cvv);
        }
    })
}

//sending request to server

function requestServer(cardNumber, expMonth, expYear, cvv) {

    const url = "https://mudfoot.doc.stu.mmu.ac.uk/node/api/creditcard";
    const data = {
        "master_card": 5222423456781234,
        "exp_year": 2025,
        "exp_month": 11,
        "cvv_code": "089"
    }

    fetch (url, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then ((response) => {
        console.log(response.status);
        console.log(cardNumber.substring(12,16));
        if(response.status === 200 || response.status === 201) {
            return response.json();
        }
        else if (response.status === 400) {
            throw "400 BAD REQUEST";
        }
        else { throw (response.status + ": something went wrong");
        }
    })
    .then ((resJson) => {
        const msg = resJson["message"];
        const card = ("************" + cardNumber.substring(12,16))
        localStorage.setItem("serverResp", msg);
        localStorage.setItem("cardNum", card);
        alert(resJson["message"]);

        basket = [];
        basketSize = 0;
        total = 0;
        localStorage.setItem("basketSize", basketSize);
        localStorage.setItem("total", total);
        localStorage.setItem("basket", JSON.stringify(basket));

        window.location = "success.html";
    })
    .catch((error) => {
        alert(error);
    })
}

//shopping basket functionality

//add to basket


class book {
    constructor(id, title, price, quantity, image) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.quantity = quantity;
        this.image = image;
    }
}

const book1 = new book("book1","Minecraft Beginners Handbook", 10.99, 0, "Images/minecraftbook.jpg");
const book2 = new book("book2","The Hellbound Heart", 12, 0, "Images/hellraiserbook.jpg");
const book3 = new book("book3","Terraria Hardmode Survival Handbook", 5.99, 0, "Images/terrariabook.jpg");
const book4 = new book("book4","Diary Of A Wimpy Kid", 7.50, 0, "Images/diaryofawimpykidbook.jpg");

const addToBasket = Array.from(document.getElementsByClassName("addToBasket"));
let basket = [];
const books = [book1, book2, book3, book4];

let total = 0;

//event listener for each add to basket button
addToBasket.forEach((button) => {
    button.addEventListener("click", () => {
        const item = button.getAttribute('id');
        console.log(button.getAttribute('id') + " was clicked"); // book x was clicked

        //get object of book clicked
        const itemObj = linearSearch(item);
        console.log(itemObj.title, "book found");

        //total
        total += itemObj.price;
        total = Math.round(total * 100) / 100; //2decimalplaces
        console.log("£" + total);

        //checks if item in bag (so quantity can increase if so)
        const inBag = searchBasket(item);

        if (inBag==false) {
            //new item added to basket
            itemObj.quantity += 1;
            basket.push(itemObj);
            
            console.log("new item added");
        }
        else { 
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

function linearSearch(id) {
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

window.onload = () => {
//success page response
const serverResponse = document.getElementById("serverResponse");
const cardConfirm = document.getElementById("cardConfirm");

if (serverResponse) {
    serverResponse.innerHTML = localStorage.getItem("serverResp");
}
if (cardConfirm) {
    cardConfirm.innerHTML = ("your card number ends in " + localStorage.getItem("cardNum"));
} 


//shopping basket
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

            //adding to page
            basketMain.appendChild(wrapper);
            })
        }
        //overall price
        document.getElementById("total").innerHTML += total;
    }
}

//checkout button
const checkout = document.getElementById("checkout");

if (checkout) {
    checkout.addEventListener("click", () => {
        window.location.href = "pay.html";
    })
}


