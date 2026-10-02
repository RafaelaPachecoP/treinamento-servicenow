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
const lista = document.getElementById("lista");

    fetch(`${url}/api/now/table/incident?sysparm_query=active=true^priority=1&sysparm_fields=number,short_description&sysparm_limit=100`, 
    {headers: {Authorization: `Basic ${credenciais}`},
})

.then((resposta) => resposta.json())
.then((dados) => {
    if(dados.result.length == 0){
        mensagem.textContent = "Nenhum incidente P1 ativo."
    }
    else{
        mensagem.textContent = "";
        dados.result.forEach((incidente) => {
            const item = document.createElement("li");
            item.textContent = `${incidente.number} - ${incidente.short_description}`;
            lista.appendChild(item);
        });
    }
})

.catch(() => {
    mensagem.textContent = "Não foi possível carregar";
});