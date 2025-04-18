import { createLogin } from "../js/login.js";


createLogin();

document.getElementById('openLogin').onclick = () => {
    document.getElementById('loginModal').style.display = 'block';
};

document.getElementById('btn-close').onclick = () => {
    document.getElementById('loginModal').style.display = 'none';
};

document.getElementById('btn-close').onclick = () => {
    document.getElementById('loginModal').style.display = 'none';
};