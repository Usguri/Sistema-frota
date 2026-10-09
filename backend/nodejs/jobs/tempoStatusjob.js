class TempoStatusJob {
    constructor(repo, emailService) {
        this.repo = repo;
        this.emailService = emailService;
    }

    async getUsersToNotify() {
        // promise exec all em paralelo,tudo de uma vez, await uma por vez
        // promise e await

        const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        const rowsEspera = await this.repo.StatusEspera()
        if (rowsEspera && rowsEspera.length > 0) {
            const rowEmails = await this.repo.VerificaEmailParaEnvio('STATUS_ESPERA')
            const organizaPlacas = rowsEspera.map(e => e.PLACA.toUpperCase()).join(', ');
            const prefixo = rowsEspera.length > 1 ? 'As placas que estão esperando são ' : 'A placa que está esperando é ';
            const separaIdsPlaca = rowsEspera.map(e => e.IDTDP)

            for (const user of rowEmails) {
                await this.emailService.sendEmail(user.EMAIL, 'Status Espera', prefixo + organizaPlacas)
            }
            separaIdsPlaca.forEach(async e => {
                await this.repo.AtualizaEnvioStatusEmail('STATUS1', e)
            });
        }

        await wait(20000)

        const rowsCarregando = await this.repo.StatusCarregando()
        if (rowsCarregado && rowsCarregando.length > 0) {
            const rowEmails = await this.repo.VerificaEmailParaEnvio('STATUS_CARREGANDO')
            const organizaPlacas = rowsCarregando.map(e => e.PLACA.toUpperCase()).join(', ');
            const prefixo = rowsCarregando.length > 1 ? 'As placas que estão esperando são ' : 'A placa que está esperando é ';
            const separaIdsPlaca = rowsEspera.map(e => e.IDTDP)

            for (const user of rowEmails) {
                await this.emailService.sendEmail(user.EMAIL, 'Status Espera', prefixo + organizaPlacas)
            }
            separaIdsPlaca.forEach(async e => {
                await this.repo.AtualizaEnvioStatusEmail('STATUS2', e)
            })
        }

        await wait(20000)

        const rowsCarregado = await this.repo.StatusCarregado();
        if (rowsCarregado && rowsCarregado.length > 0) {
            const rowEmails = await this.repo.VerificaEmailParaEnvio('STATUS_CARREGADO')
            const organizaPlacas = rowsCarregado.map(e => e.PLACA.toUpperCase()).join(', ');
            const prefixo = rowsCarregado.length > 1 ? 'As placas que estão esperando são ' : 'A placa que está esperando é ';
            const separaIdsPlaca = rowsEspera.map(e => e.IDTDP)

            for (const user of rowEmails) {
                await this.emailService.sendEmail(user.EMAIL, 'Status Espera', prefixo + organizaPlacas)
            }
            separaIdsPlaca.forEach(async e => {
                await this.repo.AtualizaEnvioStatusEmail('STATUS3', e)
            })

        }
    }

}

module.exports = TempoStatusJob;
