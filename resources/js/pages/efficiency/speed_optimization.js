/**
 * 转速优化
 */
$(function () {
    // @private
    // mainChart
    var chartVesselFuelEffivecy = {
        init: function (params) {
            var myChart = echarts.init(document.getElementById("chartVesselFuelEffivecy"));
            myChart.setOption(this.option(params), true);
        },

        option: function (params) {
            return {
                title: {
                    text: 'SLIP: ' + params.slip + '      Wind speed: ' + params.windSpeed + '      Wind diration: ' + params.windDriatiion,
                    textStyle: {
                        color: '#ccc',
                        fontSize: 11,
                        fontWeight: 'normal',
                    },
                    top: 30,
                    left: 'center',
                },
                legend: {
                    data: [
                        {
                            name: 'Actual Pointer',
                            icon: 'circle',
                        },
                        {
                            name: 'Suggest Pointer',
                            icon: 'circle',
                        },
                    ],
                },
                tooltip: {
                    trigger: 'axis',
                    padding: 0,
                    formatter: '<div style="font-size: 10px; color: #ccc; padding: 10px 20px; background: rgba(0,0,0,0.4);">\
                        <p>' + params.name + '</p>\
                        <p style="display: block; width: 100%; border-top: 1px solid #999; margin: 5px 0;"></p>\
                        <p>ME RPM: {b0} ' + params.unitX + '</p>\
                        <p>Fuel.EFF(estimate): {c0} ' + params.unitY + '</p>\
                        <p>ETA: ' + params.time + '</p>\
                        <p style="padding-left: 30px;">' + params.meta + '</p></div>',
                },
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
                    symbolSize: 6,
                    markPoint: this.markPoint([
                        ['Actual Point', '#c1240a', params.actualPoint],
                        ['Suggest Point', '#6bb72d', params.suggestPoint],
                    ]),
                    markLine: this.markLine(),
                    lineStyle: {
                        normal: {
                            color: '#ff9a00',
                            width: 1.5,
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#ff9a00',
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: '#ff9a00',
                            opacity: 0.25,
                        },
                    }, // areaStyle
                }], // series
            };
        }, // option

        markPoint: function (params) {
            var data = [];
            params.forEach(arg => {
                data.push({
                    name: arg[0],
                    coord: arg[2],
                    symbolOffset: [0, -15],
                    label: {
                        normal: {
                            show: false
                        },
                    },
                    itemStyle: {
                        normal: {
                            color: arg[1],
                        }
                    },
                })
            });

            return {
                symbol: 'circle',
                symbolSize: 12,
                data: data,
            }
        },

        markLine: function () {
            return {
                data: [{
                    type: 'average',
                    name: '平均值',
                    symbol: 'pin',
                    symbolSize: 0,
                    label: {
                        normal: {
                            show: false,
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: '#6bb72d',
                            type: 'dotted',
                        }
                    },
                }]
            };
        },
    };

    // @private
    // singleLineChart
    var chartSlip = {
        init: function (params) {
            var myChart = echarts.init(document.getElementById("chartSlip"));
            myChart.setOption(this.option(params), true);
        },

        option: function (params) {
            return {
                tooltip: {
                    trigger: 'axis',
                    padding: 0,
                    formatter: '<div style="font-size: 10px; color: #ccc; padding: 10px 20px; background: rgba(0,0,0,0.4);">\
                        <p>' + params.name + '</p>\
                        <p style="display: block; width: 100%; border-top: 1px solid #999; margin: 5px 0;"></p>\
                        <p>Time: {b0} ' + params.unitX + '</p>\
                        <p>Slip: {c0} ' + params.unitY + '</p>',
                },
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

    // @private
    // doubleLineChart
    var chartSpeed = {
        init: function (params) {
            var myChart = echarts.init(document.getElementById("chartSpeed"));
            myChart.setOption(this.option(params), true);
        },

        option: function (params) {
            return {
                tooltip: {
                    trigger: 'axis',
                    padding: 0,
                    formatter: '<div style="font-size: 10px; color: #ccc; padding: 10px 20px; background: rgba(0,0,0,0.4);">\
                        <p>' + params.name + '</p>\
                        <p style="display: block; width: 100%; border-top: 1px solid #999; margin: 5px 0;"></p>\
                        <p>Time: {b0} ' + params.unitX + '</p>\
                        <p>Slip: {c0} ' + params.unitY + '</p>',
                },
                legend: {
                    data: [
                        {
                            name: params.nameYA,
                            icon: 'circle',
                        },
                        {
                            name: params.nameYA,
                            icon: 'circle',
                        },
                    ],
                },
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
                yAxis: [
                    this.yAxis({
                        name: params.nameYA + '(' + params.unitYA + ')',
                        min: params.valueYAMin,
                        max: params.valueYAMax,
                        splitNumber: params.valueYASplit,
                        formatter: params.valueYAFormatter,
                    }),
                    this.yAxis({
                        name: params.nameYB + '(' + params.unitYB + ')',
                        min: params.valueYBMin,
                        max: params.valueYBMax,
                        splitNumber: params.valueYBSplit,
                        formatter: params.valueYBFormatter,
                    }),
                ],
                series: [
                    this.series({
                        name: params.nameYA,
                        yAxisIndex: 0,
                        data: params.valueYA,
                        color: '#33aac6',
                    }),
                    this.series({
                        name: params.nameYB,
                        yAxisIndex: 0,
                        data: params.valueYB,
                        color: '#33c698',
                    }),
                ], // series
            };
        }, // option

        yAxis: function (yAxisParams) {
            return {
                name: yAxisParams.name,
                type: 'value',
                boundaryGap: false,
                min: yAxisParams.min,
                max: yAxisParams.max,
                splitNumber: yAxisParams.splitNumber,
                nameTextStyle: {
                    color: '#ccc',
                },
                axisLabel: {
                    formatter: yAxisParams.formatter,
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
            };
        },

        series: function (seriesParams) {
            return {
                name: seriesParams.name,
                yAxisIndex: seriesParams.yAxisIndex,
                type: 'line',
                data: seriesParams.data,
                symbol: 'circle',
                symbolSize: 1.5,
                itemStyle: {
                    normal: {
                        color: seriesParams.color,
                    }
                },
                areaStyle: {
                    normal: {
                        color: seriesParams.color,
                        opacity: 0.25,
                    },
                },
            };
        }
    };

    // @private
    // doubleLineChart
    var chartLoad = {
        init: function (params) {
            var myChart = echarts.init(document.getElementById("chartLoad"));
            myChart.setOption(this.option(params), true);
        },

        option: function (params) {
            return {
                tooltip: {
                    trigger: 'axis',
                    padding: 0,
                    formatter: '<div style="font-size: 10px; color: #ccc; padding: 10px 20px; background: rgba(0,0,0,0.4);">\
                        <p>' + params.name + '</p>\
                        <p style="display: block; width: 100%; border-top: 1px solid #999; margin: 5px 0;"></p>\
                        <p>Time: {b0} ' + params.unitX + '</p>\
                        <p>Slip: {c0} ' + params.unitY + '</p>',
                },
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
                yAxis: [
                    this.yAxis({
                        name: params.nameYA + '(' + params.unitYA + ')',
                        min: params.valueYAMin,
                        max: params.valueYAMax,
                        splitNumber: params.valueYASplit,
                        formatter: params.valueYAFormatter,
                    }),
                    this.yAxis({
                        name: params.nameYB + '(' + params.unitYB + ')',
                        min: params.valueYBMin,
                        max: params.valueYBMax,
                        splitNumber: params.valueYBSplit,
                        formatter: params.valueYBFormatter,
                    }),
                ],
                series: [
                    this.series({
                        name: params.nameYA,
                        yAxisIndex: 0,
                        data: params.valueYA,
                        color: '#ff9a00',
                    }),
                    this.series({
                        name: params.nameYB,
                        yAxisIndex: 0,
                        data: params.valueYB,
                        color: '#ff6c00',
                    }),
                ], // series
            };
        }, // option

        yAxis: function (yAxisParams) {
            return {
                name: yAxisParams.name,
                type: 'value',
                boundaryGap: false,
                min: yAxisParams.min,
                max: yAxisParams.max,
                splitNumber: yAxisParams.splitNumber,
                nameTextStyle: {
                    color: '#ccc',
                },
                axisLabel: {
                    formatter: yAxisParams.formatter,
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
            };
        },

        series: function (seriesParams) {
            return {
                name: seriesParams.name,
                yAxisIndex: seriesParams.yAxisIndex,
                type: 'line',
                data: seriesParams.data,
                symbol: 'circle',
                symbolSize: 1.5,
                itemStyle: {
                    normal: {
                        color: seriesParams.color,
                    }
                },
                areaStyle: {
                    normal: {
                        color: seriesParams.color,
                        opacity: 0.25,
                    },
                },
            };
        }
    };


    // @public
    // mainChart
    chartVesselFuelEffivecy.init({
        name: 'Simulation',
        nameY: 'Vessel Fuel Effivecy',
        nameX: 'rpm',
        unitY: 'kg/nm',
        unitX: 'rpm',
        time: '2018-01-01 16:00',
        meta: '25H',
        slip: '32%',
        windSpeed: '28m/s',
        windDriatiion: '25',
        value: [3, 5, 7, 4, 7, 3, 2, 4, 2, 5, 8],
        valueMin: 1,
        valueMax: 10,
        valueSplit: 10,
        valueFormatter: '{value}.0',
        category: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        actualPoint: [5, 3],
        suggestPoint: [6, 2],
    });

    // @public
    // singleLineChart
    chartSlip.init({
        name: 'Slip',
        nameX: 'Time',
        nameY: 'Slip',
        unitX: 'h',
        unitY: '%',
        value: [3, 5, 7, 4, 7, 3, 2, 4, 2, 5, 8],
        valueMin: 1,
        valueMax: 8,
        valueSplit: 7,
        valueFormatter: '{value}',
        category: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    });

    // @public
    // doubleLineChart
    chartSpeed.init({
        name: 'Speed',
        nameYA: 'GPS',
        nameYB: 'Log',
        nameX: 'Time',
        unitYA: 'm',
        unitYB: 'kn',
        unitX: 'h',
        valueYA: [3, 5, 7, 4, 7, 3, 2, 4, 2, 5, 8],
        valueYAMin: 1,
        valueYAMax: 8,
        valueYASplit: 7,
        valueYAFormatter: '{value}',
        valueYB: [8, 5, 2, 4, 2, 3, 7, 4, 7, 5, 3],
        valueYBMin: 1,
        valueYBMax: 8,
        valueYBSplit: 7,
        valueYBFormatter: '{value}',
        category: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    });

    // @public
    // doubleLineChart
    chartLoad.init({
        name: 'Load & Fuel Efficiency',
        nameYA: 'Load',
        nameYB: 'Fuel Efficiency',
        nameX: 'Time',
        unitYA: '%',
        unitYB: 'kgh',
        unitX: 'h',
        valueYA: [3, 5, 7, 4, 7, 3, 2, 4, 2, 5, 8],
        valueYAMin: 1,
        valueYAMax: 8,
        valueYASplit: 7,
        valueYAFormatter: '{value}',
        valueYB: [8, 5, 2, 4, 2, 3, 7, 4, 7, 5, 3],
        valueYBMin: 1,
        valueYBMax: 8,
        valueYBSplit: 7,
        valueYBFormatter: '{value}',
        category: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    });
});