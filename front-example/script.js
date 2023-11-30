const BASE_URL = `https://stockapi-o69l.onrender.com`

function traduzirValor(valor) {
    let valores = {
        'id': 'id',
        'name': 'nome',
        'price': 'preço',
        'amount': 'quantidade'
    }

    return valores[valor] || undefined;
}

async function atualizarProduto(idProduto, nomeProduto, precoProduto) {
    const objetoProduto = {
        "name": nomeProduto,
        "price": Number(precoProduto)
    }

    let request = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(objetoProduto)
    }

    await fetch(`${BASE_URL}/product/${idProduto}`, request)
    .then(response => response.json())
    .catch(error => {
        alert(error.message)
    });
}

async function removerProduto(idProduto) {
    let request = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    await fetch(`${BASE_URL}/product/${idProduto}`, request)
    .then(async response => {
        if (!response.ok) {
            const json = await response.json();
            throw new Error(json.detail);
        }
        return response;
    })
    .catch(error => {
        alert(error.message)
    }); 
}

async function adicionarProduto(nomeProduto, precoProduto) {
    const objetoProduto = {
        "name": nomeProduto,
        "price": Number(precoProduto)
    }

    let request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(objetoProduto)
    }

    await fetch(`${BASE_URL}/product`, request)
    .then(async response => {
        const json = await response.json();
        if (!response.ok) {
            throw new Error(json.detail);
        }
        return json.detail;
    })
    .catch(error => {
        console.log(`${error}`);
    });
}

async function carregarProdutos() {
    const ulProdutos = document.querySelector(`#produtos`);
    ulProdutos.innerHTML = ''; // Limpa a lista existente

    fetch(`${BASE_URL}/product`)
    .then(async response => {
        if (!response.ok) { 
            throw new Error('Sem sucesso!');
        }
        const produtos = await response.json();
        
        produtos.forEach(produto => {
            let liProduto = document.createElement('li')

            // Posicionando cada uma das chaves do objeto por meio de um for.
            for (let chave in produto) {
                const div = document.createElement('div')
                div.classList.add('produto')
                div.id = chave

                const paragrafoChave = document.createElement('p')
                const paragrafoValor = document.createElement('p')
                paragrafoChave.textContent = `${traduzirValor(chave)}:`
                paragrafoValor.id = 'value'
                paragrafoValor.textContent = `${produto[chave]}`
                
                div.appendChild(paragrafoChave)
                div.appendChild(paragrafoValor)

                liProduto.appendChild(div)
            }

            const botaoAtualizar = document.createElement('button')
            botaoAtualizar.textContent = 'Atualizar'
            botaoAtualizar.id = 'atualizar'

            const botaoRemover = document.createElement('button')
            botaoRemover.textContent = 'Remover'
            botaoRemover.id = 'remover'

            liProduto.addEventListener('click', (event) => {
                event.preventDefault()
                const botao = event.target

                const li = botao.closest('li')

                const divId = li.querySelector('#id')
                const paragrafoId = divId.querySelector('#value')
                const id = paragrafoId.textContent

                const divName = li.querySelector('#name')
                const paragrafoNome = divName.querySelector('#value')
                let nome = paragrafoNome.textContent

                const divPrice = li.querySelector('#price')
                const paragrafoPreco = divPrice.querySelector('#value')
                let preco = paragrafoPreco.textContent

                if (botao.matches('#remover')) {                    
                    removerProduto(id)

                    if (removerProduto) {
                        li.remove()
                    }
                }  

                if (botao.matches('#atualizar')) {
                    
                    const dialogAtualizar = document.querySelector('#menuAtualizar')

                    dialogAtualizar.showModal()
                    
                    let formularioAtualizacao = dialogAtualizar.querySelector('#formularioAtualizacao')

                    let inputNome = formularioAtualizacao.querySelector('#nome')
                    let inputPreco = formularioAtualizacao.querySelector('#preco')
                    inputNome.value = nome
                    inputPreco.value = preco

                    formularioAtualizacao.addEventListener('submit', (event) => {
                        event.preventDefault()
                        
                        let nomeAtualizado = inputNome.value
                        let precoAtualizado = inputPreco.value

                        if (nomeAtualizado != nome || precoAtualizado != preco) {
                            atualizarProduto(id, nomeAtualizado, Number(precoAtualizado))

                            paragrafoNome.textContent = nomeAtualizado
                            paragrafoPreco.textContent = precoAtualizado
                        }
                        
                        dialogAtualizar.close()
                    })
                }
            })

            liProduto.appendChild(botaoAtualizar)
            liProduto.appendChild(botaoRemover)
            ulProdutos.appendChild(liProduto)
        });
    })
}

addEventListener('load', carregarProdutos());

// Evento de adicionar produto movido para fora do evento abrirMenuAdicionar
const botaoAdicionar = document.querySelector('#adicionar');
const dialogAdicionar = document.querySelector('#menuAdicionar');
const formAdicionar = dialogAdicionar.querySelector('#formularioAdicionar');

botaoAdicionar.addEventListener('click', async (event) => {
    event.preventDefault();

    const inputNomeProduto = formAdicionar.querySelector('#nome');
    const inputPrecoProduto = formAdicionar.querySelector('#preco');

    const nome = inputNomeProduto.value;
    const preco = inputPrecoProduto.value;
    
    await adicionarProduto(nome, preco);

    inputNomeProduto.value = '';
    inputPrecoProduto.value = '';
    await carregarProdutos();
    dialogAdicionar.close();
});

// Evento para abrir o diálogo de adicionar
const botaoAbrirMenuAdicionar = document.querySelector('#abrirMenuAdicionar');
botaoAbrirMenuAdicionar.addEventListener('click', (event) => {
    event.preventDefault();
    dialogAdicionar.showModal();
});
