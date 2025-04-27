export const createMiddleware = () => {
  return {
    load: async () => {
      const response = await fetch("/viaggi");
      const json = await response.json();
      return json;
    },
    delete: async (id) => {
      const response = await fetch("/delete/" + id, {
        method: 'DELETE',
      });
      const json = await response.json();
      return json;
    },
    add: async (viaggio) => {
      const response = await fetch("/insert", {
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
    }
  }
}

