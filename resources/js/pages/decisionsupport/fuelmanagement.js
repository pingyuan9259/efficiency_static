$(function(){
    //设置初始请求参数
    var page=0,size=10,beginTime=getPrevDate(),endTime=getNowFormatDate(),text='shipbunkeringplanfuel';
    //接口请求
    var url = 'http://193.112.135.201:8081/soms/v2/';
    //var url = rootpath;
    //初始数据请求
    getJson(url,text,page,size,beginTime,endTime);
    var start = $("#startDate").flatpickr({
        defaultDate:getPrevDate(),
        onChange: function(dateObj, dateStr, instance) {
            console.log(instance);
            beginTime = dateStr;
        }

    });
    var end = $("#endDate").flatpickr({
        defaultDate:getNowFormatDate(),
        onChange: function(dateObj, dateStr, instance) {
            endTime = dateStr
        }
    });
    //设置初始日期

    $('.table_bar div').on('click',function(){
        $('.table_bar div').removeClass('active');
        $('.list_Map').addClass('hide');
        $(this).addClass('active');
        if($(this).hasClass('plan')){
            $('section.fuel,section.record').addClass('hide');
            $('section.plan').removeClass('hide');
            if(text!='shipbunkeringplanfuel'){
                text = 'shipbunkeringplanfuel';page=0;

                $('.nt_nrvpage').removeClass('hide');

                getData(url,text,page,size,beginTime,endTime);
            }
        }
        if($(this).hasClass('record')){
            $('section.fuel,section.plan').addClass('hide');
            $('section.record').removeClass('hide');
            if(text!='shipbunkeringfuel'){
                text = 'shipbunkeringfuel';page=0;

                $('.nt_nrvpage').removeClass('hide');

                getData(url,text,page,size,beginTime,endTime);
            }
        }
        if($(this).hasClass('fuel')){
            $('section.plan,section.record').addClass('hide');
            $('section.fuel').removeClass('hide');
            $('.list_Map').removeClass('hide');
            if(text!='shipfuelchange'){
                text = 'shipfuelchange';page=0;
                if($('.div_list').hasClass('hide')){
                    $('.nt_nrvpage').addClass('hide');
                }else{
                    $('.nt_nrvpage').removeClass('hide');
                }
                getData(url,text,page,size,beginTime,endTime);
            }
        }
    });
    //列表海图切换
    $('.list_Map').on('click','div',function(){
        $('.list_Map div').removeClass('active_list_map');
        $(this).addClass('active_list_map');
        if($(this).hasClass('list')){
            $('.div_list').removeClass('hide');
            $('.div_map').addClass('hide');
            $('.nt_nrvpage').removeClass('hide');

            //clearMap();
        }else{
            $('.div_list').addClass('hide');
            $('.div_map').removeClass('hide');

            ecaFuel.init(beginTime,endTime);
        }
    });

    //点击加载数据
    $('.query').on('click',function(){
        getData(url,text,page,size,beginTime,endTime)
    });

    //返回第一页
    $('#nav_first').on('click',function(){
        var number = $('#nav_curr').text();
        if(number!=1){
            page = 0;
            getData(url,text,page,size,beginTime,endTime)
        }
    });
    //返回上一页
    $('#nav_prev').on('click',function(){
        var number = $('#nav_curr').text();
        if(number>1){
            page = page-1;
            getData(url,text,page,size,beginTime,endTime)
        }
    });
    //最后一页
    $('#nav_last').on('click',function(){
        var number = $('#nav_curr').text();
        var totalPages = $('#nav_total').text();
        if(number<totalPages){
            page = totalPages-1;
            getData(url,text,page,size,beginTime,endTime)
        }
    });
    //下一页
    $('#nav_next').on('click',function(){
        var number = $('#nav_curr').text();
        var totalPages = $('#nav_total').text();
        if(number<totalPages){
            page = page+1;
            getData(url,text,page,size,beginTime,endTime)
        }
    });

    //new plan
    $('.add').on('click',function(){
        switch (text){
            case 'shipbunkeringplanfuel':
                $('.fuel_mc_new_plan').removeClass('hide');
                $('#shipBunkeringPlanFuel').removeClass('hide');
                $('#shipBunkeringFuel,#shipFuelChange').addClass('hide');
                break;
            case 'shipbunkeringfuel':
                $('.fuel_mc_new_plan').removeClass('hide');
                $('#shipBunkeringFuel').removeClass('hide');
                $('#shipBunkeringPlanFuel,#shipFuelChange').addClass('hide');
                break;
            case 'shipfuelchange':
                $('.fuel_mc_new_plan').removeClass('hide');
                $('#shipFuelChange').removeClass('hide');
                $('#shipBunkeringPlanFuel,#shipBunkeringFuel').addClass('hide');
                break;
        }
    });
    $('.new_plan_header img').on('click',function(){
        $('.fuel_mc_new_plan').addClass('hide');
    });
    //new plan中的时间控件配置
    //shipbunkeringplanfuel
    $('#strDate1').flatpickr({})//Date
    $('#strBeginTime').flatpickr({})//开始时间
    $('#strEndTime').flatpickr({})//结束时间
    //shipbunkeringfuel
    $('#strDate2').flatpickr({})//日期
    $('#strTimeAlongside').flatpickr({})//停靠时间
    $('#strTimeCompleted').flatpickr({})//完成时间
    $('#strTimeStart').flatpickr({})//开始时间
    $('#strTimeStop').flatpickr({})//结束时间
    //shipfuelchange
    $('#strCommenceTime').flatpickr({})//换油开始时间
    $('#strCompleteTime').flatpickr({})//换油结束时间
    $('#strSecaStartDate').flatpickr({})//进入时间
    $('#strSecaEndDate').flatpickr({})//离开时间

    //首条信息点击展开
    $('.cursor').on('click',function () {
        console.log($(this).attr('attrid'))
    })
});

