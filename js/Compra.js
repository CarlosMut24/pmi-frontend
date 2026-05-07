//const { cache } = require("react");

function voltar() {
    window.location.href = "Menu.html";
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "Login.html";
}

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "Login.html";
}

document.getElementById("card_Informações").style.display = "none";
document.getElementById("ceta").style.display = "none";
async function buscar() {
    const cpf = document.getElementById("cpf").value;
    if (cpf == ""){
        document.getElementById("erroBusca").innerText = "DIGITE O CPF";
        return
    }
    
    try {
        const res = await fetch(`https://convenioiacanga-production.up.railway.app/funcionario/consulta/${cpf}`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!res.ok) {
            const msg = await res.text();
            document.getElementById("erroBusca").innerText = msg;
            return;
        }

        const dados = await res.json();
        const saldo = dados.funcionario.limite - dados.funcionario.total_gasto

        document.getElementById("card_Informações").style.display = "";
        document.getElementById("ceta").style.display = "";

        document.getElementById("nome").innerText = dados.funcionario.nome;
        document.getElementById("empresa").innerText = dados.funcionario.empresa;
        document.getElementById("saldo").innerText = saldo/*.replace(".", ",")*/ +" R$";
        //document.getElementById("limite").innerText = parseFloat(dados.funcionario.limite) +" R$";

        document.getElementById("erroBusca").innerText = "";

    } catch {
        document.getElementById("erroBusca").innerText = "Erro de conexão";
    }
}

let carregando = false;
let compraId = 0;
async function comprar() {
    if (carregando) return; // 🔒 bloqueia duplo clique
    carregando = true;

    const cpf = document.getElementById("cpf").value;
    const valor = document.getElementById("valor").value;
    const parcelas = document.getElementById("parcelas").value;

    if (cpf == "" || valor == ""){
        document.getElementById("erroCompra").innerText = "DIGITE O CPF É O VALOR";
        return
    }

    try {
        const res = await fetch("https://convenioiacanga-production.up.railway.app/compras/compra", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ cpf, valor, parcelas })
        });

        if (!res.ok) {
            const msg = await res.text(); // ✔ lê como texto
            document.getElementById("erroCompra").innerText = msg;
            carregando = false;
            return;
        }
        const dados = await res.json();
        console.log(dados);
        compraId = dados;
        // ✔ sucesso → lê como PDF
        // const blob = await res.blob();

        // const url = window.URL.createObjectURL(blob);

        // const a = document.createElement("a");
        // a.href = url;
        // a.download = "nota.pdf";
        // a.click();

        // const url = URL.createObjectURL(blob);

        // window.open(url);

        document.getElementById("erroCompra").innerText = "";
        abrirModal("Compra realizada com sucesso!");

    } catch {
        document.getElementById("erroCompra").innerText = "Erro de conexão";
        carregando = false;
    } finally {
        carregando = false;
    }
}

function abrirModal(texto) {
  document.getElementById("modalTexto").innerText = texto;
  document.getElementById("modal").style.display = "flex";
}

function fecharModal() {

    location.reload(); // 🔄 recarrega a página
}

async function baixarNota() {
    const id = compraId;
    try {
        const res = await fetch(`https://convenioiacanga-production.up.railway.app/compras/nota/${id}`, 
            {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!res.ok) {
            const msg = await res.text();
            abrirModal(msg);
            return;
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        window.open(url);
    } catch {
        document.getElementById("erroBusca").innerText = "Erro de conexão";
    }
}