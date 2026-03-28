const navBtn = document.getElementsByClassName('navBtn');
const sideNav = document.getElementById('sideNav');

Array.from(navBtn).forEach((btn) =>
    btn.addEventListener('click', () => {
        console.log("clicked");
        toggleEvent = sideNav.classList.toggle('open');
    })
)