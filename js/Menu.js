
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

function irParaRelatorio() {
    window.location.href = "RelatorioRH.html";
}

function irParaRelatorioFar() {
    window.location.href = "RelatorioFar.html";
}

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "Login.html";
}

//PERMISSOES----------------------------------------------------------------------------------------------

const PERMISSOES = {
  COMPRAR: "comprar",
  CONSULTAR: "consultar",
  ADD_FUNCIONARIO: "add_funcionario",
  RELATORIO_FAR: "relatorio_far",
  RELATORIO_RH: "relatorio_rh",
  ADMIN: "admin"
};

const ROLE_PERMISSIONS = {
  0: ["comprar", "consultar", "add_funcionario", "relatorio_far" , "relatorio_rh",  "admin"],
  1: ["comprar", "consultar", "relatorio_far"],
  2: ["add_funcionario", "relatorio_rh"]
};

const decoded = jwt_decode(token);

const permissoesUsuario = ROLE_PERMISSIONS[decoded.tipo];
//const quantidade = 0

// esconder botão se não tiver permissão
// document.getElementById("btnCompra").style.display = "none";
// document.getElementById("btnConsultar_Cliente").style.display = "none";
// document.getElementById("btnAddFuncionario").style.display = "none";

if (permissoesUsuario.includes(PERMISSOES.COMPRAR)) {
  document.getElementById("btnCompra").style.display = "flex";
}

if (permissoesUsuario.includes(PERMISSOES.CONSULTAR)) {
  document.getElementById("btnConsultar_Cliente").style.display = "flex";
}

if (permissoesUsuario.includes(PERMISSOES.ADD_FUNCIONARIO)) {
  document.getElementById("btnAddFuncionario").style.display = "flex";
}

if (permissoesUsuario.includes(PERMISSOES.RELATORIO_RH)) {
  document.getElementById("btnRelatorioRH").style.display = "flex";
}

// if (permissoesUsuario.includes(PERMISSOES.RELATORIO_FAR)) {
//   document.getElementById("btnRelatorioFar").style.display = "flex";
// }

const menu = document.querySelector(".menu");
const quantidade = menu.children.length;
console.log(quantidade)
if (quantidade <= 4) {
    menu.style.gridTemplateColumns = `repeat(2, 200px)`;
}else if (quantidade <= 8) {
    menu.style.gridTemplateColumns = `repeat(2, 200px)`;
}else {
    menu.style.gridTemplateColumns = `repeat(2, 200px)`;
}
