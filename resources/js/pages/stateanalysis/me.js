$(function() {
    // @private
    // singleLineChart
    var chartFuelEfficiency = {
        init: function (params) {
            var myChart = echarts.init(document.getElementById("chartFuelEfficiency"));
            myChart.setOption(this.option(params), true);
        },

        option: function (params) {
            return {
                grid: {
                    top: 40,
                    left: '8%',
                    right: '4%',
                    bottom: 50,
                },
                tooltip: {
                },
                xAxis: {
                    name: params.nameX + '(' + params.unitX + ')',
                    type: 'category',
                    boundaryGap: false,
                    data: params.category,
                    nameGap: -35,
                    nameTextStyle: {
                        color: '#ccc',
                        padding: [65, 0, 0, 0],
                    },
                    axisLabel: {
                        color: '#666',
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#666',
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#666',
                        }
                    }
                },
                yAxis: {
                    name: params.nameY + '(' + params.unitY + ')',
                    type: 'value',
                    boundaryGap: false,
                    min: params.valueMin,
                    max: params.valueMax,
                    splitNumber: params.valueSplit,
                    nameTextStyle: {
                        padding: [0, 0, 0, 65],
                        color: '#ccc',
                    },
                    axisLabel: {
                        formatter: params.valueFormatter,
                        color: '#666',
                    },
                    axisTick: {
                        show: false,
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#666',
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: '#666',
                        }
                    }
                },
                series: [{
                    name: params.name,
                    type: 'line',
                    data: params.value,
                    symbol: 'circle',
                    symbolSize: 1,
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color: '#ffb239',
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: '#ffb239',
                            opacity: 0.25,
                        },
                    }, // areaStyle
                }], // series
            };
        }, // option
    };

    // @public
    // singleLineChart
    chartFuelEfficiency.init({
        name: 'Fuel Efficiency',
        nameX: 'MRC',
        nameY: 'Fuel Efficiency',
        unitX: '%',
        unitY: 'g/Kwh',
        value: [190, 180, 180, 190, 200, 210, 230, 240],
        valueMin: 170,
        valueMax: 250,
        valueSplit: 6,
        valueFormatter: '{value}',
        category: ['50', '', '70', '', '90', '', '110', '120'],
    });
});