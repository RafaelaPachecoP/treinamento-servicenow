if(sessionStorage.getItem("url") == null){
    window.location.href = "index.html";
}

const url = sessionStorage.getItem("url");
const usuario = sessionStorage.getItem("usuario");
const senha = sessionStorage.getItem("senha");
const credenciais = btoa(`${usuario}:${senha}`);

document.getElementById("conectado").textContent = `${url}  - ${usuario}`;

//todos os incidentes
fetch(`${url}/api/now/table/incident?sysparm_fields=sys_id&sysparm_limit=1000`, 
    {headers: {Authorization: `Basic ${credenciais}`},
})

.then((resposta) => resposta.json())
.then((dados) => {
    document.getElementById("todos").textContent = dados.result.length;
})
.catch(() => {
    document.getElementById("todos").textContent = "Não foi possível carregar";
});

//incidentes ativos
fetch(`${url}/api/now/table/incident?sysparm_query=active=true&sysparm_fields=sys_id&sysparm_limit=1000`, 
    {headers: {Authorization: `Basic ${credenciais}`},
})

.then((resposta) => resposta.json())
.then((dados) => {
    document.getElementById("ativos").textContent = dados.result.length;
})
.catch(() => {
    document.getElementById("ativos").textContent = "Não foi possível carregar";
});

//incidentes P1
fetch(`${url}/api/now/table/incident?sysparm_query=active=true^priority=1&sysparm_fields=sys_id&sysparm_limit=1000`, 
    {headers: {Authorization: `Basic ${credenciais}`},
})

.then((resposta) => resposta.json())
.then((dados) => {
    document.getElementById("p1").textContent = dados.result.length;
})

.catch(() => {
    document.getElementById("p1").textContent = "Não foi possível carregar";
});

//mudanças agendadas
fetch(`${url}/api/now/table/change_request?sysparm_query=state=-2&sysparm_fields=sys_id&sysparm_limit=1000`, 
    {headers: {Authorization: `Basic ${credenciais}`},
})

.then((resposta) => resposta.json())
.then((dados) => {
    document.getElementById("agendadas").textContent = dados.result.length;
})
.catch(() => {
    document.getElementById("agendadas").textContent = "Não foi possível carregar";
});

const sair = () => {
    sessionStorage.clear();
    window.location.href = "index.html";
};