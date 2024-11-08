const express = require("express") // Estou iniciando o express
const router = express.Router() // Configurando a primeira parte da rota

const conectaBancodeDados = require('./bancodeDados') // Importa o arquivo de conexão
conectaBancodeDados() // Chama a função para conectar ao banco de dados

const Mulher = require('./mulherModel')

const app = express() // Iniciando o app
app.use(express.json())
const porta = 3333 // Criando a porta

// Função para o GET, que mostra as mulheres
async function mostraMulheres(request, response) {
  try {
    const mulheresVindasdoBancodeDados = await Mulher.find()
    response.json(mulheresVindasdoBancodeDados)
  } catch (erro) {
    console.log(erro)
  }
}

// POST - Cria uma nova mulher
async function criaMulher(request, response) {
  const novaMulher = new Mulher({
    nome: request.body.nome,
    imagem: request.body.imagem,
    minibio: request.body.minibio,
    citacao: request.body.citacao, // Corrigido
  })

  try {
    const mulherCriada = await novaMulher.save()
    response.status(201).json(mulherCriada)
  } catch (erro) {
    console.log(erro)
  }
}

// PATCH - Atualiza os dados de uma mulher existente
async function corrigeMulher(request, response) {
  try {
    const mulherEncontrada = await Mulher.findById(request.params.id)

    if (request.body.nome) {
      mulherEncontrada.nome = request.body.nome
    }

    if (request.body.minibio) {
      mulherEncontrada.minibio = request.body.minibio
    }

    if (request.body.imagem) {
      mulherEncontrada.imagem = request.body.imagem
    }

    if (request.body.citacao) {
      mulherEncontrada.citacao = request.body.citacao
    }

    const mulherAtualizadaNoBancoDeDados = await mulherEncontrada.save()
    response.json(mulherAtualizadaNoBancoDeDados)
  } catch (erro) {
    console.log(erro)
  }
}

// DELETE - Deleta uma mulher existente
async function deleteMulher(request, response) {
  try {
    await Mulher.findByIdAndDelete(request.params.id)
    response.json({ mensagem: 'Mulher deletada com sucesso!' })
  } catch (erro) {
    console.log(erro)
  }
}

// Rotas configuradas
app.use(router.get('/mulheres', mostraMulheres)) // Rota GET /mulheres
app.use(router.post('/mulheres', criaMulher)) // Rota POST /mulheres
app.use(router.patch('/mulheres/:id', corrigeMulher)) // Rota PATCH /mulheres/:id
app.use(router.delete('/mulheres/:id', deleteMulher)) // Rota DELETE /mulheres/:id

// Função para mostrar a porta
function mostraPorta() {
  console.log("Servidor criado e rodando na porta", porta)
}

app.listen(porta, mostraPorta) // Servidor ouvindo a porta 