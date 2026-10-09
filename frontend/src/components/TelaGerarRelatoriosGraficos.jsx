import * as React from 'react';
import Grid from '@mui/material/Grid';
import { Container, FormControlLabel, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import logo from '../assets/costa.svg'
import api from '../service/service';
import { validarDatas, diffHorasSegundos, OrganizaListaPorData, gerarDatasEntre, CompararDatas } from '../helpers/helpers';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ApexChart from './ApexCharts';
import GerarExcel from './GerarExcel'

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';


function TelaPrincipal() {

    const [datainicial, setDataInicial] = React.useState(null)
    const [datafinal, setDataFinal] = React.useState(null)
    const [dadosPesquisa, setdadosPesquisa] = React.useState([])
    const [open, setOpen] = React.useState(false)
    const handleClose = () => setOpen(false)
    const [openIntervalos, setIntervalos] = React.useState(false)
    const handleCloseIntervalos = () => setIntervalos(false)
    const [email, setEmail] = React.useState('')
    const [ListaEmails, setListaEmails] = React.useState([])

    const [StatusEspera, setStatusEspera] = React.useState('')
    const [StatusCarregando, setStatusCarregando] = React.useState('')
    const [StatusCarregado, setStatusCarregado] = React.useState('')
    const [EnviarGerarExcel, setEnviarGerarExcel] = React.useState([])
    const [gerar, setGerar] = React.useState(false)
    const [InformarTempomedio, setInformarTempomedio] = React.useState(false)
    const [OpenLoading, setOpenLoading] = React.useState(false)

    const handleEspera = (event) => {
        setStatusEspera(event.target.value)
    }

    const handleCarregando = (event) => {
        setStatusCarregando(event.target.value)
    }

    const handleCarregado = (event) => {
        setStatusCarregado(event.target.value)
    }

    let handleChangeDataInicial = (newValue) => {
        setDataInicial(newValue)
    }

    let handleChangeDataFInal = (newValue) => {
        setDataFinal(newValue)
    }

    let handleChangeEmail = (event) => {
        setEmail(event.target.value)
    }

    function PesquisarDados(acction) {

        const resultado = validarDatas(datainicial, datafinal)

        if (!resultado.valido) {
            resultado.inf == 1 ? toast.error(resultado.mensagem) : toast.info(resultado.mensagem)
            return;
        }

        if (acction == 1) {
            setOpenLoading(true)
            setInformarTempomedio(false)
        }

        api.api.post('/', { action: 'ListaCaminhoesCarregados', datainicial: resultado.inicial, datafinal: resultado.final }).then(response => {

            if (acction == 2) {
                setEnviarGerarExcel(response.data)
                setGerar(true)
                return false
            }

            setTimeout(() => {
                SeparaToSendApexcharts(response, resultado);
                setOpenLoading(false)
                setInformarTempomedio(true)
            }, 3000)

        }).catch(error => {
            console.error('Erro:', error);
        })
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        api.api.post('/', { action: 'SalvaEmailProcessosStatus', email: email }).then(response => {
            if (response.data) {
                BuscaListaEmails()
                toast.success('E-mail salvo com sucesso!')
                setEmail('')
                return false
            }
            toast.error('Erro ao salvar e-mail!')
        }).catch(error => {
            console.error('Erro:', error);
        })
    }

    const handleSwitchChange = (rowId, statusType, event) => {
        const isChecked = event.target.checked;

        switch (statusType) {
            case 'STATUS_ESPERA':
                SalvaCheckUsuario(rowId, isChecked, 'STATUS_ESPERA')
                break;

            case 'STATUS_CARREGANDO':
                SalvaCheckUsuario(rowId, isChecked, 'STATUS_CARREGANDO')
                break;

            case 'STATUS_CARREGADO':
                SalvaCheckUsuario(rowId, isChecked, 'STATUS_CARREGADO')
                break;

            case 'STATUS_FINALIZADO':
                SalvaCheckUsuario(rowId, isChecked, 'STATUS_FINALIZADO')
                break;

            default:
                console.log('Status não reconhecido:', statusType);
        }

    }

    function DeletarEmailUsuario(idrow) {
        api.api.post('/', { action: 'DeletarEmailUsuario', idemail: idrow }).then(response => {
            if (response.data) {
                BuscaListaEmails()
                toast.success('E-mail deletado!')
                return false
            }
            toast.error('Erro ao deletar!')
        }).catch(error => {
            console.error('Erro:', error);
        })
    }

    function SalvaCheckUsuario(idrow, check, status) {
        api.api.post('/', { action: 'SalvaStatusUsuario', idemail: idrow, checked: check, processostatus: status }).then(response => {
            if (response.data) {
                toast.success('Check alterado!')
                BuscaListaEmails()
                return false
            }
            toast.error('Erro ao atribuir check!')
        }).catch(error => {
            console.error('Erro:', error);
        })
    }

    function BuscaListaEmails() {
        api.api.post('/', { action: 'BuscaListaEmails' }).then(response => {
            setListaEmails(response.data.data)
        }).catch(error => {
            console.error('Erro:', error);
        })
    }

    function BuscaLimitesTempoStatus() {

        api.api.post('/', { action: 'BuscaLimiteTempo', }).then(response => {
            const dadosbanco = response.data.data
            setStatusEspera(dadosbanco[0].STATUS_ESPERA)
            setStatusCarregando(dadosbanco[0].STATUS_CARREGANDO)
            setStatusCarregado(dadosbanco[0].STATUS_CARREGADO)

        }).catch(error => {
            console.error('Erro:', error);
        })
    }

    function SalvaLimiteTempoStatus() {

        api.api.post('/', { action: 'SalvaLimiteTempoStatus', statusespera: StatusEspera, statuscarregando: StatusCarregando, statuscarregado: StatusCarregado }).then(response => {
            if (response.data) {
                setIntervalos(false)
                toast.success('Limite por status salvo!')
                return false
            }

            toast.error('Erro ao salvar limite!')
        }).catch(error => {
            console.error('Erro:', error);
        })
    }

    function SeparaToSendApexcharts(response, resultado) {
        const ordem = ["STATUS_ESPERA", "STATUS_CARREGANDO", "STATUS_CARREGADO", "STATUS_FINALIZADO"]

        const dados = OrganizaListaPorData(response.data.data)
        const gerarnoNovasDatas = gerarDatasEntre(resultado.inicial, resultado.final)

        const options = {
            'categories': gerarnoNovasDatas
        }

        const series = [
            { name: 'Intervalo 1', data: [] },
            { name: 'Intervalo 2', data: [] },
            { name: 'Intervalo 3', data: [] },
        ]

        for (let i = 0; i < gerarnoNovasDatas.length; i++) {

            let validador = false
            let intervalo1 = 0
            let intervalo2 = 0
            let intervalo3 = 0

            for (let j = 0; j < dados.length; j++) {
                if (CompararDatas(dados[j][0]['STATUS_ESPERA'], gerarnoNovasDatas[i])) {

                    dados[j].forEach(item => {
                        const verificaIgual = CompararDatas(item['STATUS_ESPERA'], gerarnoNovasDatas[i])
                        if (verificaIgual) {
                            for (let j = 0; j < ordem.length - 1; j++) {
                                const inicio = ordem[j]
                                const fim = ordem[j + 1]
                                const somaIntervalos = diffHorasSegundos(item[inicio], item[fim])

                                if (j === 0) intervalo1 += somaIntervalos
                                if (j === 1) intervalo2 += somaIntervalos
                                if (j === 2) intervalo3 += somaIntervalos
                            }
                        }
                        validador = true
                    })

                    series[0].data.push(intervalo1 / dados[j].length)
                    series[1].data.push(intervalo2 / dados[j].length)
                    series[2].data.push(intervalo3 / dados[j].length)
                }
            }

            if (!validador) {
                series[0].data.push(intervalo1)
                series[1].data.push(intervalo2)
                series[2].data.push(intervalo3)
            }
        }

        const sendApexCharts = {
            'series': series,
            'options': options
        }

        setInformarTempomedio(true)
        setdadosPesquisa(sendApexCharts)
    }

    return (
        <>
            <Container disableGutters maxWidth={false} sx={{ width: '100vw', height: '100vh', p: 2, position: 'absolute', top: 0 }}>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ marginTop: 2 }} style={{ backgroundColor: 'white', width: '100%', borderRadius: 4 }}>

                    <Grid item xs={4} sx={{ borderRadius: 1, p: 2, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Box component="img" sx={{ height: 80, width: 350, maxHeight: { xs: 233, md: 167 }, maxWidth: { xs: 350, md: 250 } }} alt="Logo da empresa" src={logo} />
                    </Grid>

                    <Grid item xs={8} sx={{ borderRadius: 1, p: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                                <DemoContainer components={['DatePicker', 'DatePicker']}>
                                    <DatePicker label="Data inicial" size="small" format="DD/MM/YYYY" value={datainicial} onChange={handleChangeDataInicial} />
                                    <DatePicker label="Data final" size="small" format="DD/MM/YYYY" value={datafinal} onChange={handleChangeDataFInal} />
                                </DemoContainer>
                            </LocalizationProvider>
                        </Box>

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, minWidth: '200px' }}>
                            <Button variant="contained" color="success" size="small" onClick={() => PesquisarDados(1)}>Pesquisar</Button>
                            <Button variant="contained" color="warning" size="small" onClick={() => { BuscaListaEmails(); setOpen(true); }}>E-mails</Button>

                            <Button variant="contained" color="secondary" size="small" onClick={() => PesquisarDados(2)}>Excel</Button>
                            <Button variant="contained" color="info" size="small" onClick={() => { BuscaLimitesTempoStatus(); setIntervalos(true) }}>Intervalos</Button>
                        </Box>
                    </Grid>

                </Grid>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ marginTop: 0.2 }} style={{ backgroundColor: 'white', with: '100%', borderRadius: 4 }}>
                    {InformarTempomedio && <ApexChart datas={dadosPesquisa} />}
                    {gerar && <GerarExcel dados={EnviarGerarExcel} />}
                </Grid>

                <Modal aria-labelledby="transition-modal-title" aria-describedby="transition-modal-description" open={open} onClose={handleClose} closeAfterTransition slots={{ backdrop: Backdrop }} slotProps={{ backdrop: { timeout: 500 } }}>
                    <Fade in={open}>
                        <Box sx={style}>
                            <Typography id="transition-modal-title" variant="h5" component="h2" style={{ fontWeight: 'bold', textAlign: 'center' }}>
                                Definição de E-mail
                                <form onSubmit={handleSubmit} id="subscription-form">
                                    <TextField autoFocus required margin="dense" id="name" name="email" value={email} onChange={handleChangeEmail} label="Endereço E-mail" type="email" fullWidth variant="standard" />
                                </form>
                            </Typography>
                            <Typography id="transition-modal-description" sx={{ mt: 2, textAlign: 'center', fontWeight: 'bold' }}>
                                Informa e-mails para cada intervalo
                            </Typography>
                            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                                    <Table stickyHeader aria-label="sticky table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align='center'>E-mail</TableCell>
                                                <TableCell align='center'>Status espera</TableCell>
                                                <TableCell align='center'>Status carregando</TableCell>
                                                <TableCell align='center'>Status carregado</TableCell>
                                                <TableCell align='center'>Exclusão</TableCell>
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {ListaEmails.map((row) =>
                                                <TableRow key={row.IDEMAIL} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                    <TableCell align="center">{row.EMAIL}</TableCell>
                                                    <TableCell align="center">
                                                        <FormControlLabel sx={{ mt: 1 }} control={<Switch checked={parseInt(row.STATUS_ESPERA) === 1} onChange={(e) => handleSwitchChange(row.IDEMAIL, 'STATUS_ESPERA', e)} label="Full width" />}></FormControlLabel>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <FormControlLabel sx={{ mt: 1 }} control={<Switch checked={parseInt(row.STATUS_CARREGANDO) === 1} onChange={(e) => handleSwitchChange(row.IDEMAIL, 'STATUS_CARREGANDO', e)} label="Full width" />}></FormControlLabel>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <FormControlLabel sx={{ mt: 1 }} control={<Switch checked={parseInt(row.STATUS_CARREGADO) === 1} onChange={(e) => handleSwitchChange(row.IDEMAIL, 'STATUS_CARREGADO', e)} label="Full width" />}></FormControlLabel>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Button variant="contained" color="error" sx={{ minWidth: 30, px: 1 }} size="small" onClick={() => DeletarEmailUsuario(row.IDEMAIL)}> <DeleteIcon fontSize="small" /></Button>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>

                                    </Table>

                                </TableContainer>
                            </Box>
                        </Box>
                    </Fade>
                </Modal>

                <Modal aria-labelledby="transition-modal-title" aria-describedby="transition-modal-description" open={openIntervalos} onClose={handleCloseIntervalos} closeAfterTransition slots={{ backdrop: Backdrop }} slotProps={{ backdrop: { timeout: 500 } }}>
                    <Fade in={openIntervalos}>
                        <Box sx={styleIntervalo}>
                            <Typography id="transition-modal-title" variant="h5" component="h2" style={{ fontWeight: 'bold', textAlign: 'center' }}>
                                Definição de intervalos
                            </Typography>
                            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                <TextField id="outlined-basic" label="Status espera" variant="outlined" type='text' inputProps={{ maxLength: 3, style: { textAlign: 'center' } }} value={StatusEspera} onChange={handleEspera} />
                                <TextField id="outlined-basic" label="Status carregando" variant="outlined" type='text' inputProps={{ maxLength: 3, style: { textAlign: 'center' } }} value={StatusCarregando} onChange={handleCarregando} />
                                <TextField id="outlined-basic" label="Status carregado" variant="outlined" type='text' inputProps={{ maxLength: 3, style: { textAlign: 'center' } }} value={StatusCarregado} onChange={handleCarregado} />
                            </Box>

                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', py: 2 }}>
                                <Button variant="contained" color="success" sx={{ minWidth: 30, px: 1 }} size="small" onClick={SalvaLimiteTempoStatus}> Salvar</Button>
                            </Box>

                        </Box>
                    </Fade>
                </Modal>

                <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
                {OpenLoading
                    &&
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                        <CircularProgress />
                    </Box>
                }
            </Container>
        </>
    )
}

const style = {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1100,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    color: 'black',
    borderRadius: 4
}

const styleIntervalo = {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 650,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    color: 'black',
    borderRadius: 4
}


export default TelaPrincipal
