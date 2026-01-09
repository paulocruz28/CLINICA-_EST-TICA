const express = require('express'); // Importa o Node.js
const app = express();

// Permite ler os dados que vêm do formulário
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rota para receber o agendamento (O que acontece quando clicam em Enviar)
app.post('/api/agendar', (req, res) => {
    
    // Aqui estão os dados REAIS que vieram do formulário
    const nome = req.body.nome;
    const email = req.body.email;
    const queixa = req.body.queixa;

    console.log(`Novo cliente: ${nome} - Queixa: ${queixa}`);

    // AQUI ENTRARIA O CÓDIGO DE BANCO DE DADOS OU E-MAIL
    // Exemplo fictício: bancoDeDados.salvar(nome, email);
    // Exemplo fictício: enviarEmail(email, "Agendamento Recebido!");

    // Responde para o site que deu tudo certo
    res.json({ mensagem: "Sucesso! Dra. Elizabeth recebeu seu pedido." });
});

// Põe o servidor para rodar na porta 3000
app.listen(3000, () => {
    console.log('Servidor rodando! Aguardando agendamentos...');
});