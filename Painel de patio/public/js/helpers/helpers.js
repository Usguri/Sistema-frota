function StatusCarregamentoCaminhao(key) {
    switch (key) {
        case 1: return 'Em espera';
        case 2: return 'Carregando';
        case 3: return 'Carregado';
        default: return '';
    }
}

function TipoStatusUtilizar(key) {
    switch (key) {
        case 1: return 'alert-danger'
        case 2: return 'alert-warning'
        case 3: return 'alert-success'
        default: return ''
    }
}

function DesabledButtonFinalizarCaminhao(key) {
    switch (key) {
        case 1: return 'btn btn-success btn-sm disabled'
        case 2: return 'btn btn-success btn-sm'
        case 3: return 'btn btn-danger btn-sm'
        default: return ''
    }
}

function DesabledButtonCallCaminhao(key) {
    const baseClass = 'btn btn-primary btn-sm me-2';
    if (key === 3) {
        return baseClass + ' disabled';
    }
    return baseClass;
}

function formatarDataHora(dataString) {
    const data = new Date(dataString.replace(' ', 'T'))
    if (isNaN(data.getTime())) return 'Data inválida'

    const formatador = new Intl.DateTimeFormat('pt-BR', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    })

    return formatador.format(data).replace(',', '')
}

window.StatusCarregamentoCaminhao = StatusCarregamentoCaminhao
window.TipoStatusUtilizar = TipoStatusUtilizar
window.DesabledButtonFinalizarCaminhao = DesabledButtonFinalizarCaminhao
window.DesabledButtonCallCaminhao = DesabledButtonCallCaminhao
window.formatarDataHora = formatarDataHora

