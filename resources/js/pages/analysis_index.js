/**
 * 首页
 */
$(function(){
	
	analysisIndex.initPer();
	analysisIndex.initEfficiencyPower();
	
	analysisIndex.init();
	
	analysisIndex.initCurrentInfo();
	//每5秒刷新
	setInterval(function(){
		//船舶燃油效率、主机燃油效率、总体船舶功率
		analysisIndex.initEfficiencyPower();
		//当前信息
		//analysisIndex.initCurrentInfo();
	},5000);
	//每5分钟刷新
	setInterval(function(){
		analysisIndex.initLineChart();
	},300000);
	//每一小时刷新
	setInterval(function(){
		//船舶燃油效率:单位运输功燃油消耗、单位运输功CO2排放、单位距离CO2排放、单位运输量CO2排放   
		analysisIndex.initPer();
	},3600*1000);
	
	setInterval(function(){
		$("#curtime").text(tool.getNowFormatDate());
	},1000);
	
});
var analysisIndex = {
	charts:{},
	map:null,
	currentType:0,
    zoom:0,
	shipLayer:null,
	voyageLayer:null,
	positions:new Array(),
	positionArray:new Array(),
	result:null,
	
	/**
	 * 初始化
	 */
	init:function(){
		var self=this;
		
		$(".nt_nxleft_biao ul li").click(function(){
			if($(this).index()<3){
				$(this).addClass("nt_nxleft_biaoon").siblings().removeClass("nt_nxleft_biaoon");
				$(".nt_diaRight").show();
				$(".nt_diaRight .nx_diatcT .nx_diatcL").text($(this).attr("title"));
				self.currentType=$(this).index();
				self.initLineChart();
			}
		});
		
		//选择天数进行查询 图表数据(线形)
		$("#selectDay").change(function(){
			self.initLineChart();
		});
		
		$(".nx_diatcR").click(function(){
			$(".nt_diaRight").hide();
			$(".nt_nxleft_biao ul li").removeClass("nt_nxleft_biaoon");
		});
		
		$(".nt_nxfximg img").click(function(){
			self.initBarChart();
			tool.showDialog("nxfx_dialog");
		});
		$("#clickOk").click(function(){
			self.initBarChart();
		});
		
	    var wmsLayer = new ol.layer.Tile({
	        source:  new ol.source.TileWMS({
		            url: geoserver_url,
		            params: {'FORMAT': 'image/png',
			             	STYLES: '',
			             	LAYERS: geoserver_layerName ,
			       },
			       wrapX: false 
		      })
	      });
		
	    self.shipLayer = new ol.layer.Vector({
		    source: new ol.source.Vector({
		        type: 'LineString',
		        features: []
		    }),
		    style: new ol.style.Style({
		        fill: new ol.style.Fill({
		            color: '#0044CC'
		        }),
		        stroke: new ol.style.Stroke({
		            color: '#0044CC',
		            width: 4
		        })
		    })
		});
	    
	    self.voyageLayer = new ol.layer.Vector({
		    source: new ol.source.Vector({
		        features: []
		    })
		});
		
		self.map = new ol.Map({
	        target: 'map',
	        layers: [
	        	wmsLayer,
	        	self.shipLayer,
	        	self.voyageLayer
	        ],
	        view: new ol.View({
	           projection: new ol.proj.Projection({
		   		    code: 'EPSG:4326',
				    units: 'degrees',
				    axisOrientation: 'neu',
				    global: true
				}),
	           extent: [-180, -59.484295,180, 83.627357],
	           center: [29.577017,10],
	           zoom: 3,
	           maxZoom:11,
	           minZoom:3
	        })
	    });
		self.zoom=3;
		
		var popup = new ol.Overlay({
	        element:document.getElementById('popup'),
	        positioning: 'bottom-center',
	        stopEvent: false,
	        offset: [0, 410]
	      });
	      self.map.addOverlay(popup);
	      self.map.on('click', function(evt) {
	        var feature = self.map.forEachFeatureAtPixel(evt.pixel,function(feature) {
	              return feature;
	            });
	        if (feature) {
	          	popup.setPosition(feature.getGeometry().getCoordinates());
	          	var voyageInfo=feature.getProperties().voyageInfo;
	          	$("#time").text(tool.getFormatTime(voyageInfo.publishTime));
	          	$("#hullFuelEfficiency").text(tool.defaultString(voyageInfo.hullFuelEfficiency, '--')+" KG/nm");
	          	
	          	$("#sog").text("");
	          	$("#cog").text("");
	          	$("#windSpeed").text("");
	          	$("#windDiration").text("");
	          	$("#meRpm").text("");
	          	$("#slipRate").text("");
	          	
	          	$.getJSON(server_url+"/shipefficiencyanddriverinfo?time="+voyageInfo.publishTime,function(data){
	    			if(data.state){
	    				if(data.result.efficiency!=undefined&&data.result.efficiency!=null){
	    					$("#slipRate").text(tool.defaultString(data.result.efficiency.slip, '--')+" %");
	    					$("#meRpm").text(tool.defaultString(data.result.efficiency.rotation, '--')+" rpm");
	    				}
	    				if(data.result.drivingInfo!=undefined&&data.result.drivingInfo!=null){
	    					$("#sog").text(tool.defaultString(data.result.drivingInfo.sog, '--')+" n");
	    		          	$("#cog").text(tool.defaultString(data.result.drivingInfo.hdt, '--')+" °");
	    		          	
	    		          	$("#windSpeed").text(tool.defaultString(data.result.drivingInfo.windSpeed, '--')+" m/s");
	    		          	$("#windDiration").text(tool.defaultString(data.result.drivingInfo.windDiration, '--')+" °");
	    				}
	            	}
	    		});
	          	
	          	$("#popup").show();
	        } else {
	        	$("#popup").hide();
	        }
	      });
	      
	    self.map.on('moveend', function(evt) {
	    	  if(self.map.getView().getZoom()!=self.zoom){
	    		  self.zoom=self.map.getView().getZoom();
	    		  self.initZoom();
	    	  }
	    });
		self.initShipVoyage();
		$("#query").click(function(){
			self.initShipVoyage();
		});
		$("#play").click(function(){
			self.startAnimation();
		});
		$("#stop").click(function(){
			self.stopAnimation();
		});
		$("#end").click(function(){
			self.stopAnimation();
		});
	},
	
	
	initZoom:function(){
		var self=this;
		var midStyle = new ol.style.Style({
		    image: new ol.style.Icon(({
		        src: server_url+'/resources/images/point-blue.png',
		        anchor: [0.5, 0.5],
		        scale:0.8
		    }))
		});
		self.voyageLayer.getSource().clear();
		for(var i=1;i<self.positionArray.length-1;i++){
			var midFeature = new ol.Feature({
		        geometry: new ol.geom.Point(self.positionArray[i]),
		        voyageInfo:self.result[self.positionArray[i][2]]
		    });
			midFeature.setStyle(midStyle);
			if((self.zoom==3||self.zoom==4)&&i%3==0){
				self.voyageLayer.getSource().addFeature(midFeature);
			}
			if((self.zoom==5||self.zoom==6)&&i%2==0){
				self.voyageLayer.getSource().addFeature(midFeature);
			}
			if(self.zoom>6){
				self.voyageLayer.getSource().addFeature(midFeature);
			}
		}
	},
	
	/**
	 * 当前信息
	 * 时间
	 * 平均速度
	 * 平均转速
	 * 主机燃油总消耗
	 * 发电机燃油总消耗
	 * 锅炉燃油总消耗
	 */
	initCurrentInfo:function(){
		$.getJSON(server_url+"/shipvoyagestate",function(data){
			if(data.state){
        		$("#totalFuelConsumption").text(tool.defaultStringUnit(data.result.hostFuelOilConsumption,"Kg",'无效'));
        		$("#totalDynamoConsumption").text(tool.defaultStringUnit(data.result.dgFuelOilConsumption,"Kg",'无效'));
        		$("#boilerhfoconsumption").text(tool.defaultStringUnit(data.result.boilerFuelOilConsumption,"Kg",'无效'));
        		//$("#speedAvg").text(tool.defaultStringUnit(data.result.avgSpeed," kn",'无效'));
        		//$("#rpmAvg").text(tool.defaultStringUnit(data.result.avgRotation," rpm",'无效'));
        	}
		});
	},
	
	
	/**
	* 船舶燃油效率，HULL Fuel Efficiency，单位KG/nm；
	* 主机燃油效率，ME Fuel Efficiency，单位g/kwh；
	* 总体船舶功率，Total Power，单位Kw；
	 */
	initEfficiencyPower:function(){
		var self=this;
		$.getJSON(server_url+"/shipvoyagestate",function(data){
			if(data.state){
        		self.initGaugeChart("hullFuelEfficiencyGauge","Vessel Fuel\nEfficiency",0,500,tool.defaultString(data.result.hullFuelEfficiency,'0'),"KG/nm");//船舶燃油效率，HULL Fuel Efficiency，单位KG/nm；
        		self.initGaugeChart("totalPowerGauge","Total Power",0,20000,tool.defaultString(data.result.totalPower,'0'),"Kw");//总体船舶功率，Total Power，单位Kw；
        	}else{
        		self.initGaugeChart("hullFuelEfficiencyGauge","HULL Fuel\nEfficiency",0,500,0,"KG/nm");//船舶燃油效率，HULL Fuel Efficiency，单位KG/nm；
        		self.initGaugeChart("totalPowerGauge","Total Power",0,20000,0,"Kw");//总体船舶功率，Total Power，单位Kw；
        	}
		});
		$.getJSON(server_url+"/hostpropulsion",function(data){
			if(data.state){
        		self.initGaugeChart("meFuelEfficiencyGauge","ME Fuel\nEfficiency",0,600,tool.defaultString(data.result.meFuelEfficiency,'0'),"g/kwh");//主机燃油效率，ME Fuel Efficiency，单位g/kwh；
        	}else{
        		self.initGaugeChart("meFuelEfficiencyGauge","ME Fuel\nEfficiency",0,600,0,"g/kwh");
        	}
		});
	},
	
	/**
	* 单位运输功燃油消耗，Fuel Consumption per ton*nm，单位kg/ton*nm(kg/ton货物.nm)；
	* 单位运输功CO2排放，CO2 Emission per ton*nm，单位kg/ton*nm(kgCO2/ton货物.nm)；
	* 单位距离CO2排放，CO2 Emission per nm，单位kg/nm(kgCO2/nm)； 
	* 单位运输量CO2排放，CO2 Emission per ton，单位kg/ton (kgCO2/ton货物)。
	 */
	initPer:function(){
		var self=this;
		$.getJSON(server_url+"/shipvoyageefficiency?period="+$("#co2Value").val(),function(data){
			if(data.state){
        		self.initGaugeChart("fuelConsumptionPerTonNmGauge","Fuel Consumption\nper ton*nm",0,100,tool.defaultString(data.result.fuelConsumptionPerTonNm,'0'),"kg/ton*nm");//单位运输功燃油消耗，Fuel Consumption per ton*nm，单位kg/ton*nm(kg/ton货物.nm)；
        		self.initGaugeChart("co2EmissionPerTonNmGauge","CO2 Emission\nper ton*nm",0,100,tool.defaultString(data.result.co2EmissionPerTonNm,'0'),"kg/ton*nm");//单位运输功CO2排放，CO2 Emission per ton*nm，单位kg/ton*nm(kgCO2/ton货物.nm)；
        		self.initGaugeChart("co2EmissionPerNmGauge","CO2 Emission\nper nm",0,100,tool.defaultString(data.result.co2EmissionPerNm,'0'),"kg/nm");//单位距离CO2排放，CO2 Emission per nm，单位kg/nm(kgCO2/nm)； 
        		self.initGaugeChart("co2_Emission_per_tonGauge","CO2 Emission\nper ton",0,100,tool.defaultString(data.result.co2EmissionPerTon,'0'),"kg/ton");//单位运输量CO2排放，CO2 Emission per ton，单位kg/ton (kgCO2/ton货物)。
			}else{
				self.initGaugeChart("fuelConsumptionPerTonNmGauge","Fuel Consumption\nper ton*nm",0,100,0,"kg/ton*nm");//单位运输功燃油消耗，Fuel Consumption per ton*nm，单位kg/ton*nm(kg/ton货物.nm)；
        		self.initGaugeChart("co2EmissionPerTonNmGauge","CO2 Emission\nper ton*nm",0,100,0,"kg/ton*nm");//单位运输功CO2排放，CO2 Emission per ton*nm，单位kg/ton*nm(kgCO2/ton货物.nm)；
        		self.initGaugeChart("co2EmissionPerNmGauge","CO2 Emission\nper nm",0,100,0,"kg/nm");//单位距离CO2排放，CO2 Emission per nm，单位kg/nm(kgCO2/nm)； 
        		self.initGaugeChart("co2_Emission_per_tonGauge","CO2 Emission\nper ton",0,100,0,"kg/ton");//单位运输量CO2排放，CO2 Emission per ton，单位kg/ton (kgCO2/ton货物)。

			}
		});
	},
	
	
	 /**
	  * 初始化船舶航行航线轨迹
	  */
	initShipVoyage:function(){
		var self=this;
		var startStyle = new ol.style.Style({
		    image: new ol.style.Icon(({
		         src: server_url+'/resources/images/point3.png',
		         anchor: [0.5, 0.5],
		         scale:2
		    }))
		});
		
		var endStyle = new ol.style.Style({
		    image: new ol.style.Icon(({
		        src: server_url+'/resources/images/point-red.png',
		        anchor: [0.5, 0.5],
		        scale:1.2
		    }))
		});
		var begin=$("#startDate").val(),end=$("#endDate").val();
		self.shipLayer.getSource().clear();
		if(begin==""||end==""){
			return;
		}
		
		$.getJSON(server_url+"/shipvoyagestatedatetime?begin="+begin+"&end="+end,function(data){
			if(data.state){
        		//$("#totalFuelConsumption").text(tool.defaultStringUnit(data.result.hostFuelOilConsumption,"Kg",'无效'));
        		//$("#totalDynamoConsumption").text(tool.defaultStringUnit(data.result.dgFuelOilConsumption,"Kg",'无效'));
        		//$("#boilerhfoconsumption").text(tool.defaultStringUnit(data.result.boilerFuelOilConsumption,"Kg",'无效'));
        		$("#speedAvg").text(tool.defaultStringUnit(data.result.avgSpeed," kn",'无效'));
        		$("#rpmAvg").text(tool.defaultStringUnit(data.result.avgRotation," rpm",'无效'));
        	}
		});
		
		
        $.getJSON(server_url+"/shipvoyagetimestate",{begin:begin,end:end,interval:60},function(data){
           	if(data.state){
           		var startPoint,endPoint,midPoint;
           		self.positions=new Array();
           		self.result=data.result;
           		$.each(data.result, function(index, voyageInfo) {	
           			if(voyageInfo.lon!=null&&voyageInfo.lat!=null
           					&&voyageInfo.lon!="null"&&voyageInfo.lat!="null"){
               			self.positions.push([parseFloat(voyageInfo.lon.replace("N","")),parseFloat(voyageInfo.lat.replace("N",""))]);
               			if(index==0){
                    	  var startPoint = new ol.Feature({//起点
                 		        geometry: new ol.geom.Point([parseFloat(voyageInfo.lon),parseFloat(voyageInfo.lat)]),
                 		        voyageInfo:voyageInfo
                 		    });
                     		startPoint.setStyle(startStyle);
                 		    self.shipLayer.getSource().addFeature(startPoint);
               			}else if(index==data.result.length-1){
                    	  var endPoint = new ol.Feature({//终点
                 		        geometry: new ol.geom.Point([parseFloat(voyageInfo.lon),parseFloat(voyageInfo.lat)]),
                 		        voyageInfo:voyageInfo
                 		    });
                 		 	endPoint.setStyle(endStyle);
                 		    self.shipLayer.getSource().addFeature(endPoint);
               			} 
           			}
              });
           		var lineString=new ol.geom.LineString(self.positions);
           		var lineFeature = new ol.Feature({//路线
           	        geometry: lineString,
           	    });
           		//self.shipLayer.getSource().addFeature(lineFeature);
            	self.positionArray=tool.makePath(self.positions,1);
            	self.initZoom();
            	self.positions=tool.makePath(self.positions,lineString.getLength()/self.speed);
            	self.index=0;
           	}
       });
	},
	
	initLineChart:function(){
		var url="",yKey="",unit="";
		var self=this,day=$("#selectDay").val();
		if(self.currentType==0){
			url="/shipefficiencyhistoptimization?period="+day;
			unit="KG/nm";
			yKey="hullFuelEfficiency";
		}
		if(self.currentType==1){
			url="/hosthispropulsion?period="+day;
			unit="g/kwh";
			yKey="meFuelEfficiency";
		}
		if(self.currentType==2){
			url="/shipvoyagehiststate?period="+day;
			unit="Kw";
			yKey="totalPower";
		}
		if(self.currentType==3){
			url="/shipvoyagehisefficiency?period="+day;
			unit="kg/ton*nm";
			yKey="fuelConsumptionPerTonNm";
		}
		if(self.currentType==4){
			url="/shipvoyagehisefficiency?period="+day;
			unit="kg/ton*nm";
			yKey="co2EmissionPerTonNm";
		}
		if(self.currentType==5){
			url="/shipvoyagehisefficiency?period="+day;
			unit="kg/nm";
			yKey="co2EmissionPerNm";
		}
		if(self.currentType==6){
			url="/shipvoyagehisefficiency?period="+day;
			unit="kg/ton";
			yKey="co2EmissionPerTon";
		}
		$.getJSON(server_url+url,function(data){
			if(data.state){
        		var seriesData=new Array(),xAxisData=new Array();
        		$.each(data.result, function(index, info) {	
    		    	xAxisData.push(tool.getFormatTime(info.publishTime));
    		    	seriesData.push(info[yKey]);
                });
        		var myChart = echarts.init(document.getElementById("lineChart"));
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
        			        boundaryGap: true,
        			        data: xAxisData,
        			        scale: true,
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
	
	
	initBarChart:function(){
		var begin=$("#startDate2").val(),end=$("#endDate2").val();
		if(begin!=""&&end!=""){
			$.getJSON(server_url+"/shipvoyagedatestate?begin="+begin+"&end="+end,function(data){
				if(data.state){
	        		var seriesData1=new Array(),seriesData2=new Array(),xAxisData=new Array();
	        		$.each(data.result, function(index, info) {	
	    		    	xAxisData.push(tool.getFormatTime(info.publishTime));
	    		    	seriesData1.push(info.hostFuelOilConsumption);
	    		    	seriesData2.push(info.dgFuelOilConsumption);
	                });
	        		var myChart = echarts.init(document.getElementById("barChart"));
	        		var option = {
	        			    tooltip: {
	        			        trigger: 'axis'
	        			    },
	        			    legend: {
	        			        data:['GEHFO','MEHFO'],
	        			        right:10,
	        			        textStyle:{
	        			        	color:"#fff",
	        			        	fontWeight:"bolder",
	        			        	fontSize:18
	        			        }
	        			    },
	        			    xAxis: [
	        			        {
	        			            type: 'category',
	        			            data: xAxisData,
		        			        axisLabel: {
		        			        	textStyle:{
		        			        		color:'#575758',
		        			        		fontWeight:'bolder',
		        				        	fontSize:18
		        			        	}
		        			        },
		        			        axisLine:{
		        			        	show:false
		        			        }
	        			        }
	        			    ],
	        			    yAxis: [
	        			        {
	        			            type: 'value',
		        			        axisLabel: {
		        			        	textStyle:{
		        			        		color:'#575758',
		        			        		fontWeight:'bolder',
		        				        	fontSize:18,
		        				        	formatter: '{value} '
		        			        	}
		        			        }
	        			        },
	        			        {
	        			            type: 'value',
	        			            axisLabel: {
		        			        	textStyle:{
		        			        		color:'#575758',
		        			        		fontWeight:'bolder',
		        				        	fontSize:18,
		        				        	formatter: '{value} '
		        			        	}
		        			        }
	        			        }
	        			    ],
	        			    series: [
	        			        {
	        			            name:'GEHFO',
	        			            type:'bar',
	        			            data:seriesData1,
	        			            itemStyle:{
	        			            	normal:{
	        			            		color:"#289F39"
	        			            	}
	        			            }
	        			        },
	        			        {
	        			            name:'MEHFO',
	        			            type:'bar',
	        			            data:seriesData2,
	        			            itemStyle:{
	        			            	normal:{
	        			            		color:"#EF8017"
	        			            	}
	        			            }
	        			        }
	        			    ]
	        			};
	        		myChart.setOption(option, true);
	        	}                       
			});
		}
	},
	/**
	 * 初始化船舶航行 刷新数据已处理
	 */
	initGaugeChart:function(domid,title,min,max,value,unit){
		var self=this;
		var myChart = self.charts[domid];
		var range = ((max-min)).toFixed(0);
		var int_value = ((value*1)/range*100).toFixed(0);
		if(myChart!=undefined&&myChart!=null&&domid!="gauge"){
			//更新数据
		      var option = myChart.getOption();
		      option.series[0].data[0].value = value; 
		      option.series[0].axisLabel.formatter = function(v) {
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
		            type: "gauge",
		            min: 0,
		            max: 100,
		            radius: '97%',      //图表尺寸
		            splitNumber: 100,
		            axisLine: {
		            	length:0,
		                lineStyle: {
		                    color: [
		                        [1, "transparent"]
		                    ],
		                    width: 1
		                }
		            },
		            axisTick: {
		            	show:false,
		                length: 0,
		            },
		            axisLabel: {
		                distance: -30,
		                formatter: function(v) {
		                	//if (v >= int_value && v <= int_value) return v+'●';
		                	if (v >= int_value && v <= int_value) return '●';
		                	//if (v >= int_value && v <= int_value) return '▼';
		                    else return ''
		                	//return v
		                },
		                textStyle: {
		                    color: "#fb5310",
		                    fontWeight: 700
		                }
		            },
		            splitLine: {
		                show: false,
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
		            name: '黑色外圈细',
		            type: 'gauge',
		            radius: '97%',
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
		            },
		            title: {
			            textStyle: {
			                fontSize: 11,
			                fontWeight: 'bolder',
			                fontStyle: 'normal',
			                fontFamily: "Square 721 Ex BT Roman",
			                color: "#d3d3d4"
			            },
			            offsetCenter: [0, 63]
			        }
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
			            offsetCenter: [0,10],
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
			                fontSize: 11,
			                fontWeight: 'bolder',
			                fontStyle: 'normal',
			                fontFamily: "Square 721 Ex BT Roman",
			                color: "#d3d3d4"
			            },
			            offsetCenter: [0, 63]
			        },
			        data: [{
			            name: unit,
			            value: value
			        }]
			    }]
			};
		myChart.setOption(option, true);
		self.charts[domid]=myChart;
	},
	
	animating:false,
	speed:1200,
	/**
	 * 开始播放轨迹
	 */
	startAnimation:function () {
		var self=this;
		$("#progress").css("marginLeft","0px");
        if (self.animating) {
        	self.stopAnimation(false);
        } else {
        	self.index=0;
        	self.animating = true;
        	self.map.getView().setCenter(self.positions[0]);
        	self.map.on('postcompose', self.moveFeature);
        	self.map.render();
        }
      },


      /**
       * 停止播放轨迹
       */
      stopAnimation:function(ended) {
    	  var self=this;
    	  self.animating = false;
    	  self.map.un('postcompose', self.moveFeature);
    	  $("#progress").css("marginLeft","0px");
      },
      index:0,
      moveFeature:function(event) {
    	  var geoMarker=new ol.style.Style({
              image: new ol.style.Circle({
                  radius: 5,
                  snapToPixel: false,
                  fill: new ol.style.Fill({color: '#DF0724'}),
                  stroke: new ol.style.Stroke({
                    color: 'white', width: 2
                  })
                })
              });
    	  var shipStyle = new ol.style.Style({
  		    image: new ol.style.Icon(({
  		        src: server_url+'/resources/images/DirectionBlueFill.png',
  		        anchor: [0.4, 0.4],
  		        scale:0.8
  		    }))
  		});
          var vectorContext = event.vectorContext;

          if (analysisIndex.animating) {
        	  if (analysisIndex.index>analysisIndex.positions.length-1) {
        		  analysisIndex.stopAnimation(true);
        		  return;
        	  }
        	  var currentPoint = new ol.geom.Point(analysisIndex.positions[analysisIndex.index]);
        	  var feature = new ol.Feature(currentPoint);
        	  vectorContext.drawFeature(feature,geoMarker);
        	  var progress=100/analysisIndex.positions.length*analysisIndex.index;
        	  $("#progress").css("marginLeft",progress+"px");
        	  analysisIndex.index=analysisIndex.index+1;
          }
          analysisIndex.map.render();
        }
      

}