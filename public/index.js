import { createLogin } from "../js/login.js";
import { createMiddleware } from "../js/middleware.js";
import { registraUtente } from "../js/register.js";
let currentUser;
const navAccedi = document.getElementById("navbar_accedi");
const navHome = document.getElementById("navbar_homepage")
const navLogin = document.getElementById("navbar_login");
const navReg = document.getElementById("navbar_reg");
const schEmbr = document.getElementById("schermata_embrionale");
const schLog = document.getElementById("schermata_login");
const schHome = document.getElementById("schermata_home");
const schSearch = document.getElementById("schermata_search");
const schPreferiti = document.getElementById("schermata_preferiti");
const schDash = document.getElementById("schermata_dash");
const schReg = document.getElementById("schermata_reg");
const accBtn = document.getElementById("accBtn");
const loginButton = document.getElementById("openLogin");
const esitoLog = document.getElementById("schermata_home");
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

const login = createLogin();
const middleware = createMiddleware();



const viaggiContainer = document.querySelector('.viaggi-container');
const viaggiFiltratiContainer = document.querySelector('.viaggi-filtrati-container');
load();
let viaggiList = [];
let tappeList = [];
let utentiList = [];
let preferitiList = [];
let viaggiPersonali = [];
let Idattuale;
let current_id_viaggio;

loginButton.onclick = () => {
  const username = document.getElementById("user").value;
  const password = document.getElementById("psw").value;
  if (username === "" || password === "") {
    alert("Inserisci sia username che password.");
    return;
  }
  currentUser = document.getElementById("user").value;
  const logged = login.login(document.getElementById("user").value, document.getElementById("psw").value)
  .then( result => {
    if (result !== false){
      mostraS(schHome);
      mostraN(navHome);
      userHomeBtn.innerHTML = currentUser[0];
    }
  })  
  utentiList.forEach(utente =>{
    if (utente.username === currentUser){
      Idattuale = utente.id;
    }
  })
}

navAccedi.onclick = () => {
  mostraS(schLog);
  mostraN(navLogin)
}
userHomeBtn.onclick = () => {
  schermataAggiuntaViaggio.style.display = "none";
  ViaggiPersonaliContainer.style.display = "block";
  mostraS(schDash)
  loadPersonali()
}
homeNavBtn.onclick = () => {
  //console.log("click home")
  render();
  mostraS(schHome);
}

preferitiNavBtn.onclick = () => {
  console.log("click preferiti");
  mostraS(schPreferiti);
  loadViaggiPreferiti(Idattuale); 
}

searchNavBtn.onclick = () => {
  console.log("click search")
  loadFiltrati()
  mostraS(schSearch);
}
regBtn.onclick = () => {
  console.log("click reg")
  mostraS(schReg);
  mostraN(navReg);
}
accBtn.onclick = () => { 
  console.log("click acc")
  mostraS(schLog);
  mostraN (navLogin);
}

addTripBtn.onclick = () => mostraS(schermataAggiuntaViaggio);

searchTripBtn.onclick = () => {
  const searchText = document.getElementById('searchInput').value.toLowerCase();
  loadFiltrati(searchText)
}
aggTappa.onclick = () => {
  open_schermata_aggiunta_tappa()
}
function mostraS(schermata) {
  const schermate = [schTappe, schHome, schSearch,schReg,schEmbr,schPreferiti,schLog,schDash,schAggiungiTappe,schermataAggiuntaViaggio];
  schermate.forEach(el => el.style.display = "none");
  schermata.style.display = "block";
}
function mostraN(navbar) {
  const navbars = [navAccedi,navLogin,navReg];
  navbars.forEach(el => el.style.display = "none");
  navbar.style.display = "flex"; 
}

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
      //console.log(tappeList);
      let html = '';

      tappeList.forEach(tappa => {
        if (current_id_viaggio == tappa.id_viaggio) {
          html += `
            <div class="viaggio" data-id="${tappa.id_tappa}">
              <h5>${tappa.titolo}</h5>
              <p>${tappa.descrizione}</p>
              <p>${tappa.data.split('T')[0]}</p>
              <button id="el-${tappa.id_tappa}" class="elimina_tappa">Elimina</button>
            </div>
          `;
        }
      });
      //console.log(html)
      Tappecontainer.innerHTML = html;
      tappeList.forEach((tappa)=>{
        if (current_id_viaggio == tappa.id_viaggio){
          //console.log("el-" + tappa.id_tappa)
          const btn = document.getElementById("el-" + tappa.id_tappa);
          //console.log(btn)
          if (btn) {
          btn.onclick = () => {
            // console.log("cliccato");
            // console.log(tappa.id_tappa);
            deleteTappa(tappa.id_tappa);
            mostraS(schDash);
          }
          }
        }
      })
    });
  }
    

