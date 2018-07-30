/**
 * 滑失率分析
 */
$(function () {

    // @private
    // doubleLineChart
    var chartSlip = {
        init: function (params) {
            var myChart = echarts.init(document.getElementById("chartSlip"));
            myChart.setOption(this.option(params), true);
        },

        option: function (params) {
            return {
                tooltip: {
                    trigger: 'none',
                    trigger: 'axis',
                    padding: 0,
                    formatter: '<div style="font-size: 10px; color: #ccc; padding: 10px 20px; background: rgba(0,0,0,0.4);">\
                        <p>' + params.name + '</p>\
                        <p style="display: block; width: 100%; border-top: 1px solid #999; margin: 5px 0;"></p>\
                        <p>Time: {b0} ' + params.unitX + '</p>\
                        <p>Slip: {c0} ' + params.unitY + '</p>',
                },
                grid: {
                    left: '5%',
                    right: '5%',
                    top: '15%',
                    bottom: '5%',
                    containLabel: true
                },
                legend: {
                    data: [
                        {
                            name: params.nameA,
                            icon: 'image:/resources/images/slip_echarts_icon_01.png',
                            textStyle:{
                                color:'#666'
                            }
                        },
                        {
                            name: params.nameB,
                            icon: 'image:/resources/images/slip_echarts_icon_02.png',
                            textStyle:{
                                color:'#666'
                            }
                        },
                        {
                            name: params.nameC,
                            icon: 'image:/resources/images/slip_echarts_icon_03.png',
                            textStyle:{
                                color:'#666'
                            }
                        },
                        {
                            name: params.nameD,
                            icon: 'image:/resources/images/slip_echarts_icon_04.png',
                            textStyle:{
                                color:'#666'
                            }
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
                        name: params.AxisYA + '(' + params.unitYA + ')',
                        min: params.valueYAMin,
                        max: params.valueYAMax,
                        splitNumber: params.valueYASplit,
                        formatter: params.valueYAFormatter,
                    }),
                    this.yAxis({
                        name: params.AxisYB,
                        min: params.valueYBMin,
                        max: params.valueYBMax,
                        splitNumber: params.valueYBSplit,
                        formatter: params.valueYBFormatter,
                    }),
                ],
                series: [
                    this.series({
                        name: params.nameA,
                        yAxisIndex: 0,
                        data: params.valueYA,
                        color: '#f7bb01',
                    }),
                    this.series({
                        name: params.nameB,
                        yAxisIndex: 0,
                        lineType: 'dashed',
                        data: params.valueYB,
                        color: '#f7bb01',
                    }),
                    this.series({
                        name: params.nameC,
                        yAxisIndex: 1,
                        data: params.valueYC,
                        color: '#2e95c7',
                    }),
                    this.series({
                        name: params.nameD,
                        yAxisIndex: 1,
                        lineType: 'dashed',
                        data: params.valueYD,
                        color: '#2e95c7',
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
                },
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
                lineStyle: {
                    normal: {
                        type: seriesParams.lineType || 'solid',
                    },
                },
                itemStyle: {
                    normal: {
                        color: seriesParams.color,
                    }
                },
            };
        }
    };


    var chartRelativeWind = {
        init: function (params) {
            var myChart = echarts.init(document.getElementById("chartRelativeWind"));
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
                        <p>Relative Wind: {c0} ' + params.unitY + '</p>',
                },
                grid: {
                    left: '10%',
                    right: '10%',
                    top: '15%',
                    bottom: '5%',
                    containLabel: true
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
                            color: '#398634',
                        }
                    },
                }], // series
            };
        }, // option
    };

    var chartPropulsionPerformance = {
        init: function (params) {
            var myChart = echarts.init(document.getElementById("chartPropulsionPerformance"));
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
                grid: {
                    left: '10%',
                    right: '10%',
                    top: '15%',
                    bottom: '5%',
                    containLabel: true
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
                            color: '#bb6609',
                        }
                    },
                }], // series
            };
        }, // option
    };

    // @public
    // singleLineChart
    chartSlip.init({
        name: 'Speed',
        AxisYA: 'Slip',
        AxisYB: 'RPM',
        nameX: 'Time',
        unitYA: '%',
        unitX: 'h',
        unitY:'%',
        valueYAMin: 1,
        valueYAMax: 8,
        valueYASplit: 7,
        valueYBMin: 1,
        valueYBMax: 8,
        valueYBSplit: 7,
        valueYAFormatter: '{value}',
        valueYBFormatter: '{value}',
        nameA:'Real Slip',
        nameB:'Potential Slip',
        nameC:'Real RPM',
        nameD:'Potential RPM',
        valueYA: [3, 5, 6, 4, 2, 1, 3, 5, 4, 5, 7, 4],
        valueYB: [null,null,null,null,null,null,null,null,null,null,null, 4, 3, 2, 3, 2,3,2,1],
        valueYC: [2, 4, 3, 2, 3, 2, 4, 3, 5, 6, 4, 5],
        valueYD: [null,null,null,null,null,null,null,null,null,null,null, 5, 2, 3, 4, 1,4,5,3],
        category: ['-3h', '', '', '-2h30m', '', '', '-2h', '', '', '-1h30m', '', '', '-1h', '', '', '-30m', '', '', '0'],
    });

    // @public
    // singleLineChart
    chartRelativeWind.init({
        name: 'Relative Wind',
        nameX: 'Time',
        nameY: 'Relative Wind',
        unitX: 'h',
        unitY: 'm/s',
        value: [3, 5, 7, 4, 7, 3, 2, 4, 2, 5, 8,4],
        valueMin: 0,
        valueMax: 20,
        valueSplit: 4,
        valueFormatter: '{value}',
        category: ['-3h','-2h30m','','-2h','', '-1h30m','','-1h','','-30m','','0'],
    });


    // @public
    // singleLineChart
    chartPropulsionPerformance.init({
        name: 'Propulsion Performance',
        nameX: 'Time',
        nameY: 'Propulsion Performance',
        unitX: 'h',
        unitY: 'kg/nm',
        value: [3, 5, 7, 4, 7, 3, 2, 4, 2, 5, 8,4],
        valueMin: 0,
        valueMax: 20,
        valueSplit: 4,
        valueFormatter: '{value}',
        category: ['-3h','-2h30m','','-2h','', '-1h30m','','-1h','','-30m','','0'],
    });

});