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
const ViaggiPersonaliContainer = document.getElementById("viaggi_personali_container");
const schTappe = document.getElementById("schermata_tappe");
const schAggiungiTappe = document.getElementById("schermata_aggiunta_tappa");
const aggTappa = document.getElementById("aggiungi_tappa")
const Tappecontainer = document.getElementById("tappe_container")
const posizione = 'en-CA';//YYYY/MM/DD
let isLogged = false;

createLogin();
const middleware = createMiddleware();
load();

function creautente() {
  const username = 'Tommy';  // Assicurati che 'Nico' sia una stringa
  const password = 'tommy';  // La password deve essere una stringa (o un numero se vuoi, ma dovresti essere consistente)
  const email = 'paolettitommaso@itis-molinari.eu'
  const nuovoUtente = {
    username,
    password,
    email

  };

  middleware.add_utente(nuovoUtente)
    .then(() => middleware.load_utenti())
    .then(res => {
      viaggiList = res;
      render();
      clearForm();
    })
    .catch(error => {
      console.error('Errore durante la creazione dell\'utente:', error);
    });
}


const viaggiContainer = document.querySelector('.viaggi-container');
const viaggiFiltratiContainer = document.querySelector('.viaggi-filtrati-container');

let viaggiList = [];
let tappeList = [];
let utentiList = [];
let preferitiList = [];
let viaggiPersonali = [];
let Idattuale;
let current_id_viaggio;

function elmina_tutti_preferiti(){
  preferitiList.forEach(element => {
    middleware.delete_preferito(element.id_utente,element.id_viaggio)
    .then(() => middleware.load_preferiti())
    .then(res => {
      preferitiList = res;
      render();
    });
  });
}
function elmina_tutti_viaggi(){
  viaggiList.forEach(element => {
    middleware.delete_viaggio(element.id_viaggio)
    .then(() => middleware.load_viaggi())
    .then(res => {
      viaggiList = res;
      render();
    });
  });
}

navAccedi.onclick = () => {
  navAccedi.style.display = "none";
  navLogin.style.display = "flex";
  schEmbr.style.display = "none";
  schLog.style.display = " block";
  
}
userHomeBtn.onclick = () => {
  schTappe.style.display = "none";
  document.getElementById("schermata_conferma_login").style.display = "none";
  schermataAggiuntaViaggio.style.display = "none";
  ViaggiPersonaliContainer.style.display = "block";
  schHome.style.display = 'none';
  schDash.style.display = 'block';
  schSearch.style.display = 'none';
  schAggiungiTappe.style.display ="none";
  schPreferiti.style.display='none';
  loadPersonali()
}
homeNavBtn.onclick = () => {
  schTappe.style.display = "none";
  console.log("click home")
  document.getElementById("schermata_conferma_login").style.display = "none"
  schHome.style.display = 'block';
  schermataAggiuntaViaggio.style.display = "none";
  schDash.style.display = 'none';
  schSearch.style.display = 'none';
  schAggiungiTappe.style.display ="none";
  schPreferiti.style.display='none';
}

document.getElementById("ok_acceduto").onclick = () => {
  loadPersonali()
  ViaggiPersonaliContainer.style.display = "block";
  document.getElementById("schermata_conferma_login").style.display = "none"
  currentUser = document.getElementById("userNavHome").value;
  utentiList.forEach(utente =>{
    if (utente.username === currentUser){
      Idattuale = utente.id;
    }
  })
  console.log(currentUser,Idattuale)
  schDash.style.display = 'block';
}

preferitiNavBtn.onclick = () => {
  schTappe.style.display = "none";
  console.log("click preferiti");
  schPreferiti.style.display = 'block';  
  schHome.style.display = 'none';
  schSearch.style.display = 'none';
  schermataAggiuntaViaggio.style.display = 'none';
  schDash.style.display = 'none';
  schSearch.style.display= 'none';
  schAggiungiTappe.style.display ="none";
  loadViaggiPreferiti(Idattuale); 
}

searchNavBtn.onclick = () => {
  schTappe.style.display = "none";
  console.log("click search")
  loadFiltrati()
  schSearch.style.display = 'block';
  schermataAggiuntaViaggio.style.display = "none";
  schHome.style.display = 'none'
  schDash.style.display = 'none';
  schAggiungiTappe.style.display ="none";
  schPreferiti.style.display='none';
}
regBtn.onclick = () => {
  console.log("click reg")
  schReg.style.display = 'block';
  schLog.style.display = 'none';
  navLogin.style.display = 'none';
  navReg.style.display = 'block';
  schAggiungiTappe.style.display ="none";
}

