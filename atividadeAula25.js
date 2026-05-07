const axios = require('axios');
const sqlite3 = require('sqlite3');
const cheerio = require('cheerio');

const dataBase = new sqlite3.Database('monitoramento.db');

dataBase.serialize (() => {
    dataBase.run(`
        CREATE TABLE IF NOT EXISTS noticias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        contagemLinks TEXT,
        url TEXT,
        data_acesso DATETIME DEFAULT CURRENT_TIMESTAMP
        )`)
});

async function create() {
    try {
        const url = 'https://www.uol.com.br/';

        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        
        const totalLinks = $("a").length;

        dataBase.run(
        `INSERT INTO noticias (url, contagemLinks) VALUES (?, ?)`,
        [url, totalLinks],
        function (err) {
            if (err) {
            console.error("Erro ao salvar:", err.message);
            } else {
            console.log("Dados salvos com sucesso!\n");
            }
        }
        );
    } catch (error) {
        console.error("Erro ao acessar site:", error.message);
    }
}

function dbRead () {
  dataBase.all("SELECT * FROM noticias", [], (err, rows) => {
    if (err) {
      throw err;
    }
    console.log("\nDados armazenados:");
    console.table(rows);
  });
}

function dbUpdate(){
    const tituloNovo = 'Pedro Kanalli';
    const idParamudar = 1;
    dataBase.run (
        `UPDATE noticias SET contagemLinks = (?) WHERE id = (?)`, 
        [tituloNovo, idParamudar],
        function (err) {
            if (err) {
                console.error("Erro ao atualizar:", err.message);
            } else {
                if (this.changes >= 1) {
                    console.log("Dados atualizados com sucesso!");
                    console.log(`O que foi feito: a tupla de id = ${idParamudar} foi alterada.\n`);
                }
            }
        }
    ) 
}

function dbDelete() {
    idParaDeletar = 2;
    dataBase.run(`DELETE FROM noticias WHERE id = (?)`, 
        [idParaDeletar],
        function (err) {
            if (err) {
                console.error("Erro ao deletar:", err.message);
            } else {
                if (this.changes >= 1) {
                    console.log("Dados deletados com sucesso!");
                    console.log(`O que foi feito: a tupla de id = ${idParaDeletar} foi apagada.`);
                }
            }
        }
    )
}

create();


setTimeout(() => {
    dbUpdate();
    dbDelete();
    dbRead();
}, 2000);