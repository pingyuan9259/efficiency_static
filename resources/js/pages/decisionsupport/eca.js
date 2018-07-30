$(function(){
    ecaFuel.init()
});
var ecaFuel = {
    map: null,
    ecaLayer: null,
    fuelchangeLayer: null,
    shipLayer: null,
    zoom: 0,
    voyageLayer: null,
    positionArray: new Array(),
    result: null,
    init: function (startDate1,endDate1) {
        var self = this;
        //隐藏分页
        $('.nt_nrvpage').addClass('hide');
        //$(".nt_tb3map").click(function () {
        var format = 'image/png';
        var bounds = [-180, -59.484295, 180, 83.627357];
        var wmsLayer = new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: 'http://193.112.135.201:19080/theme2/soms/wms',//替换
                params: {
                    'FORMAT': format,
                    LAYERS: 'soms:World_region'//替换
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

        self.fuelchangeLayer = new ol.layer.Vector({
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

        if (self.map == null) {
            self.map = new ol.Map({
                controls: ol.control.defaults({
                    attribution: false,
                    rotate: false,
                    zoom: false
                }),
                target: 'map1',
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
                    center: [19.577017, 16],
                    zoom: 3,
                    maxZoom: 8,
                    minZoom: 3
                })
            });
            self.zoom = 3;
            self.initEcaregion();

            var popupEca = new ol.Overlay({
                element: document.getElementById('popupEca'),
                positioning: 'bottom-center',
                stopEvent: false,
                offset: [0, 210]
            });
            self.map.addOverlay(popupEca);

            var popup = new ol.Overlay({
                element: document.getElementById('popup'),
                positioning: 'bottom-center',
                stopEvent: false,
                offset: [0, 400]
            });
            self.map.addOverlay(popup);

            self.map.on('pointermove', function (evt) {
                var feature = self.map.forEachFeatureAtPixel(evt.pixel, function (feature) {
                    return feature;
                });
                if (feature) {
                    //console.log(feature.getProperties());
                    var ecaInfo = feature.getProperties().ecaInfo;
                    var type = feature.getProperties().type;
                    var obj = feature.getProperties().obj;
                    $("#popup1").hide();
                    $("#popup2").hide();
                    if (ecaInfo != undefined && ecaInfo != null) {
                        $(popupEca.f).css("top", evt.pixel[1]).css("left", evt.pixel[0]);
                        $(popupEca.f).show();
                        $("#popupEca").show();
                    } else if (type != undefined && type == 0) {
                        $("#equipment_popup").text(tool.defaultString(obj.strEquipment, '--'));
                        $("#switchingMode_popup").text(tool.defaultString(obj.strSwitchingMode, '--'));
                        $("#strCommenceTime_popup").text(tool.defaultString(obj.strCommenceTime, '--'));
                        $("#longitude_popup").text(tool.defaultString(obj.longitude, '--'));
                        $("#latitude_popup").text(tool.defaultString(obj.latitude, '--'));
                        $("#speed_popup").text(tool.defaultString(obj.speed, '--') + "kn");
                        $("#strCompleteTime_popup").text(tool.defaultString(obj.strCompleteTime, '--'));
                        $("#tankNo_popup").text(tool.defaultString(obj.tankNo, '--'));
                        $("#bunkerTankEndOfChangeover_popup").text(tool.defaultString(obj.bunkerTankEndOfChangeover, '--'));
                        $("#fuelConsumedEndOfChangeover_popup").text(tool.defaultString(obj.fuelConsumedEndOfChangeover, '--'));
                        $("#sulphurContent_popup").text(tool.defaultString(obj.sulphurContent, '--'));
                        $("#strSecaStartDate_popup").text(tool.defaultString(obj.strSecaStartDate, '--'));
                        $("#strSecaEndDate_popup").text(tool.defaultString(obj.strSecaEndDate, '--'));
                        $("#signature_popup").text(tool.defaultString(obj.signature, '--'));

                        $(popup.f).css("top", evt.pixel[1]).css("left", evt.pixel[0]);
                        $(popup.f).show();
                        $("#popup1").show();
                        $("#popup").show();
                    } else {
                        $("#popupEca").hide();
                        $("#popup").hide();
                    }
                } else {
                    $("#popupEca").hide();
                    $("#popup").hide();
                }
            });

            //不同比例尺下显示不同中间点
            self.map.on('moveend', function (evt) {
                if (self.map.getView().getZoom() != self.zoom) {
                    self.zoom = self.map.getView().getZoom();
                    self.initZoom();
                }
            });

            /*
            self.map.on('click', function (evt) {
                var feature = self.map.forEachFeatureAtPixel(evt.pixel, function (feature) {
                    return feature;
                });
                if (feature) {
                    popup.setPosition(feature.getGeometry().getCoordinates());
                    var type = feature.getProperties().type;
                    var obj = feature.getProperties().obj;
                    $("#popup1").hide();
                    $("#popup2").hide();
                    if (type == 0) {
                        $("#equipment_popup").text(tool.defaultString(obj.strEquipment, '--'));
                        $("#switchingMode_popup").text(tool.defaultString(obj.strSwitchingMode, '--'));
                        $("#strCommenceTime_popup").text(tool.defaultString(obj.strCommenceTime, '--'));
                        $("#longitude_popup").text(tool.defaultString(obj.longitude, '--'));
                        $("#latitude_popup").text(tool.defaultString(obj.latitude, '--'));
                        $("#speed_popup").text(tool.defaultString(obj.speed, '--') + "kn");
                        $("#strCompleteTime_popup").text(tool.defaultString(obj.strCompleteTime, '--'));
                        $("#tankNo_popup").text(tool.defaultString(obj.tankNo, '--'));
                        $("#bunkerTankEndOfChangeover_popup").text(tool.defaultString(obj.bunkerTankEndOfChangeover, '--'));
                        $("#fuelConsumedEndOfChangeover_popup").text(tool.defaultString(obj.fuelConsumedEndOfChangeover, '--'));
                        $("#sulphurContent_popup").text(tool.defaultString(obj.sulphurContent, '--'));
                        $("#strSecaStartDate_popup").text(tool.defaultString(obj.strSecaStartDate, '--'));
                        $("#strSecaEndDate_popup").text(tool.defaultString(obj.strSecaEndDate, '--'));
                        $("#signature_popup").text(tool.defaultString(obj.signature, '--'));
                        $("#popup1").show();
                    } else {
                        $("#time").text(tool.getFormatTime(obj.publishTime));
                        $("#hullFuelEfficiency").text(tool.defaultString(obj.hullFuelEfficiency, '--') + " KG/nm");

                        $("#sog").text("");
                        $("#cog").text("");
                        $("#windSpeed").text("");
                        $("#windDiration").text("");
                        $("#meRpm").text("");
                        $("#slipRate").text("");

                        $.getJSON('http://193.112.135.201:8081/soms/v2/' + "/shipefficiencyanddriverinfo?time=" + obj.publishTime, function (data) {
                            if (data.state) {
                                if (data.result.efficiency != undefined && data.result.efficiency != null) {
                                    $("#slipRate").text(tool.defaultString(data.result.efficiency.slip, '--') + " %");
                                    $("#meRpm").text(tool.defaultString(data.result.efficiency.rotation, '--') + " rpm");
                                }
                                if (data.result.drivingInfo != undefined && data.result.drivingInfo != null) {
                                    $("#sog").text(tool.defaultString(data.result.drivingInfo.sog, '--') + " n");
                                    $("#cog").text(tool.defaultString(data.result.drivingInfo.hdt, '--') + " °");

                                    $("#windSpeed").text(tool.defaultString(data.result.drivingInfo.windSpeed, '--') + " m/s");
                                    $("#windDiration").text(tool.defaultString(data.result.drivingInfo.windDiration, '--') + " °");
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
            */
        }

        self.initShipfuelchangeAndVoyage(startDate1,endDate1);

        //});

        /*
        $("#export1").unbind("click").bind("click", function () {
            if (confirm("您真的确定要导出吗？\n\n请确认！") == true) {
                window.open('http://193.112.135.201:8081/soms/v2/' + "/shipbunkeringplanfuel/download?" + self.getParams1());
            }
        });

        $("#export2").unbind("click").bind("click", function () {
            if (confirm("您真的确定要导出吗？\n\n请确认！") == true) {
                window.open('http://193.112.135.201:8081/soms/v2/' + "/shipbunkeringfuel/download?" + self.getParams2());
            }
        });

        $("#export3").unbind("click").bind("click", function () {
            if (confirm("您真的确定要导出吗？\n\n请确认！") == true) {
                window.open('http://193.112.135.201:8081/soms/v2/' + "/shipfuelchange/download?" + self.getParams3());
            }
        });
        */
    },
    initZoom:function(){
        var self=this;
        var midStyle = new ol.style.Style({
            image: new ol.style.Icon(({
                src: 'http://193.112.135.201:8081/soms/v2/'+'/resources/images/point-blue.png',
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
    /**
     * 初始化eca区域
     */
    initEcaregion:function(){
        var self=this;
        $.getJSON('http://193.112.135.201:8081/soms/v2/'+"/ecaregion",function(data){
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
    initShipfuelchangeAndVoyage:function(startDate1,endDate1){
        var self=this;
        if(self.fuelchangeLayer.getSource()!=null){
            self.fuelchangeLayer.getSource().clear();
        }


        var fuelchangeStyle = new ol.style.Style({
            image: new ol.style.Icon(({
                src: 'http://193.112.135.201:8081/soms/v2/'+'/resources/images/fuelchange_point.png',//替换
                anchor: [0.4, 0.4],
                scale:0.8
            }))
        });
        $.getJSON('http://193.112.135.201:8081/soms/v2/'+"/shipfuelchange?period=5",function(data){//替换
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
                                src: 'http://193.112.135.201:8081/soms/v2/'+"/resources/images/mdoToHfo"+obj.equipment+".png",//替换
                                anchor: [0.4, 0.4],
                                scale:1
                            }))
                        });
                    }else{
                        fuelchangeStyle = new ol.style.Style({
                            image: new ol.style.Icon(({
                                src: 'http://193.112.135.201:8081/soms/v2/'+"/resources/images/hfoToMdo"+obj.equipment+".png",//替换
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
                src: 'http://193.112.135.201:8081/soms/v2/'+'/resources/images/point3.png',//替换
                anchor: [0.5, 0.5],
                scale:2
            }))
        });
        var endStyle = new ol.style.Style({
            image: new ol.style.Icon(({
                src: 'http://193.112.135.201:8081/soms/v2/'+'/resources/images/point-red.png',//替换
                anchor: [0.5, 0.5],
                scale:1.2
            }))
        });
        self.shipLayer.getSource().clear();//替换
        /*
        * $.ajax({
        type : "POST",
		url : rootpath+"/interface"+num,
        contentType:'application/json',
        data : JSON.stringify(list),
        * */
        //航线接口
        //Date.parse(startDate1)/1000
        var startDate = new Date(startDate1),endDate = new Date(endDate1);
        $.ajax({
            url:'http://193.112.135.201:8081/soms/v2/interface0121',
            type : "POST",
            contentType:'application/json',
            data : JSON.stringify({"startTime":Date.parse(startDate)/1000,"endTime":Date.parse(endDate)/1000}),
            success :function(data) {
                console.log(data, "***");
                if (data.state) {
                    var startPoint, endPoint, midPoint, positions = new Array();
                    self.result = data.result;
                    $.each(data.result, function (index, obj) {
                        positions.push([parseFloat(obj.lon), parseFloat(obj.lat)]);
                        if (index == 0) {
                            var startPoint = new ol.Feature({//起点
                                geometry: new ol.geom.Point([parseFloat(obj.lon), parseFloat(obj.lat)]),
                                type: 1,
                                obj: obj
                            });
                            startPoint.setStyle(startStyle);
                            self.shipLayer.getSource().addFeature(startPoint);
                        } else if (index == data.result.length - 1) {
                            var endPoint = new ol.Feature({//终点
                                geometry: new ol.geom.Point([parseFloat(obj.lon), parseFloat(obj.lat)]),
                                type: 1,
                                obj: obj
                            });
                            endPoint.setStyle(endStyle);
                            self.shipLayer.getSource().addFeature(endPoint);
                        } /*else {
                            midPoint = new ol.Feature({//中间点
                                geometry: new ol.geom.Point(positions[positions.length - 1]),
                                type: 1,
                                obj: obj
                            });
                            midPoint.setStyle(midStyle);
                            self.fuelchangeLayer.getSource().addFeature(midPoint);
                        }*/
                    });
                    var lineFeature = new ol.Feature({//路线
                        geometry: new ol.geom.LineString(positions)
                    });
                    //self.fuelchangeLayer.getSource().addFeature(lineFeature);
                    self.positionArray = tool.makePath(positions, 1);
                    self.initZoom();
                }
            }
        });
    }
};

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