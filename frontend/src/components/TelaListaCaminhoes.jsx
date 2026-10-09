
import * as React from 'react';
import Grid from '@mui/material/Grid';
import { Container, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import api from '../service/service';
import { StatusCarregamentoCaminhao, formatarDataHoraSistema, UppercaseWord } from '../helpers/helpers';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import buzina from '../helpers/buzina.mp3'


function TelaListaCaminhoes() {

    const [rows, setRows] = React.useState([])
    const [openModalAlert, setOpen] = React.useState(false)
    const handleClose = () => setOpen(false)
    const [placaCaminhao, setplacaCaminhao] = React.useState('')
    const [localCarregamento, setlocalCarregamento] = React.useState('')

    const gravaDadosTempRef = React.useRef('');
    const [somTocando, setSomTocando] = React.useState(true);



    function BuscaListaCarregamento() {
        api.api.post('/', { action: 'BuscaDadosTabelaCarregamento' }).then(response => {

            const filtrar = response.data.data.filter(e => e.STATUSCARREGAMENTO == 2)
            const ordenarDathora = OrdenarDataHora(filtrar)
            const separaSeisPlacas = ordenarDathora.slice(0, 6)

            setRows(separaSeisPlacas)
        }).catch(error => {
            console.error('Erro:', error);
        })
    }

    function BuscaPlacaParaCarregar() {

        api.api.post('/', { action: 'BuscarPlacaCarregarAgora' }).then(response => {

            const novoDatahora = response.data.datahora

            if (novoDatahora != gravaDadosTempRef.current) {
                gravaDadosTempRef.current = novoDatahora

                setOpen(true)
                setlocalCarregamento(response.data.placa)
                setplacaCaminhao(response.data.doca)
                setTimeout(() => setOpen(false), 50000)
                tocarSom()
            }

        }).catch(error => {
            console.error('Erro:', error)
        })

    }

    function tocarSom() {

        if (somTocando) {
            console.log('Tocando buzina por 50 segundos...')
            setSomTocando(false)

            let audio = new Audio(buzina)
            audio.loop = true

            audio.play().catch(err => {
                console.warn('Falha ao tocar o som:', err);
            });

            setTimeout(() => {
                audio.pause();
                audio.currentTime = 0;
                setSomTocando(false)
                console.log('Som parado após 50 segundos');
            }, 50000)
        }
    }

    function OrdenarDataHora(lista) {
        return lista.sort((a, b) => new Date(b.datahora) - new Date(a.datahora))
    }

    React.useEffect(() => {
        BuscaListaCarregamento();
        setInterval(BuscaPlacaParaCarregar, 60000)

        const desbloqueio = () => {
            const tempAudio = new Audio("../buzina.mp3");
            tempAudio.play().then(() => {
                tempAudio.pause();
                tempAudio.currentTime = 0;
            }).catch(() => { });
            document.removeEventListener("click", desbloqueio)
        }

        document.addEventListener("click", desbloqueio, { once: true })

    }, [])

    return (
        <>
            <Container disableGutters maxWidth={false} sx={{ width: '100vw', height: '100vh', p: 2, position: 'absolute', top: 0 }}>

                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ marginTop: 0.2 }} style={{ backgroundColor: 'blue', with: '100%', borderRadius: 4 }}>
                    <TableContainer component={Paper} sx={{ maxHeight: 750 }}>
                        <Table stickyHeader aria-label="sticky table" sx={{ tableLayout: 'fixed', '& .MuiTableCell-root': { padding: '8px 4px' } }}>

                            <TableHead>
                                <TableRow>
                                    <TableCell align='center'>Placa</TableCell>
                                    <TableCell align='center'>Local carregamento</TableCell>
                                    <TableCell align='center'>Data/Hora</TableCell>
                                    <TableCell align='center'>Status</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row.PLACA} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell align="center" style={{ fontWeight: 'bold', fontSize: 50 }}>{UppercaseWord(row.PLACA)}</TableCell>
                                        <TableCell align="center" style={{ fontWeight: 'bold', fontSize: 40 }}>{row.LOCALCARREGAMENTO ? UppercaseWord(row.LOCALCARREGAMENTO) : 'Aguardando'}</TableCell>
                                        <TableCell align="center" style={{ fontWeight: 'bold', fontSize: 35 }}>{formatarDataHoraSistema(row.DATAHORA)}</TableCell>
                                        <TableCell align="center" style={{ fontWeight: 'bold', fontSize: 35 }}>{StatusCarregamentoCaminhao(parseInt(row.STATUSCARREGAMENTO))}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>

                        </Table>
                    </TableContainer>

                    <Modal aria-labelledby="transition-modal-title" aria-describedby="transition-modal-description" open={openModalAlert} onClose={handleClose} closeAfterTransition slots={{ backdrop: Backdrop }} slotProps={{ backdrop: { timeout: 500 } }}>
                        <Fade in={openModalAlert}>
                            <Box sx={style}>
                                <Typography id="transition-modal-title" variant="h5" component="h2" style={{ fontWeight: 'bold', fontSize: 65 }}>
                                    <Box component="span" sx={{ fontWeight: 'bold' }}>Placa: {placaCaminhao}</Box>
                                </Typography>
                                <Typography id="transition-modal-title" variant="h5" component="h2" style={{ fontWeight: 'bold', fontSize: 65 }}>
                                    <Box component="span" sx={{ fontWeight: 'bold' }}>Dirija-se à: {localCarregamento}</Box>
                                </Typography>
                            </Box>
                        </Fade>
                    </Modal>

                </Grid>

            </Container>
        </>
    )
}

const style = {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    color: 'white',
    borderRadius: 4,
    backgroundColor: 'red'
}

export default TelaListaCaminhoes
