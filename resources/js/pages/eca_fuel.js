$(function(){	
	$(".nt_mapMI").click(function(){
		if($(".nt_mapMr").hasClass("dn")){
			$(".nt_mapMr").removeClass("dn");
		}else{
			$(".nt_mapMr").addClass("dn");
		}
	})
	clicktab('.nt_rlbd','nt_rlactive','.nt_rlhd');
	clicktab('.nt_tb3_bd','nt_tb3_bd_active','.nt_tb3_hd');

	$(".newBunkeringplanfuelBtn").click(function(){
		$("#bunkeringPlanFuelid").val("");
		$(".deleteBunkeringplanfuelBtn").hide();
		$("#shipBunkeringPlanFuel")[0].reset();
		for(var i=0;i<$("#datalength").val();i++){
    		$("#data"+i+" td").eq(5).text("");
    		$("#data"+i+" td").eq(7).text("");
    		$("#data"+i+" td").eq(10).text("");
		}
		showDialog('nt_dialog_tab1');
	})
	$(".newBunkeringfuelBtn").click(function(){
		$("#bunkeringfuelid").val("");
		$(".deleteBunkeringfuelBtn").hide();
		$("#shipBunkeringFuel")[0].reset();
		showDialog('nt_dialog_tab2');
	})
	$(".newFuelchangeBtn").click(function(){
		$("#fuelchangeid").val("");
		$(".deleteFuelchangeBtn").hide();
		$("#shipFuelChange")[0].reset();
		showDialog('nt_dialog_tab3');
	})
	ecaFuel.init();
})

