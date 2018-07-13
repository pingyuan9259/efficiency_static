/**
 * 海图
 */
$(function(){
	$(".nt_mapMI").click(function(){
		if($(".nt_mapMr").hasClass("dn")){
			$(".nt_mapMr").removeClass("dn");
			ecaIndex.initSubsystem();
		}else{
			$(".nt_mapMr").addClass("dn");
		}
	});
	ecaIndex.init();
	ecaIndex.initEcaregion();
	ecaIndex.initShipVoyage();
	
	ecaIndex.initRealtimeInfo();
	// 每5秒刷新
	setInterval(function(){
		// 当前实时船舶信息
		ecaIndex.initRealtimeInfo();
	},5000);
	
	// 每一小时刷新
	setInterval(function(){
		// 船舶航行eca报警
		 $.getJSON(server_url+"/shipvoyageecawarning",function(data){
			if(data.state){
	   		   	$("#timeToEca").text(tool.defaultString(getFormatTime(data.result.strEcaTime), '--'));
    			$("#nmToEca").text(tool.defaultString(data.result.strEcaDistant, '--'));
			}
		 });
	},60*60*1000);
	
});
var ecaIndex = {
	map:null,
	ecaLayer:null,
	zoom:0,
	shipLayer:null,
	voyageLayer:null,
	positionArray:new Array(),
	result:null,
	colors:['#308FBE','#81262B','#FEBF00','#397237'],
	/**
	 * 初始化 动态工况与历史工况
	 */
	init:function(){
		var self=this;
		var format = 'image/png';
	    var bounds = [-180, -59.484295,180, 83.627357];
	    
	    var wmsSource = new ol.source.TileWMS({
	            url: geoserver_url,
	            params: {'FORMAT': format,
		                'VERSION': '1.1.1',  
		             STYLES: '',
		             LAYERS: geoserver_layerName ,
		       },
		       wrapX: false 
          });

          var wmsLayer = new ol.layer.Tile({
            source: wmsSource
          });

		var projection = new ol.proj.Projection({
		    code: 'EPSG:4326',
		    units: 'degrees',
		    axisOrientation: 'neu',
		    global: true
		});
		
		self.ecaLayer = new ol.layer.Vector({
		    source: new ol.source.Vector({
		        type: 'MultiPolygon',
		        features: []
		    }),
		    style: new ol.style.Style({
		        fill: new ol.style.Fill({
		            color: '#126CAF'
		        }),
		        stroke: new ol.style.Stroke({
		            color: '#126CAF',
		            width: 4
		        })
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
	        	self.ecaLayer,
	        	wmsLayer,
	        	self.shipLayer,
	        	self.voyageLayer
	        ],
	        view: new ol.View({
	           projection: projection,
	           extent: bounds,
	           center: [19.577017,10],
	           zoom: 3,
	           maxZoom:10,
	           minZoom:3
	        })
	    });
		self.zoom=3;
		
		var popup = new ol.Overlay({
	        element:document.getElementById('popup'),
	        positioning: 'bottom-center',
	        stopEvent: false,
	        offset: [0, 210]
	      });
	      self.map.addOverlay(popup);
	      self.map.on('pointermove', function(evt) {
	        var feature = self.map.forEachFeatureAtPixel(evt.pixel,function(feature) {
	              return feature;
	            });
	        if (feature) {
	          	var ecaInfo=feature.getProperties().ecaInfo;
	          	var voyageInfo=feature.getProperties().voyageInfo;
	          	$("#ecaInfo").hide();
	        	$("#voyageInfo").hide();
	          	if(ecaInfo!=undefined&&ecaInfo!=null){
	          		$(popup.f).css("top",evt.pixel[1]).css("left",evt.pixel[0]);
		          	$("#ecaInfo").show();
		          	$(popup.f).show();
		          	$("#popup").show();
	          	}else{
	          		$("#popup").hide();
	          	}
	        } else {
	        	$("#popup").hide();
	        }
	      });
	      self.map.on('click', function(evt) {
	        var feature = self.map.forEachFeatureAtPixel(evt.pixel,function(feature) {
	              return feature;
	            });
	        if (feature) {
	          	popup.setPosition(feature.getGeometry().getCoordinates());
	          	var voyageInfo=feature.getProperties().voyageInfo;
	          	if(voyageInfo!=undefined&&voyageInfo!=null){
	          		$("#ecaInfo").hide();
		        	$("#voyageInfo").hide();
		        	
		        	$("#time").text(tool.defaultString(tool.getFormatTime(voyageInfo.publishTime), '--'));
		          	
		          	
		          	$("#sog").text("");
		          	$("#cog").text("");
		          	$("#windSpeed").text("");
		          	$("#windDiration").text("");
		          	$("#meRpm").text("");
		          	$("#slipRate").text("");
		          	
		          	$.getJSON(server_url+"/shipefficiencyanddriverinfo?time="+voyageInfo.publishTime,function(data){
		    			if(data.state){
		    				if(data.result.efficiency!=undefined&&data.result.efficiency!=null){
		    					$("#slipRate").text(tool.defaultStringUnit(data.result.efficiency.slip," %",'--'));
		    					$("#meRpm").text(tool.defaultString(data.result.efficiency.rotation, '--')+" rpm");
		    					$("#hullFuelEfficiency").text(tool.defaultString(data.result.efficiency.hullFuelEfficiency, '--')+" KG/nm");
		    				}
		    				if(data.result.drivingInfo!=undefined&&data.result.drivingInfo!=null){
		    					$("#sog").text(tool.defaultString(data.result.drivingInfo.sog, '--')+" n");
		    		          	$("#cog").text(tool.defaultString(data.result.drivingInfo.hdt, '--')+" °");
		    		          	
		    		          	$("#windSpeed").text(tool.defaultString(data.result.drivingInfo.windSpeed, '--')+" m/s");
		    		          	$("#windDiration").text(tool.defaultString(data.result.drivingInfo.windDiration, '--')+" °");
		    				}
		            	}
		    		});
		          	$(popup.f).css("top",evt.pixel[1]).css("left",evt.pixel[0]);
		          	$("#voyageInfo").show();
		          	$("#popup").show();
	          	}else{
	          		$("#popup").hide();
	          	}
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
	},
	
	initZoom:function(){
		var self=this;
		var midStyle = new ol.style.Style({
		    image: new ol.style.Icon(({
		        src: server_url+'/resources/images/mid_point.png',
		        anchor: [0.5, 0.5],
		        scale:0.6
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
	 * 初始化实时信息 时间 对地速度 船舶航向 主机转速 船舶滑失率 船舶燃油效率 风速 风向
	 */
	initRealtimeInfo:function(){
		$.getJSON(server_url+"/shipdrivinginfo",function(data){
			if(data.state){
				$("#currentTime").text(tool.getLocalTime(data.result.utc));
				$("#currentSog").text(tool.defaultString(data.result.sog, '--')+" n");
				$("#currentCog").text(tool.defaultString(data.result.hdt, '--')+"°");
				$("#currentWindSpeed").text(tool.defaultString(data.result.windSpeed, '--')+"m/s");
				$("#currentWindDirection").text(tool.defaultString(data.result.windDiration, '--')+"°");
			}
		});
		$.getJSON(server_url+"/shipvoyagestate",function(data){
			if(data.state){
				$("#currentHullfuelefficiency").text(tool.defaultString(data.result.hullFuelEfficiency, '--')+" rpm");
			}
		});
		$.getJSON(server_url+"/shipefficiencyoptimization",function(data){
			if(data.state){
				$("#currentMeSpeed").text(tool.defaultString(data.result.rotation, '--')+" rpm");
				$("#currentSlip").text(tool.defaultStringUnit(data.result.slip," n",'--'));
			}
		});
	},
	
	/**
	 * 初始化eca区域
	 */
	initEcaregion:function(){
		var self=this;
		$.getJSON(server_url+"/ecaregion",function(data){
			if(data.state){
				var features=new Array();
				$.each(data.result, function(index, obj) {
					var feature = new ol.Feature({
						geometry: new ol.geom.Polygon([obj.values]),
						ecaInfo:obj
					});
					features.push(feature);
	            });
				self.ecaLayer.getSource().addFeatures(features);
        	}else{
        		console.log(data);
        	}
		});
		
	},
	
	 /**
		 * 初始化船舶航行
		 */
	initShipVoyage:function(){
		var startStyle = new ol.style.Style({
		    image: new ol.style.Icon(({
		         src: server_url+'/resources/images/mid_point.png',
		         anchor: [0.5, 0.5],
				 scale:1
		    }))
		});
		var midStyle = new ol.style.Style({
		    image: new ol.style.Icon(({
		        src: server_url+'/resources/images/mid_point.png',
		        anchor: [0.5, 0.5],
		        scale:0.6
		    }))
		});
		
		var self=this;
		self.shipLayer.getSource().clear();
    	$.getJSON(server_url+"/shipvoyagetimestate?interval=60",function(data1){
        	if(data1.state){
        		var positions=new Array(),startFeature,endPoint;
        		self.result=data1.result;
        		$.each(data1.result, function(index, voyageInfo) {
        			if(voyageInfo.lon!=null&&voyageInfo.lat!=null
        					&&voyageInfo.lon!="null"&&voyageInfo.lat!="null"){
        				positions.push([parseFloat(voyageInfo.lon.replace("N","")),parseFloat(voyageInfo.lat.replace("N",""))]);
        			}
                });
        		self.positionArray=tool.makePath(positions,1);
        		self.initZoom();
        		
        		var startFeature = new ol.Feature({// 起点
    		        geometry: new ol.geom.Point(positions[0]),
    		        voyageInfo:data1.result[0]
    		    });
    		    startFeature.setStyle(startStyle);
    		    self.shipLayer.getSource().addFeature(startFeature);
    		    
    		    var shipStyle=null,shipFeature=null;
    		    
    		    $.getJSON(server_url+"/shipvoyageecawarning",function(data2){
    				if(data2.state){
    		   		   	// 船舶航行eca报警
    	    			$("#timeToEca").text(tool.defaultString(getFormatTime(data2.result.strEcaTime), '--'));
    	    			$("#nmToEca").text(tool.defaultString(data2.result.strEcaDistant, '--'));
    	    			
    	    			$.getJSON(server_url+"/shipdrivinginfo",function(data3){
    	    				if(data3.state){
    	    					shipStyle = new ol.style.Style({
            	    			    image: new ol.style.Icon(({
            	    			        src: server_url+'/resources/images/icon_alarm.png',
            	    			        anchor: [0.5, 0.5],
            	    			        scale:1,
            	    			        rotation:data3.result.hdt
            	    			    }))
            	    			});
    	    					shipFeature = new ol.Feature({// 终点
	    	        		        geometry: new ol.geom.Point([parseFloat(data3.result.lon),parseFloat(data3.result.lat)]),
	    	        		        voyageInfo:data3.result
	    	        		    });
    	    		   	   }else{
	    	    		   		shipStyle = new ol.style.Style({
	        	    			    image: new ol.style.Icon(({
	        	    			        src: server_url+'/resources/images/icon_normal.png',
	        	    			        anchor: [0.5, 0.5],
	        	    			        scale:1,
	        	    			        rotation:data3.result.hdt
	        	    			    }))
	        	    			});
	    	    		   		shipFeature = new ol.Feature({// 终点
	    	        		        geometry: new ol.geom.Point(positions[positions.length-1]),
	    	        		        voyageInfo:data1.result[positions.length-1]
	    	        		    });
    	    		   	   }
    	    				shipFeature.setStyle(shipStyle);
    	        		    self.shipLayer.getSource().addFeature(shipFeature);
    	    			});
    		   	   }else{
   	    			   $.getJSON(server_url+"/shipdrivinginfo",function(data3){
	    				  if(data3.state){
	    					  var endStyle = new ol.style.Style({
	        	    			    image: new ol.style.Icon(({
	        	    			        src: server_url+'/resources/images/icon_normal.png',
	        	    			        anchor: [0.5, 0.5],
	        	    			        scale:1,
	        	    			        rotation:data3.result.hdt
	        	    			    }))
	        	    		  });
	    					  var endFeature = new ol.Feature({// 终点
	    	        		        geometry: new ol.geom.Point([parseFloat(data3.result.lon),parseFloat(data3.result.lat)]),
	    	        		        voyageInfo:[parseFloat(data3.result.lon),parseFloat(data3.result.lat)]
	    	        		  });
	    	        		  endFeature.setStyle(endStyle);
	    	        		  self.shipLayer.getSource().addFeature(endFeature);
                         }
	    			});
    		   	   }
    			});
        	}
        });
	},
	
	initSubsystem:function(){
		var self=this;
		var options=new Array();
		$(".multiSelectOptions").find("input:checkbox:checked").each(function(i,item){
			if($(item).attr("value")!=undefined){
				options.push($(item).attr("value"));
			}
        }); 
		var lang=$("#hdlang").val();
		$.getJSON(server_url+"/indicatorfilter?lang="+lang+"&period=1&selected="+options.join(";"),function(data){
    		var xData=new Array(),yData=new Array();
    		var titles=new Array(),grids=new Array(),
    		xAxis=new Array(),yAxis=new Array(),series=new Array();
    		$.each(data, function(index1, obj1) {
    			titles.push(
					{
						text:obj1.name,
						gridIndex: index1,
						textStyle:{
							color:"#9D9D9F",
							fontSize:15
						},
						top: index1*22+23+'%',
				        left: (50-(obj1.name.length*180/100)/2)+'%'
					}
				);
    			grids.push({
    				top: index1*22+5+'%',
    		        left: '12%',
    		        right: '2%',
    		        height: '18%'
    		    });
    			xData=new Array(),yData=new Array();
    			$.each(obj1.results, function(index2, obj2) {	
    				xData.push(obj2.time);
    				yData.push(obj2.value);
                });
    			
    			xAxis.push({
    				show:false,
    		        type: 'category',
    		        data: xData,
    		        interval:10,
    		        splitNumber :17,
    		        gridIndex: index1,
    		        boundaryGap: false,
    		        splitLine:{
    		            show:true,
    		            lineStyle:{
    		                type:'solid',
    		                color: '#9C9D9D',
    		        		width: 2
    		            }
    		        },
    		        axisLabel:{
    		        	textStyle:{
    		        		color:"#9C9D9D"
    		        	}
    		        }
    		    });
    			yAxis.push({
    		        type: 'value',
    		        gridIndex: index1,
    		        name:obj1.unit,
			        nameTextStyle:{
			        	color:'#9C9D9D',
		        		fontWeight:'bolder',
			        	fontSize:14
			        },
    		        splitLine:{
    		        	lineStyle :{
    		        		color: '#fff',
    		        		width: 2
    		        	}
    		        },
    		        axisLabel:{
    		        	textStyle:{
    		        		color:"#9C9D9D"
    		        	}
    		        }
    		    });
    			series.push({
    		        name: obj1.name,
    		        type: 'line',
    		        xAxisIndex:index1,
    		        yAxisIndex:index1,
    		        data: yData,
    		        itemStyle: {
    	                normal: {
    	                    lineStyle:{
    	                    	color:self.colors[index1],
    	                    },
    	                    label: {
    	                        show: true,
    	                        position: 'top',
    	                    }
                    	}
    	            }
    		    });
        		
            });
    		self.initChart("chart",titles,grids,xAxis,yAxis,series);
		});
	},
	/**
	 * 
	 */
	initChart(domid,titles,grids,xAxis,yAxis,series){
		var myChart =  echarts.init(document.getElementById(domid));
		var datazoom=new Array();
		for(var i=0;i<titles.length;i++){
			datazoom.push(i);
		}
		var option = {
			title:titles,
			tooltip: {
	            trigger: 'axis',
	            axisPointer: {
	                type: 'cross'
	            },
	            backgroundColor: '#050505',
	            borderWidth: 1,
	            borderColor: '#ccc',
	            padding: 2,
	            textStyle: {
	                color: '#fff',
	                fontSize:11
	            },
	            position: function (pos, params, el, elRect, size) {
	                var obj = {top: 10};
	                obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
	                return obj;
	            },
	            extraCssText: 'width: 170px'
	        },
	        axisPointer: {
	            link: {xAxisIndex: 'all'},
	            label: {
	                backgroundColor: '#777'
	            }
	        },
		    grid:grids,
		    dataZoom: [
		        {
		            show: true,
		            realtime: true,
		            start: 50,
		            end: 100
		        },
		        {
		            type: 'inside',
		            realtime: true,
		            xAxisIndex:datazoom,
    		        yAxisIndex:datazoom,
		            start: 50,
		            end: 100
		        }
		    ],
		    xAxis:xAxis,
		    yAxis:yAxis,
		    series: series
		};
		myChart.setOption(option, true);
	}
};

function isNull_(value_, default_) {
	if(value_==undefined||value_==null||value_==""){
		return default_;
	}else{
		if(!isNaN(value_)){
			return value_.toFixed(2);
		}else{
			return default_;
		}
	}
};