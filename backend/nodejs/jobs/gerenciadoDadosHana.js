class GerenciadoHana {
    constructor(repo) {
        this.repo = repo;
    }

    async GetDadosHana(idnfe) {
        // promise exec all em paralelo,tudo de uma vez, await uma por vez
        // promise e await
        const dadoshana = await this.repo.QueryBancoHana(idnfe)
        return dadoshana;
    }

}

module.exports = GerenciadoHana;
