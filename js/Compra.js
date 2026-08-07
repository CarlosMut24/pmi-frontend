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
    if (carregando) return; // 🔒 bloqueia duplo clique
    carregando = true;

    const cpf = document.getElementById("cpf").value;
    if (cpf == ""){
        document.getElementById("erroBusca").innerText = "DIGITE O CPF";
        carregando = false;
        return
    }
    
    try {
        const res = await fetch(`https://convenioiacanga-production.up.railway.app/funcionario/consulta/${cpf}`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (res.status === 401) {
        localStorage.removeItem("token");

            abrirAlerta(
                "Sua sessão expirou",
                () => {
                    window.location.href = "Login.html";
                }
            );

            return;
        }

        if (!res.ok) {
            const msg = await res.text();
            document.getElementById("erroBusca").innerText = msg;
            carregando = false;
            return;
        }

        const dados = await res.json();
        const saldo = dados.funcionario.limite - dados.funcionario.total_gasto

        document.getElementById("card_Informações").style.display = "";
        document.getElementById("ceta").style.display = "";

        document.getElementById("nome").innerText = dados.funcionario.nome;
        document.getElementById("empresa").innerText = dados.funcionario.empresa;
        document.getElementById("saldo").innerText = "R$ " + saldo.toFixed(2)/*.replace(".", ",")*/;
        //document.getElementById("limite").innerText = parseFloat(dados.funcionario.limite) +" R$";

        document.getElementById("erroBusca").innerText = "";

    } catch {
        document.getElementById("erroBusca").innerText = "Erro de conexão";
        carregando = false;
    } finally {
        carregando = false;
    }
}

let carregando = false;
let compraId = 0;
async function comprar() {
    if (carregando) return; // 🔒 bloqueia duplo clique
    carregando = true;
    document.getElementById("comprar").style.backgroundColor = "rgb(116, 107, 107)";

    const cpf = document.getElementById("cpf").value;
    const valor = document.getElementById("valor").value;
    const parcelas = document.getElementById("parcelas").value;

    document.getElementById("cpf").value = ""
    document.getElementById("valor").value = ""

    if (cpf == "" || valor == ""){
        document.getElementById("erroCompra").innerText = "DIGITE O CPF É O VALOR";
        carregando = false;
        document.getElementById("comprar").style.backgroundColor = "rgb(192, 50, 50)";
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

        if (res.status === 401) {
        localStorage.removeItem("token");

            abrirAlerta(
                "Sua sessão expirou",
                () => {
                    window.location.href = "Login.html";
                }
            );

            return;
        }

        if (!res.ok) {
            const msg = await res.text(); // ✔ lê como texto
            document.getElementById("erroCompra").innerText = msg;
            carregando = false;
            document.getElementById("comprar").style.backgroundColor = "rgb(192, 50, 50)";
            return;
        }
        const dados = await res.json();
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
        document.getElementById("comprar").style.backgroundColor = "rgb(192, 50, 50)";
    }
}

function abrirModal(texto) {
    carregando = true;
    document.getElementById("modalTexto").innerText = texto;
    document.getElementById("modal").style.display = "flex";
}

function fecharModal() {
    carregando = false;
    location.reload(); // 🔄 recarrega a página
}

function abrirAlerta(texto) {
  document.getElementById("alertaTexto").innerText = texto;
  document.getElementById("alerta").style.display = "flex";
}

function fecharAlerta() {
    location.reload(); // 🔄 recarrega a página
}

async function baixarNota() {
    const aba = window.open("", "_blank");
    aba.document.write("Gerando PDF...");
    const id = compraId;
    try {
        const res = await fetch(`https://convenioiacanga-production.up.railway.app/compras/nota/${id}`, 
            {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (res.status === 401) {
        localStorage.removeItem("token");

            abrirAlerta(
                "Sua sessão expirou",
                () => {
                    window.location.href = "Login.html";
                }
            );

            return;
        }

        if (!res.ok) {
            const msg = await res.text();
            abrirModal(msg);
            return;
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        aba.location.href = url;

    } catch {
        document.getElementById("erroBusca").innerText = "Erro de conexão";
    }
}