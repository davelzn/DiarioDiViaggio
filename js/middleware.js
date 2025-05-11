export const createMiddleware = () => {
  return {
    load_viaggi: async () => {
      const response = await fetch("/viaggi");
      const json = await response.json();
      return json;
    },
    load_tappe: async () => {
      const response = await fetch("/tappe");
      const json = await response.json();
      return json;
    },
    load_preferiti: async () => {
      const response = await fetch("/preferiti");
      const json = await response.json();
      return json;
    },
    load_utenti: async () => {
      const response = await fetch("/utenti");
      const json = await response.json();
      return json;
    },
    delete_viaggio: async (id) => {
      const response = await fetch("/delete/" + id, {
      method: 'DELETE',
    });
    const json = await response.json();
    return json;
    },
    delete_tappa: async (id) => {
      const response = await fetch("/delete/tappa/" + id, {
        method: 'DELETE',
      });
      const json = await response.json();
      return json;
    },
    delete_preferito: async (id_utente, id_viaggio) => {
      const response = await fetch(`/delete/preferito/${id_utente}/${id_viaggio}`, {
      method: 'DELETE',
    });
    const json = await response.json();
    return json;
    },  
    add_viaggio: async (viaggio) => {
      const response = await fetch("/insert/viaggio", {
          method: 'POST',
          headers: {
              "content-type": "application/json"
          },
          body: JSON.stringify({
              viaggio: viaggio
          })
      });
      const json = await response.json();
      return json;        
    },
    add_tappa: async (tappa) => {
      const response = await fetch("/insert/tappa", {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            tappa: tappa
        })
    });
    const json = await response.json();
    return json;
    },
    add_preferito: async (preferito) => {
      const response = await fetch("/insert/preferito", {
      method: 'POST',
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ 
        preferito: preferito 
      })
    });
    const json = await response.json();
    return json;
  },
    add_utente: async (utente) => {
      const response = await fetch("/insert/utente", {
        method: 'POST',
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            utente: utente
        })
      });
      const json = await response.json();
      return json;
    },

  }
}

