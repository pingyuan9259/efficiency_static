/**
 * mrv
 * **/
$(function(){
    //设置初始请求参数
    var typeNum = 1,yearNum = $('.years .text').text(),monthNum = "",page = 0,size = 10;
    //接口请求
    var url = 'http://193.112.135.201:8081/soms/v2/';
    //var url = rootpath;
    //初始数据
    getDate(url,typeNum,yearNum,monthNum,page,size);

    $(document).bind("click",function(e){
        //年份航程选择
        if($(e.target).closest("div").hasClass('mrv_years')){
            $(".mrv_years ul").toggleClass("hide")
        }else{
            $(".mrv_years ul").addClass("hide")
        }
        //年份选择
        if($(e.target).closest("div").hasClass('years')){
            $(".years ul").toggleClass("hide")
        }else{
            $(".years ul").addClass("hide")
        }
        //月份季度选择
        if($(e.target).closest("div").hasClass('month_quarter')){
            $(".month_quarter ul").toggleClass("hide")
        }else{
            $(".month_quarter ul").addClass("hide")
        }
        //选择航程
        if($(e.target).closest("li").parent('ul').parent('div').hasClass('voyage')){
            $(".voyage ul").toggleClass("hide")
        }else{
            $(".voyage ul").addClass("hide")
        }
        if($(e.target).closest("div").hasClass('voyage')){
            $(".voyage ul").toggleClass("hide")
        }else{
            $(".voyage ul").addClass("hide")
        }
    });
    $(".mrv_years ul li,.years ul li,.month_quarter ul li").bind("click",function(){
        var text = $(this).text();
        $(this).parent('ul').prev('p').find('span.text').text(text);
        if($(this).attr('name') == 1){
            typeNum = 1;
            $('.years_choice').removeClass('hide');
            $('.voyage_choice').addClass('hide');
        }else if($(this).attr('name') == 2){
            typeNum = 2;
            $('.years_choice').addClass('hide');
            $('.voyage_choice').removeClass('hide');
        }else if($(this).attr('yearNum')){
            yearNum = $(this).attr('yearNum');
        }else if($(this).attr('monthNum')){
            monthNum = $(this).attr('monthNum');
            if(monthNum == "all"){
                monthNum = "";
            }
        }
    });

    //获取航程列表
    $.getJSON(url+"shipvoyageefficiencystats/voyageno",function(data){
        if(data.state){
            data.result.map(function(obj,index){
                $('.voyage').children('ul').append('<li><label><input type="checkbox" value="'+obj.voyageNo+'"/>'+obj.voyageNo+'</label></li>')
            })
        }});
    //点击搜索
    $('.query').bind('click',function(){

        getDate(url,typeNum,yearNum,monthNum,page,size);
    });
    //返回第一页
    $('#nav_first').on('click',function(){
        var number = $('#nav_curr').text();
        if(number!=1){
            page = 0;
            getDate(url,typeNum,yearNum,monthNum,page,size);
        }
    });
    //返回上一页
    $('#nav_prev').on('click',function(){
        var number = $('#nav_curr').text();
        if(number>1){
            page = page-1;
            getDate(url,typeNum,yearNum,monthNum,page,size);
        }
    });
    //最后一页
    $('#nav_last').on('click',function(){
        var number = $('#nav_curr').text();
        var totalPages = $('#nav_total').text();
        if(number<totalPages){
            page = totalPages-1;
            getDate(url,typeNum,yearNum,monthNum,page,size);
        }
    });
    //下一页
    $('#nav_next').on('click',function(){
        var number = $('#nav_curr').text();
        var totalPages = $('#nav_total').text();
        if(number<totalPages){
            page = page+1;
            getDate(url,typeNum,yearNum,monthNum,page,size);
        }
    });
    //new plan
    $('.add').on('click',function(){
        $('.mrv_mc_new_plan').removeClass('hide');
    });
    $('.new_plan_header img').on('click',function(){
        $('.mrv_mc_new_plan').addClass('hide');
    })
});
//请求数据
function getDate(url,typeNum,yearNum,monthNum,page,size){
    $('#result_table').html('');
    var params = Params(typeNum,yearNum,monthNum);
    $.getJSON(url+"shipvoyageefficiencystats?page="+page+"&size="+size+"&"+params,function(data){
        if(data.state){
            data.result.contents.map(function(obj,index){
                $('#result_table').append('<tr class="tr_data"><td>'+obj.voyageNo+'</td><td>'+obj.portOfDeparture+'</td><td>'+obj.portOfArrival+'</td>' +
                    '<td>'+timestampToTime(obj.dateOfDepature)+'</td><td>'+timestampToTime(obj.dateOfArrival)+'</td><td class="distanceTravelled">'+obj.distanceTravelled+'</td>' +
                    '<td class="timeAtsea">'+obj.timeAtsea+'</td><td class="cargo">'+obj.cargo+'</td><td class="storageHfo">'+obj.storageHfo+'</td><td class="storageFo">'+obj.storageFo+'</td><td class="consumptionHfo">'+obj.consumptionHfo+'</td>' +
                    '<td class="consumptionFo">'+obj.consumptionFo+'</td><td class="bunkeringHfo">'+obj.bunkeringHfo+'</td><td class="bunkeringFo">'+obj.bunkeringFo+'</td><td>'+obj.co2emittedTotal+'</td>' +
                    '<td>'+obj.co2emittedVoyages+'</td><td>'+obj.co2emittedDeparted+'</td><td>'+obj.co2emittedToports+'</td><td>'+obj.co2emittedWithinports+'</td></tr>');
            });
            if(10-data.result.contents.length>0) {
                var num = 10 - data.result.contents.length;
                for (var i = 0; i < num; i++) {
                    $('#result_table').append('<tr class="tr_data"><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>')
                }
            }
            //分页
            paging(data.result.number,data.result.totalPages);
            //合计
            addTotal();
            //分页点击事件
        }
    });

}
function Params(typeNum,yearNum,monthNum){
    var type = typeNum;
    var params="";
    if(type=="1"){
        var year = yearNum;
        var month = monthNum;
        params="type=1&year="+year+"&month="+month;
    }
    else{
        var values=[];
        $(".voyage").find("input:checkbox:checked").each(function(i,item){
            values.push($(item).attr("value"));
        });
        params="type=2&voyageno="+values.join(";");
    }
    return params;
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
    return Y+M+D+h+m+s;
}
//合计计算
function addTotal(){
    var distanceTravelled=0,timeAtsea=0,cargo=0,storageHfo=0,storageFo=0,consumptionHfo=0,consumptionFo=0,bunkeringHfo=0,bunkeringFo=0;
    $('.distanceTravelled').map(function(index,obj){
        distanceTravelled = accAdd(distanceTravelled,obj.innerText)
    });
    $('.timeAtsea').map(function(index,obj){
        timeAtsea = accAdd(timeAtsea,obj.innerText)
    });
    $('.cargo').map(function(index,obj){
        cargo = accAdd(cargo,obj.innerText)
    });
    $('.storageHfo').map(function(index,obj){
        storageHfo = accAdd(storageHfo,obj.innerText)
    });
    $('.storageFo').map(function(index,obj){
        storageFo = accAdd(storageFo,obj.innerText)
    });
    $('.consumptionHfo').map(function(index,obj){
        consumptionHfo = accAdd(consumptionHfo,obj.innerText)
    });
    $('.consumptionFo').map(function(index,obj){
        consumptionFo = accAdd(consumptionFo,obj.innerText)
    });
    $('.bunkeringHfo').map(function(index,obj){
        bunkeringHfo = accAdd(bunkeringHfo,obj.innerText)
    });
    $('.bunkeringFo').map(function(index,obj){
        bunkeringFo = accAdd(bunkeringFo,obj.innerText)
    });
    $('#total_distanceTravelled').text(distanceTravelled);
    $('#total_timeAtsea').text(timeAtsea);
    $('#total_cargo').text(cargo);
    $('#total_storageHfo').text(storageHfo);
    $('#total_storageFo').text(storageFo);
    $('#total_consumptionHfo').text(consumptionHfo);
    $('#total_consumptionFo').text(consumptionFo);
    $('#total_bunkeringHfo').text(bunkeringHfo);
    $('#total_bunkeringFo').text(bunkeringFo);
}
//分页
function paging(number,totalPages){
    if(totalPages==0){
        number = 0
    }
    $('#nav_curr').text(number);
    $('#nav_total').text(totalPages);
}
function pagingClick(url,typeNum,yearNum,monthNum,page,size){

}
//浮点加法
function accAdd(arg1, arg2) {
    var r1, r2, m, c;
    try {
        r1 = arg1.toString().split(".")[1].length;
    }
    catch (e) {
        r1 = 0;
    }
    try {
        r2 = arg2.toString().split(".")[1].length;
    }
    catch (e) {
        r2 = 0;
    }
    c = Math.abs(r1 - r2);
    m = Math.pow(10, Math.max(r1, r2));
    if (c > 0) {
        var cm = Math.pow(10, c);
        if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
        } else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
        }
    } else {
        arg1 = Number(arg1.toString().replace(".", ""));
        arg2 = Number(arg2.toString().replace(".", ""));
    }
    return (arg1 + arg2) / m;
}