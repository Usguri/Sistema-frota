import React, { useEffect } from 'react';
import { Page, Text, View, Document, StyleSheet, pdf, Image } from '@react-pdf/renderer';
import logoEmpresa from '../assets/costa.png';

const GerarRomaneio = ({ dados }) => {
    const styles = StyleSheet.create({
        page: {
            padding: 5,
        },
        content: {
            padding: 5,
            flexDirection: 'column',
            '@media min-width: 00': {
                flexDirection: 'row',
            },
        },
        LineRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%'
        },
        hr: {
            borderBottomWidth: 1,
            borderBottomColor: '#000',
            marginVertical: 5,
            marginTop: 10
        }
    });

    useEffect(() => {
        let fixarvaluesromaneio = dados[0]
        const gerarPDF = async () => {
            const MyDocument = (
                <Document>
                    <Page size="A4" style={styles.page}>

                        <View style={[styles.LineRow, { marginTop: 10 }]}>
                            <Text style={{ paddingLeft: 30, marginTop: 30, fontSize: 12 }}>Romaneio - N° 12312</Text>
                            <View style={{ flexDirection: 'row', paddingRight: 30 }}>
                                <Image style={{ width: 100, height: 40 }} src={logoEmpresa} />
                            </View>
                        </View>

                        <View style={[styles.hr, { marginRight: 20, marginLeft: 20 }]}></View>

                        <View style={[styles.LineRow, { marginTop: 10 }]}>
                            <View style={{ width: '70%', marginLeft: 30, fontSize: 12 }}>
                                <Text>Empresa: Sementes Costa Beber LTDA</Text>
                                <Text>Endereço: AC Linha Pontao Dos Buenos, 1       Interior</Text>
                                <Text>Cidade: Condor - RS                                          98290000</Text>
                            </View>
                            <View style={{ width: '45%', fontSize: 12, marginLeft: 10, }}>
                                <Text>CNPJ: 20.926.486/0001/09</Text>
                                <Text>IE: 1860010307</Text>
                                <Text>Fone: (55) 999876760 </Text>
                            </View>
                        </View>
                        <View style={[styles.LineRow, { marginTop: 5 }]}>
                            <View style={{ width: '70%', marginLeft: 30, fontSize: 12 }}>
                                <Text>Cliente: {fixarvaluesromaneio.Nome_Razao_Social}</Text>
                                <Text>Endereço: {fixarvaluesromaneio.Endereco}</Text>
                                <Text>Insc. Estad: {fixarvaluesromaneio.Inscricao_Estadual}</Text>
                            </View>
                            <View style={{ width: '45%', fontSize: 12, marginLeft: 10, }}>
                                <Text>Cidade: {fixarvaluesromaneio.Cidade + ' - ' + fixarvaluesromaneio.Estado}</Text>
                                <Text>CPF/CNPJ: {fixarvaluesromaneio.CNPJ_CPF}</Text>
                            </View>
                        </View>

                        <View style={[styles.hr, { borderStyle: 'dashed', marginRight: 20, marginLeft: 20 }]}></View>

                        <View style={[styles.LineRow, { marginTop: 5, fontWeight: 'bold', fontSize: 12, marginLeft: 30, }]}>
                            <Text>Produto: {fixarvaluesromaneio.Descricao_do_Produto}</Text>
                        </View>
                        <View style={[styles.LineRow, { marginTop: 0, fontWeight: 'bold', fontSize: 12, marginLeft: 30, }]}>
                            <Text>Safra: 2222/1232</Text>
                        </View>

                        <View style={[styles.hr, { borderStyle: 'dashed', marginRight: 20, marginLeft: 20 }]}></View>

                        <View style={[styles.LineRow, { marginTop: 5 }]}>
                            <View style={{ width: '70%', marginLeft: 30, fontSize: 12 }}>
                                <Text>Peso total..: 1111</Text>
                                <Text>Tara: 0000</Text>
                                <Text>Peso Bruto..: 11111</Text>
                            </View>
                            <View style={{ width: '45%', fontSize: 12, marginLeft: 10, }}>
                                <Text>Motorista: {fixarvaluesromaneio.Motorista}</Text>
                                <Text>Placa: {fixarvaluesromaneio.Placa_de_Veiculo}</Text>
                            </View>
                        </View>

                        <View style={[styles.LineRow, { marginTop: 30 }]}>
                            <View style={{ width: '70%', marginLeft: 30, fontSize: 12 }}>
                                <Text>Peso Líq..: 0000000</Text>
                            </View>
                        </View>

                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                            <View style={{ flexDirection: 'row', width: '60%', justifyContent: 'space-between', marginBottom: 20 }}>
                                <View style={{ width: '45%' }}>
                                    <View style={{ borderBottomWidth: 1, borderBottomColor: '#000', marginBottom: 2 }} />
                                    <Text style={{ fontSize: 10, textAlign: 'center' }}>Funcionário</Text>
                                </View>

                                <View style={{ width: '45%' }}>
                                    <View style={{ borderBottomWidth: 1, borderBottomColor: '#000', marginBottom: 2 }} />
                                    <Text style={{ fontSize: 10, textAlign: 'center' }}>Gerente da Unidade</Text>
                                </View>
                            </View>

                            <View style={{ width: '60%', marginTop: 10 }}>
                                <View style={{ borderBottomWidth: 1, borderBottomColor: '#000', marginBottom: 2 }} />
                                <Text style={{ fontSize: 10, textAlign: 'center' }}>Cliente</Text>
                            </View>
                        </View>



                    </Page>
                </Document>
            );

            // Gera o blob do PDF
            const asPdf = pdf();
            asPdf.updateContainer(MyDocument);
            const blob = await asPdf.toBlob();

            // Baixa automaticamente
            // const url = URL.createObjectURL(blob);
            // window.open(url, "_blank");

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'romaneio.pdf';
            a.click();
            URL.revokeObjectURL(url);
        };

        if (dados && dados.length > 0) {
            gerarPDF()
        }
    }, [dados]);

    return null; // não precisa renderizar nada
};

export default GerarRomaneio;
