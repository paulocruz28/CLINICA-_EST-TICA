const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();

// 1. Configurações básicas
app.use(express.json());
app.use(express.static(__dirname)); 

// 2. Conexão com Banco de Dados Local
const dbPath = path.resolve(__dirname, 'clinica.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Erro no banco:', err.message);
    else console.log('Conectado ao banco SQLite.');
});

// 3. Cria a tabela
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS contatos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        telefone TEXT,
        mensagem TEXT,
        data_envio DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// 4. Rota Principal
app.post('/api/salvar-contato', async (req, res) => {
    const { nome, telefone, mensagem } = req.body;
    
    // Salvar Local
    const sql = `INSERT INTO contatos (nome, telefone, mensagem, data_envio) VALUES (?, ?, ?, datetime('now', 'localtime'))`;
    
    db.run(sql, [nome, telefone, mensagem], async function(err) {
        if (err) return res.status(500).json({ erro: err.message });

        const idLocal = this.lastID;
        console.log(`✅ Salvo localmente (ID: ${idLocal})`);

        // --- AQUI ENTRA SUA URL ---
        const GOOGLE_URL = "https://script.google.com/macros/s/AKfycbwF0wrGIA3icPjV0Xdr86svx8YtUf67IMAcJhG7NQ6q7m6OOBCApYzWJho3B7KBTzU7/exec"; 
        
        // Backup na Nuvem
        if (GOOGLE_URL.includes("/exec")) {
            try {
                await fetch(GOOGLE_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nome, telefone, mensagem,
                        data: new Date().toLocaleString("pt-BR"),
                        backup_id: idLocal
                    })
                });
                console.log(`☁️ Backup enviado para o Google!`);
            } catch (e) {
                console.error(`⚠️ Erro na nuvem:`, e.message);
            }
        } else {
            console.log("⚠️ URL do Google não configurada ou incorreta.");
        }

        res.json({ message: "Sucesso!", id: idLocal });
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando em: http://localhost:${PORT}`));