const token = localStorage.getItem("token");
consultar()

function logout() {
    localStorage.removeItem("token");
    window.location.href = "Login.html";
}

if (!token) {
    window.location.href = "Login.html";
}

// const decoded = jwt_decode(token);

document.getElementById("empresa").style.display = "none";
// if (decoded.tipo == 0) {
//     // document.getElementById("empresa").style.display = "";
// }

function voltar() {
    window.location.href = "Menu.html";
}

let carregando = false;

async function consultar() {
    if (carregando) return; // 🔒 bloqueia duplo clique
    carregando = true;

    const cpf = document.getElementById("cpfP").value;
    const nome = document.getElementById("nomeP").value;
    try{
        const params = new URLSearchParams();
        if (cpf) params.append("cpf", cpf);
        if (nome) params.append("nome", nome);
        
        const res = await fetch(
            `https://convenioiacanga-production.up.railway.app/funcionario/consultar_lista?${params}`, 
            {
            headers: {
                "Authorization": "Bearer " + token
            },
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
        } else if (!res.ok) {
            const msg = await res.text();
            document.getElementById("erroBusca").innerText = msg;
            return;
        }

        document.getElementById("erroBusca").innerText = "";

        const dados = await res.json();

        const tabela = document.getElementById("tabelaCompras");
        tabela.innerHTML = "";

        dados.forEach(item => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td><strong>${item.matricula}</strong></td>
                <td><strong>${item.contrato}</strong></td>
                <td>${item.nome}</td>
                <td>${item.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}</td>
                <td>${item.empresa}</td>
                <td><strong>${formatarValor(item.salario)}</strong></td>
                <td><strong>${formatarlimite(item.limite, item.salario)}</strong></td>
                <td><strong>${formatarbloqueado(item.bloqueado)}</strong></td>
                <td><button class="btnIcone" title=\"Alterar funcionário\" onclick="alterar(
                ${item.id}, '${item.nome}', '${item.cpf}', ${item.salario}, ${item.limite}, ${item.matricula}, ${item.contrato})">
                <i class="bi bi-pencil-square"></i></button>
                <button class="btnIcone" title=\"Excluir funcionário\" onclick="abrirComfirmar(${item.id}, '${item.nome}')">
                <i class="bi bi-trash3-fill"></i></button>
                <button class="btnIcone" title=\"Relarotio de Compas do funcionario\" onclick="excel(${item.id})">
                <i class="bi bi-download"></i></button></td>
            `

            tabela.appendChild(tr);
        })
        
    } catch {
        document.getElementById("erroBusca").innerText = "Erro de conexão";
        carregando = false;
    } finally {
        carregando = false;
    }
}

function formatarlimite(limite, salario) {
    if (limite <= 1){
        limite = limite * salario
    }
    return Number(limite).toFixed(2).replace(".", ",");
}

function formatarbloqueado(bloqueado) {
    if (bloqueado){
            return "SIM";
    }
    return "NÃO";
}

function formatarValor(valor) {
    return Number(valor).toFixed(2).replace(".", ",");
}

let idDeletar = 0;

function abrirComfirmar(id, funcionario) {
    document.getElementById("confirmarTexto").innerText = `EXCLUIR: ${funcionario}?`;
    document.getElementById("Confirmar").style.display = "flex";
    idDeletar = id;
}

function fecharComfirmar() {
  document.getElementById("Confirmar").style.display = "none";
  idDeletar = 0;
}

async function deletar(){
    const id = idDeletar;
    const recisao = document.getElementById("recisao").value
    console.log(recisao, id)

    if(recisao == ""){
        document.getElementById("erroConfirmar").innerText = `adicione a data de recisão`;
        return;
    }else document.getElementById("erroConfirmar").innerText = ``;
    try {
    const params = new URLSearchParams();
    
    const res = await fetch(`https://convenioiacanga-production.up.railway.app/funcionario/delete/${id}/'${recisao}'`, 
        {
        method: "DELETE",
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
        }else if (!res.ok) {
        const msg = await res.text();
        abrirModal(msg);
        return;
    }
    fecharComfirmar();
    abrirModal("Exclusão concluida");

    consultar()

    } catch {
      abrirModal("Erro de conexão");
    }
}

function abrirModal(texto) {
  document.getElementById("modalTexto").innerText = texto;
  document.getElementById("modal").style.display = "flex";
}

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

document.getElementById("formFuncionario").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const matricula = document.getElementById("matricula").value;
    const contrato = document.getElementById("contrato").value;
    const cpf = document.getElementById("cpf").value;
    const salario = document.getElementById("salario").value;
    const limite = document.getElementById("limite").value;
    const bloqueado = document.querySelector('input[name="Bloqueado"]:checked').value;

    try {
        const res = await fetch("https://convenioiacanga-production.up.railway.app/funcionario/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ nome, cpf, salario, limite, matricula, contrato, bloqueado})
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
        } else if (!res.ok) {
            document.getElementById("erroFuncionario").innerText = msg;
            return;
        }

        const msg = await res.text();

        fecharModalFuncionario();
        consultar()

        document.getElementById("nome").value = "";
        document.getElementById("cpf").value = "";
        document.getElementById("salario").value = "";
        document.getElementById("nome").value = "";
        document.getElementById("erroFuncionario").innerText = "";

        alert("Funcionário cadastrado com sucesso!");

    } catch {
        document.getElementById("erroFuncionario").innerText = "Erro de conexão";
    }
});

