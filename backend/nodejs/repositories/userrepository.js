class UserRepository {
    constructor(database) {
        this.database = database;
    }

    async StatusEspera() {
        const sql = 'SELECT DISTINCT FTDP.PLACA, FTDP.IDTDP FROM F_TEMPO_DURACAO_PROCESSOS FTDP JOIN F_SEND_EMAIL_ALERT FSEA ON 1=1 WHERE FTDP.STATUS_ESPERA < DATE_SUB(NOW(), INTERVAL FSEA.STATUS_ESPERA MINUTE ) AND FTDP.STATUS_CARREGANDO IS NULL AND FTDP.STATUS1 = 0';
        return this.database.query(sql);
    }

    async StatusCarregando() {
        const sql = 'SELECT DISTINCT FTDP.PLACA, FTDP.IDTDP FROM F_TEMPO_DURACAO_PROCESSOS FTDP JOIN F_SEND_EMAIL_ALERT FSEA ON 1=1 WHERE FTDP.STATUS_CARREGANDO < DATE_SUB(NOW(), INTERVAL FSEA.STATUS_CARREGANDO MINUTE ) AND FTDP.STATUS_CARREGADO IS NULL AND FTDP.STATUS2 = 0';
        return this.database.query(sql);
    }

    async StatusCarregado() {
        const sql = 'SELECT DISTINCT FTDP.PLACA, FTDP.IDTDP FROM F_TEMPO_DURACAO_PROCESSOS FTDP JOIN F_SEND_EMAIL_ALERT FSEA ON 1=1 WHERE FTDP.STATUS_CARREGADO < DATE_SUB(NOW(), INTERVAL FSEA.STATUS_CARREGADO MINUTE ) AND FTDP.STATUS_FINALIZADO IS NULL AND FTDP.STATUS3 = 0';
        return this.database.query(sql);
    }

    async VerificaEmailParaEnvio(status) {
        const sql = 'SELECT EMAIL FROM F_SEND_EMAIL_ALERT WHERE ' + status + ' = 1';
        return this.database.query(sql);
    }

    async AtualizaEnvioStatusEmail(status, idtdp) {
        const sql = `UPDATE F_TEMPO_DURACAO_PROCESSOS SET ${status} = 1 WHERE IDTDP = ?`;
        return this.database.query(sql, [parseInt(idtdp)]);
    }

    async QueryBancoHana(numeropedido) {
        const sql = `SELECT
        NFS."Serial" AS "Num_Nota",
            NFS."CardName" AS "Nome_Razao_Social",
                ADR."AddrTypeS" || ' ' || ADR."StreetS" || ', ' || ADR."StreetNoS" || ' - ' || ADR."BuildingS" AS "Endereco",
                    ADR."BlockS" AS "Bairro",
                        ADR."CityS" AS "Cidade",
                            ADR."StateS" AS "Estado",
                                ADR."CountryS" AS "Pais",
                                    CASE 
                                WHEN ADR."TaxId0" IS NOT NULL AND ADR."TaxId0" <> '' THEN ADR."TaxId0"
                                WHEN ADR."TaxId4" IS NOT NULL AND ADR."TaxId4" <> '' THEN ADR."TaxId4"
                                ELSE NULL
                            END AS "CNPJ_CPF",
            ADR."TaxId1" AS "Inscricao_Estadual",
                ADR."Vehicle" AS "Placa_de_Veiculo",
                    ITM."Dscription" AS "Descricao_do_Produto"
        FROM
        SBO_PRD_COSTA.OINV AS NFS
                    INNER JOIN SBO_PRD_COSTA.INV12 AS ADR 
                    ON NFS."DocEntry" = ADR."DocEntry"
                    INNER JOIN SBO_PRD_COSTA.INV1 AS ITM
                    ON NFS."DocEntry" = ITM."DocEntry"
        WHERE
        NFS."Serial" = ${numeropedido};
        `;
        return this.database.query(sql);
    }

}

module.exports = UserRepository;
