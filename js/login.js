export const createLogin = () => {
    let currentUser = "";
    let currentUserId = null; 
    return{
        login: async (username, password) => {
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
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.error("Errore durante il login:", err);
            return null;
        }
        }
    }
}