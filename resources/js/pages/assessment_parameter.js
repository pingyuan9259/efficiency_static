/**
 * 海图
 */
$(function(){
	assessmentParameter.init();
	
	//每5分钟刷新
	setInterval(function(){
		assessmentParameter.init();
	},300*1000);
});
var assessmentParameter = {
	charts:{},
	currentType:0,
	/**
	 * 初始化	动态工况与历史工况
	 */
	init:function(){
			//打开详细窗口
			var self=this;
			$(".assessmentParameterDetail").click(function(){
				$("#assessmentParameter").hide();
				var o=$(this).parent().parent();
				self.initGaugeChart("gauge",o.attr("min"),o.attr("max"),o.attr("val"),o.attr("unit"));
				self.currentType=$(this).attr("type");
				self.initAssessmentParameterDetailsChart();
				$("#assessmentParameterDetail .nt_zjmlist .nt_zjmlist_tit").html($(this).parent().parent().children(".nt_zjmlist_tit").html());
				$("#assessmentParameterDetail .nt_cs2_right .nt_csm_lefttitle").html($(this).parent().parent().children(".nt_zjmlist_tit").html());
				$("#assessmentParameterDetail .nt_zjmlist .nt_zjmlist_cont").html($(this).parent().parent().children(".nt_zjmlist_cont").html());
				$("#assessmentParameterDetail").show();
			});
			$(".assessmentParameter").click(function(){
				$("#assessmentParameter").show();
				$("#assessmentParameterDetail").hide();
			});
			
			//选择天数进行查询
			$("#selectDay").change(function(){
				self.initAssessmentParameterDetailsChart();
			});
			
			
			$.getJSON(server_url+"/shipvoyagestate",function(data){
				if(data.state){
            		$("#parameter1_5").text(tool.defaultString(data.result.hostFuelOilConsumption,'--'));
            		$("#parameter1_6").text(tool.defaultString(data.result.dgFuelOilConsumption,'--'));
            		$("#parameter1_7").text(tool.defaultString(data.result.boilerFuelOilConsumption,'--'));
            		$("#parameter1_8").text(tool.defaultString(data.result.tfuelOilConsumption,'--'));/*data.result.tfuelOilConsumption.toFixed(2)*/
            		$("#parameter4_1").text(tool.defaultString(data.result.totalPower,'--'));
            		self.initGaugeChart("gauge4",0,20000,tool.defaultString(data.result.totalPower,'0'),"Kw");
            		//经度:东经正数，西经为负数
               		//纬度:北纬为正数，南纬为负数
               		var lonStr,latStr;
               		if(data.result.lon<0){
               			lonStr="W";
               		}else{
               			lonStr="E";
               		}
               		if(data.result.lat<0){
               			latStr="S";
               		}else{
               			latStr="N";
               		}
               		if(null != data.result.lat && data.result.lat != "" && null != data.result.lon && data.result.lon != ""){
	            		$("#parameter3_8").text(null != data.result.lat && data.result.lat != "" ? tool.formatDegree(data.result.lat) : "--");
	            		$("#parameter3_8_1").text(latStr);
	            		$("#parameter3_9").text(null != data.result.lon && data.result.lon != "" ? tool.formatDegree(data.result.lon) : "--");
	            		$("#parameter3_9_1").text(lonStr);
               		}
            	}
			});
			$.getJSON(server_url+"/shipefficiencyoptimization",function(data){
				if(data.state){
            		$("#parameter1_1").text(tool.defaultString(data.result.fuelOilConsumption, '--'));
            		self.initGaugeChart("gauge1",0,8000,tool.defaultString(data.result.fuelOilConsumption,'0'),"kg/h");
            		$("#parameter2_1").text(tool.defaultString(data.result.hullFuelEfficiency, '--'));
            		self.initGaugeChart("gauge2",0,600,tool.defaultString(data.result.hullFuelEfficiency,'0'),"g/kwh");
            		$("#parameter3_7").text(tool.defaultString(data.result.trim,'--'));
            		$("#parameter5_1").text(tool.defaultString(data.result.slip,'--'));
            		self.initGaugeChart("gauge5",-100,100,tool.defaultString(data.result.slip,'0'),"%");
            	}                       
			});
			
/*			$.getJSON(server_url+"/shipefficiencyoptimizationcond",function(data){
				if(data.state){
            		self.initGaugeChart("gauge5",-100,100,tool.defaultString(data.result.slip,'0'),"%");
				}                       
			});*/
			$.getJSON(server_url+"/hostfueloil",function(data){
				if(data.state){
            		$("#parameter1_2").text(tool.defaultString(data.result.meFoConsumption, '--'));
            		$("#parameter2_2").text(tool.defaultString(data.result.meFoInletFlow, '--'));
            		$("#parameter2_3").text(tool.defaultString(data.result.meFoOutletFlow, '--'));
            	}
			});
			$.getJSON(server_url+"/metotalfueloil",function(data){
				if(data.state){
            		$("#parameter1_3").text(tool.defaultString(data.result.fuelOilConsumption, '--'));
            	}
			});
			$.getJSON(server_url+"/boilerfueloil",function(data){
				if(data.state){
            		$("#parameter1_4").text(tool.defaultString(data.result.fuelConsumption, '--'));
            	}
			});
			$.getJSON(server_url+"/hostpropulsion",function(data){
				if(data.state){
            		$("#parameter2_4").text(tool.defaultString(data.result.mePower, '--'));
            		$("#parameter4_2").text(tool.defaultString(data.result.mePower, '--'));
            	}
			});
			
			$.getJSON(server_url+"/shipdrivinginfo",function(data){
				if(data.state){
            		$("#parameter3_1").text(tool.defaultString(data.result.consumptionPerNm,'--'));
            		self.initGaugeChart("gauge3",0,500,tool.defaultString(data.result.consumptionPerNm,'0'),"kg/nm");
            		$("#parameter5_5").text(tool.defaultString(data.result.shipSpeed, '--'));
            		$("#parameter5_4").text(tool.defaultString(data.result.meSpeed, '--'));
            		$("#parameter3_2").text(tool.defaultString(data.result.sog, '--'));
            		$("#parameter3_10").text(tool.defaultString(data.result.hdt, '--'));
            		//经度:东经正数，西经为负数
               		//纬度:北纬为正数，南纬为负数
               		var lonStr,latStr;
               		if(data.result.lon<0){
               			lonStr="W";
               		}else{
               			lonStr="E";
               		}
               		if(data.result.lat<0){
               			latStr="S";
               		}else{
               			latStr="N";
               		}
               		if(null != data.result.lat && data.result.lat != "" && null != data.result.lon && data.result.lon != ""){
	            		$("#parameter3_8").text(null != data.result.lat && data.result.lat != "" ? tool.formatDegree(data.result.lat) : "--");
	            		$("#parameter3_8_1").text(latStr);
	            		$("#parameter3_9").text(null != data.result.lon && data.result.lon != "" ? tool.formatDegree(data.result.lon) : "--");
	            		$("#parameter3_9_1").text(lonStr);
               		}
            	}
			});
			$.getJSON(server_url+"/shipstate",function(data){
				if(data.state){
            		$("#parameter3_3").text(tool.defaultString(data.result.fwdDraught, '--'));
            		$("#parameter3_4").text(tool.defaultString(data.result.portDraught, '--'));
            		$("#parameter3_5").text(tool.defaultString(data.result.stbdDraught, '--'));
            		$("#parameter3_6").text(tool.defaultString(data.result.aftDraught, '--'));
            		$("#parameter5_2").text(tool.defaultString(data.result.pitch, '--'));
            		$("#parameter5_3").text(tool.defaultString(data.result.rotationRate, '--'));
            		
            	}
			});
			$.getJSON(server_url+"/dgefficiency",function(data){
				if(data.state){
					$.each(data.result, function(index, info) {	
						if(null != info)
        		    	$("#parameter4_3"+info.equipmentId).text(tool.defaultString(info.power, '--'));
	                });
            	}
			});
	},

	initAssessmentParameterDetailsChart:function(){
		var url="",yKey="",unit="";
		var day=$("#selectDay").val(),self=this;
		if(self.currentType==1){
			url="/shipefficiencyhistoptimization?period="+day;
			unit="kg/h";
			yKey="fuelOilConsumption";
		}
		if(self.currentType==2){
			url="/shipefficiencyhistoptimization?period="+day;
			unit="g/kwh";
			yKey="hullFuelEfficiency";
		}
		if(self.currentType==3){
			url="/shipdrivinghistinfo?period="+day;
			unit="kg/nm";
			yKey="consumptionPerNm";
		}
		if(self.currentType==4){
			url="/shipvoyagehiststate?period="+day;
			unit="Kw";
			yKey="totalPower";
		}
		if(self.currentType==5){
			url="/shipefficiencyhistoptimization?period="+day;
			unit="%";
			yKey="slip";
		}
		$.getJSON(server_url+url,function(data){
			if(data.state){
        		var seriesData=new Array(),xAxisData=new Array();
        		$.each(data.result, function(index, info) {	
    		    	xAxisData.push(tool.getFormatTime(info.publishTime));
    		    	seriesData.push(info[yKey]);
                });
        		var myChart = echarts.init(document.getElementById("assessmentParameterDetailsChart"));
        		var option = {
        			    tooltip: {
        			        trigger: 'axis'
        			    },
        			    legend: {
        			    	show:false,
        			        data:[$("#gauge"+self.currentType).prev(".nt_zjmlist_tit").text()]
        			    },
        			    brush: {
        			        toolbox: ['lineX', 'clear'],
        			        xAxisIndex: 0
        			    },
        			    toolbox: {
        			        show: true,
        			        x: 10
        			    },
        			    dataZoom: [{
	    			            show: true,
	    			            realtime: true,
	    			            start: 0,
	    			            end: 100
	    			        },
	    			        {
	    			            type: 'inside',
	    			            realtime: true,
	    			            start: 0,
	    			            end: 100
	    			        }
	    			    ],
	    			    grid:{
	    			    	y2:80
	    			    },
        			    xAxis:  {
        			    	show:true,
        			        type: 'category',
        			        boundaryGap: false,
        			        data: xAxisData,
        				    axisLabel: {
        			        	textStyle:{
        			        		color:'#575758',
        			        		fontWeight:'bolder',
        				        	fontSize:18
        			        	}
        			        }
        			    },
        			    yAxis: {
        			        type: 'value',
        			        name:unit,
    				        nameTextStyle:{
    				        	color:'#575758',
    			        		fontWeight:'bolder',
    				        	fontSize:18
    				        },
        			        axisLabel: {
        			        	textStyle:{
        			        		color:'#575758',
        			        		fontWeight:'bolder',
        				        	fontSize:18
        			        	}
        			        }
        			    },
        			    series: [
        			        {
        			            name:$("#gauge"+self.currentType).prev(".nt_zjmlist_tit").text(),
        			            type:'line',
        			            data:seriesData,
        			            markLine: {
        			                data: [
        			                    {type: 'average', name: '平均值'}
        			                ]
        			            }
        			        }
        			    ]
        			};
        		//区域选择 显示平均值、最小值、最大值
        		myChart.on('brushSelected', function(params) {
        			var sum = 0;
        	        var min =Infinity;
        	        var max =0;
        	        var average=0;
        	        myChart.setOption({
         		        title: {
         		        	show:false
         		        }
         		    });
        	        if(params.batch.length>0){
        	        	 if(params.batch[0].areas.length>0){
        	        		 var coordRange=params.batch[0].areas[0].coordRange;
        	        		 var n=0;
            	        	 for(var i=0;i<seriesData.length;i++){
            	        		 if(i<=coordRange[1]&&i>=coordRange[0]){
            	        			 n++;
            	        			 sum += seriesData[i];
            	        			 min = Math.min(seriesData[i], min);
                    	             max = Math.max(seriesData[i], max);
            	        		 }
            	        	 }
            	        	 average=(sum/n).toFixed(2); 
            	        	 myChart.setOption({
                 		        title: {
                 		        	show:true,
                 		            backgroundColor: '#333',
                 		            text: '平均值:'+average+' \n' 
                 		            	+ '最小值:'+min+'\n'
                 		            	+ '最大值:'+max+'\n',
                 		            bottom: 100,
                 		            right: 100,
                 		            width: 100,
                 		            textStyle: {
                 		                fontSize: 16,
                 		                color: '#fff'
                 		            }
                 		        }
                 		    });
            	         }
        	         }
        		   
        		});
        		
        		myChart.setOption(option, true);
        	}                       
		});
	},
	
	 /**
	  * 初始化船舶航行 刷新数据已处理
	  */
	initGaugeChart:function(domid,min,max,value,unit){
		var self=this;
		var myChart = self.charts[domid];
		$("#"+domid).parent().attr("min",min).attr("max",max).attr("val",value).attr("unit",unit);
		//var range = ((max-min)).toFixed(0);
		if(!value){
			value = 0;
		}
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
		                    width: 2,
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
		            title : {
		                show: false
		            },
		            detail : {
		                show: false
		            },
		            data: [{
		                value: '',
		                name: ''
		            }]
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
		                    width: 10
		                }
		            },
		            axisTick: {
		                lineStyle: {
		                    color: "#000000",
		                    width: 2
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
			            offsetCenter: [0,-20],
			            textStyle: {
			                fontSize: 48,
			                color: "#fff"
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
			                color: "#fff"
			            },
			            offsetCenter: [0, 93]
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