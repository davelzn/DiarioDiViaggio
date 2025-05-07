import { createLogin } from "../js/login.js";
import { createMiddleware } from "../js/middleware.js";
const navAccedi = document.getElementById("navbar_accedi")
const navLogin = document.getElementById("navbar_login")
const navReg = document.getElementById("navbar_reg")
const schEmbr = document.getElementById("schermata_embrionale");
const schLog = document.getElementById("schermata_login");
const schHome = document.getElementById("schermata_home");
const schDash = document.getElementById("schermata_dash");
const schReg = document.getElementById("schermata_reg");
const userHomeBtn = document.getElementById("userNavHome");
const homeNavBtn = document.getElementById("homeNavHome");
const regBtn = document.getElementById("regBtn");
const sendReg = document.getElementById("sendReg");
let isLogged = false;
createLogin();


const viaggiContainer = document.querySelector('.viaggi-container');
const middleware = createMiddleware();
let viaggiList = [];

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
}
homeNavBtn.onclick = () => {
  console.log("click home")
  loadViaggi()
  schHome.style.display = 'block';
  schDash.style.display = 'none';
}
regBtn.onclick = () => {
  console.log("click reg")
  schReg.style.display = 'block';
  schLog.style.display = 'none';
  navLogin.style.display = 'none';
  navReg.style.display = 'block';
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
      render();
      viaggiContainer.style.display = 'block';
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

}

document.addEventListener('DOMContentLoaded', () => {
  const addTripBtn = document.getElementById('addTrip');
  const schermataAggiuntaViaggio = document.getElementById('schermata_aggiunta_viaggio');
  const submitViaggioBtn = document.getElementById('submitViaggio');

  if (addTripBtn) {
      console.log('addTripBtn trovato');
      addTripBtn.onclick = () => {
          console.log('Pulsante cliccato');
          if (schermataAggiuntaViaggio) {
              console.log('schermata_aggiunta_viaggio trovata');
              schermataAggiuntaViaggio.style.display = "block"; 
          } else {
              console.log('schermata_aggiunta_viaggio NON trovato');
          }
      };
  } else {
      console.log('addTripBtn NON trovato');
  }

  if (submitViaggioBtn) {
      submitViaggioBtn.onclick = () => {
          const titolo = document.getElementById("titolo").value;
          const descrizione = document.getElementById("descrizione").value;
          const dataInizio = document.getElementById("data_inizio").value;
          const dataFine = document.getElementById("data_fine").value;

          if (!titolo || !descrizione || !dataInizio || !dataFine) {
              alert("Tutti i campi sono obbligatori!");
              return;
          }

          const durata = calculateDurata(dataInizio, dataFine);

          const nuovoViaggio = {
              titolo: titolo,
              descrizione: descrizione,
              data_inizio: dataInizio,
              data_fine: dataFine,
              durata: durata
          };

          fetch("https://ws.cipiaceinfo.it/diario/create", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "key": "7e1bdc72-9efc-4588-b534-372a7c50e96a"
              },
              body: JSON.stringify({
                  viaggio: nuovoViaggio
              })
          })
          .then(response => response.json())
          .then(data => {
              if (data.result === 'ok') {
                  alert("Viaggio aggiunto con successo!");
                  loadViaggi();
                  schermataAggiuntaViaggio.style.display = "none"; 
              } else {
                  alert("Errore nell'aggiungere il viaggio");
              }
          })
          .catch(err => {
              console.error("Errore:", err);
              alert("Errore durante la comunicazione con il server");
          });
      };
  }
});


function clearForm() {
  document.getElementById('titolo').value = '';
  document.getElementById('descrizione').value = '';
  document.getElementById('data_inizio').value = '';
  document.getElementById('data_fine').value = '';
}