function loadPersonali(){
  viaggiPersonali = []
  middleware.load_viaggi()
    .then(res => {
      viaggiList=res;
      //console.log(Idattuale)
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

document.getElementById('submitTappa').onclick = async () => {
  const inputFile = document.querySelector('#file');
  let filename = inputFile.value.split(/[/\\]/).pop();
  const titolo = document.getElementById('titoloTappa').value;
  const descrizione = document.getElementById('descrizioneTappa').value;
  const data = new Date().toLocaleDateString(posizione);
  const id_viaggio = current_id_viaggio;
  const formData = new FormData();
  formData.append("file", inputFile.files[0]);
  const body = formData;
  const fetchOptions = {
    method: 'post',
    body: body
  };
  try {
      const res = await fetch("/upload", fetchOptions);
      const data = await res.json();
    } catch (e) {
      console.log(e);
    }

  if (!titolo || !descrizione || !data) return;

    const nuovaTappa = {
      titolo,
      descrizione,
      data,
      immagine: filename,
      id_viaggio
    };

    console.log("Nuova tappa:", JSON.stringify(nuovaTappa, null, 2));

    await middleware.add_tappa(nuovaTappa);
    const res = await middleware.load_tappe();
    tappeList = res;
    render();
    mostraS(schDash);
    document.getElementById('titoloTappa').value = "";
    document.getElementById('descrizioneTappa').value = "";
    clearForm();
  }
  


document.getElementById('submitViaggio').onclick = () => {
  const titolo = document.getElementById('titolo').value;
  const descrizione = document.getElementById('descrizione').value;
  const data_inizio = new Date().toLocaleDateString(posizione);
  console.log(data_inizio);
  let finito = false;
  const data_fine = null
  let id_utente
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
      mostraS(schHome)
      clearForm();
    });
};

window.deleteViaggio = async (id) => {
  try {
    console.log(id, Idattuale)
    await middleware.delete_preferito(Idattuale, id);
    await middleware.delete_viaggio(id);

    const res = await middleware.load_viaggi();
    viaggiList = res;
    const res2 = await middleware.load_preferiti();
    preferitiList = res2;

    render();
    //render_viaggi_personali_temp();
  } catch (error) {
    console.error("Errore durante l'eliminazione:", error);
  }
};

window.deleteTappa = (id) => {
  console.log("ID VIAGGIO", id)
  middleware.delete_tappa(id)
  .then(() => middleware.load_tappe())
  .then(res => {
    tappeList = res;
    render();
  });
};



function render() {
  middleware.load_tappe()
  .then(res => {
    const tappeList = res;
    tappeList.reverse();
    let html = '';
    console.log(tappeList)                            
tappeList.forEach(tappa => {
  html += `
    <div class="viaggio-card" data-id="${tappa.id_viaggio}">
      <img class="viaggio-img" src="/files/${tappa.immagine}" alt="Immagine tappa">
      <div class="viaggio-content">
        <h5 class="viaggio-titolo">${tappa.titolo}</h5>
        <p class="viaggio-descrizione">${tappa.descrizione}</p>
        <p class="viaggio-date">Dal: ${tappa.data.split('T')[0]}</p>
      </div>
    </div>
  `;
});
      viaggiContainer.innerHTML = "";
      viaggiContainer.innerHTML = html;
      const tappeDivs = viaggiContainer.querySelectorAll(".viaggio-card");
      //console.log(tappeDivs)
      tappeDivs.forEach(div => {
        div.onclick = () => {
          const id = div.getAttribute('data-id');  
          console.log("Apro schermata viaggio per ID:", id);
          render_viaggio(id);
        }
      });
    })
  };

const render_viaggio = (id) => {
  middleware.load_viaggi()
    .then((res) => {
      const viaggiList = res;
      viaggiList.reverse();
      console.log(viaggiList);
      let html = '';          

      for (let i = 0; i < viaggiList.length; i++) {
        const viaggio = viaggiList[i];
        let isPreferito = false;

        for (let j = 0; j < preferitiList.length; j++) {
          if (preferitiList[j].id_viaggio === viaggio.id_viaggio) {
            isPreferito = true;
            break;
          }
        }
        if (viaggio.id_viaggio == id) {
          html += `
            <div class="viaggio-card" data-id="${viaggio.id_viaggio}">
              <div class="viaggio-content">
                <h5 class="viaggio-titolo">${viaggio.titolo}</h5>
                <p class="viaggio-descrizione">${viaggio.descrizione}</p>
                <p>Dal: ${viaggio.data_inizio.split('T')[0]} al: ${viaggio.data_fine ? viaggio.data_fine : "in corso..."}</p>
                <button class="aggiungi_preferito btn btn-sm" ${isPreferito ? "disabled" : ""}>❤️ Preferito</button>
              </div>
            </div>
          `;
        }
      }
      viaggiContainer.innerHTML = "";
      viaggiContainer.innerHTML = html;
      middleware.load_tappe()
      .then((res) => {
        const tappeList = res;
        tappeList.reverse();
        console.log(tappeList);
        let html = 'TAPPE:';
        tappeList.forEach(tappa =>{
          if (tappa.id_viaggio == id){
          html+= `
              <div class="viaggio-card" data-id="${tappa.id_viaggio}">
                <img class="viaggio-img" src="/files/${tappa.immagine}" alt="Immagine tappa">
                <div class="viaggio-content">
                  <h5 class="viaggio-titolo">${tappa.titolo}</h5>
                  <p class="viaggio-descrizione">${tappa.descrizione}</p>
                  <p class="viaggio-date">Il: ${tappa.data.split('T')[0]}</p>
                </div>
              </div>
            `;}
        })
        viaggiContainer.innerHTML += html;
        const card = document.querySelector('.viaggio-card');
        if (card) {
          const idViaggio = card.getAttribute('data-id');
          const btnPreferito = card.querySelector('.aggiungi_preferito');

          if (btnPreferito) {
            btnPreferito.onclick = () => {
              let giaPreferito = false;
              for (let k = 0; k < preferitiList.length; k++) {
                if (preferitiList[k].id_viaggio === idViaggio) {
                  giaPreferito = true;
                  break;
                }
              }
              if (giaPreferito) return;

              const nuovoPreferito = {
                id_viaggio: idViaggio,
                id_utente: Idattuale
              };

              middleware.add_preferito(nuovoPreferito)
                .then(() => middleware.load_preferiti())
                .then((res) => {
                  preferitiList = res;
                  render_viaggio(id);
                  clearForm();
                });
            };
          }
        }
        })
    });
};




function render_filtrati(viaggiFiltrati) {
  viaggiFiltratiContainer.innerHTML = '';
  viaggiFiltrati.forEach(viaggio => {
    viaggiFiltratiContainer.innerHTML += `
      <div class="viaggio">
        <h5>${viaggio.titolo}</h5>
        <p>${viaggio.descrizione}</p>
        <p>Dal:${viaggio.data_inizio.split('T')[0]} al:boh</p>
        <div>
        </div>
      </div>
    `;
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
  let html = '';

  viaggiPersonali.forEach((viaggio) => {
    html += `
      <div class="viaggio" data-id="${viaggio.id_viaggio}">
        <h5>${viaggio.titolo}</h5>
        <p>${viaggio.descrizione}</p>
        <p>Dal: ${viaggio.data_inizio.split('T')[0]} al: ${viaggio.data_fine ? viaggio.data_fine : "in corso..."}</p>
        <div>
          <button class="btn btn-danger btn-sm elimina_viaggio" data-id="${viaggio.id_viaggio}">Elimina</button>
          ${!viaggio.data_fine ? `
            <button class="btn btn-sm conferma_viaggio" data-id="${viaggio.id_viaggio}">Termina</button>
          ` : ''}
        </div>
      </div>
    `;
  });

  ViaggiPersonaliContainer.innerHTML = html;

  const eliminaBtns = ViaggiPersonaliContainer.querySelectorAll(".elimina_viaggio");
  const terminaBtns = ViaggiPersonaliContainer.querySelectorAll(".conferma_viaggio");

  eliminaBtns.forEach(btn => {
    btn.onclick = () => {
      const id = btn.getAttribute('data-id');
      console.log("Elimino viaggio con ID:", id);
      tappeList.forEach(tappa => {
        if (tappa.id_viaggio == id) {
          console.log("ELIMINO", tappa.id_tappa);
          deleteTappa(tappa.id_tappa);
        }
      });
      deleteViaggio(id).then(() => {
        render_viaggi_personali_temp(viaggiPersonali);
        mostraS(schDash);
      });
    };
  });

  terminaBtns.forEach(btn => {
    btn.onclick = async () => {
      const id = btn.getAttribute('data-id');
      console.log("Termino viaggio con ID:", id);

      try {
        const res = await fetch('/termina/viaggio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id_viaggio: id })
        });

        const result = await res.json();

        if (result.success) {
          const viaggio = viaggiPersonali.find(v => v.id_viaggio == id);
          if (viaggio) {
            const oggi = new Date().toISOString().split('T')[0];
            viaggio.data_fine = oggi;
            render_viaggi_personali_temp(viaggiPersonali);
            mostraS(schDash);
          }
        }
      } catch (error) {
        console.error("Errore nella fetch termina viaggio:", error);
      }
    };
  });

  const viaggioDivs = ViaggiPersonaliContainer.querySelectorAll(".viaggio");
  viaggioDivs.forEach(div => {
    div.onclick = () => {
      const id = div.getAttribute('data-id');  
      current_id_viaggio = id;
      console.log("Apro schermata tappa per ID:", id);
      middleware.load_viaggi()
        .then(res => {
          viaggiList = res;
          viaggiList.forEach(viaggio => {
            if (viaggio.id_viaggio == current_id_viaggio) {
              console.log(viaggio.data_fine);
              if (viaggio.data_fine == null) {
                render_tappe();
                open_schermata_tappa();
              } else {
                console.log("IL VIAGGIO È GIÀ STATO TERMINATO");
              }
            }
          });
        });
    };
  });
}


function clearForm() {
  document.getElementById('titolo').value = '';
  document.getElementById('descrizione').value = '';
}