function abrirModalFuncionario() {
    document.getElementById("modalFuncionario").style.display = "block";
    document.getElementById("limite").value = 0.30;
}

function fecharModalFuncionario() {
    document.getElementById("modalFuncionario").style.display = "none";
}

function abrirAlerta(texto) {
  document.getElementById("alertaTexto").innerText = texto;
  document.getElementById("alerta").style.display = "flex";
}

function fecharAlerta() {
    location.reload(); // 🔄 recarrega a página
}

let idAlterar = 0;
function alterar(id, nome, cpf, salario, limite, matricula, contrato){
    document.getElementById("modalAlterar").style.display = "block";
    
    idAlterar = id;

    document.getElementById("nomeAlterar").value = nome;
    document.getElementById("matriculaAlterar").value = matricula;
    document.getElementById("contratoAlterar").value = contrato;
    document.getElementById("cpfAlterar").value = cpf;
    document.getElementById("salarioAlterar").value = salario;
    document.getElementById("limiteAlterar").value = limite;
}

function fecharModalAlterar() {
    document.getElementById("modalAlterar").style.display = "none";
    idAlterar = 0;
}

document.getElementById("formAlterar").addEventListener("submit", async (e) => {
    e.preventDefault();

    console.log("ALTERAR DISPAROU");
    const id = idAlterar;
    const nome = document.getElementById("nomeAlterar").value;
    const matricula = document.getElementById("matriculaAlterar").value;
    const contrato = document.getElementById("contratoAlterar").value;
    const cpf = document.getElementById("cpfAlterar").value;
    const salario = document.getElementById("salarioAlterar").value;
    const limite = document.getElementById("limiteAlterar").value;
    const bloqueado = document.querySelector('input[name="BloqueadoAlterar"]:checked').value;

    console.log(idAlterar, cpf, nome, salario, limite, bloqueado)

    try {
        const res = await fetch("https://convenioiacanga-production.up.railway.app/funcionario/alterar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ 
                id_funcionario: id, 
                nome: nome, 
                cpf: cpf, 
                salario: salario, 
                limite: limite, 
                matricula: matricula,
                contrato: contrato,
                bloqueado: bloqueado
            })
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
        } else if (!res.ok) {
            document.getElementById("erroFuncionario").innerText = msg;
            return;
        }
        
        const msg = await res.text();

        fecharModalAlterar();
        consultar()

        document.getElementById("nome").value = "";
        document.getElementById("cpf").value = "";
        document.getElementById("salario").value = "";
        document.getElementById("nome").value = "";
        document.getElementById("erroFuncionario").innerText = "";

        alert("Funcionário alterado com sucesso!");

    } catch {
        document.getElementById("erroFuncionario").innerText = "Erro de conexão";
    }
});

async function excel(id_funcionario) {

        const res = await fetch(`https://convenioiacanga-production.up.railway.app/funcionario/excel/${id_funcionario}`, 
            {
            headers: {
                "Authorization": "Bearer " + token
            }
        });
        console.log("fetch");

        if (res.status === 401) {
        localStorage.removeItem("token");

            abrirAlerta(
                "Sua sessão expirou",
                () => {
                    window.location.href = "Login.html";
                }
            );

            return;
        } else if (!res.ok) {
            const msg = await res.text();
            abrirModal(msg)
            return;
        }

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "funcionario.xlsx";
        a.click();

        abrirModal("download iniciado");
// router.get("/excel/:id", auth, permissao(PERMISSOES.RELATORIO_FUNCIONARIOS), MEUlog('Solicitou um relatorio do funcionario'), controller.relatorioFuncionario)

}