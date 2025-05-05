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
        const esitoLog = document.getElementById("esitoLog");
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
            document.getElementById("schermata_home").style.display = 'block';

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
            isLogged: () => isLogged
        };
    };
    