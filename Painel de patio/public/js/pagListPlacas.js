var gravadadostemp = ''
var audio = null
var somTocando = false

window.onload = function () {
    ListaPlacasCarregamento()
}

function ListaPlacasCarregamento() {

    fetch('API.php', {
        method: 'POST',
        body: JSON.stringify({
            'action': 'BuscaListaCarregamento'
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json()).then(data => {
        AtualizarTable(data.data)
        tocarSom()
    })
}

function AtualizarTable(data) {

    var table = document.getElementById("table_list_carregando_agora").querySelector('tbody')
    table.innerHTML = '';

    let dadosOrganizadosDataHora = OrdenarDataHora(data)
    let contador = 0;

    dadosOrganizadosDataHora.forEach(element => {
        if (contador < 6) {
            var newRow = table.insertRow()
            var cellPlaca = newRow.insertCell(0)
            var cellDoca = newRow.insertCell(1)
            var cellHora = newRow.insertCell(2)
            var cellStatus = newRow.insertCell(3)

            const AlertStatus = document.createElement('div')
            AlertStatus.textContent = 'Dirija-se à ' + element.LOCALCARREGAMENTO
            AlertStatus.className = 'alert alert-success small-alert'
            AlertStatus.setAttribute('role', 'alert')


            cellPlaca.textContent = element.PLACA
            cellHora.textContent = formatarDataHora(element.DATAHORA)
            cellHora.style.fontSize = '40px'
            cellPlaca.style.fontSize = '50px'
            cellDoca.appendChild(AlertStatus)

            const alert = document.createElement('div')
            alert.textContent = StatusCarregamentoCaminhao(parseInt(element.STATUSCARREGAMENTO))
            alert.className = 'alert alert-warning alert-status-carregamento'
            alert.style.fontSize = '30px'
            cellStatus.appendChild(alert)

            contador++;
        }
    })
}

function OrdenarDataHora(lista) {
    return lista.sort((a, b) => new Date(b.datahora) - new Date(a.datahora))
}

function showCustomAlert(message, duration) {
    const alertBox = document.getElementById('custom-alert');
    alertBox.textContent = message;
    alertBox.style.display = 'block';

    setTimeout(() => {
        alertBox.style.display = 'none';
    }, duration);
}

function BuscaPlacaCarregamento() {

    fetch('api.php', {
        method: 'POST',
        body: JSON.stringify({
            'action': 'BuscarPlacaCarregarAgora'
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json()).then(data => {

        if (data.datahora != gravadadostemp) {
            gravadadostemp = data.datahora
            showCustomAlert("Placa: " + data.placa + " Dirija-se à " + data.doca, 50000)
            somTocando = true
            tocarSom()
        }

        ListaPlacasCarregamento()
    })
}

function tocarSom() {

    if (somTocando) {
        console.log('Tocando buzina por 50 segundos...');
        somTocando = false;

        audio = new Audio('../buzina.mp3');
        audio.loop = true;

        audio.play().catch(err => {
            console.warn('Falha ao tocar o som:', err);
        });

        setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
            somTocando = false;
            console.log('Som parado após 50 segundos');
        }, 50000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', () => {
        const desbloqueio = new Audio('../buzina.mp3')
        desbloqueio.play().then(() => {
            desbloqueio.pause()
            desbloqueio.currentTime = 0
        }).catch(() => { })
    }, { once: true })
})

setInterval(BuscaPlacaCarregamento, 60000)
