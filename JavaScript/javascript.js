const navBtn = document.getElementById('navBtn');
const sideNav = document.getElementById('sideNav');

navBtn.addEventListener('click', () => {
    console.log("clicked");
    toggleEvent = sideNav.classList.toggle('open');
})