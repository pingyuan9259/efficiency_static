$(function () {
    var start = $("#startDate").flatpickr();
    var end = $("#endDate").flatpickr();

    $(document).bind("click", function (e) {
        // me选择
        if ($(e.target).closest("div").hasClass('me_selection')) {
            $("#meSelection ul").toggleClass("hide")
        } else {
            $("#meSelection ul").addClass("hide")
        }
        // dg选择
        if ($(e.target).closest("div").hasClass('dg_selection')) {
            $("#dgSelection ul").toggleClass("hide")
        } else {
            $("#dgSelection ul").addClass("hide")
        }
        // boiler选择
        if ($(e.target).closest("div").hasClass('boiler_selection')) {
            $("#boilerSelection ul").toggleClass("hide")
        } else {
            $("#boilerSelection ul").addClass("hide")
        }
    });

    $('._dropdown_group li').on('click', function() {
        var text = $(this).text();
        $(this).parent('ul').prev('p').find('span.text').text(text);
    });

    // @private
    // mainChart
    var chartDeviceAssessment = {
        init: function (params) {
            var myChart = echarts.init(document.getElementById("chartDeviceAssessment"));
            myChart.setOption(this.option(params), true);
        },

        option: function (params) {
            return {
                grid: {
                    top: 40,
                    left: '5%',
                    right: '5%',
                },
                legend: {
                    left: '3%',
                    top: 0,
                    textStyle: {
                        color: '#ccc',
                    },
                    data: [
                        {
                            name: params.nameA,
                            icon: 'circle',
                        },
                        {
                            name: params.nameB,
                            icon: 'circle',
                        },
                        {
                            name: params.nameC,
                            icon: 'circle',
                        },
                        {
                            name: params.nameD,
                            icon: 'circle',
                        },
                    ],
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
                dataZoom: [
                    {
                        type: 'slider',
                        realtime: true,
                        show: true,
                        start: 0,
                        end: 100,
                        bottom: -5,
                    }
                ],
                xAxis: {
                    // name: params.nameX + '(' + params.unitX + ')',
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
                    // name: params.nameY + '(' + params.unitY + ')',
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
                series: [
                    {
                        type: 'line',
                        name: '用于计算markline',
                        data: params.value,
                        markLine: this.markLine(),    
                    },
                    this.series({
                        name: params.nameA,
                        data: params.valueYA,
                        color: '#398634',
                    }),
                    this.series({
                        name: params.nameB,
                        data: params.valueYB,
                        color: '#9f61ff',
                    }),
                    this.series({
                        name: params.nameC,
                        data: params.valueYC,
                        color: '#2e95c7',
                    }),
                    this.series({
                        name: params.nameD,
                        data: params.valueYD,
                        color: '#f7bb01',
                    }),
                ], // series
            };
        }, // option

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

        series: function (seriesParams) {
            return {
                name: seriesParams.name,
                type: 'line',
                data: seriesParams.data,
                symbol: 'circle',
                symbolSize: 10,
                itemStyle: {
                    normal: {
                        color: seriesParams.color,
                    }
                },
                areaStyle: {
                    normal: {
                        opacity: 0.25,
                    },
                },
            };
        }
    };

    // @public
    // mainChart
    chartDeviceAssessment.init({
        nameA: 'At Sea',
        nameB: 'At Port(In/Out)',
        nameC: 'At Loading/Unloading',
        nameD: 'Harbor',
        nameY: '',
        nameX: '',
        unitY: '',
        unitX: '',
        time: '2018-01-01 16:00',
        meta: '25H',
        slip: '32%',
        windSpeed: '28m/s',
        windDriatiion: '25',
        value: [3, 5, 8, 4, 2, 3, 6, 3, 2, 4, 8, 2, 3, 7, 8, 4, 5],
        valueYA: [3, 5, 8, 4, 2],
        valueYB: [null, null, null, null, 2, 3, 6, 3, 2],
        valueYC: [null, null, null, null, null, null, null, null, 2, 4, 8, 2, 3],
        valueYD: [null, null, null, null, null, null, null, null, null, null, null, null, 3, 7, 8, 4, 5],
        valueMin: 1,
        valueMax: 10,
        valueSplit: 10,
        valueFormatter: '{value}.0',
        category: ['2009/6/15 0:00', '2009/6/15 1:00', '2009/6/15 2:00', '2009/6/15 3:00', '2009/6/15 4:00','2009/6/15 0:00', '2009/6/15 1:00', '2009/6/15 2:00', '2009/6/15 3:00', '2009/6/15 4:00','2009/6/15 0:00', '2009/6/15 1:00', '2009/6/15 2:00', '2009/6/15 3:00', '2009/6/15 4:00','2009/6/15 0:00', '2009/6/15 1:00'],
    });
});