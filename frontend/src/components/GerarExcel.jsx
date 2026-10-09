import React from 'react';
import { UppercaseWord, TipoCarreGamentoCaminhao, EncontraLocalCarregamento } from '../helpers/helpers';
import ExcelJS from 'exceljs';


const GerarDadosExcel = ({ dados }) => {

    async function FunctionGeradorExcel(params) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Planilha1');

        worksheet.columns = [
            { header: 'PLACA', key: 'PLACA', width: 10 },
            { header: 'TIPO_CARREGAMENTO', key: 'TIPO_CARREGAMENTO', width: 10 },
            { header: 'LOCAL_CARREGAMENTO', key: 'LOCAL_CARREGAMENTO', width: 10 },
            { header: 'STATUS_ESPERA', key: 'STATUS_ESPERA', width: 30 },
            { header: 'STATUS_CARREGANDO', key: 'STATUS_CARREGANDO', width: 15 },
            { header: 'STATUS_CARREGADO', key: 'STATUS_CARREGADO', width: 15 },
            { header: 'STATUS_FINALIZADO', key: 'STATUS_FINALIZADO', width: 15 }
        ];

        params.forEach(e => {
            worksheet.addRow({
                PLACA: UppercaseWord(e.PLACA),
                TIPO_CARREGAMENTO: TipoCarreGamentoCaminhao(parseInt(e.TIPO_CARREGAMENTO)),
                LOCAL_CARREGAMENTO: EncontraLocalCarregamento(e.TIPO_CARREGAMENTO, e.LOCAL_CARREGAMENTO),
                STATUS_ESPERA: e.STATUS_ESPERA,
                STATUS_CARREGANDO: e.STATUS_CARREGANDO,
                STATUS_CARREGADO: e.STATUS_CARREGADO,
                STATUS_FINALIZADO: e.STATUS_FINALIZADO
            });
        });


        try {
            const buffer = await workbook.xlsx.writeBuffer()
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'Planilha_status_carregamento.xlsx'
            a.click()
            window.URL.revokeObjectURL(url)
            console.log('Planilha criada com sucesso!')
        } catch (error) {
            console.error('Erro ao criar planilha:', error);
        }

    }

    React.useEffect(() => {

        if (dados.data.length > 0) {
            FunctionGeradorExcel(dados.data)
            return;
        }
    }, [dados])

    return (
        <>
        </>

    )

}
export default GerarDadosExcel;