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
}

function abrirFuncionario(){
    document.getElementById("abaFarmacias").style.display = "none";
    document.getElementById("abaFuncionarios").style.display = "block";
    document.getElementById("abaFechamentos").style.display = "none";   
}

function abrirFechamento(){
    document.getElementById("abaFarmacias").style.display = "none";
    document.getElementById("abaFuncionarios").style.display = "none";
    document.getElementById("abaFechamentos").style.display = "block";
}