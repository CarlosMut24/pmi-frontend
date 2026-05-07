const token = localStorage.getItem("token");

function logout() {
    localStorage.removeItem("token");
    window.location.href = "Login.html";
}

function voltar() {
    window.location.href = "Menu.html";
}


if (!token) {
    window.location.href = "Login.html";
}

document.getElementById("resultado").style.display = "none";

async function consultar() {
    document.getElementById("resultado").style.display = "none";
    const funcionario_id = document.getElementById("id").value;
    const cpf = document.getElementById("cpf").value;
    const mes = document.getElementById("mes").value;
    const ano = document.getElementById("ano").value;
    const nome = document.getElementById("nome").value;

    try{
        
        const params = new URLSearchParams();

        if (funcionario_id) params.append("funcionario_id", funcionario_id);
        if (cpf) params.append("cpf", cpf);
        if (mes !== undefined && mes !== "") params.append("mes", mes);
        if (ano) params.append("ano", ano);
        if (nome) params.append("nome", nome);
        
        const res = await fetch(`https://convenioiacanga-production.up.railway.app/compras/consultar?${params}`, 
            {
            headers: {
                "Authorization": "Bearer " + token
            },
        });
        
        if (!res.ok) {
            const msg = await res.text();
            document.getElementById("erroBusca").innerText = msg;
            return;
        }

        document.getElementById("resultado").style.display = "";
        document.getElementById("erroBusca").innerText = "";

        const dados = await res.json();
        const resumo = dados.resumo;
        const lista = dados.lista;
        

        const tabela = document.getElementById("tabelaCompras");
        tabela.innerHTML = "";

        lista.forEach(item => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td><strong>${item.id}</strong></td>
                <td>${item.nome}</td>
                <td>${item.empresa}</td>
                <td><strong>${item.data_vencimento}</strong></td>
                <td><strong>${formatarValor(item.valor)}</strong></td>
                <td>${item.nparcela + "/" + item.numero_parcelas}</td>
                <td>${formatarValor(item.valor_parcela)}</td>
                <td><button class="btn" onclick="baixarNota(${item.id})">Imprimir</button>
                <button class="btn" onclick="deletar(${item.id})">Deletar</button></td>
            `

            tabela.appendChild(tr);
        })

        document.getElementById("total").innerText = resumo.total_valor;
        document.getElementById("numero").innerText = resumo.total_compras;
        
    } catch {
        document.getElementById("erroBusca").innerText = "Erro de conexão";
    }
}

function formatarData(data) {
    const d = new Date(data);
    return d.toLocaleDateString("pt-BR");
}

function formatarValor(valor) {
    return Number(valor).toFixed(2).replace(".", ",");
}

async function baixarNota(compraId) {
    try {
        const res = await fetch(`https://convenioiacanga-production.up.railway.app/compras/nota/${compraId}`, 
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

async function deletar(id){
    try {
    const res = await fetch(`https://convenioiacanga-production.up.railway.app/compras/cancelar/${id}`, 
        {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    });
    if (!res.ok) {
        const msg = await res.text();
        abrirModal(msg);
        return;
    }

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

