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

    let isLogged = false;
    let currentUser = "";
    let currentUserId = null; 

    const login = async (username, password) => {
        try {
            const res = await fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            if (!res.ok) {
                throw new Error("Errore nella risposta del server");
            }

            const data = await res.json();
            console.log("Risposta dal server:", data);

            if (data.success && data.user) {
                currentUser = data.user.username;
                currentUserId = data.user.id;
                console.log("LOGGATOOOOO!");

                document.getElementById("schermata_login").style.display = 'none';
                document.getElementById("schermata_dash").style.display = 'block';
                document.getElementById("schermata_conferma_login").style.display = "block";
                document.getElementById("navbar_login").style.display = 'none';
                document.getElementById("userNavHome").value = currentUser;
                document.getElementById("userNavHome").innerHTML = currentUser;
                document.getElementById("navbar_homepage").style.display = 'block';

                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.error("Errore durante il login:", err);
            return null;
        }
    };

    loginButton.onclick = async () => {
        const name = inputName.value;
        const password = inputPassword.value;

        if (!name || !password) {
            esitoLog.innerHTML = '<div class="alert alert-warning">Inserisci username e password</div>';
            return;
        }

        const result = await login(name, password);

        if (result === true) {
            isLogged = true;
            console.log("Login riuscito:", currentUser);

            document.getElementById("schermata_login").style.display = 'none';
            document.getElementById("schermata_dash").style.display = 'block';
            document.getElementById("schermata_conferma_login").style.display = "block";
            document.getElementById("navbar_login").style.display = 'none';
            document.getElementById("userNavHome").value = currentUser;
            document.getElementById("userNavHome").innerHTML = currentUser;
            document.getElementById("navbar_homepage").style.display = 'block';
        } else if (result === false) {
            esitoLog.innerHTML = '<div class="alert alert-danger">Credenziali Errate!</div>';
        } else {
            esitoLog.innerHTML = '<div class="alert alert-danger">Errore durante il login</div>';
        }
    };

    return {
        isLogged: () => isLogged,
        currentUser: () => currentUser,
        currentUserId: () => currentUserId 
    };
};

    
    
export function registraUtente() {
  const username = document.getElementById("userR").value;
  console.log(username)
  const email = document.getElementById("email").value;

  if (!username || !email) {
    alert("Compila tutti i campi!");
    return;
  }

  fetch("/utente", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email })
  })
    .then(res => res.json())
    .then(data => {
      if (data && data.result === "ok") {
        alert("Registrazione completata! Controlla la tua email per la password.");
      } else {
        alert("Errore nella registrazione: " + (data.message || "Dati non validi."));
      }
    })
    .catch(err => {
      console.error("Errore nella registrazione:", err);
      alert("Errore durante la registrazione");
    });
}