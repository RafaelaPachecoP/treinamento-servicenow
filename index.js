const conectar = () => {
    const url = document.getElementById("url");
    const usuario = document.getElementById("usuario");
    const senha = document.getElementById("senha");
    const erro = document.getElementById("erro");
    const botaoConectar = document.getElementById("botaoConectar");

    erro.textContent = "";
    url.classList.remove("invalido");
    usuario.classList.remove("invalido");
    senha.classList.remove("invalido");

    let vazio = false;

    if(url.value == ""){
        url.classList.add("invalido");
        vazio = true;
    }

    if(usuario.value == ""){
        usuario.classList.add("invalido");
        vazio = true;
    }

    if(senha.value == ""){
        senha.classList.add("invalido");
        vazio = true;
    }

    if(vazio){
        erro.textContent = "Preencha todos os campos.";
        return
    }
    
    //desabilita o botao e os campos na hora que tentar conectar
    botaoConectar.disabled = true;
    url.disabled = true;
    usuario.disabled = true;
    senha.disabled = true;
    erro.textContent = "Conectando..."

    
    const credenciais = btoa(`${usuario.value}:${senha.value}`);
    fetch(`${url.value}/api/now/table/incident?sysparm_limit=1`,{
        headers: {Authorization: `Basic ${credenciais}`},
    })
    .then((resposta) => {
        if(resposta.status == 401){
            erro.textContent = "Usuário ou senha inválidos";
        }
        else if(resposta.ok){
            sessionStorage.setItem("url", url.value);
            sessionStorage.setItem("usuario", usuario.value);
            sessionStorage.setItem("senha", senha.value);
            window.location.href = "painel.html";
        }
        else{
            erro.textContent = "Erro " +resposta.status;
        }
    })
    .catch(() => {
        erro.textContent = "Não foi possível conectar."
    })
    .finally(() => {
        //reabilita tudo novamente, exceto se já tiver redirecionado
        botaoConectar.disabled = false;
        url.disabled = false;
        usuario.disabled = false;
        senha.disabled = false;
    })
    
};

document.getElementById("senha").addEventListener("keydown", (evento) => {
    if(evento.key == "Enter"){
        conectar();
    }
});