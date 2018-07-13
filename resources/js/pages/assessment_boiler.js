/**
 * 暂无
 */
$(function(){
	assessmentBoiler.init();
	//每5秒刷新
	setInterval(function(){
		assessmentBoiler.init();
	},5000);
});
var assessmentBoiler = {
	charts:{},
	/**
	 * 初始化	锅炉
	 */
	init:function(){
		var self=this;
		//锅炉 燃油消耗
		$.getJSON(server_url+"/boilerfueloil",function(data){
			if(data.state){
        		$("#boiler_fo_inlet_flow").text(tool.defaultString(data.result.foInletFlow, '--') + " kg/h");
        		$("#boiler_fo_inlet_temp").text(tool.defaultString(data.result.foInletTemp, '--') + " °C");
        		$("#boiler_fo_inlet_density").html(tool.defaultString(data.result.foInletDensity, '--') + " Kg/m<sup>3</sup>");
        		
        		self.initGaugeChart("fuelConsumptionGauge","Flow",0,3000,data.result.fuelConsumption,"kg/h");//燃油消耗，单位kg/h；
        	}
		});
		
		//锅炉 废气锅炉/辅锅炉/港口锅炉
		$.getJSON(server_url+"/boilercondition",function(data){
			if(data.state){
				if(data.result != null && data.result != "" && data.result.length > 0) {
					for (var i = 0 ; i < data.result.length; i ++) {
						if(data.result[i] != null && data.result[i] != "") {
							$("#" + data.result[i].equipmentId + "_boiler_exh_gas_fore_temp").text(tool.defaultString(data.result[i].exhGasForeTemp, '--') + " °C");
							$("#" + data.result[i].equipmentId + "_boiler_exh_gas_aft_temp").text(tool.defaultString(data.result[i].exhGasAftTemp, '--') + " °C");

							$("#" + data.result[i].equipmentId + "_boiler_steam_press").text(tool.defaultString(data.result[i].steamPress, '--') + " MPa");
							$("#" + data.result[i].equipmentId + "_boiler_fo_temp").text(tool.defaultString(data.result[i].foTemp, '--') + " °C");
							$("#" + data.result[i].equipmentId + "_boiler_fo_press").text(tool.defaultString(data.result[i].foPress, '--') + " MPa");
							$("#" + data.result[i].equipmentId + "_boiler_watch_level").text(tool.defaultString(data.result[i].waterLevel, '--'));
							
							$(".fuel_type_light_" + data.result[i].equipmentId).css("background","#afb0b1");
							$(".fuel_type_default_" + data.result[i].equipmentId).css("background","#afb0b1");
							
							if ("0" == data.result[i].fuelType)
								$(".fuel_type_light_" + data.result[i].equipmentId).css("background","#ff8901");
							else if ("1" == data.result[i].fuelType)
								$(".fuel_type_default_" + data.result[i].equipmentId).css("background","#ff8901");
						}
					}
				}
        	}
		})
	},
	/**
	 * 初始化船舶航行 刷新数据已处理
	 */
	initGaugeChart:function(domid,title,min,max,value,unit){
		var self=this;
		var myChart = self.charts[domid];
		//var range = ((max-min)).toFixed(0);
		var int_value = (value*1/max*100).toFixed(0);
		if(myChart!=undefined&&myChart!=null&&domid!="gauge"){
			//更新数据
		      var option = myChart.getOption();
		      option.series[1].axisLabel.formatter = function(v) {
		    	  if (v >= int_value && v <= int_value) return '●';
                  else if(v <= 50) return ''
              }; 
              option.series[2].data[0].value = value;    
		      myChart.setOption(option);  
	         return;
	    }
		myChart = echarts.init(document.getElementById(domid));
		var option = {
			    title: {
			        show:false,
			        x: "center"
			    },
			    series: [{
		            name: '黑色外圈细',
		            type: 'gauge',
		            radius: '96%',
		            startAngle: 359.9,
		            endAngle: 0,
		            axisLine: { // 坐标轴线
		                lineStyle: { // 属性lineStyle控制线条样式
		                    color: [
		                        [1, '#000000']
		                    ],
		                    width: 1,
		                    shadowColor: '#0d4b81', //默认透明
		                }
	
		            },
		            splitLine: { //分隔线样式
		                show: false,
		            },
		            axisLabel: { //刻度标签
		                show: false,
		            },
		            axisTick: { //刻度样式
		                show: false,
		            },
		            detail : {
		                show: true,
			            offsetCenter: [0,-60],
			            textStyle: {
			                fontSize: 20,
			                fontFamily: "Arial Bold",
			                color: "#d3d3d4"
			            },
			            formatter: function(param) {
			                return title;
			            }
		            }
		        },{
		            type: "gauge",
		            min: 0,
		            max: 100,
		            radius: '74%',      //图表尺寸
		            splitNumber: 100,
		            axisLine: {
		                lineStyle: {
		                    color: [
		                        [1, "transparent"]
		                    ],
		                    width: 1
		                }
		            },
		            axisTick: {
		                lineStyle: {
		                    color: "#000000",
		                    width: 1
		                },
		                length: 0,
		                splitNumber: 1
		            },
		            axisLabel: {
		                distance: -40,
		                formatter: function(v) {
		                	if (v >= int_value && v <= int_value) return '●';
		                	//if (v >= int_value && v <= int_value) return '▼';
		                    else if(v <= 50) return ''
		                },
		                textStyle: {
		                    color: "#fb5310",
		                    fontWeight: 700
		                }
		            },
		            splitLine: {
		                show: true,
		                length: 10,
		                lineStyle: {
		                    color: '#fff',
		                    width: 0
		                }
		            },
		            itemStyle: {
		                normal: {
		                    color: "transparent"
		                }
		            },
		            pointer: {
		                length: 0
		            },
		            detail: {
		                show: false
		            },
		            title: {
		                show: false
		            },
		            data: [{
		                name: "",
		                value: value
		            }]
		        },{
			    	name: $("#"+domid).prev(".nt_zjmlist_tit").text(),
			        type: 'gauge',
			        splitNumber: 12,     //刻度数量
			        min: 0,
			        max: 60,
			        radius: '84%',      //图表尺寸
			        axisLine: {
			            show: true,
			            lineStyle: {
			                width: 4,
			                shadowBlur: 0,
			                color: [
			                    [0.8, '#999999'],
			                    [1, '#339933']
			                ]
			            }
			        },
			        axisTick: {
			            show: true,
			            lineStyle: {
			                color: "#999999",
			                width: 1
			            },
			            length: -5,
			            splitNumber: 2
			        },
			        splitLine: {
			            show: true,
			            length: -5,
			            lineStyle: {
			                color:'#999999'
			            }
			        },
			        axisLabel: {
			            distance: -40,
			            textStyle: {
			                color: "#999999",
			                fontSize: "14",
			            },
			            formatter: function(e) {
			                return "";
			            }
			        },
			        pointer: {
			            show: false,
			        },
			        detail: {           //指针评价
			            show:true,
			            offsetCenter: [0,0],
			            textStyle: {
			                fontSize: 43,
			                color: "#d3d3d4"
			            },
			            formatter: function(param) {
			                return param;
			            },
			        },
			        title: {
			            textStyle: {
			                fontSize: 28,
			                fontWeight: 'bolder',
			                fontStyle: 'normal',
			                fontFamily: "font44706",
			                color: "#d3d3d4"
			            },
			            offsetCenter: [0, 83]
			        },
			        data: [{
			            name: unit,
			            value: value
			        }]
			    }]
			};
		myChart.setOption(option, true);
		self.charts[domid]=myChart;
	}

}