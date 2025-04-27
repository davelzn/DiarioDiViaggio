import { createLogin } from "../js/login.js";
import { createMiddleware } from "../js/middleware.js";


createLogin();

const viaggiContainer = document.querySelector('.viaggi-container');
const middleware = createMiddleware();
let viaggiList = [];
let isLogged = false;

document.getElementById('loginBtn').onclick = () => {
  isLogged = true;
  document.getElementById('loginModal').style.display = 'none';
  loadViaggi();
};

function loadViaggi() {
  middleware.load()
    .then(res => {
      viaggiList = res;
      render();
      viaggiContainer.style.display = 'block';
    });
}

document.getElementById('openLogin').onclick = () => {
  document.getElementById('loginModal').style.display = 'block';
};

document.getElementById('btn-close').onclick = () => {
  document.getElementById('loginModal').style.display = 'none';
};


document.getElementById('openViaggioForm').onclick = () => {
  if (isLogged) {
    document.getElementById('viaggioModal').style.display = 'block';
  }};

document.getElementById('closeViaggioForm').onclick = () => {
  document.getElementById('viaggioModal').style.display = 'none';
};

document.getElementById('submitViaggio').onclick = () => {
  const titolo = document.getElementById('titolo').value;
  const descrizione = document.getElementById('descrizione').value;
  const data_inizio = document.getElementById('data_inizio').value;
  const data_fine = document.getElementById('data_fine').value;

  if (!titolo || !descrizione || !data_inizio || !data_fine) {
    alert("Compila tutti i campi!");
    return;
  }

  const nuovoViaggio = {
    titolo,
    descrizione,
    data_inizio,
    data_fine,
    id_utente: 1
  };

  middleware.add(nuovoViaggio)
    .then(() => middleware.load())
    .then(res => {
      viaggiList = res;
      render();
      document.getElementById('viaggioModal').style.display = 'none';
      clearForm();
    });
};

window.deleteViaggio = (id) => {
  middleware.delete(id)
    .then(() => middleware.load())
    .then(res => {
      viaggiList = res;
      render();
    });
};

function render() {
  viaggiContainer.innerHTML = '';
  viaggiList.forEach(viaggio => {
    const viaggioDiv = document.createElement('div');
    viaggioDiv.classList.add('viaggio');
    viaggioDiv.innerHTML = `
      <h5>${viaggio.titolo}</h5>
      <p>${viaggio.descrizione}</p>
      <p><strong>Dal:</strong> ${viaggio.data_inizio} <strong>al:</strong> ${viaggio.data_fine}</p>
      <button class="btn btn-danger btn-sm" onclick="deleteViaggio(${viaggio.id_viaggio})">Elimina</button>
    `;
    viaggiContainer.appendChild(viaggioDiv);
  });
}

function clearForm() {
  document.getElementById('titolo').value = '';
  document.getElementById('descrizione').value = '';
  document.getElementById('data_inizio').value = '';
  document.getElementById('data_fine').value = '';
}