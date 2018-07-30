/**
 * 纵倾优化
 */
$(function () {
    var start = $("#startDate").flatpickr();
    var end = $("#endDate").flatpickr();

    $(document).bind("click", function (e) {
        if ($(e.target).closest("div").hasClass('selection1-1')) {
            $("#selection1-1 ul").toggleClass("hide")
        } else {
            $("#selection1-1 ul").addClass("hide")
        }

        if ($(e.target).closest("div").hasClass('selection1-2')) {
            $("#selection1-2 ul").toggleClass("hide")
        } else {
            $("#selection1-2 ul").addClass("hide")
        }

        if ($(e.target).closest("div").hasClass('selection2-1')) {
            $("#selection2-1 ul").toggleClass("hide")
        } else {
            $("#selection2-1 ul").addClass("hide")
        }

        if ($(e.target).closest("div").hasClass('selection2-2')) {
            $("#selection2-2 ul").toggleClass("hide")
        } else {
            $("#selection2-2 ul").addClass("hide")
        }

        if ($(e.target).closest("div").hasClass('selection3-1')) {
            $("#selection3-1 ul").toggleClass("hide")
        } else {
            $("#selection3-1 ul").addClass("hide")
        }

        if ($(e.target).closest("div").hasClass('selection3-2')) {
            $("#selection3-2 ul").toggleClass("hide")
        } else {
            $("#selection3-2 ul").addClass("hide")
        }

        if ($(e.target).closest("div").hasClass('selection4-1')) {
            $("#selection4-1 ul").toggleClass("hide")
        } else {
            $("#selection4-1 ul").addClass("hide")
        }

        if ($(e.target).closest("div").hasClass('selection4-2')) {
            $("#selection4-2 ul").toggleClass("hide")
        } else {
            $("#selection4-2 ul").addClass("hide")
        }

        if ($(e.target).closest("div").hasClass('selection5-1')) {
            $("#selection5-1 ul").toggleClass("hide")
        } else {
            $("#selection5-1 ul").addClass("hide")
        }
    });

    $('._dropdown_group li').on('click', function() {
        var text = $(this).text();
        $(this).parent('ul').prev('p').find('span.text').text(text);
    });

    // @private
    // mainChart
    var chartMain = {
        init: function (params) {
            var myChart = echarts.init(document.getElementById("chartMain"));
            myChart.setOption(this.option(params), true);
        },

        option: function (params) {
            return {
                grid: {
                    top: -10,
                    left: '6%',
                    right: '5%',
                    bottom: 60,
                },
                tooltip: {
                    // trigger: 'axis',
                    // padding: 0,
                    // formatter: '<div style="font-size: 10px; color: #ccc; padding: 10px 20px; background: rgba(0,0,0,0.4);">\
                    //     <p>' + params.name + '</p>\
                    //     <p style="display: block; width: 100%; border-top: 1px solid #999; margin: 5px 0;"></p>\
                    //     <p>ME RPM: {b0} ' + params.unitX + '</p>\
                    //     <p>Fuel.EFF(estimate): {c0} ' + params.unitY + '</p>\
                    //     <p>ETA: ' + params.time + '</p>\
                    //     <p style="padding-left: 30px;">' + params.meta + '</p></div>',
                },
                xAxis: {
                    name: params.nameX,
                    type: 'category',
                    boundaryGap: false,
                    data: params.category,
                    nameTextStyle: {
                        color: '#ccc',
                    },
                    axisLabel: {
                        color: '#666',
                        margin: 15,
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
                    name: params.nameY,
                    type: 'value',
                    boundaryGap: false,
                    min: params.valueMin,
                    max: params.valueMax,
                    splitNumber: params.valueSplit,
                    nameTextStyle: {
                        color: '#ccc',
                        padding: [0, 55, 0, 0],
                    },
                    nameGap: -40,
                    axisLabel: {
                        formatter: params.valueFormatter,
                        color: '#666',
                        fontSize: 24,
                        margin: 12,
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
                },
                series: [{
                    name: params.name,
                    type: 'line',
                    data: params.value,
                    symbol: 'circle',
                    symbolSize: 10,
                    lineStyle: {
                        normal: {
                            color: '#d49e0e',
                            width: 1.5,
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#d49e0e',
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: '#d49e0e',
                            opacity: 0.25,
                        },
                    }, // areaStyle
                }], // series
            };
        }, // option

    };

    // @private
    // singleLineChart
    var chartVice1 = {
        init: function (params) {
            var myChart = echarts.init(document.getElementById("chartVice1"));
            myChart.setOption(this.option(params), true);
        },

        option: function (params) {
            return {
                grid: {
                    top: -6,
                    left: '7%',
                    right: '4%',
                    bottom: 30,    
                },
                tooltip: {
                    // trigger: 'axis',
                    // padding: 0,
                    // formatter: '<div style="font-size: 10px; color: #ccc; padding: 10px 20px; background: rgba(0,0,0,0.4);">\
                    //     <p>' + params.name + '</p>\
                    //     <p style="display: block; width: 100%; border-top: 1px solid #999; margin: 5px 0;"></p>\
                    //     <p>Time: {b0} ' + params.unitX + '</p>\
                    //     <p>Slip: {c0} ' + params.unitY + '</p>',
                },
                xAxis: {
                    name: params.nameX,
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
                    name: params.nameY,
                    type: 'value',
                    boundaryGap: false,
                    min: params.valueMin,
                    max: params.valueMax,
                    splitNumber: params.valueSplit,
                    nameTextStyle: {
                        color: '#ccc',
                        padding: [0, 30, 0, 0],
                    },
                    nameGap: -18,
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
                            color: '#2e95c7',
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: '#2e95c7',
                            opacity: 0.25,
                        },
                    }, // areaStyle
                }], // series
            };
        }, // option
    };

    // @private
    // singleLineChart
    var chartVice2 = {
        init: function (params) {
            var myChart = echarts.init(document.getElementById("chartVice2"));
            myChart.setOption(this.option(params), true);
        },

        option: function (params) {
            return {
                grid: {
                    top: -6,
                    left: '7%',
                    right: '4%',
                    bottom: 30,    
                },
                tooltip: {
                    // trigger: 'axis',
                    // padding: 0,
                    // formatter: '<div style="font-size: 10px; color: #ccc; padding: 10px 20px; background: rgba(0,0,0,0.4);">\
                    //     <p>' + params.name + '</p>\
                    //     <p style="display: block; width: 100%; border-top: 1px solid #999; margin: 5px 0;"></p>\
                    //     <p>Time: {b0} ' + params.unitX + '</p>\
                    //     <p>Slip: {c0} ' + params.unitY + '</p>',
                },
                xAxis: {
                    name: params.nameX,
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
                    name: params.nameY,
                    type: 'value',
                    boundaryGap: false,
                    min: params.valueMin,
                    max: params.valueMax,
                    splitNumber: params.valueSplit,
                    nameTextStyle: {
                        color: '#ccc',
                        padding: [0, 30, 0, 0],
                    },
                    nameGap: -18,
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
                            color: '#ff5050',
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: '#ff5050',
                            opacity: 0.25,
                        },
                    }, // areaStyle
                }], // series
            };
        }, // option
    };

    // @private
    // singleLineChart
    var chartVice3 = {
        init: function (params) {
            var myChart = echarts.init(document.getElementById("chartVice3"));
            myChart.setOption(this.option(params), true);
        },

        option: function (params) {
            return {
                grid: {
                    top: -6,
                    left: '7%',
                    right: '4%',
                    bottom: 30,    
                },
                tooltip: {
                    // trigger: 'axis',
                    // padding: 0,
                    // formatter: '<div style="font-size: 10px; color: #ccc; padding: 10px 20px; background: rgba(0,0,0,0.4);">\
                    //     <p>' + params.name + '</p>\
                    //     <p style="display: block; width: 100%; border-top: 1px solid #999; margin: 5px 0;"></p>\
                    //     <p>Time: {b0} ' + params.unitX + '</p>\
                    //     <p>Slip: {c0} ' + params.unitY + '</p>',
                },
                xAxis: {
                    name: params.nameX,
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
                    name: params.nameY,
                    type: 'value',
                    boundaryGap: false,
                    min: params.valueMin,
                    max: params.valueMax,
                    splitNumber: params.valueSplit,
                    nameTextStyle: {
                        color: '#ccc',
                        padding: [0, 30, 0, 0],
                    },
                    nameGap: -18,
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
                            color: '#f7bb01',
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: '#f7bb01',
                            opacity: 0.25,
                        },
                    }, // areaStyle
                }], // series
            };
        }, // option
    };

    // @private
    // singleLineChart
    var chartVice4 = {
        init: function (params) {
            var myChart = echarts.init(document.getElementById("chartVice4"));
            myChart.setOption(this.option(params), true);
        },

        option: function (params) {
            return {
                grid: {
                    top: -6,
                    left: '7%',
                    right: '4%',
                    bottom: 30,    
                },
                tooltip: {
                    // trigger: 'axis',
                    // padding: 0,
                    // formatter: '<div style="font-size: 10px; color: #ccc; padding: 10px 20px; background: rgba(0,0,0,0.4);">\
                    //     <p>' + params.name + '</p>\
                    //     <p style="display: block; width: 100%; border-top: 1px solid #999; margin: 5px 0;"></p>\
                    //     <p>Time: {b0} ' + params.unitX + '</p>\
                    //     <p>Slip: {c0} ' + params.unitY + '</p>',
                },
                xAxis: {
                    name: params.nameX,
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
                    name: params.nameY,
                    type: 'value',
                    boundaryGap: false,
                    min: params.valueMin,
                    max: params.valueMax,
                    splitNumber: params.valueSplit,
                    nameTextStyle: {
                        color: '#ccc',
                        padding: [0, 30, 0, 0],
                    },
                    nameGap: -18,
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
    // mainChart
    chartMain.init({
        name: 'Main',
        nameY: 'g/Kwh',
        nameX: '',
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
        category: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'],
        actualPoint: [5, 3],
        suggestPoint: [6, 2],
    });

    // @public
    // singleLineChart
    chartVice1.init({
        name: 'Vice',
        nameX: '',
        nameY: '°C',
        value: [3, 5, 7, 4, 7, 3, 2, 4, 2, 5, 8],
        valueMin: 1,
        valueMax: 8,
        valueSplit: 7,
        valueFormatter: '{value}',
        category: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    });

    // @public
    // singleLineChart
    chartVice2.init({
        name: 'Vice',
        nameX: '',
        nameY: 'MPs',
        value: [3, 5, 7, 4, 7, 3, 2, 4, 2, 5, 8],
        valueMin: 1,
        valueMax: 8,
        valueSplit: 7,
        valueFormatter: '{value}',
        category: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    });

    // @public
    // singleLineChart
    chartVice3.init({
        name: 'Vice',
        nameX: '',
        nameY: 'MPs',
        value: [3, 5, 7, 4, 7, 3, 2, 4, 2, 5, 8],
        valueMin: 1,
        valueMax: 8,
        valueSplit: 7,
        valueFormatter: '{value}',
        category: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    });

    // @public
    // singleLineChart
    chartVice4.init({
        name: 'Vice',
        nameX: '',
        nameY: 'MPs',
        value: [3, 5, 7, 4, 7, 3, 2, 4, 2, 5, 8],
        valueMin: 1,
        valueMax: 8,
        valueSplit: 7,
        valueFormatter: '{value}',
        category: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    });
});
