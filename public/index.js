import { createLogin, registraUtente } from "../js/login.js";
import { createMiddleware } from "../js/middleware.js";
let currentUser;
const navAccedi = document.getElementById("navbar_accedi");
const navLogin = document.getElementById("navbar_login");
const navReg = document.getElementById("navbar_reg");
const schEmbr = document.getElementById("schermata_embrionale");
const schLog = document.getElementById("schermata_login");
const schHome = document.getElementById("schermata_home");
const schSearch = document.getElementById("schermata_search");
const schPreferiti = document.getElementById("schermata_preferiti");
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
const viaggiPreferitiContainer = document.getElementById("viaggi_preferiti_container");
const posizione = 'it-IT';
let isLogged = false;
createLogin();
const middleware = createMiddleware();
load();

const viaggiContainer = document.querySelector('.viaggi-container');
const viaggiFiltratiContainer = document.querySelector('.viaggi-filtrati-container');
let viaggiList = [];
let tappeList = [];
let utentiList = [];
let preferitiList = [];

navAccedi.onclick = () => {
  navAccedi.style.display = "none";
  navLogin.style.display = "flex";
  schEmbr.style.display = "none";
  schLog.style.display = " block";
}
userHomeBtn.onclick = () => {
  console.log("click user")
  document.getElementById("schermata_conferma_login").style.display = "none"
  schHome.style.display = 'none';
  schDash.style.display = 'block';
  schSearch.style.display = 'none';
  schPreferiti.style.display='none';
}
homeNavBtn.onclick = () => {
  console.log("click home")
  document.getElementById("schermata_conferma_login").style.display = "none"
  schHome.style.display = 'block';
  schermataAggiuntaViaggio.style.display = "none";
  schDash.style.display = 'none';
  schSearch.style.display = 'none';
  schPreferiti.style.display='none';
}

document.getElementById("ok_acceduto").onclick = () => {
  document.getElementById("schermata_conferma_login").style.display = "none"
  currentUser = document.getElementById("userNavHome").value;
  console.log(currentUser)
  schDash.style.display = 'block';
}

preferitiNavBtn.onclick = () => {
  console.log("click preferiti");
  schPreferiti.style.display = 'block';  
  schHome.style.display = 'none';
  schSearch.style.display = 'none';
  schermataAggiuntaViaggio.style.display = 'none';
  schDash.style.display = 'none';
  schSearch.style.display= 'none';

  loadPreferiti(); 
}

searchNavBtn.onclick = () => {
  console.log("click search")
  loadFiltrati()
  schSearch.style.display = 'block';
  schermataAggiuntaViaggio.style.display = "none";
  schHome.style.display = 'none'
  schDash.style.display = 'none';
  schPreferiti.style.display='none';
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
/*sendReg.onclick = async () => {
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
}*/
sendReg.onclick = () =>{
  registraUtente();
}

function loadPreferiti() {
  middleware.load_preferiti()
    .then(res => {
      const preferiti = res; // è già filtrato dal backend
      render_preferiti(preferiti);
      schPreferiti.style.display = 'block';
    });
}

function load() {
  middleware.load_viaggi()
    .then(res => {
      viaggiList = res;
      console.log(viaggiList)
      render();
      viaggiContainer.style.display = 'block';
    });
  middleware.load_preferiti()
  .then(res => {
    preferitiList = res;
    console.log(preferitiList)
  })
  middleware.load_tappe()
  .then(res => {
    tappeList = res;
    console.log(tappeList)
  })
  middleware.load_utenti()
  .then(res => {
    utentiList = res;
    console.log(utentiList)
  })
}

function loadFiltrati(searchText) {
  middleware.load_viaggi()
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

function aggiungi_viaggio(titolo,descrizione,data_inizio,data_fine){
  
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
  const data_inizio = "2000/10/10"
  let finito = false;
  const data_fine = "2000/10/10"
  let id_utente
  currentUser = "Nico"
  for (let i = 0; i < utentiList.length; i++) {
  if (utentiList[i].username === currentUser) {
    id_utente = utentiList[i].id;
    break;
  }
}
  if (!titolo || !descrizione || !data_inizio) {
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

  middleware.add_viaggio(nuovoViaggio)
    .then(() => middleware.load_viaggi())
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
    .then(() => middleware.load_tappe())
    .then(res => {
      tappeList = res;
      render();
      clearForm();
    });
};

window.deleteViaggio = (id) => {
  middleware.delete_viaggio(id)
    .then(() => middleware.load_viaggi())
    .then(res => {
      viaggiList = res;
      render();
    });
};

window.deleteTappa = (id) => {
  middleware.delete_tappa(id)
  .then(() => middleware.load_tappe())
  .then(res => {
    tappeList = res;
    render();
  });
};


function render() {
  viaggiContainer.innerHTML = '';
  viaggiList.forEach(viaggio => {
    const isPreferito = preferitiList.some(p => p.id_viaggio === viaggio.id_viaggio);

    const viaggioDiv = document.createElement("div");
    viaggioDiv.className = "viaggio";
    viaggioDiv.innerHTML = `
      <h5>${viaggio.titolo}</h5>
      <p>${viaggio.descrizione}</p>
      <p>Dal: ${viaggio.data_inizio.split('T')[0]} al: boh</p>
      <div>
        <button class="elimina_viaggio btn btn-danger btn-sm">Elimina</button>
        <button class="aggiungi_preferito btn btn-sm" ${isPreferito ? "disabled" : ""}>❤️ Preferito</button>
      </div>
    `;

    viaggioDiv.querySelector(".elimina_viaggio").onclick = () => {
      deleteViaggio(viaggio.id_viaggio);
    };

    viaggioDiv.querySelector(".aggiungi_preferito").onclick = async () => {
      const nuovoPreferito = {
        id_viaggio: viaggio.id_viaggio
      };
      await middleware.add_preferito(nuovoPreferito);
      preferitiList = await middleware.load_preferiti(); 
      render(); 
    };

    viaggiContainer.appendChild(viaggioDiv);
  });
}


function render_filtrati(viaggiFiltrati) {
  viaggiFiltratiContainer.innerHTML = '';
  viaggiFiltrati.forEach(viaggio => {
    viaggiFiltratiContainer.innerHTML += `
      <div class="viaggio">
        <h5>${viaggio.titolo}</h5>
        <p>${viaggio.descrizione}</p>
        <p>Dal:${viaggio.data_inizio.split('T')[0]} al:boh</p>
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

function render_preferiti(preferiti) {
  viaggiPreferitiContainer.innerHTML = '';
  preferiti.forEach((viaggio, index) => {
    viaggiPreferitiContainer.innerHTML += `
      <div class="viaggio">
        <h5>${viaggio.titolo}</h5>
        <p>${viaggio.descrizione}</p>
        <p>Dal:${viaggio.data_inizio.split('T')[0]} al:${viaggio.data_fine.split('T')[0]}</p>
        <div>
          <button class="rimuovi_preferito btn btn-danger btn-sm">Rimuovi dai preferiti</button>
        </div>
      </div>
    `;
  });

  const rimuoviBtns = viaggiPreferitiContainer.querySelectorAll(".rimuovi_preferito");
  rimuoviBtns.forEach((btn, index) => {
    btn.onclick = async () => {
      await middleware.delete_preferito(preferiti[index].id_viaggio);
      loadPreferiti(); 
    };
  });
}

function clearForm() {
  document.getElementById('titolo').value = '';
  document.getElementById('descrizione').value = '';
}