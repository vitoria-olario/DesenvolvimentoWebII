const express = require("express")
const app = express()
const handlebars = require("express-handlebars").engine
const bodyParser = require("body-parser")
const post = require("./models/post")


// Configurando Handlebars como motor de templates
app.engine("handlebars", handlebars({defaultLayout: "main"}))
app.set("view engine", "handlebars")

//middleware processa dados enviados em formulários HTML, formato padrão ao se submeter um forms via POST. transforma esses dados em um objeto JavaScript acessível via req.body dentro do seu código Express.
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Rota que renderiza o template Handlebars
app.get("/", function(req, res){
    res.render("primeira_pagina")
})

app.get("/consultar", function(req, res){
    post.findAll().then(function(posts){
        res.render("segunda_pagina", {posts})
        console.log(posts)
    })
})

app.get("/editar/:id", function(req, res){
    post.findAll({where: {'id': req.params.id}}).then(
        function(posts){
            res.render("editar", {posts})
            console.log(posts)
        }
    )
})

app.post("/atualizar", function(req,res) {
    post.update({
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data_contato: req.body.data_contato,
        observacao: req.body.observacao
    },{
        where: {
            id: req.body.id
        }
    }).then(
        function(){
            console.log("Dados atualizados com sucesso!")
            res.render("primeira_pagina")
        }
    )
})

app.get("/excluir/:id", function(req,res){
    post.destroy({where: {'id' :req.params.id}}).then(function(){
        console.log("Dados excluidos com sucesso!")
        res.render("primeira_pagina")
    })
})

app.get("/confirmar-exclusao/:id", function(req, res) {
    post.findByPk(req.params.id).then(function(post) {
        if (post) {
            res.render("confirmar_exclusao", { post });
        } else {
            res.status(404).send("Post não encontrado");
        }
    }).catch(function(erro) {
        console.log("Erro ao buscar o post: " + erro);
        res.status(500).send("Erro interno do servidor");
    });
});


//gera dinamicamente o conteúdo HTML a partir de um template Handlebars e insere o resultado na estrutura da página web
app.post("/cadastrar", function(req,res){
    const {nome, telefone, origem, data_contato, observacao} = req.body
    post.create({
        //nome: req.body.nome
        nome,
        telefone,
        origem,
        data_contato,
        observacao
    }).then(function(){
        res.send("Dados cadastrados com sucesso!")
        res.redirect("/")
    }).catch(function(erro){
        console.log("Erro ao gravar os dados na entidade!" + erro)
    })
})



//método do express.js para iniciar o servidor (porta, callback)
app.listen(8081, function(){
    console.log("Servidor Ativo, http://localhost:8081")
})