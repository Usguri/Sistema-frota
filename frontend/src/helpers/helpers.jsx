import { Alert } from '@mui/material';


export const StatusCarregamentoCaminhao = (key) => {
    switch (key) {
        case 1: return <Alert variant="filled" severity="info" style={{ textAlign: 'center' }}>{'Em espera'}</Alert>;
        case 2: return <Alert variant="filled" severity="warning" style={{ textAlign: 'center' }}>{'Carregando'}</Alert>;
        case 3: return <Alert variant="filled" severity="success" style={{ textAlign: 'center' }}>{'Carregado'}</Alert>;
        default: return '';
    }
};

export const formatarDataHoraSistema = (dataString) => {
    const data = new Date(dataString.replace(' ', 'T'));
    if (isNaN(data.getTime())) return 'Data inválida';

    const formatador = new Intl.DateTimeFormat('pt-BR', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    return formatador.format(data).replace(',', '');
};

export const TipoCarreGamentoCaminhao = (key) => {
    switch (key) {
        case 1: return 'SEMENTES';
        case 2: return 'INDUSTRIA';
        default: return '';
    }
};

export const UppercaseWord = (key) => {
    if (key) {
        return key.toUpperCase()
    }
}

export const LocalCarregamentoDoca = (key) => {
    let nomeLocalCarregamento = 'Doca '
    let dadosRetorno = []
    let numLocais = 6

    if (key == 2) {
        numLocais = 7
        nomeLocalCarregamento = 'Moega '
    }

    for (let i = 0; i < numLocais; i++) {
        dadosRetorno.push({
            'id': i + 1,
            'nome': nomeLocalCarregamento + (i + 1)
        })
    }
    return dadosRetorno
}

export const AlterarColorButon = (key) => {
    switch (parseInt(key)) {
        case 2: return 'success';
        case 3: return 'error';
        default: return '';
    }
}

export function validarDatas(datainicial, datafinal) {
    if (!datainicial || !datafinal) {
        return { valido: false, inf: '1', mensagem: "Selecione as duas datas!" };
    }

    if (datainicial.isAfter(datafinal)) {
        return { valido: false, inf: '2', mensagem: "A data inicial não pode ser maior que a final!" };
    }

    const diff = datafinal.diff(datainicial, "day");

    if (diff > 7) {
        return { valido: false, inf: '3', mensagem: "O intervalo não pode ser maior que 7 dias!" };
    }

    return {
        valido: true,
        inicial: datainicial.format("YYYY-MM-DD"),
        final: datafinal.format("YYYY-MM-DD"),
    };
}

export function diffHorasSegundos(inicio, fim) {


    const diffMs = new Date(fim) - new Date(inicio);
    const minutosTotais = Math.floor(Math.abs(diffMs) / 1000 / 60);

    if (!inicio || !fim) {
        return 0
    }

    return minutosTotais

    // const diffMs = new Date(fim) - new Date(inicio)
    // const horas = Math.floor(diffMs / 1000 / 60 / 60)
    // const minutos = Math.floor((diffMs / 1000 / 60) % 60)
    // return `${horas}h ${minutos}m`

}

export function OrganizaListaPorData(dados) {
    const temp = {};

    dados.forEach(item => {
        const data = item.STATUS_ESPERA.split(' ')[0];
        if (!temp[data]) temp[data] = [];
        temp[data].push(item);
    })

    const datasOrdenadas = Object.keys(temp).sort((a, b) => new Date(a) - new Date(b));
    return datasOrdenadas.map(data => temp[data]);
}

export function gerarDatasEntre(inicial, final) {
    const datas = [];
    const [anoI, mesI, diaI] = inicial.split('-').map(Number);
    const [anoF, mesF, diaF] = final.split('-').map(Number);

    let atual = new Date(anoI, mesI - 1, diaI)
    const fim = new Date(anoF, mesF - 1, diaF)

    while (atual <= fim) {
        const dia = String(atual.getDate()).padStart(2, '0');
        const mes = String(atual.getMonth() + 1).padStart(2, '0');
        const ano = atual.getFullYear();
        datas.push(`${mes}/${dia}/${ano} GMT`);

        atual.setDate(atual.getDate() + 1);
    }

    return datas;
}

export function CompararDatas(dataespera, datamostrarapexcharts) {
    const data1 = new Date(dataespera)
    const data2 = new Date(datamostrarapexcharts)

    return data1.getUTCFullYear() === data2.getUTCFullYear() && data1.getUTCMonth() === data2.getUTCMonth() && data1.getUTCDate() === data2.getUTCDate()
}

export function AjusteMinutosEmHoraMin(minutos) {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;

    if (horas === 0) return `${mins}m`;
    if (mins === 0) return `${horas}h`;
    return `${horas}h ${mins}m`;
}

export function OrganizaPorLocalCarregamento(dados) {
    const local = {}

    dados.forEach(item => {
        const data = item.TIPO_CARREGAMENTO.split(' ')[0];
        if (!local[data]) local[data] = [];
        local[data].push(item)
    })

    const locais_ajustados = Object.keys(local).map(data => local[data])
    const organizado_por_box = []

    for (let i = 0; i < locais_ajustados.length; i++) {
        const organizado_por_local = {}

        locais_ajustados[i].forEach(item => {
            const local = item.LOCAL_CARREGAMENTO
            if (!organizado_por_local[local]) organizado_por_local[local] = []
            organizado_por_local[local].push(item)
        })

        const array_indexado = Object.values(organizado_por_local)
        locais_ajustados[i] = array_indexado

        organizado_por_box.push(array_indexado)
    }



    return organizado_por_box
}

export function EncontraLocalCarregamento(tipo, local) {
    return (tipo == 1 ? 'Doca ' + local : 'Moega ' + local)
}