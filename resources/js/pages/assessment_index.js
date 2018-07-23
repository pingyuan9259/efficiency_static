/**
 * 首页
 */
$(function(){
	$("#ship-image").rotate(0);//上:-30(min=-10),下:30 (max=10)
	$("#trim-image").rotate(90);//开始:16(min=10),结束:142(max=-10) 
	$("#slip-image").rotate(93);//开始:6(min=-100),结束:192(max=100) 
	$("#rotation-image").rotate(-90);//开始:-32(min=0),结束:-170(max=100) 
	
	$(".nt_indLeft_main ul li").hover(function(){
		$(this).find(".nt_indLeft_main_dndiv").show();
	},function(){
		$(this).find(".nt_indLeft_main_dndiv").hide();
	});
	
	assessmentIndex.init();
	assessmentIndex.initShipVoyageState();
	
	assessmentIndex.initShipState();
	
	assessmentIndex.initShipVoyageEfficiency();
	
	assessmentIndex.initShipEfficiencyOptimization();
	
	assessmentIndex.initShipvoyagestatecond();
	
	//每5秒刷新
	setInterval(function(){
		//右边=航行时间、航行距离(对地)、航行距离(对水)、燃油消耗量
		assessmentIndex.initShipvoyagestatecond();
		//左边=主机燃油效率
		assessmentIndex.initHostpropulsion();
		//中间仪表盘
		assessmentIndex.initShipEfficiencyOptimization();
		//右边 船舶状态:	状态
		assessmentIndex.initShipvoyagecondition();
		//右边 船舶状态:	能效分布
		assessmentIndex.initShipefficiencyanalysis();
		//船舶首向仪表
		assessmentIndex.initHdt();
		//船舶舵角仪表
		assessmentIndex.initRudderangle();
		//发电机燃油流量
		assessmentIndex.initDgfuelflow();
		//发电机功率
		assessmentIndex.initDgpower();
		//船舶驾驶信息
		assessmentIndex.initShipDrivingInfo();
		//船舶航行状态
		assessmentIndex.initShipState();
		
	},5000);
	
	//船舶首向仪表
	assessmentIndex.initHdt();
	//船舶舵角仪表
	assessmentIndex.initRudderangle();
	//发电机燃油流量
	assessmentIndex.initDgfuelflow();
	//发电机功率
	assessmentIndex.initDgpower();
	//初始化主机燃油效率
	assessmentIndex.initHostpropulsion();
	
	//每一小时刷新
	setInterval(function(){
		//船舶燃油效率:单位运输功燃油消耗、单位运输功CO2排放、单位距离CO2排放、单位运输量CO2排放   
		assessmentIndex.initShipVoyageEfficiency();
	
		//ECA  船舶航行报警
		assessmentIndex.initShipvoyageecawarning();
	},3600*1000);
	
	//每半小时刷新
	setInterval(function(){
		//左边=船舶燃油效率:船舶燃油效率、总体船舶功率 
		assessmentIndex.initShipVoyageState();
	},1800*1000);
	
	
	assessmentIndex.initShipDrivingInfo();
	
	assessmentIndex.initVoyagetask();
	assessmentIndex.initShipvoyageecawarning();
	assessmentIndex.initReset();
	assessmentIndex.initShipvoyagecondition();
	assessmentIndex.initShipefficiencyanalysis();
	
});
var assessmentIndex = {
	charts:{},
	/**
	 * 初始化	动态工况与历史工况
	 */
	init:function(){
		var self=this;
		
		//弹层 历史工况
		$(".nt_indbz ul li .nt_indMidtu").click(function(){
			var type=$(this).parent().index(),dom=$(this);
			var myChart = echarts.init(document.getElementById("conditionHistoryChart"));
			$.getJSON(server_url+"/shipefficiencyhistoptimization?period=1",function(data){
				//console.log("haha1");
				console.log(data);
				if(data.state){
					var seriesData1=new Array(),seriesData2=new Array(),xAxisData=new Array(),unitName="";
					$.each(data.result, function(index, info) {	
        		    	if(type==0){//滑失率 slip
        		    		seriesData1.push(info.slip);
        		    		seriesData2.push(info.fuelOilConsumption);
        		    		unitName="%";
        		    	}
        		    	if(type==1){//纵倾值trim
        		    		seriesData1.push(info.trim);
        		    		seriesData2.push(info.fuelOilConsumption);
        		    		unitName="m";
        		    	}
        		    	if(type==2){//主机转速rotation
        		    		seriesData1.push(info.rotation);
        		    		seriesData2.push(info.fuelOilConsumption);
        		    		unitName="rpm";
        		    	}
        		    	xAxisData.push(tool.getFormatTime(info.publishTime));
	                });
					var title=dom.next().children(".nt_indMidtit").text().replace(":","");
					var option = {
							title: {
						        text:title,
						        x:'center',
						        textStyle:{
						        	fontSize: 18,
						            fontWeight: 'bolder',
						            color: '#fff'
						        }
						    },
						    tooltip: {
						        trigger: 'axis'
						    },
						    legend: {
						    	show:false,
						        data:[title,"燃油消耗"]
						    },
						    toolbox: {
						        show: false
						    },
						    xAxis:  {
						    	show:false,
						    	type: 'category',
	        			        boundaryGap: false,
        				    	data: xAxisData,
        				        splitLine: {
        				            lineStyle: {
        				                type: 'solid'
        				            }
        				        },
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
						        name:unitName,
        				        nameTextStyle:{
        				        	color:'#575758',
        				        	fontWeight:'bolder',
    					        	fontSize:14
        				        },
						        axisLabel: {
						        	textStyle:{
						        		color:'#575758',
						        		fontWeight:'bolder',
							        	fontSize:14
						        	}
						        },
						        splitLine: {
						            lineStyle: {
						                type: 'solid'
						            }
						        }
						    },
						    series: [
						        {
						            name:title,
						            type:'line',
						            lineStyle:{
						            	normal:{
						            		color:"#F2BF16",
						            		width:3
						            	}
						            },
						            data:seriesData1,
						            markLine: {
						                data: [
						                    {type: 'average', name: '平均值'}
						                ]
						            }
						        }
						    ]
						};
					myChart.setOption(option, true);
					$("#nthis_dialog").children(".nx_diatcT").children(".nx_diatcL").text(title);
					tool.showDialog('nthis_dialog');
            	}
			});
		
		});
		//动态工况
		$(".nt_indbiao").click(function(){
			var myChart = echarts.init(document.getElementById("conditionChart"));
		     $.getJSON(server_url+"/fueloilefficiencyoptimization",function(data1){
        		   $.getJSON(server_url+"/shipefficiencyoptimization",function(data2){//红点
        				if(data2.state){
		        		    var seriesData0=new Array(),//拆线
		        		    seriesData1=new Array(),//红点(当前值)
		        		    seriesData2=new Array(),//绿点(优化值)
		        		    xAxisData=new Array();//转速
		        		    $.each(data1.caseLine[0], function(index, obj) {	
		        		    	seriesData0.push([data1.caseLine[0][index].toString(),parseFloat(data1.caseLine[1][index])]);
		        		    	if(data1.caseLine[0][index]==data1.rpmOptimized){
		        		    		seriesData2.push([data1.caseLine[0][index].toString(),parseFloat(data1.caseLine[1][index])]);
		        		    		$("#hullfueleffiviency2").text(data1.caseLine[1][index].toFixed(2)+" kg/nm");
		        		    	}
		        		    	if(data1.caseLine[0][index]==data1.me_rpm){
		        		    		seriesData1.push([data1.caseLine[0][index].toString(),(data1.fuelConsumptionEf*1).toFixed(2)]);
		        		    	}
		        		    	xAxisData.push(data1.caseLine[0][index].toString());
			                });
        					//优化	主机转速,船舶燃油效率,
        					$("#merpm1").text(tool.defaultString(data1.me_rpm, '--')+" rpm");
        					$("#hullfueleffiviency1").text((data1.fuelConsumptionEf*1).toFixed(2)+" kg/nm");
        					//船舶行驶速度
        					$("#shipspeed1").text(tool.defaultString(data1.speed, '--')+" kn");
        					//当前	主机转速,船舶燃油效率
        					$("#merpm2").text(tool.defaultString(data1.rpmOptimized, '--')+" rpm");
	        		    	
        					$("#eta").text(tool.getFormatTime(data2.result.publishTime));
        					
        	        		var option = {
		        				    tooltip: {
		        				        trigger: 'axis'
		        				    },
		        				    legend: {
		        				        data: ['Actual point','Suggest point'],
		        				        left: 'right',
		        				        textStyle:{
	        				        		color:'#575758',
	        				        		fontWeight:'bolder',
	        					        	fontSize:18
	        				        	}
		        				    },
		        				    xAxis:  {
		        				    	show:false,
		        				    	type: 'category',
			        			        boundaryGap: false,
		        				    	data: xAxisData,
		        				        splitLine: {
		        				            lineStyle: {
		        				                type: 'solid'
		        				            }
		        				        },
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
		        				        name:'kg/nm',
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
		        				        },
		        				        splitLine: {
		        				            lineStyle: {
		        				                type: 'solid'
		        				            }
		        				        }
		        				    },
		        				    series: [
		        				        {
		        				            name:'HULL FUEL FFFIVENCY',
		        				            type:'line',
		        				            lineStyle:{
		        				            	normal:{
		        				            		color:"#FFC000",
		        				            		width:3
		        				            	}
		        				            },
		        				            data:seriesData0
		        				        },
		        				        {
		        				            name: 'Actual point',
		        				            type: 'scatter',
		        				            itemStyle:{
		        				            	normal:{
		        				            		color:'red'
		        				            	}
		        				            },
		        				            symbolSize:20,
		        				            label: {
		        				                emphasis: {
		        				                    show: true,
		        				                    position: 'left',
		        				                    textStyle: {
		        				                        color: 'blue',
		        				                        fontSize: 16
		        				                    }
		        				                }
		        				            },
		        				            data: seriesData1
		        				        },
		        				        {
		        				            name: 'Suggest point',
		        				            type: 'scatter',
		        				            itemStyle:{
		        				            	normal:{
		        				            		color:'green'
		        				            	}
		        				            },
		        				            symbolSize:20,
		        				            label: {
		        				                emphasis: {
		        				                    show: true,
		        				                    position: 'left',
		        				                    textStyle: {
		        				                        color: 'blue',
		        				                        fontSize: 16
		        				                    }
		        				                }
		        				            },
		        				            data: seriesData2
		        				        }
		        				        
		        				    ]
		        				};
		        			myChart.setOption(option, true);
		        			tool.showDialog('nt_dialog');
        	        	}
        			});
		       });
		});
	},
	
	
	/**
	 * 船舶首向仪表
	 */
	initHdt:function(){
		var self=this;
		$.getJSON(server_url+"/shipdrivinginfo/hdtscope?period=20",function(data){
			if(data.state){
				$("#hdt").text(tool.defaultString(data.result.max, '--')+"°");
        		self.initHdtGauge("hdtGauge",data.result.min,data.result.max,0);
        	}
		});
	},
	
	/**
	 * 船舶舵角仪表
	 */
	initRudderangle:function(){
		var self=this;
		$.getJSON(server_url+"/shipdrivinginfo/rudderanglescope?period=20",function(data){
			if(data.state){
				$("#rudderangle").text(tool.defaultString(data.result.max, '--')+"°");
        		self.initRudderangleGauge("rudderangleGauge",data.result.min,data.result.max,0);
        	}
		});
	},
	
	/**
	 * 发电机燃油流量
	 */
	initDgfuelflow:function(){
		var self=this;
		$.getJSON(server_url+"/metotalfueloil",function(data){
			if(data.state){
        		$("#dgfuelflow").text(data.result.dgFuelOilConsumption+" kg/h");
        	}
		});
	},
	
	
	/**
	 * 发电机功率
	 */
	initDgpower:function(){
		var self=this;
		$.getJSON(server_url+"/dgefficiency",function(data){
			if(data.state){
	    		$.each(data.result, function(index, info) {	
			    	$("#dgpower"+info.equipmentId).text(info.power+" Kw");
	            });
	    	}
		});
	},
	
	
	
	
	/**
	  * 初始化主机燃油效率
	  */
	initHostpropulsion:function(){
		var self=this;
		$.getJSON(server_url+"/hostpropulsion",function(data){
			if(data.state){
	    		$("#mePower").text(tool.defaultString(data.result.mePower, '--')+" Kw");//主机功率
	    	}
		});
	},
	
	/**
	  * 初始化船舶燃油效率、主机燃油效率、总体船舶功率
	  */
	initShipvoyagestatecond:function(){
		var self=this;
		$.getJSON(server_url+"/shipvoyagestatecond",function(data){
			if(data.state){
	    		//1：绿，0：黄，-1：红
				//主机燃油效率(状态)
	    		self.compareValue("meFuelEfficiency",data.result.meFuelEfficiency,data.result.meFuelEfficiencyCon);//主机燃油效率(状态)
	    		//船舶燃油效率
    		   	self.compareValue("shipFuelEfficiency",data.result.shipFuelEfficiency,data.result.shipFuelEfficiencyCon);
    		   	//总体船舶功率
       			self.compareValue("totalPower",data.result.totalPower,data.result.totalPowerCon);
	    	}else{
	    		$("#meFuelEfficiency").children('p').text("--");
	    		$("#shipFuelEfficiency").children('p').text("--");
	    		$("#totalPower").children('p').text("--");
	    	}
		});
	},
	
	
	/**
	  * 初始化船舶航行状态
	  */
	initShipVoyageState:function(){
		var self=this;
		$.getJSON(server_url+"/shipvoyagestate",function(data){
			if(data.state){
				//航行时间、航行距离(对地)、航行距离(对水)、燃油消耗量
       			$("#voyageTime").text(tool.defaultStringUnit(data.result.voyageTime, "", '--'));
       			$("#vdistOverGround").text(tool.defaultStringUnit(data.result.vdistOverGround,"nm",'无效'));
       			$("#vdistInWater").text(tool.defaultStringUnit(data.result.vdistInWater,"nm",'无效'));
       			$("#tfuelOilConsumption").text(tool.defaultStringUnit(data.result.tfuelOilConsumption,"ton",'无效'));
			}
		});
	},
	
	
	/**
	  * 初始化船舶航行任务
	  */
	initVoyagetask:function(){
		var self=this;
		$.getJSON(server_url+"/voyagetask",function(data){
			if(data.state){
	   		   	var obj=data.result;
      			$("#destination").text(tool.defaultStringUnit(obj.destination, "", '--'));
      			//$("#timeOfArrival").text(tool.getLocalTime(obj.timeOfArrival));
      			//if(obj.shipDrivingInfo!=null){
      			//	$("#sog1").text(obj.shipDrivingInfo.sog+"kn");
      			//}
	   	   }
		});
	},
	
	/**
	  * 初始化重置
	  */
	initReset:function(){
		$("#reset").unbind("click").bind("click",function(){
			if(confirm("您真的确定要重置吗？\n\n请确认！")==true){ 
				$.get(server_url+"/shipvoyagereset",function(data){
					if(data.state){
				    	alert("重置成功!");
				    }else{
						alert(data.message);
					}
				});
			}
		});
	},
	
	
	/**
	  * 初始化船舶航行eca报警
	  */
	initShipvoyageecawarning:function(){
		var self=this;
		$.getJSON(server_url+"/shipvoyageecawarning",function(data){
			if(data.state){
	   		   	$("#timeToEca").text(tool.defaultStringUnit(data.result.strEcaTime, "", '--'));
     			$("#nmToEca").text(tool.defaultStringUnit(data.result.strEcaDistant, "", '--'));
	   	   }
		});
	},
	
	/**
	  * 初始化船舶航行状态
	  */
	initShipvoyagecondition:function(){
		var self=this;
		$.getJSON(server_url+"/shipvoyagecondition",function(data){
			if(data.state){
	   		   	$("#condition").text(tool.defaultStringUnit(data.result.condition, "", '--'));
	   	   }
		});
	},
	
	/**
	  * 初始化船舶能效分析
	  */
	initShipefficiencyanalysis:function(){
		$.getJSON(server_url+"/shipefficiencyanalysis",function(data){
			if(data.state){
				$(".nt_indrigECA_bot").hide();
				if(data.result.stdTotalPowerInput<data.result.totalPowerInput){
					$(".nt_indrigECA_bot").show();
				}else{
					$(".nt_indrigECA_bot").hide();
				}
	    	}
		});
	},
	/**
	  * 初始化船舶航行能效
	  */
	initShipVoyageEfficiency:function(){
		var self=this;
        $.getJSON(server_url+"/shipvoyageefficiency?period="+$("#co2Value").val(),function(data){
       	   if(data.state){
       		   	var obj=data.result;
       		   	//单位运输功燃油消耗
       		   	//self.compareValue("fuelConsumptionPerTonNm",obj.fuelConsumptionPerTonNm,obj.fuelConsumptionPerTonNmType);
       		   	$("#fuelConsumptionPerTonNm").children('p').text(tool.defaultString(obj.fuelConsumptionPerTonNm, '--'));
       		   	//单位运输功CO2排放
       		   	//self.compareValue("co2EmissionPerTonNm",obj.co2EmissionPerTonNm,obj.co2EmissionPerTonNmType);
       		   	$("#co2EmissionPerTonNm").children('p').text(tool.defaultString(obj.co2EmissionPerTonNm, '--'));
       		   	//单位距离CO2排放
       		   	//self.compareValue("co2EmissionPerNm",obj.co2EmissionPerNm,obj.co2EmissionPerNmType);
       		   	$("#co2EmissionPerNm").children('p').text(tool.defaultString(obj.fuelConsumptionPerTonNm, '--'));
       		   	//单位运输量CO2排放
          		//self.compareValue("co2EmissionPerTon",obj.co2EmissionPerTon,obj.co2EmissionPerTonType);
          		$("#co2EmissionPerTon").children('p').text(tool.defaultString(obj.co2EmissionPerTon, '--'));
       	   }else{
       		   $("#fuelConsumptionPerTonNm").children('p').text("--");
       		   $("#co2EmissionPerTonNm").children('p').text("--");
       		   $("#co2EmissionPerNm").children('p').text("--");
       		   $("#co2EmissionPerTon").children('p').text("--");
       	   }
      });
	},
	
	/**
	  * 初始化仪表盘
	  */
	initShipEfficiencyOptimization:function(){
		var self=this;
		$.ajax({
           type: "post",
           url:server_url+"/shipefficiencyoptimization",
           dataType: "json",
           success: function(data){
	           if(data.state){
	        	   $("#shipSpeed").text(tool.defaultStringUnit(data.result.rotation, "", '--'));
	        	   //$("#slip-image").rotate(slip);//开始:6(min=-100),结束:192(max=100) 
	           	}
           }
       });
		
		//滑失率与纵倾值下面颜色条	 1：绿，0：黄，-1：红
		$.getJSON(server_url+"/shipefficiencyoptimizationcond",function(data){
			if(data.state){
				
				$("#curSlip").text(tool.defaultString(data.result.slip, '--'));
        		$("#curTrim").text(tool.defaultString(data.result.trim, '--'));
        		
        		//中间仪表盘 	指针
           		var ship=30/10*(data.result.trim*-1);
           		$("#ship-image").rotate(ship);//上:-30(min=-10),下:30 (max=10)
           		var trim=(142-16)/20*data.result.trim*-1+(142-16)/2+16;
        		$("#trim-image").rotate(trim);//开始:16(min=10),结束:142(max=-10) 
        		
        		var slip=(192-6)/200*data.result.slip*-1+(192-6)/2+6;
        		$("#slip-image").rotate(slip);//开始:6(min=-100),结束:192(max=100) 
        		
        		//主机转速下面颜色条1：绿，0：黄，-1：红
        		if(data.result.rotationColor==1){//绿
        			$("#rotationColor").attr("class","nt_indbz01");
        		}
        		if(data.result.rotationColor==0){//黄
        			$("#rotationColor").attr("class","nt_indbz03");
        		}
        		if(data.result.rotationColor==-1){//红
        			$("#rotationColor").attr("class","nt_indbz02");
        		}
        		
				if(data.result.slipColor==1){//绿
        			$("#slipColor").attr("class","nt_indbz01");
        		}
        		if(data.result.slipColor==0){//黄
        			$("#slipColor").attr("class","nt_indbz03");
        		}
        		if(data.result.slipColor==-1){//红
        			$("#slipColor").attr("class","nt_indbz02");
        		}
        		
        		if(data.result.trimColor==1){//绿
        			$("#trimColor").attr("class","nt_indbz01");
        		}
        		if(data.result.trimColor==0){//黄
        			$("#trimColor").attr("class","nt_indbz03");
        		}
        		if(data.result.trimColor==-1){//红
        			$("#trimColor").attr("class","nt_indbz02");
        		}
        	}else{
        		$("#curSlip").text('--');
        		$("#curTrim").text('--');
        	}
		});
		
		//主机转速
		$.getJSON(server_url+"/fueloilefficiencyoptimization",function(data){
			$("#curRotation").text(tool.defaultString(data.me_rpm, '--'));
			
			var rotation=-((170-32)/100*(100-data.me_rpm)+32);
    		$("#rotation-image").rotate(rotation);//开始:-32(min=0),结束:-170(max=100) 
    		
			$("#rotationImg").attr("src",server_url+"/resources/images/index/icon_jt"+data.rpmOptCond+"_2.png");
			$("#lastRotation").text(tool.defaultString(data.rpmOptimized, '--'));
		});
		
		//主机燃油流量
		$.getJSON(server_url+"/hostfueloil",function(data){
			if(data.state){
        		$("#meFoFlow").text(tool.defaultString(data.result.meFoFlow, '--')+" kg/h");
        	}
		});
		//锅炉燃油流量
		$.getJSON(server_url+"/boilerfueloil",function(data){
			if(data.state){
        		$("#foTotalFlow").text(tool.defaultString(data.result.foTotalFlow, '--')+" kg/h");
        	}
		});
		
	},
	
	
	 /**
	  * 初始化船舶航行信息
	  */
	initShipDrivingInfo:function(){
		var self=this;
		$.ajax({
           type: "post",
           url:server_url+"/shipdrivinginfo",
           dataType: "json",
           success: function(data){
           	if(data.state){
           		$("#windDiration").text(tool.defaultString(data.result.windDiration, '--')+"°");
           		$("#windSpeed").text(tool.defaultString(data.result.windSpeed, '--')+"");
           		self.initwindDirationGauge("windDirationGauge", tool.defaultString(data.result.windDiration, '--'));
           		
           		$("#drivingInfoTime").text(tool.defaultString(tool.getLocalTime(data.result.utc), '--'));
           		
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
           		$("#drivingInfoLon").text(tool.defaultString(tool.formatDegree(data.result.lon), '--')+" "+lonStr);
           		$("#drivingInfoLat").text(tool.defaultString(tool.formatDegree(data.result.lat), '--')+" "+latStr);
           		
           		$("#rot").text(tool.defaultString(data.result.rot, '--'));
           		var rot=5*data.result.rot+50;
           		$("#rotProgress").width(rot+"%");
           		
           		//$("#shipSpeed").text(data.result.shipSpeed);
           		
           		$("#shipSpeedProgress").width(data.result.shipSpeed+"%");
           		
           		$("#stw").text(tool.defaultString(data.result.stw, '--'));
           		var stw=100/30*data.result.stw;
           		$("#stwProgress").width(stw+"%");
           		
           		$("#sog").text(tool.defaultString(data.result.sog, '--'));
           		var sog=100/30*data.result.sog;
           		$("#sogProgress").width(sog+"%");
           		
           		$(".nt_indrightRm").hide();
           		$(".nt_indrightRm").eq(data.result.telegraph-1).show();
           		
           		$("#hdt").text(tool.defaultString(data.result.hdt, '--')+"°");//船艏向
           		$("#rudderangle").text(tool.defaultString(data.result.rudderAngle, '--')+"°");//舵角
           		
           		//0:绿，1：黄
           		self.setOnOff("bridge",data.result.bridge);
           		self.setOnOff("atsea",data.result.atsea);
           		self.setOnOff("ecr",data.result.ecr);
           		self.setOnOff("standby",data.result.standby);
           		self.setOnOff("local",data.result.local);
           		self.setOnOff("few",data.result.few);
           	}
           }
       });
	},
	
	setOnOff:function(domid,value){
		if(value==1){//0:绿，1：黄
   			$("#"+domid).attr("class","nt_indrightquanorg");
   		}else{
   			$("#"+domid).attr("class","nt_indrightquangreen");
   		}
	},
	
	 /**
	  * 初始化船舶状态
	  */
	initShipState:function(){
		$.ajax({
            type: "post",
            url:server_url+"/shipstate",
            dataType: "json",
            success: function(data){
            	if(data.state){
            		$("#fwdDraught").text(tool.defaultString(data.result.fwdDraught, '--')+" m");
            		$("#aftDraught").text(tool.defaultString(data.result.aftDraught, '--')+" m");
            		$("#portDraught").text(tool.defaultString(data.result.portDraught, '--')+" m");
            		$("#stbdDraught").text(tool.defaultString(data.result.stbdDraught, '--')+" m");
            		$("#waterDepth").text(tool.defaultString(data.result.waterDepth, '--')+" m");
            		$("#heelAngle").text(tool.defaultString(data.result.heelAngle, '--')+" °");
            		$("#trimAngle").text(tool.defaultString(data.result.trimAngle, '--')+" °");
            	}
            }
        });
	},
	
	 /**
	  * 初始化船艏向 刷新数据已处理
	  */
	initHdtGauge:function(domid,min,max,value){
		var self=this;
		var myChart = self.charts[domid];
		
		var mid=0.25,splitNumber=1/360;
		var red="#a92014",white="#fff",color1="#fff",color2="#fff",color3="#fff",color4="#fff";
		if(max<90){
			color1=white;
			color2=white;
			color3=red;
			color4=white;
			min=min*splitNumber+mid;
			max=max*splitNumber+mid;
		}else if(min>270){
			color1=white;
			color2=red;
			color3=red;
			color4=white;
			min=(min-270)*splitNumber;
			max=(max-270)*splitNumber;
		}else if(max<270){
			color1=white;
			color2=white;
			color3=red;
			color4=white;
			min=min*splitNumber+mid;
			max=max*splitNumber+mid;
		}else if(max>270){
			color1=white;
			color2=red;
			color3=white;
			color4=red;
			var t=min;
			min=(max-270)*splitNumber;
			max=t*splitNumber+mid;
		}else{
			color1='#999999';
			color2='#999999';
			color3=red;
			color4='#999999';
			min=min*splitNumber+mid;
			max=max*splitNumber+mid;
		}
		if(myChart!=undefined&&myChart!=null){
			//更新数据
			var option = myChart.getOption();
		      option.series[0].axisLine.lineStyle.color = [[0, color1],[min, color2], [max, color3], [1, color4]];  
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
			        type: 'gauge',
			        splitNumber: 12,     //刻度数量
			        startAngle:0,
			        endAngle:359.9,
			        clockwise:false,
			        radius: '90%',      //图表尺寸
			        axisLine: {
			            show: true,
			            length: -2,
			            lineStyle: {
			                width: 1,
			                shadowBlur: 0,
			                color: [[0, color1],[min, color2], [max, color3], [1, color4]]
			            }
			        },
			        axisTick: {
			            show: true,
			            lineStyle: {
			                color: "#999999",
			                width: 0,
			            },
			            length: -1,
			            splitNumber: 0
			        },
		            splitLine: { //分隔线样式
		                show: false,
		            },
		            axisLabel: { //刻度标签
		                show: false,
		            },
		            axisTick: { //刻度样式
		                show: true,
			            lineStyle: {
			                color: "#999999",
			                width: 1
			            },
			            length: -2,
			            splitNumber: 2
		            },
			        pointer: {
			            show: false,
			        },
			        detail: {           //指针评价
			            show:false,
			        },
			        data: [{
			            name: "",
			            value: 0
			        }]
			    },{
		            name: '黑色外圈细',
		            type: 'gauge',
		            radius: '100%',
		            startAngle: 359.9,
		            endAngle: 0,
		            axisLine: { // 坐标轴线
		                lineStyle: { // 属性lineStyle控制线条样式
		                    color: [
		                        [1, '#999999']
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
		        }]
			};
		myChart.setOption(option, true);
		self.charts[domid]=myChart;
	},
	
	 /**
	  * 初始化船舵角 刷新数据已处理
	  */
	initRudderangleGauge:function(domid,min,max,value){
		var self=this;
		var myChart = self.charts[domid];
		if(max>0){
			max=-(90-max);
			min=-90;
		}else{
			min=-90+max;
			max=-90;
		}
		if(myChart!=undefined&&myChart!=null){
			//更新数据
		      var option = myChart.getOption();
		      option.series[1].startAngle = max;  
		      option.series[1].endAngle = min; 
		      
		      myChart.setOption(option);  
	          return;
	    }
		myChart = echarts.init(document.getElementById(domid));
		var option = {
			    series: [{
			        type: 'gauge',
			        splitNumber: 0,     //刻度数量
			        startAngle:-50,
			        endAngle:-130,
			        radius: '93%',      //图表尺寸
			        axisLine: {
			            show: true,
			            lineStyle: {
			                width: 1,
			                shadowBlur: 0,
			                color: [
			                    [0, '#fff'],
			                    [1, '#fff']
			                ]
			            }
			        },
			        splitLine: {
			            show: true,
			            length: -0,
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
			            show:false,
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
			            name: "",
			            value: 0
			        }]
			    },{
			        type: 'gauge',
			        splitNumber: 0,     //刻度数量
			        startAngle:max,
			        endAngle:min,
			        radius: '93%',      //图表尺寸
			        axisLine: {
			            show: true,
			            lineStyle: {
			                width: 2,
			                shadowBlur: 0,
			                color: [
			                    [0, '#C1240A'],
			                    [1, '#C1240A']
			                ]
			            }
			        },
			        splitLine: {
			            show: true,
			            length: -0,
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
			            show:false,
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
			            name: "",
			            value: 0
			        }]
			    }]
			};
		myChart.setOption(option, true);
		self.charts[domid]=myChart;
	},
	
	/**
	  * 初始化船舶风向 刷新数据已处理
	  */
	initwindDirationGauge:function(domid,value){
		var self=this;
		var myChart = self.charts[domid];
		var int_value = (value*1+90).toFixed(0);
		if(value>270){
			int_value = (value*1-270).toFixed(0);
		}
		if(myChart!=undefined&&myChart!=null){
			//更新数据
			var option = myChart.getOption();
		      option.series[0].axisLabel.formatter = function(v) {
												    	  if (v == int_value) return '•';
										                  else return '';
										              }; 
		      myChart.setOption(option);  
		      return;
	     }
		myChart = echarts.init(document.getElementById(domid));
		var option = {
			    series: [{
		            type: "gauge",
		            startAngle: 0,
		            endAngle: 359.9,
		            min: 0 ,
		            max: 360,
		            radius: '100%',      //图表尺寸
		            splitNumber:360,
		            clockwise:false,
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
		                distance: 52,
		                formatter: function(v) {
		                	 if (v >= int_value && v <= int_value) return '•';
			                    else return '';
		                },
		                textStyle: {
		                    color: "#fb5310",
		                    fontSize:25
		                }
		            },
		            splitLine: {
		                show: true,
		                length: 1,
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
		                value: int_value
		            }]
		        }]
			};
		myChart.setOption(option, true);
		self.charts[domid]=myChart;
	},
	compareValue:function(domid,value,type){
		value=tool.defaultString(value,'--');
		if(type!=null&&value!="--"){
			value=parseFloat(value).toFixed(2);
			if(type==-100){
				$("#"+domid).children('img').attr("src",server_url+"/resources/images/index/icon_blank.png");
			}else{
				if(parseFloat($("#"+domid).children('p').text())==value){
		 			$("#"+domid).children('img').attr("src",server_url+"/resources/images/index/icon_jt"+type+"_2.png");
		 		}else if(parseFloat($("#"+domid).children('p').text()) < parseFloat(value)){
		 			$("#"+domid).children('img').attr("src",server_url+"/resources/images/index/icon_jt"+type+"_1.png");
		 		}else{
		 			$("#"+domid).children('img').attr("src",server_url+"/resources/images/index/icon_jt"+type+"_3.png");
		 		}
			} 
		}
		$("#"+domid).children('p').text(value);
	}
}