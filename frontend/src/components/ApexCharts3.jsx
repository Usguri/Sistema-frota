import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { AjusteMinutosEmHoraMin } from '../helpers/helpers';

const ApexChart3 = ({ dados }) => {


    const [showApexcharts, setshowApexcharts] = React.useState(false)
    const [state, setState] = React.useState({

        series: [],
        options: {
            chart: {
                type: 'bar',
                height: 350,
                stacked: true,
                toolbar: { show: false },
                zoom: { enabled: false }
            },
            colors: ['#10b981'],
            tooltip: {
                enabled: true,
                theme: 'dark',
                style: {
                    fontSize: '12px',
                    fontFamily: undefined,
                    backgroundColor: '#000000',
                    color: '#ffffff'
                },
                y: {
                    formatter: function (value) {
                        return AjusteMinutosEmHoraMin(value)
                    }
                }
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                    borderRadius: 4,
                    dataLabels: {
                        total: {
                            enabled: true,
                            offsetX: 0,
                            style: {
                                fontSize: '13px',
                                fontWeight: 900
                            },
                            formatter: function (val) {
                                const totalMinutos = val;
                                const horas = Math.floor(totalMinutos / 60);
                                const minutos = totalMinutos % 60;

                                if (horas === 0) {
                                    return `${minutos}min`;
                                } else if (minutos === 0) {
                                    return `${horas}h`;
                                } else {
                                    return `${horas}h ${minutos}m`;
                                }
                            }
                        }
                    }
                },
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                width: 1,
                colors: ['#fff']
            },
            title: {
                text: 'TEMPO MÉDIO POR LOCAL DE CARREGAMENTO',
                align: 'center'
            },
            xaxis: {
                categories: [],
                labels: {
                    formatter: function (val) {
                        return val + "m"
                    },
                    style: {
                        fontWeight: 'bold'
                    }
                }
            },
            yaxis: {
                title: {
                    text: undefined
                },
            },
            fill: {
                opacity: 1
            },
            legend: {
                position: 'top',
                horizontalAlign: 'left',
                offsetX: 40
            }
        }

    });

    useEffect(() => {

        if (!dados || !dados.series) {
            setshowApexcharts(false)
            return;
        }

        const categories = dados.options.categories


        setState(prev => ({
            ...prev,
            series: dados.series || [],
            options: {
                ...prev.options,
                xaxis: {
                    ...prev.options.xaxis,
                    categories
                }
            }
        }))

        setshowApexcharts(true)

    }, [dados])

    return (
        <>
            {showApexcharts && (
                <div style={{ backgroundColor: 'white', borderRadius: 4, padding: 0, width: '100%', margin: 0 }}>
                    <ReactApexChart options={state.options} series={state.series} type="bar" height={350} />
                </div>
            )}

        </>

    )

}
export default ApexChart3;