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
    viaggiContainer.innerHTML += `
      <div class="viaggio">
        <h5>${viaggio.titolo}</h5>
        <p>${viaggio.descrizione}</p>
        <p>Dal:${viaggio.data_inizio.split('T')[0]} al:${viaggio.data_fine.split('T')[0]}</p>
        <div>
          <button class="elimina_viaggio btn btn-danger btn-sm">Elimina</button>
          <button class="punta btn btn-sm">Punta</button>
        </div>
      </div>
    `;
    const eliminaBtns = viaggiContainer.querySelectorAll(".elimina_viaggio");
    eliminaBtns.forEach((btn, index) => {
      btn.onclick = () => {
        deleteViaggio(viaggiList[index].id_viaggio);
      };
    });

    const puntaBtns = viaggiContainer.querySelectorAll(".punta");
    puntaBtns.forEach((btn, index) => {
      btn.onclick = () => {
        const modal = document.getElementById("myModal");
        modal.style.display = "block";
        document.getElementById("titolo_modale_informazioni").innerHTML = viaggiList[index].titolo;
        document.getElementById("descrizione_modale_informazioni").innerHTML = viaggiList[index].descrizione;
        document.getElementById("datainizio_modale_informazioni").innerHTML = viaggiList[index].data_inizio.split("T")[0];
        document.getElementById("datafine_modale_informazioni").innerHTML = viaggiList[index].data_fine.split("T")[0];
      };
    });
  });

  const closeModal = document.querySelector(".close");
  closeModal.onclick = () => {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
  };

  window.onclick = (event) => {
    const modal = document.getElementById("myModal");
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}



function clearForm() {
  document.getElementById('titolo').value = '';
  document.getElementById('descrizione').value = '';
  document.getElementById('data_inizio').value = '';
  document.getElementById('data_fine').value = '';
}