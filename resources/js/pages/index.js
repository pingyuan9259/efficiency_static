/**
 * 首页
 */
$(function(){
	index.init();
	index.initHeader();
	//每5秒刷新
	setInterval(function(){
		index.init();
	},5000);
	
});
var index = {
	charts:{},
	type:0,
	/**
	 * 初始化	动态工况与历史工况
	 */
	init:function(){
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
		
		
		$.getJSON(server_url+"/hostpropulsionbearing",function(data){
			if(data.state){
				//主机轴功率
				//self.compareValue("shaftPower",data.result.shaftPower,data.result.shaftPowerType);
				$("#shaftPower").children('p').text(tool.defaultString(data.result.shaftPower, '--'));
	    		//主机轴转速
	    		//self.compareValue("shaftSpeed",data.result.shaftSpeed,data.result.shaftSpeedType);
				$("#shaftSpeed").children('p').text(tool.defaultString(data.result.shaftSpeed, '--'));
	    	}else{
	    		$("#shaftPower").children('p').text("--");
	    	}
		});
		
		
		$.getJSON(server_url+"/shipdrivinginfo",function(data){
           	if(data.state){
           		$("#windDiration").text(tool.defaultString(data.result.windDiration, '--')+"°");
           		self.initwindDirationGauge("windDirationGauge",data.result.windDiration);
           		
           		$("#utc").text(tool.getLocalTime(data.result.utc));
           		
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
           		$("#lon").text(tool.formatDegree(data.result.lon)+" "+lonStr);
           		$("#lat").text(tool.formatDegree(data.result.lat)+" "+latStr);
           		
           		$("#rot").text(tool.defaultString(data.result.rot, '--'));
           		
           		$("#shipSpeed").text(tool.defaultString(data.result.shipSpeed, '--'));
           		$("#shipspeed1").text(tool.defaultString(data.result.shipSpeed, '--')+" kn");
           		$("#stw").text(tool.defaultString(data.result.stw, '--'));
           		$("#sog").text(tool.defaultString(data.result.sog, '--'));
           		
           		$("#hdt").text(tool.defaultString(data.result.hdt, '--')+"°");//船艏向
           		$("#rudderangle").text(tool.defaultString(data.result.rudderAngle, '--')+"°");//舵角
           		
           		//海里油耗
           		//self.compareValue("consumptionPerNm",data.result.consumptionPerNm,data.result.consumptionPerNmType);
           		$("#consumptionPerNm").children('p').text(tool.defaultString(data.result.consumptionPerNm, '--'));
           	}
       });
		
		
		//主机转速
		$.getJSON(server_url+"/fueloilefficiencyoptimization",function(data){
			$("#curRotation").text(tool.defaultString(data.me_rpm,'--'));
			$("#rotationImg").attr("src",server_url+"/resources/images/index/icon_jt"+data.rpmOptCond+"_2.png");
			$("#lastRotation").text(tool.defaultString(data.rpmOptimized,'--'));
		});
		
		//滑失率与纵倾值下面颜色条	 1：绿，0：黄，-1：红
		$.getJSON(server_url+"/shipefficiencyoptimizationcond",function(data){
			if(data.state){
				$("#curSlip").text(tool.defaultString(data.result.slip,'--'));
        		$("#curTrim").text(tool.defaultString(data.result.trim,'--'));
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
		
		//船舶首向仪表
		$.getJSON(server_url+"/shipdrivinginfo/hdtscope?period=20",function(data){
			if(data.state){
				$("#hdt").text(tool.defaultString(data.result.max, '--')+"°");
        		self.initHdtGauge("hdtGauge",data.result.min,data.result.max,0);
        	}
		});
		
		//船舶舵角仪表
		$.getJSON(server_url+"/shipdrivinginfo/rudderanglescope?period=20",function(data){
			if(data.state){
				$("#rudderangle").text(tool.defaultString(data.result.max, '--')+"°");
        		self.initRudderangleGauge("rudderangleGauge",data.result.min,data.result.max,0);
        	}
		});

		//目的港
		$.getJSON(server_url+"/voyagetask",function(data){
			if(data.state){
      			$("#destination").text(tool.defaultString(data.result.destination, '--'));
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
		                distance: 120,
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
		 		}else if(parseFloat($("#"+domid).children('p').text())<parseFloat(value)){
		 			$("#"+domid).children('img').attr("src",server_url+"/resources/images/index/icon_jt"+type+"_1.png");
		 		}else{
		 			$("#"+domid).children('img').attr("src",server_url+"/resources/images/index/icon_jt"+type+"_3.png");
		 		}
			}
			
		}
		$("#"+domid).children('p').text(tool.defaultString(value, '--'));
	},
	
	initHeader:function(){
		var self=this;
		$("#options").multiSelect({
			noneSelected: "====请选择====",
			selectAll:false,
	        listHeight:200
	    });
		$.getJSON(server_url+"/checklogin",function(data){
			if(data.state){
				$("#loginname").text(tool.defaultString(data.result.username, '--'));
				$("#loginname").show();
				$("#logout").show();
				$("#login").hide();
			}else{
				$("#loginname").hide();
				$("#logout").hide();
				$("#login").show();
			}
		});
		
		//设置
		$("#setting").click(function(){
			tool.showDialog('setting_dialog');
		});
		
		//能效系统
		$("#efficiency_sys").click(function(){
			$.getJSON(server_url+"/checklogin",function(data){
				if(data.state){
					if(data.result.type==0||data.result.permission==1){
						window.location.href=$("#efficiency_sys").attr("data-url");
					}else{
						alert("您没有智能能效系统权限,请联系管理员!");
					}
				}else{
					$('#login').trigger("click");
					self.type=1;
				}
			});
		});
		
		//健康系统
		$("#health_sys").click(function(){
			$.getJSON(server_url+"/checklogin",function(data){
				console.log(data);
				if(data.state){
					if(data.result.type==0||data.result.permission==2){
						window.location.href=$("#health_sys").attr("data-url");
					}else{
						alert("您没有健康管理系统权限,请联系管理员!");
					}
				}else{
					$('#login').trigger("click");
					self.type=2;
				}
			});
		});
		
		//登录
		$("#login").click(function(){
			tool.showDialog('login_dialog');
		});
		//登录
		$(".loginBtn").unbind("click").bind("click",function(){
			var username=$(".username").val();
			var password=$(".password").val();
			if(username!=""&&password!=""){ 
				$.post(server_url+"/login",{username:username,password:password},function(data){
					if(data.state){
				    	alert("登录成功!");
				    	$("#loginname").text(tool.defaultString(username, '--'));
				    	$("#loginname").show();
						$("#logout").show();
						$("#login").hide();
				    	tool.closeDialog();
				    	if(self.type==1){
				    		if(data.result.type==0||data.result.permission==1){
								window.location.href=$("#efficiency_sys").attr("data-url");
							}else{
								alert("您没有智能能效系统权限,请联系管理员!");
							}
				    	}
				    	if(self.type==2){
				    		if(data.result.type==0||data.result.permission==2){
								window.location.href=$("#health_sys").attr("data-url");
							}else{
								alert("您没有健康管理系统权限,请联系管理员!");
							}
				    	}
				    }else{
						alert(data.message);
					}
				});
			}
		});
		//配置
		$(".saveSysparam").unbind("click").bind("click",function(){
			var options=new Array();
			$("#options").parent().children(".multiSelectOptions").find("input:checkbox:checked").each(function(i,item){
				if($(item).attr("value")!=undefined){
					options.push($(item).attr("value"));
				}
	        }); 
			if(options.length>4){
	        	alert("能效设备配置最多只能选择4项!");
	        	return ;
	        }
			if(confirm("您真的确定要参数配置吗？\n\n请确认！")==true){ 
				$.post(server_url+"/sysparam/save",{code:"co2",value:$("#co2Value").val(),options:options.join(";")},function(data){
					if(data.state){
				    	alert("参数配置成功!");
				    }else{
						alert(data.message);
					}
				});
			}
		});
		//退出
		$("#logout").bind("click",function(){
			if (confirm("您真的确定要退出吗？\n\n请确认！")==true){ 
				$.getJSON(server_url+"/logout",function(data){
					if(data.state){
						$("#loginname").hide();
						$("#logout").hide();
						$("#login").show();
						alert("退出成功!");
					}else{
						alert("退出失败!");
					}
				});
				self.type=0;
			}
		});
		
	}
}