const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const server = new Koa();

server.use(bodyParser());

const produtos = [
    {
       id: 1,
       nome: "Guitarra Fender",
       qtd: 4,
       valor: 500000,
       deletado: false,
    },

];

const pedidos = [
    {
        id: 1,
        produtos: [produtos],
        estado:"incompleto",
        idCliente: 1,
        deletado: false,
        valorTotal: 500000
    }
]; 

const obterPedidos = () => {
    const pedidosSemDeletados = []

    pedidos.forEach(elemento => {
        if(elemento.deletado === false) {
            pedidosSemDeletados.push(elemento);
        }
        
    });
    return pedidosSemDeletados;
};

const adicionarPedidos = (pedido) => {
    const novoPedido = {
        id: pedidos.length + 1,
        produtos:[],
        estado: "incompleto",
        idCliente: pedido.idCliente,
        deletado: false,
        valorTotal: pedido.valorTotal ? pedido.valorTotal : "Pedido sem valor"

    };
    produtos.push(novoPedido);
    return novoPedido;
};
//-------------------------------------------------------------------------------------------------------------
const obterProdutos = () => {
    const produtosSemDeletados = []

    produtos.forEach(elemento => {
        if(elemento.deletado === false) {
            produtosSemDeletados.push(elemento);
        }
        
    });
    return produtosSemDeletados;
};

const adicionarProdutos = (produtos) => {
    const novoProduto = {
        id: produtos.length + 1,
        nome: produtos.nome,
        qtd: produtos.qtd,
        valor: produtos.valor,
        deletado: false,
        

    };
    produtos.push(novoProduto);
    return novoProduto;
};
// ------------------------------------------------------------------------------------------------
server.use((ctx) => {
    const path = ctx.url;
    const method = ctx.method;
    if(path === '/orders') {
        if(method === "GET"){
            ctx.body = obterPedidos();
            ctx.status = 200;
                ctx.body = {
                    status: "sucesso",
                    data: {
                        mensagem: "Pedido obtido"
                    }
                }
        }else if(method === "POST"){
            if(ctx.request.body.idCliente){
            const addPedidos = adicionarPedidos(ctx.request.body);
            ctx.body = addPedidos;
            ctx.status = 201;
                ctx.body = {
                    status: "sucesso",
                    data: {
                        mensagem: "Pedido adicionado"
                    }
                }
            }else {
                ctx.status = 400;
                ctx.body = {
                    status: "erro",
                    data: {
                        mensagem: "Pedido mal formatado"
                    }
                }
            }
            

        }else { console.log(method);
            console.log(path);
            ctx.status = 404;
            ctx.body = "Não Encontrado";
        }

        

    }if(path === '/orders/:id'){
        if(method === "GET"){
            ctx.body = obterProdutos();
            ctx.status = 200;
                ctx.body = {
                    status: "sucesso",
                    data: {
                        mensagem: "Produto obtido"
                    }
                }
        }else if(method === "PUT"){
            const addProdutos = adicionarProdutos(ctx.request.body);
            ctx.body = addProdutos;
            ctx.status = 201;
                ctx.body = {
                    status: "sucesso",
                    data: {
                        mensagem: "Produto adicionado"
                    }
                }

        }else { ctx.status = 400;
                ctx.body = {
                status: "erro",
                data: {
                    mensagem: "Produto mal formatado"
                }
            }
        }

    }else if(path.includes("/orders/:id")){

    }else {
        ctx.status = 404;
        ctx.body = "Não encontrado!"
    }


});

server.listen(8081, () => console.log('Rodadando na porta 8081'));