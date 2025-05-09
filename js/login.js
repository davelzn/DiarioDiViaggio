let myToken, myKey;

fetch('conf.json') // carica le variabili da conf.json
    .then(response => {
        if (!response.ok) {
            console.log('Errore nel caricamento del file JSON');
        }
        return response.json();
    })
    .then(data => {
        myToken = data.cacheToken;
        myKey = data.myKey;
        console.log (myToken, myKey);
    })
    .catch(error => console.error('Errore:', error));

    export const createLogin = () => {
        const inputName = document.querySelector("#user");
        const inputPassword = document.querySelector("#psw");
        const loginButton = document.getElementById("openLogin");
        const esitoLog = document.getElementById("schermata_home");
        //const openLoginBtn = document.getElementById("openLogin"); // bottone in basso a destra
        let isLogged = false;
        
        let currentUser = "";
    
        const login = (name, password) => {
            return new Promise((resolve, reject) => {
                fetch("https://ws.cipiaceinfo.it/credential/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "key": myToken
                    },
                    body: JSON.stringify({
                        username: name,
                        password: password
                    })
                })
                .then(r => r.json())
                .then(r => {
                    resolve(r.result);
                })
                .catch(reject);
            });
        };
    
        loginButton.onclick = () => {
            //console.log("gdvhdgv", inputName, inputPassword);
    login(inputName.value, inputPassword.value).then(result => {
        console.log("Login Result:", result); // Log della risposta del server
        if (result) {
            isLogged = true;
            currentUser = inputName.value;
            console.log("Logged", currentUser);
            document.getElementById("schermata_login").style.display = 'none';
            document.getElementById("schermata_dash").style.display = 'block';
            document.getElementById("schermata_conferma_login").style.display = "block";
            document.getElementById("navbar_login").style.display = 'none';
            document.getElementById("userNavHome").value = currentUser;
            document.getElementById("userNavHome").innerHTML = currentUser
            document.getElementById("navbar_homepage").style.display = 'block';

            //openLoginBtn.innerHTML = currentUser;
        } else {
            esitoLog.innerHTML =
                '<div class="alert alert-danger">Credenziali Errate!</div>';
        }
    }).catch(error => {
        console.error('Errore durante il login:', error);
        esitoLog.innerHTML =
            '<div class="alert alert-danger">Si è verificato un errore durante il login!</div>';
    });
};
    
        return {
            isLogged: () => isLogged,
            currentUser: () => currentUser
        };
    };
    
    
export function registraUtente() {
  const nome = document.getElementById("userR").value;
  const email = document.getElementById("email").value;

  if (!nome || !email) {
    alert("Compila tutti i campi!");
    return;
  }

  fetch("/utente", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email })
  })
    .then(res => res.json())
    .then(data => {
      if (data && data.result === "ok") {
        alert("Registrazione completata! Controlla la tua email per la password.");
        closeRegisterModal();
      } else {
        alert("Errore nella registrazione: " + (data.message || "Dati non validi."));
      }
    })
    .catch(err => {
      console.error("Errore nella registrazione:", err);
      alert("Errore durante la registrazione");
    });
}