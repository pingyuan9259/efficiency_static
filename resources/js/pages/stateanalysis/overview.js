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
                    top: 30,
                    left: '5%',
                    right: '8%',
                    bottom: 90,
                },
                tooltip: {
                },
                dataZoom: [
                    {
                        type: 'slider',
                        realtime: true,
                        show: true,
                        start: 0,
                        end: 100,
                        bottom: 25,
                    }
                ],
                xAxis: {
                    name: params.nameX + '(' + params.unitX + ')',
                    type: 'category',
                    boundaryGap: false,
                    data: params.category,
                    nameTextStyle: {
                        color: '#ccc',
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
                    symbolSize: 1.5,
                    itemStyle: {
                        normal: {
                            color: '#6bb72d',
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: '#6bb72d',
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
        name: 'Slip',
        nameX: 'Time',
        nameY: 'g',
        unitX: 'h',
        unitY: 'Kwh',
        value: [3, 5, 7, 4, 7, 3, 2, 4, 2, 5, 8],
        valueMin: 1,
        valueMax: 8,
        valueSplit: 7,
        valueFormatter: '{value}',
        category: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    });
});