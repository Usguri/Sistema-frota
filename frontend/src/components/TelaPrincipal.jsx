
import * as React from 'react';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Container, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import logo from '../assets/costa.svg'
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import { StatusCarregamentoCaminhao, AlterarColorButon, formatarDataHoraSistema, TipoCarreGamentoCaminhao, UppercaseWord, LocalCarregamentoDoca } from '../helpers/helpers';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apis from '../service/service';
import GerarRomaneio from './GerarRomaneio'


function TelaPrincipal() {

    const [tipoCarregamento, setTipoCarregamento] = React.useState('')
    const [placa, setPlaca] = React.useState('')
    const [rows, setRows] = React.useState([])

    const [open, setOpen] = React.useState(false)
    const handleClose = () => setOpen(false)
    const [placaCaminhao, setplacaCaminhao] = React.useState('')
    const [ListaLocaisCarregamento, setListaLocaisCarregamento] = React.useState([])
    const [SelectLocalCarregamento, setSelectLocalCarregamento] = React.useState('')
    let [IdPlacaCarregamento, setIdPlacaCarregamento] = React.useState('')

    const [EnviarGerarRomaneio, setEnviarGerarRomaneio] = React.useState([])
    const [validarRomaneio, setvalidarRomaneio] = React.useState(false)
    const [OpenRomaneio, setOpenRomaneio] = React.useState(false)
    const handleClosesetOpenRomaneio = () => setOpenRomaneio(false)
    const [NumeroNfe, setNumeroNfe] = React.useState('')
    const [PlacaNfe, setPlacaNfe] = React.useState('')
    const [motorista, setmotorista] = React.useState('')


    let handleChangeSelect = (event) => {
        setTipoCarregamento(event.target.value)
    }

    let handleChangeInputt = (event) => {
        setPlaca(event.target.value)
    }

    let handleNumeroNfe = (event) => {
        setNumeroNfe(event.target.value)
    }

    let handleMotorista = (event) => {
        setmotorista(event.target.value)
    }

    React.useEffect(() => {
        BuscaDadosCarregamento()
    }, [])

    function CallCaminhao(dados) {
        setplacaCaminhao(dados.PLACA)
        setOpen(true)
        setListaLocaisCarregamento(LocalCarregamentoDoca(dados.TIPO_DE_CARREGAMENTO))
        setIdPlacaCarregamento(dados.IDCHAMARCAMINHAO)
    }

    let handleChangeSelectSelectLocal = (event) => {
        setSelectLocalCarregamento(event.target.value)
    }

    function BuscaDadosCarregamento() {
        apis.api.post('/', { action: 'BuscaDadosTabelaCarregamento' }).then(response => {
            setRows(response.data.data)
        }).catch(error => {
            console.error('Erro:', error);
        })
    }

    function SalvarDadosCarregamnto() {

        apis.api.post('/', { action: 'SalvaPlacaCarregamento', placa: placa, statuscarregamento: 1, tipocarregamento: tipoCarregamento }).then(response => {
            BuscaDadosCarregamento();
            toast.success("Caminhão salvo para carregamento!")
        }).catch(error => {
            console.error('Erro:', error);
        })

        setPlaca('')
        setTipoCarregamento('')
    }

    function FinalizarCarregamento(dados) {

        let urlpost = dados.STATUSCARREGAMENTO == 2 ? 'FinalizaCarregamento' : 'DeletarCaminhao'

        apis.api.post('/', { action: urlpost, idcaminhao: dados.IDCHAMARCAMINHAO }).then(response => {
            BuscaDadosCarregamento()

            if (dados.STATUSCARREGAMENTO == 2) {
                toast.success("Carregamento finalizado!")
            } else {
                toast.success("Caminhão deletado da lista!")
            }

        }).catch(error => {
            toast.error("Erro ao salvar local de carregamento!")
            console.error('Erro:', error);
        });
    }

    function SalvarLocalCarregamento() {

        apis.api.post('/', { action: 'InformarLocalCarregamentoDoca', id: IdPlacaCarregamento, doca: SelectLocalCarregamento }).then(response => {
            BuscaDadosCarregamento();
            toast.success("Local de carregamento salvo com sucesso!")
        }).catch(error => {
            toast.error("Erro ao salvar local de carregamento!")
            console.error('Erro:', error);
        });
        setIdPlacaCarregamento('')
        setSelectLocalCarregamento('')
        setOpen(false)
    }

    function BuscarDadosGerarRomaneio() {

        apis.apiNodejs.post('/busca_dados_sap', { serial: NumeroNfe }).then(response => {

            if (response.data.dados.length > 0) {
                response.data.dados[0]['Motorista'] = motorista
                setvalidarRomaneio(true)
                setOpenRomaneio(false)
                setEnviarGerarRomaneio(response.data.dados)
                return false
            }


            setNumeroNfe('')
            setPlacaNfe('')
            setmotorista('')

            toast.error('Não contém informação a respeito desta nota!')
        }).catch(error => {
            console.error('Erro:', error);
        })

        setvalidarRomaneio(false)
    }

    function PrintarDadosRomaneio(params) {
        setPlacaNfe(UppercaseWord(params.PLACA))
    }

    const style = {
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        color: 'black',
        borderRadius: 4
    }

    return (
        <>
            <Container disableGutters maxWidth={false} sx={{ width: '100vw', height: '100vh', p: 2, position: 'absolute', top: 0 }}>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ marginTop: 2 }} style={{ backgroundColor: 'white', with: '100%', borderRadius: 4 }}>

                    <Grid item sx={{ borderRadius: 1, p: 2, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', minWidth: 200 }}>
                        <Box component="img" sx={{ height: 80, width: 350, maxHeight: { xs: 233, md: 167 }, maxWidth: { xs: 350, md: 250 } }}
                            alt="Logo da empresa" src={logo}
                        />
                    </Grid>

                    <Grid item sx={{ borderRadius: 1, p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                        <Grid item sx={{ borderRadius: 1, alignItems: 'center', flexGrow: 1, order: 1 }}>
                            <TextField id="placa" label="BEE4R22" variant="outlined" size="small" style={{ float: 'right' }} value={placa} onChange={handleChangeInputt} inputProps={{ maxLength: 7 }} />
                        </Grid>
                        <Grid item sx={{ borderRadius: 1, justifyContent: 'flex-start', alignItems: 'center', flexGrow: 1, order: 2 }}>
                            <FormControl sx={{ m: 1, minWidth: 300 }} size="small">
                                <InputLabel id="demo-select-small-label">Tipo Caregamento</InputLabel>
                                <Select labelId="demo-select-small-label" id="demo-select-small" value={tipoCarregamento} label="Tipo Carregamento" onChange={handleChangeSelect}>
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    <MenuItem value="1">Sementes</MenuItem>
                                    <MenuItem value="2">Industria</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item sx={{ borderRadius: 1, justifyContent: 'flex-start', alignItems: 'center', flexGrow: 1, order: 3 }}>
                            <Button variant="contained" color="success" size="small" style={{ float: 'left', justifyContent: 'flex-start' }} onClick={SalvarDadosCarregamnto}>Salvar</Button>
                        </Grid>
                    </Grid>

                </Grid>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ marginTop: 0.2 }} style={{ backgroundColor: 'blue', with: '100%', borderRadius: 4 }}>
                    <TableContainer component={Paper} sx={{ maxHeight: 750 }}>
                        <Table stickyHeader aria-label="sticky table">

                            <TableHead>
                                <TableRow>
                                    <TableCell align='center'>Placa</TableCell>
                                    <TableCell align='center'>Status</TableCell>
                                    <TableCell align='center'>Local carregamento</TableCell>
                                    <TableCell align='center'>Carregamento</TableCell>
                                    <TableCell align='center'>Data/Hora</TableCell>
                                    <TableCell align='center'>Opções</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row.PLACA} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell align="center">{UppercaseWord(row.PLACA)}</TableCell>
                                        <TableCell align="center">{StatusCarregamentoCaminhao(parseInt(row.STATUSCARREGAMENTO))}</TableCell>
                                        <TableCell align="center">{row.LOCALCARREGAMENTO ? UppercaseWord(row.LOCALCARREGAMENTO) : 'Aguardando'}</TableCell>
                                        <TableCell align="center">{TipoCarreGamentoCaminhao(parseInt(row.TIPO_DE_CARREGAMENTO))}</TableCell>
                                        <TableCell align="center">{formatarDataHoraSistema(row.DATAHORA)}</TableCell>
                                        <TableCell align="center">
                                            <Button variant="contained" size="small" disabled={row.STATUSCARREGAMENTO == 1 || row.STATUSCARREGAMENTO == 2 ? '' : 'success'} onClick={() => CallCaminhao(row)}>Chamar</Button>
                                            <Button variant="contained" color={AlterarColorButon(row.STATUSCARREGAMENTO)} style={{ marginLeft: 1 }} size="small" disabled={row.STATUSCARREGAMENTO == 1 ? 'success' : ''} onClick={() => FinalizarCarregamento(row)}>
                                                Finalizar
                                            </Button>
                                            <Button variant="contained" color="warning" disabled={row.STATUSCARREGAMENTO == 3 ? '' : 'success'} style={{ marginLeft: 1 }} size="small" onClick={() => { PrintarDadosRomaneio(row); setOpenRomaneio(true) }}>
                                                Romaneio
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                <Modal aria-labelledby="transition-modal-title" aria-describedby="transition-modal-description" open={open} onClose={handleClose} closeAfterTransition slots={{ backdrop: Backdrop }} slotProps={{ backdrop: { timeout: 500 } }}>
                    <Fade in={open}>
                        <Box sx={style}>
                            <Typography id="transition-modal-title" variant="h5" component="h2" style={{ fontWeight: 'bold', textAlign: 'center' }}>
                                Informações do caminhão
                            </Typography>
                            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                                <Box component="span" sx={{ fontWeight: 'bold' }}>Placa: </Box> {placaCaminhao}
                            </Typography>
                            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography sx={{ fontWeight: 'bold' }}>
                                    Informe o local de carregamento:
                                </Typography>
                                <FormControl sx={{ minWidth: 300 }} size="small">
                                    <InputLabel id="demo-select-local-carregamento">Local de carregamento</InputLabel>
                                    <Select labelId="demo-select-local-carregamento" id="demo-select-small-local" value={SelectLocalCarregamento} label="Local de carregamento" onChange={handleChangeSelectSelectLocal}>
                                        <MenuItem value=""><em>Selecione uma opção</em></MenuItem>
                                        {ListaLocaisCarregamento.map((item, index) => (
                                            <MenuItem key={index} value={item.nome}>
                                                {item.nome || item.label || item}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>

                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', py: 2 }}>
                                <Button variant="contained" color="success" size="small" onClick={SalvarLocalCarregamento}>
                                    Confirmar
                                </Button>
                            </Box>

                        </Box>
                    </Fade>
                </Modal>

                <Modal aria-labelledby="transition-modal-title" aria-describedby="transition-modal-description" open={OpenRomaneio} onClose={handleClosesetOpenRomaneio} closeAfterTransition slots={{ backdrop: Backdrop }} slotProps={{ backdrop: { timeout: 500 } }}>
                    <Fade in={OpenRomaneio}>
                        <Box sx={style}>
                            <Typography id="transition-modal-title" variant="h5" component="h2" style={{ fontWeight: 'bold', textAlign: 'center' }}>
                                Informações do caminhão
                            </Typography>
                            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                                <Box component="span" sx={{ fontWeight: 'bold' }}>Placa: </Box> {PlacaNfe}
                            </Typography>

                            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography sx={{ fontWeight: 'bold', minWidth: 80 }}>
                                    Motorista:
                                </Typography>
                                <TextField
                                    id="motorista"
                                    label="Motorista"
                                    variant="outlined"
                                    size="small"
                                    value={motorista}
                                    onChange={handleMotorista}
                                    inputProps={{ maxLength: 50 }}
                                    fullWidth
                                />
                            </Box>

                            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography sx={{ fontWeight: 'bold', minWidth: 80 }}>
                                    N° NFE:
                                </Typography>
                                <TextField
                                    id="nfe"
                                    label="NFE"
                                    variant="outlined"
                                    size="small"
                                    value={NumeroNfe}
                                    onChange={handleNumeroNfe}
                                    inputProps={{ maxLength: 7 }}
                                    fullWidth
                                />
                            </Box>


                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', py: 2 }}>
                                <Button variant="contained" color="success" size="small" onClick={BuscarDadosGerarRomaneio}>
                                    Confirmar
                                </Button>
                            </Box>

                        </Box>
                    </Fade>
                </Modal>

                {validarRomaneio && <GerarRomaneio dados={EnviarGerarRomaneio} />}

                <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

            </Container>
        </>
    )
}

export default TelaPrincipal