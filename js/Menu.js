
function logout() {
    localStorage.removeItem("token");
    window.location.href = "Login.html";
}

function irParaCompra() {
    window.location.href = "Compra.html";
}

function irParaConsulta() {
    window.location.href = "ConsultaCompra.html";
}

function irParaAddFuncionario() {
    window.location.href = "AddFuncionario.html";
}

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

//PERMISSOES----------------------------------------------------------------------------------------------

const PERMISSOES = {
  COMPRAR: "comprar",
  CONSULTAR: "consultar",
  ADD_FUNCIONARIO: "add_funcionario",
  ADMIN: "admin"
};

const ROLE_PERMISSIONS = {
  0: ["comprar", "consultar", "add_funcionario", "admin"],
  1: ["comprar", "consultar"],
  2: ["consultar", "add_funcionario"]
};

const decoded = jwt_decode(token);

const permissoesUsuario = ROLE_PERMISSIONS[decoded.tipo];
//const quantidade = 0

// esconder botão se não tiver permissão
if (!permissoesUsuario.includes(PERMISSOES.COMPRAR)) {
  document.getElementById("btnCompra").style.display = "none";
}

if (!permissoesUsuario.includes(PERMISSOES.CONSULTAR)) {
  document.getElementById("btnConsultar_Cliente").style.display = "none";
}

if (!permissoesUsuario.includes(PERMISSOES.ADD_FUNCIONARIO)) {
  document.getElementById("btnAddFuncionario").style.display = "none";
}

const menu = document.querySelector(".menu");
const quantidade = menu.children.length;
console.log(quantidade)
if (quantidade <= 4) {
    menu.style.gridTemplateColumns = `repeat(2, 200px)`;
}else if (quantidade <= 8) {
    menu.style.gridTemplateColumns = `repeat(4, 200px)`;
}else {
    menu.style.gridTemplateColumns = `repeat(8, 125px)`;
}