var ecaFuel = {
	map:null,
	ecaLayer:null,
	fuelchangeLayer:null,
	shipLayer:null,
	zoom:0,
	voyageLayer:null,
	positionArray:new Array(),
	result:null,
	init:function(){
		var self = this;
		
		self.initTable1();
		self.initTable2();
		self.initTable3();
		
		$(".nt_tb3map").click(function(){
			var format = 'image/png';
		    var bounds = [-180, -59.484295,180, 83.627357];
	        var wmsLayer = new ol.layer.Tile({
	            source: new ol.source.TileWMS({
			            url: geoserver_url,
			            params: {'FORMAT': format,
				             LAYERS: geoserver_layerName
				       },
				       wrapX: false 
		          })
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
			
			self.fuelchangeLayer= new ol.layer.Vector({
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
			
			if(self.map==null){
				self.map = new ol.Map({
			        target: 'map',
			        layers: [
			        	self.ecaLayer,
			        	wmsLayer,
			        	self.shipLayer,
			        	self.voyageLayer,
			        	self.fuelchangeLayer
			        ],
			        view: new ol.View({
			           projection: projection,
			           extent: bounds,
			           center: [19.577017,16],
			           zoom: 3,
			           maxZoom:8,
			           minZoom:3
			        })
			    });
				self.zoom=3;
				self.initEcaregion();
				
				var popupEca = new ol.Overlay({
			        element:document.getElementById('popupEca'),
			        positioning: 'bottom-center',
			        stopEvent: false,
			        offset: [0, 210]
			      });
			      self.map.addOverlay(popupEca);
			      
			      var popup = new ol.Overlay({
				        element:document.getElementById('popup'),
				        positioning: 'bottom-center',
				        stopEvent: false,
				        offset: [0, 400]
				      });
				      self.map.addOverlay(popup);
				      
			      self.map.on('pointermove', function(evt) {
			        var feature = self.map.forEachFeatureAtPixel(evt.pixel,function(feature) {
			              return feature;
			            });
			        if (feature) {
			        	console.log(feature.getProperties());
			          	var ecaInfo=feature.getProperties().ecaInfo;
			          	var type=feature.getProperties().type;
			          	var obj=feature.getProperties().obj;
			          	$("#popup1").hide();
			          	$("#popup2").hide();
			          	if(ecaInfo!=undefined&&ecaInfo!=null){
			          		$(popupEca.f).css("top",evt.pixel[1]).css("left",evt.pixel[0]);
				          	$(popupEca.f).show();
				          	$("#popupEca").show();
			          	}else if(type!=undefined&&type==0){
			          		$("#equipment_popup").text(tool.defaultString(obj.strEquipment, '--'));
				          	$("#switchingMode_popup").text(tool.defaultString(obj.strSwitchingMode, '--'));
				          	$("#strCommenceTime_popup").text(tool.defaultString(obj.strCommenceTime, '--'));
				          	$("#longitude_popup").text(tool.defaultString(obj.longitude, '--'));
				          	$("#latitude_popup").text(tool.defaultString(obj.latitude, '--'));
				          	$("#speed_popup").text(tool.defaultString(obj.speed, '--')+"kn");
				          	$("#strCompleteTime_popup").text(tool.defaultString(obj.strCompleteTime, '--'));
				          	$("#tankNo_popup").text(tool.defaultString(obj.tankNo, '--'));
				          	$("#bunkerTankEndOfChangeover_popup").text(tool.defaultString(obj.bunkerTankEndOfChangeover, '--'));
				          	$("#fuelConsumedEndOfChangeover_popup").text(tool.defaultString(obj.fuelConsumedEndOfChangeover, '--'));
				          	$("#sulphurContent_popup").text(tool.defaultString(obj.sulphurContent, '--'));
				          	$("#strSecaStartDate_popup").text(tool.defaultString(obj.strSecaStartDate, '--'));
				          	$("#strSecaEndDate_popup").text(tool.defaultString(obj.strSecaEndDate, '--'));
				          	$("#signature_popup").text(tool.defaultString(obj.signature, '--'));
				          	
				          	$(popup.f).css("top",evt.pixel[1]).css("left",evt.pixel[0]);
				          	$(popup.f).show();
				          	$("#popup1").show();
				          	$("#popup").show();
			          	}else{
			          		$("#popupEca").hide();
			          		$("#popup").hide();
			          	}
			        } else {
			        	$("#popupEca").hide();
			        	$("#popup").hide();
			        }
			      });
			      
			      //不同比例尺下显示不同中间点
			     self.map.on('moveend', function(evt) {
			    	  if(self.map.getView().getZoom()!=self.zoom){
			    		  self.zoom=self.map.getView().getZoom();
			    		  self.initZoom();
			    	  }
			    });
				
				
			      self.map.on('click', function(evt) {
			        var feature = self.map.forEachFeatureAtPixel(evt.pixel,function(feature) {
			              return feature;
			            });
			        if (feature) {
			          	popup.setPosition(feature.getGeometry().getCoordinates());
			          	var type=feature.getProperties().type;
			          	var obj=feature.getProperties().obj;
			          	$("#popup1").hide();
			          	$("#popup2").hide();
			          	if(type==0){
			          		$("#equipment_popup").text(tool.defaultString(obj.strEquipment, '--'));
				          	$("#switchingMode_popup").text(tool.defaultString(obj.strSwitchingMode, '--'));
				          	$("#strCommenceTime_popup").text(tool.defaultString(obj.strCommenceTime, '--'));
				          	$("#longitude_popup").text(tool.defaultString(obj.longitude, '--'));
				          	$("#latitude_popup").text(tool.defaultString(obj.latitude, '--'));
				          	$("#speed_popup").text(tool.defaultString(obj.speed, '--')+"kn");
				          	$("#strCompleteTime_popup").text(tool.defaultString(obj.strCompleteTime, '--'));
				          	$("#tankNo_popup").text(tool.defaultString(obj.tankNo, '--'));
				          	$("#bunkerTankEndOfChangeover_popup").text(tool.defaultString(obj.bunkerTankEndOfChangeover, '--'));
				          	$("#fuelConsumedEndOfChangeover_popup").text(tool.defaultString(obj.fuelConsumedEndOfChangeover, '--'));
				          	$("#sulphurContent_popup").text(tool.defaultString(obj.sulphurContent, '--'));
				          	$("#strSecaStartDate_popup").text(tool.defaultString(obj.strSecaStartDate, '--'));
				          	$("#strSecaEndDate_popup").text(tool.defaultString(obj.strSecaEndDate, '--'));
				          	$("#signature_popup").text(tool.defaultString(obj.signature, '--'));
				          	$("#popup1").show();
			          	}else{
			          		$("#time").text(tool.getFormatTime(obj.publishTime));
				          	$("#hullFuelEfficiency").text(tool.defaultString(obj.hullFuelEfficiency, '--')+" KG/nm");
				          	
				          	$("#sog").text("");
				          	$("#cog").text("");
				          	$("#windSpeed").text("");
				          	$("#windDiration").text("");
				          	$("#meRpm").text("");
				          	$("#slipRate").text("");
				          	
				          	$.getJSON(server_url+"/shipefficiencyanddriverinfo?time="+obj.publishTime,function(data){
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
				          	$("#popup2").show();
			          	}
			          	$("#popup").show();
			        } else {
			        	$("#popup").hide();
			        }
			      });
			}
			
			self.initShipfuelchangeAndVoyage();
			
		});
		
		
		$("#export1").unbind("click").bind("click",function(){
			if (confirm("您真的确定要导出吗？\n\n请确认！")==true){ 
				window.open(server_url+"/shipbunkeringplanfuel/download?"+self.getParams1());
			}
		});
		
		$("#export2").unbind("click").bind("click",function(){
			if (confirm("您真的确定要导出吗？\n\n请确认！")==true){ 
				window.open(server_url+"/shipbunkeringfuel/download?"+self.getParams2());
			}
		});
		
		$("#export3").unbind("click").bind("click",function(){
			if (confirm("您真的确定要导出吗？\n\n请确认！")==true){ 
				window.open(server_url+"/shipfuelchange/download?"+self.getParams3());
			}
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
		        type:1,
		        voyageInfo:self.result[self.positionArray[i][2]]
		    });
			midFeature.setStyle(midStyle);
			if(self.zoom==3&&i%5==0){
				self.voyageLayer.getSource().addFeature(midFeature);
			}
			if(self.zoom==4&&i%4==0){
				self.voyageLayer.getSource().addFeature(midFeature);
			}
			if(self.zoom==5&&i%3==0){
				self.voyageLayer.getSource().addFeature(midFeature);
			}
			if(self.zoom==6&&i%2==0){
				self.voyageLayer.getSource().addFeature(midFeature);
			}
			if((self.zoom==8||self.zoom==7)&&i%1==0){
				self.voyageLayer.getSource().addFeature(midFeature);
			}
		}
	},
	
	initTable1:function(){
		var self = this;
		$("#btn_query1").bind("click",function(){
			self.loadData1(0,10);
		});
		
		self.loadData1(0,10);

		$("#nav_first1").bind("click",function(){
			self.loadData1(0,10);
		});

		$("#nav_prev1").bind("click",function(){
			var totalPage = parseInt($("#nav_total1").text());
			var page = $("#nav_curr1").text()-2;
			if(parseInt(page)<0 || parseInt(page)>=totalPage)return;
			self.loadData1(page,10);
		});

		$("#nav_next1").bind("click",function(){
			var totalPage = parseInt($("#nav_total1").text());
			var page = $("#nav_curr1").text();
			if(parseInt(page)<0 || parseInt(page)>=totalPage)return;
			self.loadData1(page,10);
		});
		
		$("#nav_last1").bind("click",function(){
			var totalPage = $("#nav_total1").text();
			self.loadData1(totalPage-1,10);
		});
		
		$(".existingCapacityNumber").unbind("blur").bind("blur",function(){
			var v=$(this).val();
			var tr=$(this).parent().parent();
			if(v!=""){
				var a=(v*1)/(tr.children("td").eq(2).children("input").val()*1);
				tr.children("td").eq(5).text((a*100).toFixed(1));
			}
		});
		$(".preloadedOilNumber").unbind("blur").bind("blur",function(){
			var v=$(this).val();
			var tr=$(this).parent().parent();
			if(v!=""){
	    		var b=(v*1)/(tr.children("td").eq(2).children("input").val()*1);
	    		tr.children("td").eq(7).text((b*100).toFixed(1));
			}
		});
		
		$(".actualLoadOilNumber").unbind("blur").bind("blur",function(){
			var v=$(this).val();
			var tr=$(this).parent().parent();
			if(v!=""){
	    		var c=(v*1)/(tr.children("td").eq(2).children("input").val()*1);
	    		tr.children("td").eq(10).text((c*100).toFixed(1));
			}
		});
		var rules={ //配置验证规则，key就是被验证的dom对象，value就是调用验证的方法(也是json格式)
				  port:{required:true},
				  strDate:{required:true},
				  maximumOilRate:{required:true,number:true},
				  recommendedOilRate:{required:true,number:true},
				  actualOilRate:{required:true,number:true},
				  variety:{required:true},
				  strBeginTime:{required:true},
				  oilSupplier:{required:true},
				  numberOfOilLoaded:{required:true,number:true},
				  strEndTime:{required:true},
				  tanker:{required:true},
				  draftBeforeRefuellingBow:{ required:true},
				  refuelingEndDraftBow:{required:true},
				  draftBeforeRefuellingStern:{required:true},
				  refuelingEndDraftStern:{required:true},
				  safetyInstructions:{required:true},
				  oilPersonnel:{required:true},
				  operate:{required:true},
				  deck:{required:true}
			 };
			for(var i=0;i<$("#datalength").val();i++){
				rules["shipBunkeringPlanFuelDetails["+i+"].existingCapacityNumber"] = {required:true,number:true}; 
				rules["shipBunkeringPlanFuelDetails["+i+"].preloadedOilNumber"] = {required:true,number:true}; 
				rules["shipBunkeringPlanFuelDetails["+i+"].preloadedOilLevel"] = {required:true,number:true}; 
				rules["shipBunkeringPlanFuelDetails["+i+"].actualLoadOilNumber"] = {required:true,number:true}; 
				rules["shipBunkeringPlanFuelDetails["+i+"].actualLoadOilLevel"] = {required:true,number:true}; 
			}
			$("#shipBunkeringPlanFuel").validate({rules:rules}).form();
		$(".saveBunkeringplanfuelBtn").unbind("click").bind("click",function(){
			if($("#shipBunkeringPlanFuel").validate({rules:rules}).form()){
				if($("#port1").val()==""){
					alert("请选择港口!");
					return ;
				}
				$.ajax( {  
	                type : "POST",  
	                url : server_url+"/shipbunkeringplanfuel/save",  
	                data : $("#shipBunkeringPlanFuel").serialize(),  
	                success : function(data) { 
	                	if(data.state){
					    	alert("保存成功!");
					    	tool.closeDialog();
					    	var curr = $("#nav_curr1").text();
							self.loadData1(curr-1,10);
					    }
	                }  
	            }); 
			}
			
		});
		
		$(".deleteBunkeringplanfuelBtn").unbind("click").bind("click",function(){
			if (confirm("您真的确定要删除吗？\n\n请确认！")==true){ 
				$.get(server_url+"/shipbunkeringplanfuel/del/"+$("#bunkeringPlanFuelid").val(),function(data){
					if(data.state){
				    	alert("删除成功!");
				    	tool.closeDialog();
				    	var curr = $("#nav_curr1").text();
						self.loadData1(curr-1,10);
				    }
				});
			}
		});
		
		/**
		 * 加油计划 港口模糊搜索
		 */
		$("#portName1").autocomplete({
			source:function(request,response) {
				$.get(server_url+"/port?q="+$.trim(request.term),function(data){
	    			if(data.state){
	    				response($.map(data.result, function(item){ // 此处是将返回数据转换为 JSON对象，并给每个下拉项补充对应参数                            
							return {                                 // 设置item信息                                 
								label: item.namecn +" "+item.name, // 下拉项显示内容                                 
								value: item.namecn +" "+item.name,    
								id: item.id                
							}                        
						})); 
	    		    }
	    		});
			},            
			minLength: 2,  // 输入框字符个等于2时开始查询          
			scrollHeight : 300, //提示的高度，溢出显示滚动条
			select: function( event, ui ) { // 选中某项时执行的操作 
				$("#port1").val(tool.defaultString(ui.item.id, '--'));
			} 
		});
	},
	
	initTable2:function(){
		var self = this;
		$("#btn_query2").bind("click",function(){
			self.loadData2(0,10);
		});
		
		self.loadData2(0,10);

		$("#nav_first2").bind("click",function(){
			self.loadData2(0,10);
		});

		$("#nav_prev2").bind("click",function(){

			var totalPage = parseInt($("#nav_total2").text());
			var page = $("#nav_curr2").text()-2;
			if(parseInt(page)<0 || parseInt(page)>=totalPage)return;
			self.loadData2(page,10);
		});

		$("#nav_next2").bind("click",function(){
			var totalPage = parseInt($("#nav_total2").text());
			var page = $("#nav_curr2").text();
			if(parseInt(page)<0 || parseInt(page)>=totalPage)return;
			self.loadData2(page,10);
		});
		
		$("#nav_last2").bind("click",function(){
			var totalPage = $("#nav_total2").text();
			self.loadData2(totalPage-1,10);
		});
		var rules={ //配置验证规则，key就是被验证的dom对象，value就是调用验证的方法(也是json格式)
			 port:{required:true},
			  strDate:{required:true},
			  supplyCompany:{required:true},
			  strTimeAlongside:{required:true},
			  bargeName:{required:true},
			  strTimeCompleted:{required:true},
			  product:{required:true},
			  strTimeStart:{required:true},
			  quantity:{required:true,number:true},
			  strTimeStop:{required:true},
			  remarks:{required:true},
			  deck:{required:true},
			  engine:{required:true}
		 }
		$("#shipBunkeringFuel").validate({rules:rules}).form();
		$(".saveBunkeringfuelBtn").unbind("click").bind("click",function(){
			if($("#shipBunkeringFuel").validate({rules:rules}).form()){
				if($("#port2").val()==""){
					alert("请选择港口!");
					return ;
				}
				$.ajax( {  
	                type : "POST",  
	                url : server_url+"/shipbunkeringfuel/save",  
	                data : $("#shipBunkeringFuel").serialize(),  
	                success : function(data) { 
	                	if(data.state){
					    	alert("保存成功!");
					    	tool.closeDialog();
					    	var curr = $("#nav_curr2").text();
							self.loadData2(curr-1,10);
					    }
	                }  
	            }); 
			}
			
		});
		
		$(".deleteBunkeringfuelBtn").unbind("click").bind("click",function(){
			if (confirm("您真的确定要删除吗？\n\n请确认！")==true){ 
				$.get(server_url+"/shipbunkeringfuel/del/"+$("#bunkeringfuelid").val(),function(data){
					if(data.state){
				    	alert("删除成功!");
				    	tool.closeDialog();
				    	var curr = $("#nav_curr2").text();
						self.loadData2(curr-1,10);
				    }
				});
			}
		});
		/**
		 * 燃料加注记录 港口模糊搜索
		 */
		$("#portName2").autocomplete({
			source:function(request,response) {
				$.get(server_url+"/port?q="+$.trim(request.term),function(data){
	    			if(data.state){
	    				response($.map(data.result, function(item){ // 此处是将返回数据转换为 JSON对象，并给每个下拉项补充对应参数                            
							return {                                 // 设置item信息                                 
								label: item.namecn +" "+item.name, // 下拉项显示内容                                 
								value: item.namecn +" "+item.name,    
								id: item.id                
							}                        
						})); 
	    		    }
	    		});
			},            
			minLength: 2,  // 输入框字符个等于2时开始查询          
			scrollHeight : 300, //提示的高度，溢出显示滚动条
			select: function( event, ui ) { // 选中某项时执行的操作 
				$("#port2").val(tool.defaultString(ui.item.id, '--'));
			} 
		});
	},

	initTable3:function(){
		var self = this;
		$("#btn_query3").bind("click",function(){
			self.loadData3(0,10);
		});
		
		self.loadData3(0,10);

		$("#nav_first3").bind("click",function(){
			self.loadData3(0,10);
		});

		$("#nav_prev3").bind("click",function(){
			var totalPage = parseInt($("#nav_total3").text());
			var page = $("#nav_curr3").text()-2;
			if(parseInt(page)<0 || parseInt(page)>=totalPage)return;
			self.loadData3(page,10);
		});

		$("#nav_next3").bind("click",function(){
			var totalPage = parseInt($("#nav_total3").text());
			var page = $("#nav_curr3").text();
			if(parseInt(page)<0 || parseInt(page)>=totalPage)return;
			self.loadData3(page,10);
		});
		
		$("#nav_last3").bind("click",function(){
			var totalPage = $("#nav_total3").text();
			self.loadData3(totalPage-1,10);
		});
		
		var rules={
				strCommenceTime:{required:true},
				strCompleteTime:{required:true},
				sulphurContent:{required:true},
				bunkerTankEndOfChangeover:{required:true},
				fuelConsumedEndOfChangeover:{required:true},
				tankNo:{required:true},
				strSecaStartDate:{required:true},
				signature:{required:true},
				strSecaEndDate:{required:true}
		 };
		$("#shipFuelChange").validate({rules:rules}).form();
		$(".saveFuelchangeBtn").unbind("click").bind("click",function(){
			if($("#shipFuelChange").validate({rules:rules}).form()){
				$.ajax( {  
	                type : "POST",  
	                url : server_url+"/shipfuelchange/save",  
	                data : $("#shipFuelChange").serialize(),  
	                success : function(data) { 
	                	if(data.state){
					    	alert("保存成功!");
					    	tool.closeDialog();
					    	var curr = $("#nav_curr3").text();
							self.loadData3(curr-1,10);
							self.initShipfuelchangeAndVoyage();
					    }
	                }  
	            }); 
			}
			
		});
		$("#strSwitchingTime3").unbind("blur").bind("blur",function(){
			var time=$("#strSwitchingTime3").val();
			if(time!=""){
				$.post(server_url+"/shipvoyageswitchtimestate",{time:time},function(data){
					if(data.state){
						$("#longitude3").val(tool.defaultString(data.result.lon, '--'));
    			    	$("#latitude3").val(tool.defaultString(data.result.lat, '--'));
    			    	$("#speed3").val(tool.defaultString(data.result.speed, '--'));
				    }
				});
			}
		});
		$(".deleteFuelchangeBtn").unbind("click").bind("click",function(){
			if (confirm("您真的确定要删除吗？\n\n请确认！")==true){ 
				$.get(server_url+"/shipfuelchange/del/"+$("#fuelchangeid").val(),function(data){
					if(data.state){
				    	alert("删除成功!");
				    	tool.closeDialog();
				    	var curr = $("#nav_curr3").text();
						self.loadData3(curr-1,10);
						self.initShipfuelchangeAndVoyage();
				    }
				});
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
        	}
		});
		
	},
	/**
	 * 初始化海图燃油切换与航线
	 */
	initShipfuelchangeAndVoyage:function(){
		var self=this;
		if(self.fuelchangeLayer.getSource()!=null){
			self.fuelchangeLayer.getSource().clear();
		}
		
		
		var fuelchangeStyle = new ol.style.Style({
		    image: new ol.style.Icon(({
		        src: server_url+'/resources/images/fuelchange_point.png',
		        anchor: [0.4, 0.4],
		        scale:0.8
		    }))
		});
		$.getJSON(server_url+"/shipfuelchange",function(data){
			if(data.state){
				var features=new Array();
				$.each(data.result.contents, function(index, obj) {
					 var point = new ol.Feature({//起点
	          		        geometry: new ol.geom.Point([parseFloat(obj.longitude),parseFloat(obj.latitude)]),
	          		        type:0,
	          		        obj:obj
	          		 });
					 if(obj.switchingMode==1){
						 fuelchangeStyle = new ol.style.Style({
						    image: new ol.style.Icon(({
						        src: server_url+"/resources/images/mdoToHfo"+obj.equipment+".png",
						        anchor: [0.4, 0.4],
						        scale:1
						    }))
						 });
					 }else{
						 fuelchangeStyle = new ol.style.Style({
						    image: new ol.style.Icon(({
						        src: server_url+"/resources/images/hfoToMdo"+obj.equipment+".png",
						        anchor: [0.4, 0.4],
						        scale:1
						    }))
						 });
					 }
					 
					point.setStyle(fuelchangeStyle);
          		    self.fuelchangeLayer.getSource().addFeature(point);
	            });
        	}
		});
		
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
		self.shipLayer.getSource().clear();
		$.getJSON(server_url+"/shipvoyagedatestate?begin="+$("#startDate3").val()+"&end="+$("#endDate3").val()+"&interval=60",function(data){
			if(data.state){
				var startPoint,endPoint,midPoint,positions=new Array();
				self.result=data.result;
				$.each(data.result, function(index, obj) {
					positions.push([parseFloat(obj.lon),parseFloat(obj.lat)]);
           			if(index==0){
                	  var startPoint = new ol.Feature({//起点
             		        geometry: new ol.geom.Point([parseFloat(obj.lon),parseFloat(obj.lat)]),
             		        type:1,
             		        obj:obj
             		    });
                 		startPoint.setStyle(startStyle);
             		    self.shipLayer.getSource().addFeature(startPoint);
           			}else if(index==data.result.length-1){
                	  var endPoint = new ol.Feature({//终点
             		        geometry: new ol.geom.Point([parseFloat(obj.lon),parseFloat(obj.lat)]),
             		        type:1,
             		        obj:obj
             		    });
             		 	endPoint.setStyle(endStyle);
             		    self.shipLayer.getSource().addFeature(endPoint);
           			} /*else{
                	  midPoint = new ol.Feature({//中间点
	          		        geometry: new ol.geom.Point(positions[positions.length-1]),
	          		        type:1,
	          		        obj:obj
	          		   });
	                   midPoint.setStyle(midStyle);
	          		   self.fuelchangeLayer.getSource().addFeature(midPoint);
                  } */
	            });
           		var lineFeature = new ol.Feature({//路线
           	        geometry: new ol.geom.LineString(positions)
           	    });
           		//self.fuelchangeLayer.getSource().addFeature(lineFeature);
           		self.positionArray=tool.makePath(positions,1);
            	self.initZoom();
        	}
		});
	},
	

	// 请求数据
	loadData1:function(page,size){
		var self = this;
		var params = self.getParams1();
		$.getJSON(server_url+"/shipbunkeringplanfuel?page="+page+"&size="+size+"&"+params,function(data){
			self.refresh1(data);
		});
	},

	// 请求数据
	loadData2:function(page,size){
		var self = this;
		
		var params = self.getParams2();
		
		$.getJSON(server_url+"/shipbunkeringfuel?page="+page+"&size="+size+"&"+params,function(data){
			self.refresh2(data);
		});
	},

	// 请求数据
	loadData3:function(page,size){
		var self = this;
		var params = self.getParams3();
		$.getJSON(server_url+"/shipfuelchange?page="+page+"&size="+size+"&"+params,function(data){
			self.refresh3(data);
		});
	},
	
	getParams1:function(){
		var startDate = $("#startDate1").val();
		var end = $("#endDate1").val();
		var params="begin="+startDate+"&end="+end;
		return params;
	},
	
	getParams2:function(){
		var startDate = $("#startDate2").val();
		var end = $("#endDate2").val();
		var params="begin="+startDate+"&end="+end;
		return params;
	},
	
	getParams3:function(){
		var startDate = $("#startDate3").val();
		var end = $("#endDate3").val();
		var params="begin="+startDate+"&end="+end;
		return params;
	},
	
	// 刷新数据
	refresh1:function(data){
		if(data.state){
    		$('#nav_curr1').text(tool.defaultString(data.result.number, '--'));
    		$('#nav_total1').text(tool.defaultString(data.result.totalPages, '--'));
    		
    		var html ="";
    		$("#result_table1").html(html);
    		for(var i=0;i<data.result.contents.length;i++){
    			var obj = data.result.contents[i];
    			html+="<tr class='tr_data'>"+
		        "<td><a href='javascript:void(0)' class='editBunkeringplanfuelBtn' bunkeringPlanFuelid='"+obj.id+"'>"+(new Date(obj.date)).toLocaleDateString()+"</a></td>"+
		        "<td>"+obj.shipInfo.name+"</td>"+
		        "<td>"+obj.portName+"</td>"+
		        "<td>"+obj.recommendedOilRate+"</td>"+
		        "<td>"+obj.numberOfOilLoaded+"</td>"+
		        "<td>"+(obj.oilSupplier==null?"":obj.oilSupplier)+"</td>"+
		        "<td>"+obj.oilPersonnel+"</td>"
		        +"</tr>";
    		}
    		for(var i=data.result.contents.length;i<10;i++){
    			html+="<tr class='tr_data'>"+
		        "<td>"+"</td>"+
		        "<td>"+"</td>"+
		        "<td>"+"</td>"+
		        "<td>"+"</td>"+
		        "<td>"+"</td>"+
		        "<td>"+"</td>"+
		        "<td>"+"</td>"
		        +"</tr>";
    		}

    		$("#result_table1").html(html);
    		$(".editBunkeringplanfuelBtn").unbind("click").bind("click",function(){
    			var bunkeringPlanFuelid=$(this).attr("bunkeringPlanFuelid");
    			$.getJSON(server_url+"/shipbunkeringplanfuel/"+bunkeringPlanFuelid,function(data){  
    			    if(data.state){
    			    	$("#port1").val(tool.defaultString(data.result.port, '--'));
    			    	$("#portName1").val(tool.defaultString(data.result.portName, '--'));
    			    	$("#strDate1").val(tool.defaultString(data.result.strDate, '--'));
    			    	$("#maximumOilRate").val(tool.defaultString(data.result.maximumOilRate, '--'));
    			    	$("#recommendedOilRate").val(tool.defaultString(data.result.recommendedOilRate, '--'));
    			    	$("#actualOilRate").val(tool.defaultString(data.result.actualOilRate, '--'));
    			    	$("#variety").val(tool.defaultString(data.result.variety, '--'));
    			    	$("#strBeginTime").val(tool.defaultString(data.result.strBeginTime, '--'));
    			    	$("#oilSupplier").val(tool.defaultString(data.result.oilSupplier, '--'));
    			    	$("#numberOfOilLoaded").val(tool.defaultString(data.result.numberOfOilLoaded, '--'));
    			    	$("#strEndTime").val(tool.defaultString(data.result.strEndTime, '--'));
    			    	$("#tanker").val(tool.defaultString(data.result.tanker, '--'));
    			    	$("#draftBeforeRefuellingBow").val(tool.defaultString(data.result.draftBeforeRefuellingBow, '--'));
    			    	$("#refuelingEndDraftBow").val(tool.defaultString(data.result.refuelingEndDraftBow, '--'));
    			    	$("#draftBeforeRefuellingStern").val(tool.defaultString(data.result.draftBeforeRefuellingStern, '--'));
    			    	$("#refuelingEndDraftStern").val(tool.defaultString(data.result.refuelingEndDraftStern, '--'));
    			    	$("#safetyInstructions").val(tool.defaultString(data.result.safetyInstructions, '--'));
    			    	$("#oilPersonnel").val(tool.defaultString(data.result.oilPersonnel, '--'));
    			    	$("#operate").val(tool.defaultString(data.result.operate, '--'));
    			    	$("#deck1").val(tool.defaultString(data.result.deck, '--'));
    			    	$.each(data.result.shipBunkeringPlanFuelDetails, function(index, obj) {
    			    		$("#data"+index+" td").eq(0).children("input").eq(1).val(tool.defaultString(obj.id, '--'));
    			    		$("#data"+index+" td").eq(4).children("input").val(tool.defaultString(obj.existingCapacityNumber, '--'));
    			    		
    			    		var a=(obj.existingCapacityNumber*1)/(obj.oilTank.capacity*1);
    			    		$("#data"+index+" td").eq(5).text((a*100).toFixed(1));
    			    		
    			    		$("#data"+index+" td").eq(6).children("input").val(tool.defaultString(obj.preloadedOilNumber, '--'));
    			    		
    			    		var b=(obj.preloadedOilNumber*1)/(obj.oilTank.capacity*1);
    			    		$("#data"+index+" td").eq(7).text((b*100).toFixed(1));
    			    		
    			    		$("#data"+index+" td").eq(8).children("input").val(tool.defaultString(obj.preloadedOilLevel, '--'));
    			    		$("#data"+index+" td").eq(9).children("input").val(tool.defaultString(obj.actualLoadOilNumber, '--'));
    			    		
    			    		var c=(obj.actualLoadOilNumber*1)/(obj.oilTank.capacity*1);
    			    		$("#data"+index+" td").eq(10).text((c*100).toFixed(1));
    			    		
    			    		$("#data"+index+" td").eq(11).children("input").val(tool.defaultString(obj.actualLoadOilLevel, '--'));
    		            });
    			    	
    			    }  
    			});  
    			$(".deleteBunkeringplanfuelBtn").show();
    			$("#bunkeringPlanFuelid").val(tool.defaultString(bunkeringPlanFuelid, '--'));
    			tool.showDialog('nt_dialog_tab1');
    		});
		}
	},
	
	// 刷新数据
	refresh2:function(data){
		if(data.state){
    		$('#nav_curr2').text(tool.defaultString(data.result.number, '--'));
    		$('#nav_total2').text(tool.defaultString(data.result.totalPages, '--'));
    		
    		var html ="";
    		$("#result_table2").html(html);
    		for(var i=0;i<data.result.contents.length;i++){
    			var obj = data.result.contents[i];
    			
    			html+="<tr class='tr_data'>"+
		        "<td><a href='javascript:void(0)' class='editBunkeringfuelBtn' bunkeringfuelid='"+obj.id+"'>"+obj.bargeName+"</a></td>"+
		        "<td>"+obj.portName+"</td>"+
		        "<td>"+obj.supplyCompany+"</td>"+
		        "<td>"+tool.getLocalTime(obj.timeStart)+"</td>"+
		        "<td>"+tool.getLocalTime(obj.timeStop)+"</td>"+
		        "<td>"+obj.product+"</td>"+
		        "<td>"+obj.quantity+"</td>"
		        +"</tr>";
    		}
    		for(var i=data.result.contents.length;i<10;i++){
    			html+="<tr class='tr_data'>"+
		        "<td>"+"</td>"+
		        "<td>"+"</td>"+
		        "<td>"+"</td>"+
		        "<td>"+"</td>"+
		        "<td>"+"</td>"+
		        "<td>"+"</td>"+
		        "<td>"+"</td>"
		        +"</tr>";
    		}

    		$("#result_table2").html(html);
    		$(".editBunkeringfuelBtn").unbind("click").bind("click",function(){
    			var bunkeringfuelid=$(this).attr("bunkeringfuelid");
    			$.getJSON(server_url+"/shipbunkeringfuel/"+bunkeringfuelid,function(data){  
    			    if(data.state){
    			    	$("#port2").val(tool.defaultString(data.result.port, '--'));
    			    	$("#portName2").val(tool.defaultString(data.result.portName, '--'));
    			    	$("#strDate2").val(tool.defaultString(data.result.strDate, '--'));
    			    	$("#supplyCompany").val(tool.defaultString(data.result.supplyCompany, '--'));
    			    	$("#bargeName").val(tool.defaultString(data.result.bargeName, '--'));
    			    	$("#strTimeAlongside").val(tool.defaultString(data.result.strTimeAlongside, '--'));
    			    	$("#strTimeCompleted").val(tool.defaultString(data.result.strTimeCompleted, '--'));
    			    	$("#strTimeStart").val(tool.defaultString(data.result.strTimeStart, '--'));
    			    	$("#strTimeStop").val(tool.defaultString(data.result.strTimeStop, '--'));
    			    	$("#quantity").val(tool.defaultString(data.result.quantity, '--'));
    			    	$("#product").val(tool.defaultString(data.result.product, '--'));
    			    	$("#remarks").val(tool.defaultString(data.result.remarks, '--'));
    			    	$("#deck").val(tool.defaultString(data.result.deck, '--'));
    			    	$("#engine").val(tool.defaultString(data.result.engine, '--'));
    			    }  
    			});  
    			$("#bunkeringfuelid").val(tool.defaultString(bunkeringfuelid, '--'));
    			$(".deleteBunkeringfuelBtn").show();
    			tool.showDialog('nt_dialog_tab2');
    		});
		}
	},
	
	// 刷新数据
	refresh3:function(data){
		if(data.state){
    		$('#nav_curr3').text(tool.defaultString(data.result.number, '--'));
    		$('#nav_total3').text(tool.defaultString(data.result.totalPages, '--'));
    		
    		var html ="";
    		$("#result_table3").html(html);
    		for(var i=0;i<data.result.contents.length;i++){
    			var obj = data.result.contents[i];
    			
    			html+="<tr class='tr_data'>"+
		        "<td><a href='javascript:void(0)' class='editFuelchange' fuelchangeid='"+obj.id+"'>"+obj.strEquipment+"</a></td>"+
		        "<td>"+obj.strSwitchingMode+"</td>"+
		        "<td>"+(obj.strCommenceTime==null?"":obj.strCommenceTime)+"</td>"+
		        "<td>"+(obj.strCompleteTime==null?"":obj.strCompleteTime)+"</td>"+
		        "<td>"+obj.longitude+"</td>"+
		        "<td>"+obj.latitude+"</td>"+
		        "<td>"+(obj.speed==null?"":obj.speed)+"</td>"+
		        "<td>"+(obj.tankNo==null?"":obj.tankNo)+"</td>"+
		        "<td>"+(obj.sulphurContent==null?"":obj.sulphurContent)+"</td>"+
		        "<td>"+(obj.bunkerTankEndOfChangeover==null?"":obj.bunkerTankEndOfChangeover)+"</td>"+
		        "<td>"+(obj.fuelConsumedEndOfChangeover==null?"":obj.fuelConsumedEndOfChangeover)+"</td>"+
		        "<td>"+(obj.strSecaStartDate==null?"":obj.strSecaStartDate)+"</td>"+
		        "<td>"+(obj.strSecaEndDate==null?"":obj.strSecaEndDate)+"</td>"+
		        "<td>"+(obj.signature==null?"":obj.signature)+"</td>"+
		        "</tr>";
    		}
    		for(var i=data.result.contents.length;i<10;i++){
    			html+="<tr class='tr_data'>"+
		        "<td>"+"</td>"+
		        "<td>"+"</td>"+
		        "<td>"+"</td>"+
		        "<td>"+"</td>"+
		        "<td>"+"</td>"+
		        "<td>"+"</td>"+
		        "<td>"+"</td>"+
		        "<td>"+"</td>"+
		        "<td>"+"</td>"+
		        "<td>"+"</td>"+
		        "<td>"+"</td>"+
		        "<td>"+"</td>"+
		        "<td>"+"</td>"+
		        "<td>"+"</td>"+
		        "</tr>";
    		}

    		$("#result_table3").html(html);
    		$(".editFuelchange").unbind("click").bind("click",function(){
    			var fuelchangeid=$(this).attr("fuelchangeid");
    			$.getJSON(server_url+"/shipfuelchange/"+fuelchangeid,function(data){  
    			    if(data.state){
    			    	$("#equipment3").val(tool.defaultString(data.result.equipment, '--'));
    			    	$("#switchingMode3").val(tool.defaultString(data.result.switchingMode, '--'));
    			    	$("#longitude3").val(tool.defaultString(data.result.longitude, '--'));
    			    	$("#latitude3").val(tool.defaultString(data.result.latitude, '--'));
    			    	$("#speed3").val(tool.defaultString(data.result.speed, '--'));
    			    
    			    	$("#strCommenceTime").val(tool.defaultString(data.result.strCommenceTime, '--'));
    			    	$("#strCompleteTime").val(tool.defaultString(data.result.strCompleteTime, '--'));
    			    	
    			    	$("#bunkerTankEndOfChangeover").val(tool.defaultString(data.result.bunkerTankEndOfChangeover, '--'));
    			    	$("#sulphurContent").val(tool.defaultString(data.result.sulphurContent, '--'));
    			    	$("#fuelConsumedEndOfChangeover").val(tool.defaultString(data.result.fuelConsumedEndOfChangeover, '--'));
    			    	$("#tankNo").val(tool.defaultString(data.result.tankNo, '--'));
    			    	$("#strSecaStartDate").val(tool.defaultString(data.result.strSecaStartDate, '--'));
    			    	$("#strSecaEndDate").val(tool.defaultString(data.result.strSecaEndDate, '--'));
    			    	$("#signature").val(tool.defaultString(data.result.signature, '--'));
    			    }  
    			});  
    			$("#fuelchangeid").val(tool.defaultString(fuelchangeid, '--'));
    			$(".deleteFuelchangeBtn").show();
    			tool.showDialog('nt_dialog_tab3');
    		});
		}
	}
}

//打开弹层
function showDialog(divId){
	easyDialog.open({
		container :divId, //打开弹层的id
		fixed:true,         //跟随
		overlay:true       //是否遮罩
		//autoClose : 5000    //5秒后自动关闭
	});
}
//关闭弹层
function closeDialog(){
	easyDialog.close()  //关闭弹层
}