addTripBtn.onclick = () => {
  schTappe.style.display = "none";
  schHome.style.display = "none";
  schDash.style.display = "none";
  schSearch.style.display = "none";
  schPreferiti.style.display = "none";
  schermataAggiuntaViaggio.style.display = "block"
  schAggiungiTappe.style.display ="none";
}
searchTripBtn.onclick = () => {
  const searchText = document.getElementById('searchInput').value.toLowerCase();
  
  loadFiltrati(searchText)
}
aggTappa.onclick = () => {
  open_schermata_aggiunta_tappa()
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
function loadViaggiPreferiti(ut) {
  middleware.load_preferiti()
    .then(res => {
      preferitiList = res;

      return middleware.load_viaggi();
    })
    .then(res => {
      viaggiList = res;
      const viaggiFiltrati = [];

      for (let i = 0; i < preferitiList.length; i++) {
        const preferito = preferitiList[i];
        if (preferito.id_utente === ut) {
          for (let j = 0; j < viaggiList.length; j++) {
            const viaggio = viaggiList[j];
            if (viaggio.id_viaggio === preferito.id_viaggio) {
              viaggiFiltrati.push(viaggio);
            }
          }
        }
      }

      console.log(viaggiFiltrati);
      render_preferiti(viaggiFiltrati);
      viaggiFiltratiContainer.style.display = 'block';
    })
    .catch(error => {
      console.error("Errore durante il caricamento dei preferiti:", error);
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
function open_schermata_aggiunta_tappa(){
  schTappe.style.display = "none"
  schAggiungiTappe.style.display ="block";
}
function open_schermata_tappa() {
  render_tappe()
  schDash.style.display = "none";
  schTappe.style.display = "block";
  schAggiungiTappe.style.display ="none";
}
function render_tappe() {
  middleware.load_tappe()
    .then(res => {
      const tappeList = res;
      console.log(tappeList);
      let html = '';

      tappeList.forEach(tappa => {
        if (current_id_viaggio === tappa.id_viaggio) {
          html += `
            <div class="viaggio tappa" data-id="${tappa.id_tappa}">
              <h5>${tappa.titolo}</h5>
              <p>${tappa.descrizione}</p>
              <p>Dal: ${tappa.data} al: boh</p>
              <button class="elimina_tappa">Elimina</button>
            </div>
          `;
        }
      });
      console.log(html)
      Tappecontainer.innerHTML = html;

      const cards = document.querySelectorAll('.tappa');
      cards.forEach(card => {
        const idtappa = card.getAttribute('data-id');

      const eliminaBtns = Tappecontainer.querySelectorAll(".elimina_tappa");
      eliminaBtns.forEach((btn, index) => {
        btn.onclick = () => {
            console.log("cliccato")
            console.log(tappeList[index].id_tappa)
            deleteTappa(tappeList[index].id_tappa);
      };
      });
    });
  })
}
    

function loadPersonali(){
  viaggiPersonali = []
  middleware.load_viaggi()
    .then(res => {
      viaggiList=res;
      for (let i = 0; i < viaggiList.length; i++){
        const viaggio = viaggiList[i]
        if (viaggio.id_utente === Idattuale){
          viaggiPersonali.push(viaggio)
        }
      }
      console.log(viaggiPersonali)
      render_viaggi_personali_temp(viaggiPersonali)
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


/*
document.getElementById('openViaggioForm').onclick = () => {
  if (isLogged) {
    document.getElementById('viaggioModal').style.display = 'block';
  }};
  */
document.getElementById('submitTappa').onclick = () =>{
  const titolo = document.getElementById('titoloTappa').value;
  const descrizione = document.getElementById('descrizioneTappa').value;
  const data = new Date().toLocaleDateString(posizione);
  let id_viaggio = current_id_viaggio
  console.log(current_id_viaggio)
  console.log(id_viaggio)
  if(!titolo || !descrizione || !data){
    return
  }
  const nuovaTappa = {
    titolo,
    descrizione,
    data,
    id_viaggio
  }

  middleware.add_tappa(nuovaTappa)
    .then(() => middleware.load_tappe())
    .then(res => {
      tappeList = res;
      render();
      clearForm();
    });

}
document.getElementById('submitViaggio').onclick = () => {
  const titolo = document.getElementById('titolo').value;
  const descrizione = document.getElementById('descrizione').value;
  const data_inizio = new Date().toLocaleDateString(posizione);
  console.log(data_inizio);
  let finito = false;
  const data_fine = "0001/01/01"
  let id_utente
  currentUser = document.getElementById("userNavHome").value;
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

window.deleteViaggio = async (id) => {

  try {
    await middleware.delete_preferito(Idattuale, id);
    await middleware.delete_viaggio(id);

    const res = await middleware.load_viaggi();
    viaggiList = res;
    const res2 = await middleware.load_preferiti();
    preferitiList = res2;

    render();
    
  } catch (error) {
    console.error("Errore durante l'eliminazione:", error);
  }
};

window.deleteTappa = (id) => {
  console.log(id)
  middleware.delete_tappa(id)
  .then(() => middleware.load_tappe())
  .then(res => {
    tappeList = res;
    render();
  });
};


function render() {
  let html = '';

  viaggiList.forEach(viaggio => {
    let isPreferito = false;
    for (let i = 0; i < preferitiList.length; i++) {
      if (preferitiList[i].id_viaggio === viaggio.id_viaggio) {
        isPreferito = true;
        break;
      }
    }

    html += `
      <div class="viaggio" data-id="${viaggio.id_viaggio}">
        <h5>${viaggio.titolo}</h5>
        <p>${viaggio.descrizione}</p>
        <p>Dal: ${viaggio.data_inizio} al: boh</p>
        <div>
          <button class="aggiungi_preferito btn btn-sm" ${isPreferito ? "disabled" : ""}>❤️ Preferito</button>
        </div>
      </div>
    `;
  });

  viaggiContainer.innerHTML = html;

  const cards = document.querySelectorAll('.viaggio');
  cards.forEach(card => {
    const idViaggio = card.getAttribute('data-id');

    const btnElimina = card.querySelector('.elimina_viaggio');
    if (btnElimina) {
      btnElimina.onclick = () => {
        deleteViaggio(idViaggio);
      };
    }


    const btnPreferito = card.querySelector('.aggiungi_preferito');
    if (btnPreferito) {
      btnPreferito.onclick = async () => {
        let id_utente;
        currentUser = document.getElementById("userNavHome").value;
        for (let i = 0; i < utentiList.length; i++) {
          if (utentiList[i].username === currentUser) {
            id_utente = utentiList[i].id;
            break;
          }
        }
        const nuovoPreferito = {
          id_viaggio: idViaggio,
          id_utente: id_utente
        };
        middleware.add_preferito(nuovoPreferito)
        .then(() => middleware.load_preferiti())
        .then(res => {
          preferitiList = res;
          render();
          clearForm();
        });
      };
    }
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
  preferiti.forEach((viaggio) => {
    viaggiPreferitiContainer.innerHTML += `
      <div class="viaggio">
        <h5>${viaggio.titolo}</h5>
        <p>${viaggio.descrizione}</p>
        <p>Dal:${viaggio.data_inizio.split('T')[0]} al:boh</p>
        <div>
          <button class="rimuovi_preferito btn btn-danger btn-sm">Rimuovi dai preferiti</button>
        </div>
      </div>
    `;
  });
  console.log(preferitiList)
  const rimuoviBtns = viaggiPreferitiContainer.querySelectorAll(".rimuovi_preferito");
  rimuoviBtns.forEach((btn, index) => {
    btn.onclick = async () => {
      await middleware.delete_preferito(preferitiList[index].id_utente,preferitiList[index].id_viaggio);
      loadViaggiPreferiti(); 
    };
  });
}

function render_viaggi_personali_temp(viaggiPersonali) {
  let html = ''
  viaggiPersonali.forEach(viaggio => {
    html += `
      <div class="viaggio">
        <h5>${viaggio.titolo}</h5>
        <p>${viaggio.descrizione}</p>
        <p>Dal:${viaggio.data_inizio.split('T')[0]} al:boh</p>
        <div>
          <button class="elimina_viaggio btn btn-danger btn-sm" id="bottone_elimina">Elimina</button>
        </div>
      </div>
    `;
    ViaggiPersonaliContainer.innerHTML = html
    const eliminaBtns = ViaggiPersonaliContainer.querySelectorAll(".elimina_viaggio");
    eliminaBtns.forEach((btn, index) => {
      btn.onclick = () => {
        deleteViaggio(viaggiList[index].id_viaggio);
      };
    });
    const viaggioBtns = ViaggiPersonaliContainer.querySelectorAll(".viaggio");
    viaggioBtns.forEach((btn, index) => {
      btn.onclick = () => {
        current_id_viaggio = viaggiPersonali[index].id_viaggio
        console.log(current_id_viaggio)
        console.log(viaggiPersonali[index])
        open_schermata_tappa();
      }
    })
  });

}

function clearForm() {
  document.getElementById('titolo').value = '';
  document.getElementById('descrizione').value = '';
}