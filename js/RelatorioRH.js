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
    document.getElementById("abaFarmacias").style.display = "block";
    document.getElementById("abaFuncionarios").style.display = "none";
    document.getElementById("abaFechamentos").style.display = "none";
    consultarFarmacias_vendas()
}

function abrirFuncionario(){
    document.getElementById("abaFarmacias").style.display = "none";
    document.getElementById("abaFuncionarios").style.display = "block";
    document.getElementById("abaFechamentos").style.display = "none";
    consultarFuncionarios_gastos()   
}

function abrirFechamento(){
    document.getElementById("abaFarmacias").style.display = "none";
    document.getElementById("abaFuncionarios").style.display = "none";
    document.getElementById("abaFechamentos").style.display = "block";
}

async function consultarFarmacias_vendas() {
    try{
        const res = await fetch(`https://convenioiacanga-production.up.railway.app/empresas/relatorio`, 
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

        const tabela = document.getElementById("tabelaFarmacias");
        tabela.innerHTML = "";

        const decoded = jwt_decode(token);
        
        dados.forEach(farmacia => {
            console.log(decoded.id, farmacia.rh_id)
            if (farmacia.rh_id ==  decoded.id){
                const tr = document.createElement("tr");

                tr.innerHTML = `
                <td><strong>${farmacia.nome}</strong></td>
                <td><strong>${farmacia.cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")}</strong></td>
                <td><strong>${farmacia.total}</strong></td>                    
                `
                
                tabela.appendChild(tr);
            } 
        })

    } catch {
        abrirModal("Erro de conexão");
    }
}

async function consultarFuncionarios_gastos() {
    try{
        const res = await fetch(`https://convenioiacanga-production.up.railway.app/funcionario/relatorio`, 
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

        const tabela = document.getElementById("tabelaFuncionarios");
        tabela.innerHTML = "";

        const decoded = jwt_decode(token);
        
        dados.forEach(funcionario => {
            console.log(decoded.id, funcionario.rh_id)
            const tr = document.createElement("tr");
            
            tr.innerHTML = `
            <td><strong>${funcionario.nome}</strong></td>
            <td><strong>${funcionario.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}</strong></td>
            <td><strong>${funcionario.Matricula}</strong></td>
            <td><strong>${funcionario.contrato}</strong></td>
            <td><strong>${funcionario.total}</strong></td>                    
            `
            
            tabela.appendChild(tr);
            
        })

    } catch {
        abrirModal("Erro de conexão");
    }
}

async function consultarFechamento() {
    try{
        const res = await fetch(`https://convenioiacanga-production.up.railway.app/funcionario/relatorio`, 
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
            console.log(decoded.id, funcionario.rh_id)
            const tr = document.createElement("tr");
            
            tr.innerHTML = `
            <td><strong>${funcionario.nome}</strong></td>
            <td><strong>${funcionario.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}</strong></td>
            <td><strong>${funcionario.Matricula}</strong></td>
            <td><strong>${funcionario.contrato}</strong></td>
            <td><strong>${funcionario.total}</strong></td>                    
            `
            
            tabela.appendChild(tr);
            
        })

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
    location.reload();
}