const form = document.getElementById("loginForm");
console.log("Form enviado");

form.addEventListener("submit", async (e) => {
  console.log("Form enviado");
    e.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;

    try {      
      const resposta = await fetch("https://convenioiacanga-production.up.railway.app/usuarios/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
        body: JSON.stringify({ nome: usuario, senha: senha})
      });

      if (!resposta.ok) {
        const msg = await resposta.text(); // ✔ lê como texto
        document.getElementById("erro").innerText = msg;
        return;
      }

      const dados = await resposta.json();

      localStorage.setItem("token", dados.token);
      window.location.href = "Menu.html";
      console.log("Login OK");
    } catch (err) {
      document.getElementById("erro").innerText = "Erro de conexão";
    }

    
});