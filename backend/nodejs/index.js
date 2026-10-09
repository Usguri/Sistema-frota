const express = require('express')
const cors = require('cors');
const Database = require('./database/Database')
const DatabaseHana = require('./database/DatabaseHana')
const UserRepository = require('./repositories/userrepository');
const TempoStatusJob = require('./jobs/tempoStatusjob')
const GerenciadoHana = require('./jobs/gerenciadoDadosHana')
const EmailService = require('./services/emailservice')

const dbConfig = { host: 'ip', port: 'porta', user: 'root', password: 'password', database: 'banco' }
const hanaConfig = { host: 'ip', port: 'porta', uid: 'banco', pwd: 'password' }
const emailConfig = { host: 'email-ssl.com.br', port: 'porta', secure: true, auth: { user: 'email', pass: 'password' }, tls: { rejectUnauthorized: false } }


const app = express();
app.use(express.json())
app.use(cors());

async function start() {

    const database = new Database(dbConfig);
    const userRepo = new UserRepository(database);
    const emailService = new EmailService(emailConfig);
    const job = new TempoStatusJob(userRepo, emailService);

    try {
        await job.getUsersToNotify();
        console.log('Job executado automaticamente');
    } catch (err) {
        console.error('Erro ao buscar registros:', err.message);
    }

}

app.post('/busca_dados_sap', async (req, res) => {

    const hanaDb = new DatabaseHana(hanaConfig);
    const userRepoToHana = new UserRepository(hanaDb);
    const jobHana = new GerenciadoHana(userRepoToHana);

    const idserial = req.body.serial

    try {
        const dados = await jobHana.GetDadosHana(idserial)
        res.json({ dados: dados });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

setInterval(async () => { start() }, 900000)

app.listen(4002, () => {
    console.log('API rodando em http://localhost:4002');
});







