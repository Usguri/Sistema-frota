window.onload = function () {
    BuscaTiposCarregamento()
    BuscaDadosCarregamento()
}

function SalvarProxCarregamento(event) {
    event.preventDefault()

    fetch('api.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'action': 'SalvaPlacaCarregamento',
            'placa': document.getElementById("placa").value,
            'statuscarregamento': 1,
            'tipocarregamento': document.getElementById("tipocarregamento").value
        })
    }).then(response => response.json()).then(data => {

        document.getElementById("placa").value = ''
        document.getElementById("tipocarregamento").value = 0
        BuscaDadosCarregamento()

    }).catch(error => {
        console.error('Erro:', error);
    })
}

function AtualizarTable(data) {

    const tbody = document.getElementById("table_list_placas").querySelector("tbody")
    tbody.innerHTML = ''

    data.forEach((element) => {
        const newRow = tbody.insertRow()

        const cellPlaca = newRow.insertCell()
        const cellStatus = newRow.insertCell()
        const cellLocalCarre = newRow.insertCell()
        const cellDatahora = newRow.insertCell()
        const cellEnvio = newRow.insertCell()

        cellPlaca.textContent = element.PLACA
        cellLocalCarre.textContent = SelectTipoCarregamento(parseInt(element.TIPO_DE_CARREGAMENTO))

        const alert = document.createElement('div')
        alert.textContent = StatusCarregamentoCaminhao(parseInt(element.STATUSCARREGAMENTO))
        alert.className = `alert ${TipoStatusUtilizar(parseInt(element.STATUSCARREGAMENTO))} alert-status-carregamento`
        cellStatus.appendChild(alert)

        cellDatahora.textContent = formatarDataHora(element.DATAHORA)

        const buttonCall = document.createElement('button')
        buttonCall.textContent = 'Chamar'
        buttonCall.id = 'btn_' + element.PLACA
        buttonCall.className = DesabledButtonCallCaminhao(parseInt(element.STATUSCARREGAMENTO))
        buttonCall.addEventListener('click', () => abrirModalConfirmacao(element))

        const btnFinalizaCarregamento = document.createElement('button')
        btnFinalizaCarregamento.textContent = 'Finalizar'
        btnFinalizaCarregamento.id = 'btn_' + element.PLACA
        btnFinalizaCarregamento.className = DesabledButtonFinalizarCaminhao(parseInt(element.STATUSCARREGAMENTO))
        btnFinalizaCarregamento.addEventListener('click', () => FinalizarCarregamento(element))

        cellEnvio.appendChild(buttonCall)
        cellEnvio.appendChild(btnFinalizaCarregamento)
    })
}

function abrirModalConfirmacao(element) {

    SelectDocasEndMoegas(element.TIPO_DE_CARREGAMENTO)
    const modal = new bootstrap.Modal(document.getElementById('exampleModal'))
    modal.show()

    const modalPlaca = document.getElementById('modal-placa')
    modalPlaca.innerHTML = `<strong>Placa:</strong> ${element.PLACA}`

    document.getElementById('btn-confirmar-doca').value = element.IDCHAMARCAMINHAO
}

function ChamarCaminhaoCarregar() {

    var valorDoca = parseInt(document.getElementById("doca-select").value)
    var idcarregamentoplaca = parseInt(document.getElementById('btn-confirmar-doca').value)

    if (valorDoca == 0) {
        alert('Favor informe um local de carregamento!')
        return false
    }

    fetch('api.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'action': 'InformarLocalCarregamentoDoca',
            'id': idcarregamentoplaca,
            'doca': 'Doca ' + valorDoca
        })
    }).then(response => response.json()).then(data => {
        document.getElementById("doca-select").value = 0
        BuscaDadosCarregamento()
    }).catch(error => {
        console.error('Erro:', error);
    })

    const myModal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'))
    myModal.hide()
}

function BuscaDadosCarregamento() {
    fetch('api.php', {
        method: 'POST',
        body: JSON.stringify({
            'action': 'BuscaDadosTabelaCarregamento'
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json()).then(data => {

        AtualizarTable(data.data)
    })
}

function SelectTipoCarregamento(key) {
    switch (key) {
        case 1:
            return 'SEMENTES'
        case 2:
            return 'INDUSTRIA'
        default:
            break;
    }
}

function BuscaTiposCarregamento() {
    fetch('api.php', {
        method: 'POST',
        body: JSON.stringify({
            'action': 'BuscaDadosTipoCarregamento'
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json()).then(data => {

        let select = document.getElementById('tipocarregamento')
        data.data.forEach(element => {
            var opt = document.createElement('option')
            opt.value = element.IDTIPO
            opt.innerHTML = element.CARREGAMENTO
            select.appendChild(opt)
        })
    })
}

function FinalizarCarregamento(element) {

    let urlpost = 'FinalizaCarregamento'

    if (element.STATUSCARREGAMENTO == 3) {
        urlpost = 'DeletarCaminhao'
    }

    fetch('api.php', {
        method: 'POST',
        body: JSON.stringify({
            'action': urlpost,
            'idcaminhao': element.IDCHAMARCAMINHAO
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json()).then(data => {
        BuscaDadosCarregamento()
    })
}

function SelectDocasEndMoegas(tipo) {

    let numLocais = 6
    let NomeLocais = "Docas "
    const select = document.getElementById('doca-select')
    select.innerHTML = ''


    if (tipo == 2) {
        numLocais = 7
        NomeLocais = "Moega "
    }

    for (let i = 0; i <= numLocais; i++) {
        let opt = document.createElement('option')
        opt.value = i
        opt.innerHTML = NomeLocais + i

        if (i == 0) {
            opt.innerHTML = 'Selecione o local de carregamento'
            opt.selected = true
            opt.disabled = true
        }

        select.appendChild(opt)
    }

}