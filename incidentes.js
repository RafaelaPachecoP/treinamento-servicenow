if(sessionStorage.getItem("url") == null){
    window.location.href = "index.html";
}

const url = sessionStorage.getItem("url");
const usuario = sessionStorage.getItem("usuario");
const senha = sessionStorage.getItem("senha");
const credenciais = btoa(`${usuario}:${senha}`);

document.getElementById("conectado").textContent = `${url} - ${usuario}`;

const sair = () => {
    sessionStorage.clear();
    window.location.href = "index.html";
};

const mensagem = document.getElementById("mensagem");
const corpo = document.getElementById("corpo");
let pagina = 0;
let linhaAberta = null;

function corDaPrioridade(prioridade){
if(prioridade.includes("1")) return "vermelho";
if(prioridade.includes("2")) return "laranja";
if(prioridade.includes("3")) return "amarelo";
return "cinza"
}

function buscarIncidentes(){
mensagem.textContent = "Carregando..."
corpo.innerHTML = "";

const estado = document.getElementById("estado").value;
const prioridade = document.getElementById("prioridade").value;
const busca = document.getElementById("busca").value.trim();

let consulta = "";
if(estado != ""){
consulta += `state=${estado}`;
}
if(prioridade != ""){
if(consulta != ""){
    consulta += "^";
}
consulta += `priority=${prioridade}`;
}
if(busca != ""){
if(consulta != ""){
    consulta += "^";
}
consulta += `numberLIKE${busca}^ORshort_descriptionLIKE${busca}`;
}

document.getElementById("numero-pagina").textContent = `Página ${pagina + 1}`

fetch(`${url}/api/now/table/incident?sysparm_query=${consulta}ORDERBYDESCopened_at&sysparm_fields=sys_id,number,short_description,priority,state,assignment_group,opened_at&sysparm_limit=20&sysparm_offset=${pagina * 20}&sysparm_display_value=true`, {
headers: {Authorization: `Basic ${credenciais}`},
})
.then((resposta) => resposta.json())
.then((dados) => {
if(dados.result.length == 0){
    mensagem.textContent = "Nenhum incidente encontrado";
    document.getElementById("tabela").style.display = "none";
}
else{
    mensagem.textContent = "";
    document.getElementById("tabela").style.display = "table";
    dados.result.forEach((incidente) => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${incidente.number}</td>
            <td>${incidente.short_description}</td>
            <td><span class="badge badge-${corDaPrioridade(incidente.priority)}">${incidente.priority}</span></td>
            <td>${incidente.state}</td>
            <td>${incidente.assignment_group.display_value}</td>
            <td>${incidente.opened_at}</td>
        `;
        linha.style.cursor = "pointer";
        linha.setAttribute("tabindex", "0");
        linha.onclick = () => abrirModal(incidente.sys_id, linha)
        corpo.appendChild(linha);
    });
}
})
.catch(() => {
mensagem.textContent = "Não foi possível carregar";
});
}

function proximaPagina(){
pagina = pagina + 1;
document.getElementById("anterior").disabled = false;
buscarIncidentes();
}

function paginaAnterior(){
if(pagina > 0){
    pagina = pagina - 1;
}
if(pagina == 0){
    document.getElementById("anterior").disabled = true;
}
buscarIncidentes();
}

function filtrar(){
pagina = 0;
document.getElementById("anterior").disabled = true;
buscarIncidentes();
}

function abrirModal(sysId, linha){
linhaAberta = linha;

fetch(`${url}/api/now/table/incident/${sysId}?sysparm_display_value=true`, {
    headers: {Authorization: `Basic ${credenciais}`},
})
.then((resposta) => resposta.json())
.then((dados) => {
    const incidente = dados.result;

    document.getElementById("modal-numero").textContent = incidente.number;
    document.getElementById("modal-titulo").textContent = incidente.short_description;
    document.getElementById("modal-solicitante").textContent = incidente.caller_id.display_value || "Não informado";
    document.getElementById("modal-categoria").textContent = incidente.category || "Não informado";
    document.getElementById("modal-grupo").textContent = incidente.assignment_group.display_value || "Não informado";
    document.getElementById("modal-impacto").textContent = incidente.impact || "Não informado";
    document.getElementById("modal-urgencia").textContent = incidente.urgency || "Não informado";
    document.getElementById("modal-prioridade").textContent = incidente.priority || "Não informado";
    document.getElementById("modal-responsavel").textContent = incidente.assigned_to.display_value || "Não informado";
    document.getElementById("modal-estado").textContent = incidente.state || "Não informado";
    document.getElementById("modal-aberto").textContent = incidente.opened_at || "Não informado";
    document.getElementById("modal-atualizado").textContent = incidente.sys_updated_on || "Não informado";
    document.getElementById("modal-descricao").textContent = incidente.description || "Não informado";

    document.getElementById("modal-fundo").classList.remove("fundo");
})
.catch(() =>{
    alert("Não foi possível carregar os detalhes do incidente.")
})
}

function fecharModal(){
document.getElementById("modal-fundo").classList.add("fundo");
if(linhaAberta != null){
    try{
        linhaAberta.focus();
    }
    catch(erro){
        console.log("Não foi possível foca a linha: ", erro)
    }
}
}

buscarIncidentes();