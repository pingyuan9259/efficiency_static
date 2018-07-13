/**
 * 暂无
 */
$(function(){
	assessmentAuxiliary.init();
	//每5秒刷新
	setInterval(function(){
		assessmentAuxiliary.init();
	},5000);
});
var assessmentAuxiliary = {
	charts:{},
	/**
	 * 初始化	副机
	 */
	init:function(){
		var self=this;
		//副机 燃油进口/燃油出口
		$.getJSON(server_url+"/auxiliarytotalfueloil",function(data){
			if(data.state){
        		$("#auxiliary_fo_inlet_flow").text(isNull_(data.result.auxiliaryFoInletFlow, "--") + " kg/h");
        		$("#auxiliary_fo_inlet_temp").text(isNull_(data.result.auxiliaryFoInletTemp, "--") + " °C");
        		$("#auxiliary_fo_inlet_density").html(isNull_(data.result.auxiliaryFoInletDensity, "--") + " Kg/m<sup>3</sup>");
        		$("#auxiliary_fo_outlet_flow").text(isNull_(data.result.auxiliaryFoOutletFlow, "--") + " kg/h");
        		$("#auxiliary_fo_outlet_temp").text(isNull_(data.result.auxiliaryFoOutletTemp, "--") + " °C");
        		$("#auxiliary_fo_outlet_density").html(isNull_(data.result.auxiliaryFoOutletDensity, "--") + " Kg/m<sup>3</sup>");
        		
        		self.initGaugeChart("auxiliaryFoInletFlowGauge","Flow",0,5000,isNull_(data.result.auxiliaryFoInletFlow, "--"),"kg/h");//主表盘显示副机燃油进口流量，DG FO inlet flow，单位kg/h；
        		self.initGaugeChart("auxiliaryFoOutletFlowGauge","Flow",0,5000,isNull_(data.result.auxiliaryFoOutletFlow, "--"),"kg/h");//主表盘显示副机燃油出口流量，DG FO outlet flow，单位kg/h；
        		
        	}
		});

		//副机废气出口温度
		$.getJSON(server_url+"/auxiliaryaircylindercondition",function(data){
			if(data.state){
				$.each(data.result, function(index, info) {	
					//副机气缸id 设备编号
    		    	$("#airCylinders"+info.equipmentId+"_"+info.aacId).text(isNull_(info.exhGasTempAft, "--") + " °C");
                });
        	}
		});
		
		var data_;
		//副机 参数
		$.getJSON(server_url+"/auxiliaryefficiency",function(data){
			if(data.state){
				if(data.result != null && data.result != "" && data.result.length > 0) {
					data_ = null;
					for (var i = 0 ; i < data.result.length; i ++) {
						data_ = data.result[i];
						if(data_ != null && data_ != "") {
							$("#fo_inlet_press_" + data_.equipmentId).text(isNull_(data_.foInletPress + " bar", "0"));
							$("#fo_inlet_temp_" + data_.equipmentId).text(isNull_(data_.foInletTemp + " ℃", "0"));
							$("#lo_inlet_press_" + data_.equipmentId).text(isNull_(data_.loInletpress + " bar", "0"));
							$("#lo_inlet_temp_" + data_.equipmentId).text(isNull_(data_.loInletTemp + " ℃", "0"));
							$("#lo_inlet_filter_press_" + data_.equipmentId).text(isNull_(data_.loInletFilterPress + " bar", "0"));
							$("#lt_water_inlet_temp_" + data_.equipmentId).text(isNull_(data_.ltWaterInletTemp + " ℃", "0"));
							$("#lt_water_inlet_press_" + data_.equipmentId).text(isNull_(data_.ltWaterInletPress + " bar", "0"));

							$("#ht_water_inlet_temp_" + data_.equipmentId).text(isNull_(data_.htWaterInletTemp + " ℃", "0"));
							$("#ht_water_inlet_press_" + data_.equipmentId).text(isNull_(data_.htWaterInletPress + " bar", "0"));
							$("#ht_water_outlet_temp_" + data_.equipmentId).text(isNull_(data_.htWaterOutletTemp + " ℃", "0"));
							$("#tc_lo_inlet_press_" + data_.equipmentId).text(isNull_(data_.tcLoInletPress + " bar", "0"));
							$("#tc_exh_gas_out_temp_" + data_.equipmentId).text(isNull_(data_.tcExhGasOutTemp + " ℃", "0"));
							$("#scavair_press_" + data_.equipmentId).text(isNull_(data_.scavairPress + " bar", "0"));
							$("#scavair_temp_" + data_.equipmentId).text(isNull_(data_.scavairTemp + " ℃", "0"));
							
							$(".fuel_type_light_" + data_.equipmentId).css("background","#afb0b1");
							$(".fuel_type_default_" + data_.equipmentId).css("background","#afb0b1");
							
								if ("0" == data_.fuelOilType)
									$(".fuel_type_light_" + data_.equipmentId).css("background","#ff8901");
								else if ("1" == data_.fuelOilType)
									$(".fuel_type_default_" + data_.equipmentId).css("background","#ff8901");
						}
					}
				}
        	}
		})
		
		//副机 参数
		$.getJSON(server_url+"/auxiliarydgparameter",function(data){
			if(data.state){
				if(data.result != null && data.result != "" && data.result.length > 0) {
					data_ = null;
					for (var i = 0 ; i < data.result.length; i ++) {
						data_ = data.result[i];
						if(data_ != null && data_ != "") {
							$("#bearing_temp_" + data_.equipmentId).text(isNull_(data_.bearingTemp, "--") + " ℃");
							$("#uwinding_temp_" + data_.equipmentId).text(isNull_(data_.uwindingTemp, "--") + " ℃");
							$("#vwinding_temp_" + data_.equipmentId).text(isNull_(data_.vwindingTemp, "--") + " ℃");
							$("#wwinding_temp_" + data_.equipmentId).text(isNull_(data_.wwindingTemp, "--") + " ℃");
							$("#cos_" + data_.equipmentId).text(isNull_(data_.cos, "--"));
							$("#frequency_" + data_.equipmentId).text(isNull_(data_.frequency, "--") + " Hz");
							$("#uvoltage_" + data_.equipmentId).text(isNull_(data_.uvoltage, "--") + " V");
							$("#vvoltage_" + data_.equipmentId).text(isNull_(data_.vvoltage, "--") + " V");
							$("#wvoltage_" + data_.equipmentId).text(isNull_(data_.wvoltage, "--") + " V");
							$("#power_" + data_.equipmentId).text(isNull_(data_.power, "--") + " kW");
							if(!data_.power != null){
								$("#load_" + data_.equipmentId).text((data_.power*1/600*100).toFixed(1) + " %");
							}else{
								$("#load_" + data_.equipmentId).text("-- %");
							}
							$("#ucurrent_" + data_.equipmentId).text(isNull_(data_.ucurrent, "--") + " A");
							$("#vcurrent_" + data_.equipmentId).text(isNull_(data_.vcurrent, "--") + " A");
							$("#wcurrent_" + data_.equipmentId).text(isNull_(data_.wcurrent, "--") + " A");
						}
					}
				}
        	}
		});
		
		//增压器 参数
		$.getJSON(server_url+"/exhaust",function(data){
			if(data.state){
				if(data.result != null && data.result != "" && data.result.length > 0) {
					data_ = null;
					for (var i = 0 ; i < data.result.length; i ++) {
						data_ = data.result[i];
						if(data_ != null && data_ != "") {
							$("#tc_inlet_no1_temp_" + data_.equipmentId).text(isNull_(data_.tcInletNo1Temp, "--") + " ℃");
							$("#tc_inlet_no2_temp_" + data_.equipmentId).text(isNull_(data_.tcInletNo2Temp, "--") + " ℃");
						}
					}
				}
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
		var int_value = (value/max*100).toFixed(0);
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
			                fontFamily: "Arial Bold",
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

};

function isNull_(value_, default_) {
	if(value_ == null  || "null" == value_ || "" == value_)
		return default_;
	else
		return value_;
};