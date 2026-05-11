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
    const compra_id = document.getElementById("id").value;
    const cpf = document.getElementById("cpf").value;
    const mes = document.getElementById("mes").value;
    const ano = document.getElementById("ano").value;
    const nome = document.getElementById("nome").value;

    try{
        
        const params = new URLSearchParams();

        if (compra_id) params.append("compra_id", compra_id);
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
                <td><strong>${formatarData(item.data_vencimento)}</strong></td>
                <td>R$ ${formatarValor(item.valor)}</td>
                <td>${item.nparcela + "/" + item.numero_parcelas}</td>
                <td><strong>R$ ${formatarValor(item.valor_parcela)}</strong></td>
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
    return d.toLocaleDateString("pt-BR", {
        timeZone: "UTC"
    });
}

function formatarValor(valor) {
    return Number(valor).toFixed(2).replace(".", ",");
}

async function baixarNota(compraId) {
    const aba = window.open("", "_blank");
    aba.document.write("Gerando PDF...");
    try {
        const res = await fetch(`https://convenioiacanga-production.up.railway.app/compras/nota/${compraId}`, 
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
        } else if (!res.ok) {
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

async function deletar(id){
    try {
        const res = await fetch(`https://convenioiacanga-production.up.railway.app/compras/cancelar/${id}`, 
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

function abrirAlerta(texto) {
  document.getElementById("alertaTexto").innerText = texto;
  document.getElementById("alerta").style.display = "flex";
}

function fecharAlerta() {
    location.reload(); // 🔄 recarrega a página
}

