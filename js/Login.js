const form = document.getElementById("loginForm");
console.log("Form enviado");

let carregando = false;
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (carregando) return;
    carregando = true;
    document.getElementById("entrar").style.backgroundColor = "rgb(116, 107, 107)";

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
        carregando = false;
        document.getElementById("entrar").style.backgroundColor = "rgb(192, 50, 50)";
        return;
      }

      const dados = await resposta.json();

      localStorage.setItem("token", dados.token);
      window.location.href = "Menu.html";
      console.log("Login OK");
    } catch (err) {
      document.getElementById("erro").innerText = "Erro de conexão";
      document.getElementById("entrar").style.backgroundColor = "rgb(192, 50, 50)";
      carregando = false;
    } finally {
      document.getElementById("entrar").style.backgroundColor = "rgb(192, 50, 50)";
      carregando = false;
    }

    
});