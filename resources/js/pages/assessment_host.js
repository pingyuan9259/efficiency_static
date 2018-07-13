/**
 * 暂无
 */
$(function(){
	assessmentHost.init();
	//每5秒刷新
	setInterval(function(){
		assessmentHost.init();
	},5000);
});
var assessmentHost = {
	charts:{},
	/**
	 * 初始化	主机
	 */
	init:function(){
		var self=this;
		//主机 FO
		$.getJSON(server_url+"/hostfo",function(data){
			if(data.state){
        		$("#host_fo_inlet_press").text(tool.defaultString(data.result.foInletPress, '--') + " bar");
        		$("#host_fo_inlet_temp").text(tool.defaultString(data.result.foInletTemp, '--') + " °C");
        	}
		});
		
		//主机 LO
		$.getJSON(server_url+"/hostlo",function(data){
			if(data.state){
        		$("#host_main_lo_inlet_press").text(tool.defaultString(data.result.mainLoInletPress, '--') + " bar");
        		$("#host_main_lo_inlet_temp").text(tool.defaultString(data.result.mainLoInletTemp, '--') + " °C");
        		$("#host_no1tc_lo_inlet_press").text(tool.defaultString(data.result.no1tcLoInletPress, '--') + " bar");
        		$("#host_no2tc_lo_inlet_press").text(tool.defaultString(data.result.no2tcLoInletPress, '--') + " bar");
        	}
		});
		
		//主机 AIR
		$.getJSON(server_url+"/hostair",function(data){
			if(data.state){
        		$("#host_starting_air_inlet_press").text(tool.defaultString(data.result.startingAirInletPress, '--') + " bar");
        		$("#host_control_air_inlet_press").text(tool.defaultString(data.result.controlAirInletPress, '--') + " bar");
        		$("#host_exh_valve_spring_air_inlet_press").text(tool.defaultString(data.result.exhValveSpringAirInletPress, '--') + " bar");
        		$("#host_scav_air_receiver_temp").text(tool.defaultString(data.result.scavAirReceiverTemp, '--') + " °C");
        	}
		});
		
		//主机 Misc
		$.getJSON(server_url+"/hostmisc",function(data){
			if(data.state){
        		$("#host_jcw_inlet_press").text(tool.defaultString(data.result.jcwInletPress, '--') + " bar");
        		$("#host_jcw_aft_cyl_diff_press").text(tool.defaultString(data.result.jcwAftCylDiffPress, '--') + " bar");
        		$("#host_jcw_aft_cyl_exh_diff_press").text(tool.defaultString(data.result.jcwAftCylExhDiffPress, '--') + " bar");
        		$("#host_no1_air_cooler_cw_inlet_temp").text(tool.defaultString(data.result.no1AirCoolerCwInletTemp, '--') + " °C");
        		$("#host_no2_air_cooler_cw_inlet_temp").text(tool.defaultString(data.result.no2AirCoolerCwInletTemp, '--') + " °C");
        	}
		});
		
		//主机 进口/出口
		$.getJSON(server_url+"/hostfueloil",function(data){
			if(data.state){
        		$("#host_me_fo_inlet_flow").text(tool.defaultString(data.result.meFoInletFlow, '--') + " kg/h");
        		self.initGaugeChart("meFoInletFlowGauge","Flow",0,8000,data.result.meFoInletFlow,"kg/h");//进口流量
        		$("#host_me_fo_inlet_temp").text(tool.defaultString(data.result.meFoInletTemp, '--') + " °C");
        		$("#host_me_fo_inlet_density").html(tool.defaultString(data.result.meFoInletDensity, '--') + " Kg/m<sup>3</sup>");
        		$("#host_me_fo_outlet_flow").text(tool.defaultString(data.result.meFoOutletFlow, '--') + " kg/h");
        		self.initGaugeChart("meFoOutletFlowGauge","Flow",0,8000,data.result.meFoOutletFlow,"kg/h");//出口流量
        		$("#host_me_fo_outlet_temp").text(tool.defaultString(data.result.meFoOutletTemp, '--') + " °C");
        		$("#host_me_fo_outlet_density").html(tool.defaultString(data.result.meFoOutletDensity, '--') + " Kg/m<sup>3</sup>");
        	}
		});
		
		//主机 气缸
		$.getJSON(server_url+"/hostaircylindercondition",function(data){
			if(data.state){
				if(data.result != null && data.result != "" && data.result.length > 0) {
					for (var i = 0 ; i < data.result.length; i ++) {
						if(data.result[i] != null && data.result[i] != "" ) {
							$("#hac1" + data.result[i].acId).text(tool.defaultString(data.result[i].exhGasTempAft, '--') + " °C");
							$("#hac2" + data.result[i].acId).text(tool.defaultString(data.result[i].jcwOutletTemp, '--') + " °C");
							$("#hac3" + data.result[i].acId).text(tool.defaultString(data.result[i].jcwOutletTemp, '--') + " °C");
							$("#pco" + data.result[i].acId).text(tool.defaultString(data.result[i].pcoOutletTemp, '--') + " °C");
						}
					}
				}
        	}
		});
		
		//主机 推力轴承
		$.getJSON(server_url+"/hostpropulsionbearing",function(data){
			if(data.state){
        		$("#host_thrust_bearing_temp").text(tool.defaultString(data.result.thrustBearingTemp, '--') + " °C");
        		$("#host_st_fore_bearing_temp1").text(tool.defaultString(data.result.stForeBearingTemp1, '--') + " °C");
        		$("#host_st_fore_bearing_temp2").text(tool.defaultString(data.result.stForeBearingTemp2, '--') + " °C");
        		$("#host_intern_bearing_temp").text(tool.defaultString(data.result.internBearingTemp, '--') + " °C");
        		$("#host_st_aft_bearing_temp1").text(tool.defaultString(data.result.stAftBearingTemp1, '--') + " °C");
        		$("#host_st_aft_bearing_temp2").text(tool.defaultString(data.result.stAftBearingTemp2, '--') + " °C");
        	}
		});	
		
		//主机推进有：
		$.getJSON(server_url+"/shipefficiencyoptimization",function(data){
			if(data.state){
				self.initGaugeChart("rotationGauge","ME RPM",0,100,data.result.rotation,"rpm");//转速表，ME RPM，单位rpm
        	}
		});
		$.getJSON(server_url+"/hostpropulsion",function(data){
			if(data.state){
				self.initGaugeChart("mePowerGauge","ME Power",0,20000,data.result.mePower,"Kw");//功率表，ME Power，单位Kw；
				self.initGaugeChart("meFuelEfficiencyGauge","ME Fuel Efficiency",0,600,data.result.meFuelEfficiency,"g/kwh");//主机燃油效率，ME Fuel Efficiency，单位g/kwh；
				self.initGaugeChart("torqueGauge","Torque",0,10000,data.result.torque,"kNm");//扭矩表，Torque，单位kNm。
        	}
		});
	},
	
	 /**
	  * 初始化船舶航行 刷新数据已处理
	  */
	initGaugeChart:function(domid,title,min,max,value,unit){
		var self=this;
		var myChart = self.charts[domid];
		//var range = (max-min).toFixed(0);
		//var int_value = (value/max*100).toFixed(0);
		if(!value){
			value = 0;
		}
		var int_value = (value*1/max*100).toFixed(0);
		if(myChart!=undefined&&myChart!=null&&domid!="gauge"){
			//更新数据
		      var option = myChart.getOption();
		      option.series[1].axisLabel.formatter = function(v) {
		    	  if (v >= int_value && v <= int_value) return '●';
                  else return ''
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
			            offsetCenter: [0,-30],
			            textStyle: {
			                fontSize: 14,
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
		            radius: '59%',      //图表尺寸
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
		                	if (v >= int_value && v <= int_value) return '•';
		                	//if (v >= int_value && v <= int_value) return '▼';
		                    else return ''
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
			                width: 2,
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
			            length: -2,
			            splitNumber: 2
			        },
			        splitLine: {
			            show: true,
			            length: -2,
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
			                fontSize: 30,
			                fontFamily: "Arial Bold",
			                color: "#d3d3d4"
			            },
			            formatter: function(param) {
			                return param;
			            },
			        },
			        title: {
			            textStyle: {
			                fontSize: 10,
			                fontWeight: 'bolder',
			                fontStyle: 'normal',
			                fontFamily: "Square 721 Ex BT Roman",
			                color: "#d3d3d4"
			            },
			            offsetCenter: [0, 44]
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