//分块请求数据
function getData(url,text,page,size,beginTime,endTime) {
    switch (text){
        case 'shipbunkeringplanfuel':
            $('#result_table1').html('');//清空当前数据
            getJson(url,text,page,size,beginTime,endTime);
            break;
        case 'shipbunkeringfuel':
            $('#result_table2').html('');//清空当前数据
            getJson(url,text,page,size,beginTime,endTime);
            break;
        case 'shipfuelchange':
            $('#result_table3').html('');//清空当前数据
            getJson(url,text,page,size,beginTime,endTime);
            break;
    }
}
//分块获取数据并渲染
function getJson(url,text,page,size,beginTime,endTime){
    $.getJSON(url+text+"?page="+page+"&size="+size+"&begin="+beginTime+"&end="+endTime,function(data){
        if(data.state){
            data.result.contents.map(function(obj,index){
                switch (text){
                    case 'shipbunkeringplanfuel':
                        $('#result_table1').append('<tr>'+
                            '<td attrId="'+obj.id+'" class="cursor">'+timestampToTime(obj.date)+'</td>'+
                            '<td>'+obj.shipInfo.shipId+'</td>'+
                            '<td>'+obj.port+'</td>'+
                            '<td>'+obj.recommendedOilRate+'</td>'+
                            '<td>'+obj.numberOfOilLoaded+'</td>'+
                            '<td>'+obj.oilSupplier+'</td>'+
                            '<td>'+obj.oilPersonnel+'</td>'+
                            '</tr>');
                        break;
                    case 'shipbunkeringfuel':
                        $('#result_table2').append('<tr>'+
                            '<td attrId="'+obj.id+'" class="cursor">'+obj.bargeName+'</td>'+
                            '<td>'+obj.portName+'</td>'+
                            '<td>'+obj.supplyCompany+'</td>'+
                            '<td>'+timestampToTime(obj.timeStart)+'</td>'+
                            '<td>'+timestampToTime(obj.timeStop)+'</td>'+
                            '<td>'+obj.product+'</td>'+
                            '<td>'+obj.quantity+'</td>'+
                            '</tr>');
                        break;
                    case 'shipfuelchange':
                        $('#result_table3').append('<tr>' +
                            '<td attrId="'+obj.id+'" class="cursor">'+obj.equipment+'</td>'+
                            '<td>'+obj.strSwitchingMode+'</td>'+
                            '<td>'+obj.strCommenceTime+'</td>'+
                            '<td>'+obj.strCompleteTime+'</td>'+
                            '<td>'+obj.longitude+'</td>'+
                            '<td>'+obj.latitude+'</td>'+
                            '<td>'+obj.speed+'</td>'+
                            '<td>'+(obj.tankNo==null?'':obj.tankNo)+'</td>'+
                            '<td>'+(obj.sulphurContent==null?'':obj.sulphurContent)+'</td>'+
                            '<td>'+(obj.bunkerTankEndOfChangeover==null?'':obj.bunkerTankEndOfChangeover)+'</td>'+
                            '<td>'+(obj.fuelConsumedEndOfChangeover==null?'':obj.fuelConsumedEndOfChangeover)+'</td>'+
                            '<td>'+obj.strSecaStartDate+'</td>'+
                            '<td>'+obj.strSecaEndDate+'</td>'+
                            '<td>'+obj.signature+'</td>'+
                            '</tr>');
                        break;
                }
            });
            if(10-data.result.contents.length>0){
                switch (text){
                    case 'shipbunkeringplanfuel':
                        for(var i=0;i<10-data.result.contents.length;i++){
                            $('#result_table1').append('<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>');
                        }
                        break;
                    case 'shipbunkeringfuel':
                        for(var i=0;i<10-data.result.contents.length;i++){
                            $('#result_table2').append('<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>');
                        }
                        break;
                    case 'shipfuelchange':
                        for(var i=0;i<10-data.result.contents.length;i++){
                            $('#result_table3').append('<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>');
                        }
                        break;

                }
            }
            //分页
            paging(data.result.number,data.result.totalPages);
            //点击首个td
            $('.cursor').on('click',function(){
                var id = $(this).attr('attrid');
                $.getJSON(url+text+'/'+id,function(data){
                    console.log(data)
                });
                $('.fuel_mc_new_plan').removeClass('hide');
                switch (text){
                    case 'shipbunkeringplanfuel':
                        $('#shipBunkeringPlanFuel').removeClass('hide');
                        $('#shipFuelChange,#shipBunkeringFuel').addClass('hide');
                        break;
                    case 'shipbunkeringfuel':
                        $('#shipBunkeringFuel').removeClass('hide');
                        $('#shipFuelChange,#shipBunkeringPlanFuel').addClass('hide');
                        break;
                    case 'shipfuelchange':
                        $('#shipFuelChange').removeClass('hide');
                        $('#shipBunkeringPlanFuel,#shipBunkeringFuel').addClass('hide');
                        break;
                }

            })
        }
    });
}
//分页
function paging(number,totalPages){
    if(totalPages==0){
        number = 0
    }
    $('#nav_curr').text(number);
    $('#nav_total').text(totalPages);
}
//当前日期
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}
//上一个月的日期
function getPrevDate() {
    var date = new Date();
    date.setMonth(date.getMonth()-1);
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}
//时间戳转换
function timestampToTime(timestamp) {
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    Y = date.getFullYear() + '-';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    D = date.getDate() + ' ';
    h = date.getHours() + ':';
    m = date.getMinutes() + ':';
    s = date.getSeconds();
    return Y+M+D;
}
//清除绘制的海图
function clearMap(){
    $('#map1').html('')
}
//绘制海图
function makeMap1(){
    //隐藏分页
    $('.nt_nrvpage').addClass('hide');
    var wmsLayer = new ol.layer.Tile({
        source:  new ol.source.TileWMS({
            url: "http://193.112.135.201:19080/theme2/soms/wms",
            params: {'FORMAT': 'image/png',
                //styles: '',
                layers: 'soms:World_region' ,
            },
            wrapX: false
        }),
        style:new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#FF69B4',
                width: 0
            }),
            fill: new ol.style.Fill({
                color: '#FF69B4'
            }),
        })
    });
// 创建地图
    new ol.Map({
        controls: ol.control.defaults({
            attribution: false,
            rotate: false,
            zoom: false
        }),
        target: 'map1',
        // 设置地图图层
        layers: [
            // 创建一个使用Open Street Map地图源的瓦片图层
            wmsLayer
        ],
        view: new ol.View({
            projection: new ol.proj.Projection({
                code: 'EPSG:4326',
                units: 'degrees',
                axisOrientation: 'neu',
                global: true}),
            extent: [-180, -59.484295,180, 83.627357],
            center: [29.577017,10],
            zoom: 2,
            maxZoom:11,
            minZoom:3
        })
        // 让id为map的div作为地图的容器
    });
}


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
