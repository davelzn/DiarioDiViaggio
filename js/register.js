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