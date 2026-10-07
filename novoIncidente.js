if(sessionStorage.getItem("url") == null){
    window.location.href = "index.html";
}

const url = sessionStorage.getItem("url");
const usuario = sessionStorage.getItem("usuario");
const senha = sessionStorage.getItem("senha");
const credenciais = btoa(`${usuario}:${senha}`);


document.getElementById("conectado").textContent = `${url} - ${usuario}`;

fetch(`${url}/api/now/table/sys_user?sysparm_fields=user_name,name&sysparm_limit=1000&sysparm_query=active=true`, {
    headers: {Authorization: `Basic ${credenciais}`},
})
.then((resposta) => resposta.json())
.then((dados) => {
    const listaSolicitantes = document.getElementById("listaSolicitantes");
    dados.result.forEach((pessoa) => {
        const opcao = document.createElement("option");
        opcao.value = pessoa.user_name;
        opcao.textContent = pessoa.name;
        listaSolicitantes.appendChild(opcao);
    });

    document.getElementById("carregandoSolicitantes").style.display = "none";
})
.catch(() => {
    console.log("Não foi possível carregar a lista de solicitantes.");
    document.getElementById("carregandoSolicitantes").textContent = "Não foi possível carregar sugestões"
})

//botao sair, limpa a sessao e volta para o index.html
const sair = () => {
    sessionStorage.clear();
    window.location.href = "index.html";
}

const campoDescricaoRe = document.getElementById("descricaoRe");
const contador = document.getElementById("contador");
const mensagem = document.getElementById("mensagem");
const botaoCriar = document.getElementById("criar"); 

//atualiza o contador de caracteres
campoDescricaoRe.addEventListener("input", () => {
    const restante = 160 - campoDescricaoRe.value.length;
    contador.textContent = `${restante} caracteres restantes`;
});

//botao cancelar, volta para o painel.html
document.getElementById("cancelar").addEventListener("click", () => {
    window.location.href = "painel.html";
});

document.getElementById("incidente").addEventListener("submit", (evento) => {
    evento.preventDefault();

    const campoSolicitante = document.getElementById("solicitante");
    const campoImpacto = document.getElementById("impacto");
    const campoUrgencia = document.getElementById("urgencia");

    campoDescricaoRe.classList.remove("invalido");
    campoSolicitante.classList.remove("invalido");
    campoImpacto.classList.remove("invalido");
    campoUrgencia.classList.remove("invalido");
    document.getElementById("erroDescricaoRe").textContent = "";
    mensagem.textContent = "";

    let erro = false;
    

    const erroDescricaoRe = document.getElementById("erroDescricaoRe");
    if(campoDescricaoRe.value.trim() == ""){
        campoDescricaoRe.classList.add("invalido");
        erroDescricaoRe.textContent = "Campo obrigatório";
        erro = true;
    }
    else{
        erroDescricaoRe.textContent = "";
    }

    if(campoSolicitante.value.trim() == ""){
        campoSolicitante.classList.add("invalido");
        erro = true;
    }

    if(campoImpacto.value.trim() == ""){
        campoImpacto.classList.add("invalido");
        erro = true;
    }

    if(campoUrgencia.value.trim() == ""){
        campoUrgencia.classList.add("invalido");
        erro = true;
    }

    //se tiver erro, mostra a mensagem de erro
    if(erro){
        if(mensagem.textContent == ""){
            mensagem.textContent = "Preencha os campos obrigatórios";
        }
        return;
    }

    const dadosIncidente = {
        caller_id: document.getElementById("solicitante").value,
        category: document.getElementById("categoria").value,
        short_description: campoDescricaoRe.value,
        description: document.getElementById("descricao").value,
        impact: document.getElementById("impacto").value,
        urgency: document.getElementById("urgencia").value,
    }

    //desabilita o botao criar e mostra a mensagem de criando incidente
    botaoCriar.disabled = true;
    mensagem.textContent = "Criando incidente...";

    fetch(`${url}/api/now/table/incident`, {
        method: "POST",
        headers: {  
            "Authorization": `Basic ${credenciais}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dadosIncidente)
    })
    .then((resposta) => resposta.json())
    .then((dados) => {
        //mostra o numero do incidente criado e limpa o formulario
        const numero = dados.result.number;
        mensagem.textContent = `Incidente ${numero} criado com sucesso`;
        document.getElementById("incidente").reset();
        contador.textContent = "160 caracteres restantes";

        //volta para a tela de incidentes depois de 1,5 segundos
        setTimeout(() => {
            window.location.href = "incidentes.html";
        }, 1500);
    })
    .catch(() => {
        mensagem.textContent = "Não foi possível criar o incidente";
    })
    .finally(() => {
        //habilita o botao criar
        botaoCriar.disabled = false;
    });
});  

    