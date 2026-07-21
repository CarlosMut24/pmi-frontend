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

function abrirFarmacias(){
    document.getElementById("abaFarmacias").style.display = "flex";
    document.getElementById("abaFechamentos").style.display = "none";
    consultarFarmacias_vendas()
}

function abrirFechamento(){
    document.getElementById("abaFarmacias").style.display = "none";
    document.getElementById("abaFechamentos").style.display = "block";
    consultarFechamento()
}

async function consultarFarmacias_vendas() {
    try{
        const res = await fetch(`https://convenioiacanga-production.up.railway.app/empresas/relatorioFar`, 
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
            abrirModal(msg);
            return;
        }

        const dados = await res.json();
        console.log(dados)

        const tabela = document.getElementById("tabelaFarmacias");
        tabela.innerHTML = "";

        const decoded = jwt_decode(token);
        
        dados.forEach(farmacia => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
            <td><strong>${farmacia.nome}</strong></td>
            <td><strong>${farmacia.cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")}</strong></td>
            <td><strong>${farmacia.total}</strong></td>                    
            `
            
            tabela.appendChild(tr);
        })

    } catch {
        abrirModal("Erro de conexão");
    }
}

async function consultarFechamento() {
    const mes = document.getElementById("mes").value;
    const ano = document.getElementById("ano").value;
    // try{
        const params = new URLSearchParams();
        
        if (mes !== undefined && mes !== "") params.append("mes", mes);
        if (ano) params.append("ano", ano);

        const res = await fetch(`https://convenioiacanga-production.up.railway.app/fechamentos/consultarFar?${params}`, 
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
            abrirModal(msg);
            return;
        }

        const dados = await res.json();

        const tabela = document.getElementById("tabelaFechamentos");
        tabela.innerHTML = "";

        const decoded = jwt_decode(token);
        
        dados.forEach(funcionario => {
            const tr = document.createElement("tr");
            
            tr.innerHTML = `
            <td><strong>${funcionario.mes}</strong></td>
            <td><strong>${funcionario.ano}</strong></td>
            <td><strong>${formatarData(funcionario.data_inicio)} a ${formatarData(funcionario.data_fim)}</strong></td>
            <td><button class="btnIcone" title=\"Baixar fechamneto\" onclick="relatorio(${funcionario.id})">
            <i class="bi bi-download"></i></button></td>                  
            `
            
            tabela.appendChild(tr);
            
        })

    // } catch {
    //     abrirModal("Erro de conexão");
    // }
}

async function relatorio(fechamentoId) {
    const res = await fetch(`https://convenioiacanga-production.up.railway.app/fechamentos/relatorioFar/${fechamentoId}`, 
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
        a.download = "Fechamento.xlsx";
        a.click();

        abrirModal("download iniciado");
}

function formatarData(data) {
    const d = new Date(data);
    return d.toLocaleDateString("pt-BR", {
        timeZone: "UTC"
    });
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
    location.reload();
}