import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import ApexChart2 from './ApexCharts2';
import ApexCharts3 from './ApexCharts3';
import api from '../service/service';
import { diffHorasSegundos, UppercaseWord, OrganizaPorLocalCarregamento, EncontraLocalCarregamento } from '../helpers/helpers';

const ApexChart = ({ datas }) => {

    const [DadosGrafico2, SetDadosGrafico2] = React.useState([])
    const [DadosGrafico3, SetDadosGrafico3] = React.useState([])

    const handleBarClick = (event, chartContext, config) => {
        const { dataPointIndex, seriesIndex } = config
        const dataClicada = chartContext.w.config.xaxis.categories[dataPointIndex]

        const nivelClicado = chartContext.w.config.series[seriesIndex]
        // const nomeDoNivel = nivelClicado.name
        // const valorClicado = nivelClicado.data[dataPointIndex]

        // console.log("📅 Data:", dataClicada)
        // console.log("🎯 Nível/Série:", nomeDoNivel)
        // console.log("📊 Valor:", valorClicado)
        // console.log("🔢 Índice da série:", seriesIndex)
        BuscaDadosExpecificos(dataClicada, seriesIndex);
    }

    const [state, setState] = useState({
        series: [],

        options: {
            chart: {
                type: 'bar',
                height: 350,
                toolbar: { show: false },
                zoom: { enabled: false },
                events: {
                    dataPointSelection: handleBarClick
                },
            },
            colors: ['#3B82F6', '#10B981', '#F59E0B'],
            tooltip: {
                enabled: false
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    borderRadius: 10,
                    borderRadiusApplication: 'end',
                    borderRadiusWhenStacked: 'last',
                    dataLabels: {
                        position: 'top',
                        total: {
                            enabled: false
                        }
                    }
                }
            },
            dataLabels: {
                enabled: true,
                style: {
                    fontSize: '14px',
                    fontWeight: 'bold',
                    colors: ['#111111']
                },
                offsetY: -20,
                formatter: function (val) {
                    if (val > 0) {
                        return val
                    }
                },
                dropShadow: {
                    enabled: true,
                    top: 1,
                    left: 1,
                    blur: 1,
                    opacity: 0.5
                }
            },
            title: {
                text: 'TEMPO MÉDIO POR STATUS',
                align: 'center'
            },
            xaxis: {
                type: 'datetime',
                categories: [],
                labels: {
                    formatter: function (value) {
                        if (value < 11) return ''

                        const data = new Date(value)
                        if (isNaN(data.getTime())) return ''
                        const dia = String(data.getDate()).padStart(2, '0')
                        const mes = String(data.getMonth() + 1).padStart(2, '0')
                        const ano = data.getFullYear()
                        return `${dia}/${mes}/${ano}`
                    }
                }
            },
            legend: {
                position: 'right',
                offsetY: 40
            },
            fill: {
                opacity: 1
            }
        }
    })

    function BuscaDadosExpecificos(dataselecionada, nomeDoNivel) {

        const [day, month, year] = dataselecionada.replace(" GMT", "").split('/')
        const dataAmericana = `${year}-${day}-${month}`

        api.api.post('/', { action: 'SelecionaDeterminadoStatus', data: dataAmericana, intervalo: nomeDoNivel }).then(response => {
            AplicaLogicaGraficos(response.data.data)
        }).catch(error => {
            console.error('Erro:', error);
        })
    }

    function AplicaLogicaGraficos(listaPlaca) {

        const ordem = ["STATUS_ESPERA", "STATUS_CARREGANDO", "STATUS_CARREGADO", "STATUS_FINALIZADO"]

        const seriesGraf2 = [
            { name: 'Intervalo 1', data: [] },
            { name: 'Intervalo 2', data: [] },
            { name: 'Intervalo 3', data: [] },
        ]

        const optionsGraf2 = {
            'categories': []
        }

        for (let i = 0; i < listaPlaca.length; i++) {

            let intervalo1 = 0
            let intervalo2 = 0
            let intervalo3 = 0

            for (let j = 0; j < ordem.length - 1; j++) {
                const inicio = ordem[j]
                const fim = ordem[j + 1]
                const somaIntervalos = diffHorasSegundos(listaPlaca[i][inicio], listaPlaca[i][fim])

                if (j === 0) intervalo1 += somaIntervalos
                if (j === 1) intervalo2 += somaIntervalos
                if (j === 2) intervalo3 += somaIntervalos

            }

            optionsGraf2.categories.push(UppercaseWord(listaPlaca[i]['PLACA']))
            seriesGraf2[0].data.push(intervalo1)
            seriesGraf2[1].data.push(intervalo2)
            seriesGraf2[2].data.push(intervalo3)

        }

        const sendApexCharts2 = {
            'series': seriesGraf2,
            'options': optionsGraf2
        }

        // ------------------------------------------------------- \\

        const OrganizadoLocais = OrganizaPorLocalCarregamento(listaPlaca)

        const seriesGraf3 = [
            { name: 'Intervalo Carregamento', data: [] },
        ]

        const optionsGraf3 = {
            'categories': []
        }

        for (let i = 0; i < OrganizadoLocais.length; i++) {

            for (let j = 0; j < OrganizadoLocais[i].length; j++) {

                let somaIntervalo2 = 0

                for (let k = 0; k < OrganizadoLocais[i][j].length; k++) {

                    let intervalo2 = 0

                    for (let l = 0; l < ordem.length - 1; l++) {
                        const inicio = ordem[l]
                        const fim = ordem[l + 1]
                        const somaIntervalos = diffHorasSegundos(OrganizadoLocais[i][j][k][inicio], OrganizadoLocais[i][j][k][fim])

                        if (l === 1) intervalo2 += somaIntervalos

                    }

                    somaIntervalo2 += intervalo2
                }
                optionsGraf3.categories.push(EncontraLocalCarregamento(parseInt(OrganizadoLocais[i][j][0]['TIPO_CARREGAMENTO']), parseInt(OrganizadoLocais[i][j][0]['LOCAL_CARREGAMENTO'])))
                seriesGraf3[0].data.push(somaIntervalo2)


            }
        }

        const sendApexCharts3 = {
            'series': seriesGraf3,
            'options': optionsGraf3
        }

        SetDadosGrafico2(sendApexCharts2)
        SetDadosGrafico3(sendApexCharts3)
    }

    useEffect(() => {
        if (!datas) return;

        const categories = (datas.options?.categories || []).map(date => {
            if (typeof date === 'string') {
                return date.split(' ')[0]
            }
            return date
        })

        setState(prev => ({
            ...prev,
            series: datas.series || [],
            options: {
                ...prev.options,
                xaxis: {
                    ...prev.options.xaxis,
                    categories,
                    type: 'category'
                }
            }
        }))
    }, [datas])

    return (
        <>
            <div style={{ backgroundColor: 'white', borderRadius: 4, padding: 0, width: '100%' }}>
                <ReactApexChart options={state.options} series={state.series} type="bar" height={350} />
                <ApexChart2 dados={DadosGrafico2} />
                <ApexCharts3 dados={DadosGrafico3} />
            </div>
        </>

    );
};

export default ApexChart;