import { createLogin } from "../js/login.js";
import { createMiddleware } from "../js/middleware.js";
const navAccedi = document.getElementById("navbar_accedi")
const navLogin = document.getElementById("navbar_login")
const navReg = document.getElementById("navbar_reg")
const schEmbr = document.getElementById("schermata_embrionale");
const schLog = document.getElementById("schermata_login");
const schHome = document.getElementById("schermata_home");
const schSearch = document.getElementById("schermata_search")
const schDash = document.getElementById("schermata_dash");
const schReg = document.getElementById("schermata_reg");
const schermataAggiuntaViaggio = document.getElementById('schermata_aggiunta_viaggio');
const userHomeBtn = document.getElementById("userNavHome");
const homeNavBtn = document.getElementById("homeNavHome");
const preferitiNavBtn = document.getElementById("preferitiNavHome");
const searchNavBtn = document.getElementById("searchNavHome");
const searchText = document.getElementById('searchInput').value.toLowerCase();
const regBtn = document.getElementById("regBtn");
const sendReg = document.getElementById("sendReg");
const addTripBtn = document.getElementById("addTrip");
const searchTripBtn = document.getElementById("searchTrip");
const posizione = 'it-IT';
let isLogged = false;
createLogin();


const viaggiContainer = document.querySelector('.viaggi-container');
const viaggiFiltratiContainer = document.querySelector('.viaggi-filtrati-container');
const middleware = createMiddleware();
let viaggiList = [];
let tappeList = [];

navAccedi.onclick = () => {
  navAccedi.style.display = "none";
  navLogin.style.display = "flex";
  schEmbr.style.display = "none";
  schLog.style.display = " block";
}
userHomeBtn.onclick = () => {
  console.log("click user")
  schHome.style.display = 'none';
  schDash.style.display = 'block';
  schSearch.style.display = 'none';
}
homeNavBtn.onclick = () => {
  console.log("click home")
  loadViaggi()
  schHome.style.display = 'block';
  schermataAggiuntaViaggio.style.display = "none";
  schDash.style.display = 'none';
  schSearch.style.display = 'none';
}
preferitiNavBtn.onclick = () => {
  console.log("click preferiti")
  loadViaggi()
  schHome.style.display = 'block';
  schermataAggiuntaViaggio.style.display = "none";
  schDash.style.display = 'none';
  schSearch.style.display = 'none';
}
searchNavBtn.onclick = () => {
  console.log("click search")
  loadFiltrati()
  schSearch.style.display = 'block';
  schermataAggiuntaViaggio.style.display = "none";
  schHome.style.display = 'none'
  schDash.style.display = 'none';
}
regBtn.onclick = () => {
  console.log("click reg")
  schReg.style.display = 'block';
  schLog.style.display = 'none';
  navLogin.style.display = 'none';
  navReg.style.display = 'block';
}

addTripBtn.onclick = () => {
  schermataAggiuntaViaggio.style.display = "block"
}
searchTripBtn.onclick = () => {
  const searchText = document.getElementById('searchInput').value.toLowerCase();
  loadFiltrati(searchText)
}
sendReg.onclick = async () => {
  const email = document.getElementById("email").value;
  const username = document.getElementById("userR").value;
  const password = document.getElementById("pswR").value;

  if (!email || !username || !password) {
    alert("Compila tutti i campi");
    return;
  }

  try {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }),
    });

    const data = await res.json();
    alert(data.message);
  } catch (err) {
    alert("Errore nella registrazione");
    console.error(err);
  }
}

function loadViaggi() {
  middleware.load()
    .then(res => {
      viaggiList = res;
      console.log(viaggiList)
      render();
      viaggiContainer.style.display = 'block';
    });
}

function loadFiltrati(searchText) {
  middleware.load()
    .then(res => {
      viaggiList = res;
      const viaggiFiltrati = [];
      for (let i = 0; i < viaggiList.length; i++) {
        const viaggio = viaggiList[i];
        if (viaggio.titolo.toLowerCase().includes(searchText)) {
          viaggiFiltrati.push(viaggio);
        }
      }
      console.log(viaggiFiltrati)
      render_filtrati(viaggiFiltrati);
      viaggiFiltratiContainer.style.display = 'block';
    });
}

/*
document.getElementById('openViaggioForm').onclick = () => {
  if (isLogged) {
    document.getElementById('viaggioModal').style.display = 'block';
  }};
  */


document.getElementById('submitViaggio').onclick = () => {
  const titolo = document.getElementById('titolo').value;
  const descrizione = document.getElementById('descrizione').value;
  const data_inizio = new Date().toLocaleDateString(posizione);
  let finito = false;
  id_utente = currentUser;
  if (!titolo || !descrizione || !data_inizio || !data_fine) {
    return;
  }

  const nuovoViaggio = {
    titolo,
    descrizione,
    data_inizio,
    data_fine,
    finito,
    id_utente
  };

  middleware.add(nuovoViaggio)
    .then(() => middleware.load())
    .then(res => {
      viaggiList = res;
      render();
      clearForm();
    });
};

document.getElementById('submitTappa').onclick = () => {
  const titolo = document.getElementById('titolo').value;
  const descrizione = document.getElementById('descrizione').value;
  const data = document.getElementById('data').value;
  if (!titolo || !descrizione || !data_inizio || !data_fine) {
    return;
  }

  const nuovoTappa = {
    titolo,
    descrizione,
    data,
    id_viaggio: 1
  };

  middleware.add_tappa(nuovoTappa)
    .then(() => middleware.load())
    .then(res => {
      tappeList = res;
      render();
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

window.deleteTappa = (id) => {
  middleware.delete_Tappa(id)
  .then(() => middleware.load_tappe())
  .then(res => {
    tappeList = res;
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
        </div>
      </div>
    `;
    const eliminaBtns = viaggiContainer.querySelectorAll(".elimina_viaggio");
    eliminaBtns.forEach((btn, index) => {
      btn.onclick = () => {
        deleteViaggio(viaggiList[index].id_viaggio);
      };
    });
  });

}
function render_filtrati(viaggiFiltrati) {
  viaggiFiltratiContainer.innerHTML = '';
  viaggiFiltrati.forEach(viaggio => {
    viaggiFiltratiContainer.innerHTML += `
      <div class="viaggio">
        <h5>${viaggio.titolo}</h5>
        <p>${viaggio.descrizione}</p>
        <p>Dal:${viaggio.data_inizio.split('T')[0]} al:${viaggio.data_fine.split('T')[0]}</p>
        <div>
          <button class="elimina_viaggio btn btn-danger btn-sm">Elimina</button>
        </div>
      </div>
    `;
    const eliminaBtns = viaggiFiltratiContainer.querySelectorAll(".elimina_viaggio");
    eliminaBtns.forEach((btn, index) => {
      btn.onclick = () => {
        deleteViaggio(viaggiList[index].id_viaggio);
      };
    });
  });

}

function clearForm() {
  document.getElementById('titolo').value = '';
  document.getElementById('descrizione').value = '';
  document.getElementById('data_inizio').value = '';
  document.getElementById('data_fine').value = '';
}