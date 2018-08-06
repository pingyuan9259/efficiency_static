/**
 * mrv
 * **/
$(function(){
    //设置初始请求参数
    var typeNum = 1,yearNum = $('.years .text').text(),monthNum = "",page = 0,size = 10;
    //new plan的时间设置
    var depature = '',arrival = '';
    //接口请求
    var url = 'http://193.112.135.201:8081/soms/v2/';
    //选择时间计算排放
    $('#strDateOfDepature').flatpickr({
        onChange: function(dateObj, dateStr, instance) {
            depature = dateStr;
            if ( (depature == null || depature == "") || (arrival == null || arrival == "") ) {
                $("#co2emittedTotal").val("");
                $("#co2emittedVoyages").val("");
                $("#co2emittedToports").val("");
                $("#co2emittedDeparted").val("");
                $("#co2emittedWithinports").val("");
                return;
            }
            $.get(url+"shipvoyageefficiencystats/co2?begin="+depature+"&end="+arrival,function(data){
                if(data.state){
                    $("#co2emittedTotal").val((data.result.co2emittedTotal*1).toFixed(3));
                    $("#co2emittedVoyages").val((data.result.co2emittedVoyages*1).toFixed(3));
                    $("#co2emittedToports").val((data.result.co2emittedToports*1).toFixed(3));
                    $("#co2emittedDeparted").val((data.result.co2emittedDeparted*1).toFixed(3));
                    $("#co2emittedWithinports").val((data.result.co2emittedWithinports*1).toFixed(3));
                }
            });
        }
    });
    $('#strDateOfArrival').flatpickr({
        onChange: function(dateObj, dateStr, instance) {
            arrival = dateStr;
            if ( (depature == null || depature == "") || (arrival == null || arrival == "") ) {
                $("#co2emittedTotal").val("");
                $("#co2emittedVoyages").val("");
                $("#co2emittedToports").val("");
                $("#co2emittedDeparted").val("");
                $("#co2emittedWithinports").val("");
                return;
            }
            $.get(url+"shipvoyageefficiencystats/co2?begin="+depature+"&end="+arrival,function(data){
                if(data.state){
                    $("#co2emittedTotal").val((data.result.co2emittedTotal*1).toFixed(3));
                    $("#co2emittedVoyages").val((data.result.co2emittedVoyages*1).toFixed(3));
                    $("#co2emittedToports").val((data.result.co2emittedToports*1).toFixed(3));
                    $("#co2emittedDeparted").val((data.result.co2emittedDeparted*1).toFixed(3));
                    $("#co2emittedWithinports").val((data.result.co2emittedWithinports*1).toFixed(3));
                }
            });
        }
    });

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
        $('.mrv_mc_new_plan,.new_plan').removeClass('hide');
        $('.td_details').addClass('hide');
    });
    $('.new_plan_header img').on('click',function(){
        $('.mrv_mc_new_plan').addClass('hide');
    });
    //点击td查看详情
    $('#result_table').on('click','.cursor',function(){
        $('.mrv_mc_new_plan,.td_details').removeClass('hide');
        $('.new_plan').addClass('hide');
        var id = $(this).attr('attrId');
        $('.deleteBtn').attr('attrId',id);
        $.getJSON(url+'shipvoyageefficiencystats/'+id,function(data){
            //赋值
            $('.td_details .voyageNo span').text(data.result.voyageNo);
            $('.td_details .portNameOfDeparture span').text(data.result.portNameOfDeparture);
            $('.td_details .portNameOfArrival span').text(data.result.portNameOfArrival);
            $('.td_details .strDateOfDepature span').text(data.result.strDateOfDepature);
            $('.td_details .strDateOfArrival span').text(data.result.strDateOfArrival);
            $('.td_details .distanceTravelled span').text(data.result.distanceTravelled);
            $('.td_details .timeAtsea span').text(data.result.timeAtsea);
            $('.td_details .cargo span').text(data.result.cargo);
            $('.td_details .storageHfo span').text(data.result.storageHfo);
            $('.td_details .storageFo span').text(data.result.storageFo);
            $('.td_details .consumptionHfo span').text(data.result.consumptionHfo);
            $('.td_details .consumptionFo span').text(data.result.consumptionFo);
            $('.td_details .bunkeringHfo span').text(data.result.bunkeringHfo);
            $('.td_details .bunkeringFo span').text(data.result.bunkeringFo);
            $('.td_details .co2emittedTotal span').text(data.result.co2emittedTotal);
            $('.td_details .co2emittedVoyages span').text(data.result.co2emittedVoyages);
            $('.td_details .co2emittedDeparted span').text(data.result.co2emittedDeparted);
            $('.td_details .co2emittedToports span').text(data.result.co2emittedToports);
            $('.td_details .co2emittedWithinports span').text(data.result.co2emittedWithinports);
        });
    });
    //点击删除
    $('.td_details').on('click','.deleteBtn',function(){
        var id = $(this).attr('attrId');
        $.getJSON(url+'shipvoyageefficiencystats/del/'+id,function(data) {
            if(data.state){
                $('.mrv_mc_new_plan').addClass('hide');
                getDate(url,typeNum,yearNum,monthNum,page,size);
            }
        })
    })
    //选择时间计算排放
    /*
    $("#strDateOfDepature").unbind("click").bind("click",function(){
        var depature=$("#strDateOfDepature").val();
        var arrival=$("#strDateOfArrival").val();
        if ( (depature == null || depature == "") || (arrival == null || arrival == "") ) {
            $("#co2emittedTotal").val("");
            $("#co2emittedVoyages").val("");
            $("#co2emittedToports").val("");
            $("#co2emittedDeparted").val("");
            $("#co2emittedWithinports").val("");
            return;
        }
        $.get(url+"/shipvoyageefficiencystats/co2?begin="+depature+"&end="+arrival,function(data){
            if(data.state){
                $("#co2emittedTotal").val((data.result.co2emittedTotal*1).toFixed(3) + " kg");
                $("#co2emittedVoyages").val((data.result.co2emittedVoyages*1).toFixed(3) + " kg");
                $("#co2emittedToports").val((data.result.co2emittedToports*1).toFixed(3) + " kg");
                $("#co2emittedDeparted").val((data.result.co2emittedDeparted*1).toFixed(3) + " kg");
                $("#co2emittedWithinports").val((data.result.co2emittedWithinports*1).toFixed(3) + " kg");
            }
        });
    });

    $("#strDateOfArrival").unbind("click").bind("click",function(){
        var depature=$("#strDateOfDepature").val();
        var arrival=$("#strDateOfArrival").val();
        if ( (depature == null || depature == "") || (arrival == null || arrival == "") ) {
            $("#co2emittedTotal").val("");
            $("#co2emittedVoyages").val("");
            $("#co2emittedToports").val("");
            $("#co2emittedDeparted").val("");
            $("#co2emittedWithinports").val("");
            return;
        }
        $.get(url+"/shipvoyageefficiencystats/co2?begin="+depature+"&end="+arrival,function(data){
            if(data.state){
                $("#co2emittedTotal").val((data.result.co2emittedTotal*1).toFixed(3) + " kg");
                $("#co2emittedVoyages").val((data.result.co2emittedVoyages*1).toFixed(3) + " kg");
                $("#co2emittedToports").val((data.result.co2emittedToports*1).toFixed(3) + " kg");
                $("#co2emittedDeparted").val((data.result.co2emittedDeparted*1).toFixed(3) + " kg");
                $("#co2emittedWithinports").val((data.result.co2emittedWithinports*1).toFixed(3) + " kg");
            }
        });
    });
    */
    //from提交
    var rules={ //配置验证规则，key就是被验证的dom对象，value就是调用验证的方法(也是json格式)
        voyageNo:{required:true,number:true},
        portNameOfArrival:{required:true},
        portNameOfDeparture:{required:true},
        dateOfDepature:{required:true},
        dateOfArrival:{required:true},
        distanceTravelled:{required:true,number:true},
        timeAtsea:{required:true,number:true},
        cargo:{required:true},
        storageHfo:{required:true,number:true},
        storageFo:{required:true,number:true},
        consumptionHfo:{required:true,number:true},
        consumptionFo:{required:true,number:true},
        bunkeringHfo:{required:true,number:true},
        bunkeringFo:{required:true,number:true},
        co2emittedTotal:{required:true,number:true},
        co2emittedVoyages:{required:true,number:true},
        co2emittedDeparted:{required:true,number:true},
        co2emittedToports:{required:true,number:true},
        co2emittedWithinports:{required:true,number:true}
    };
    $("#shipVoyageEfficiencyStats").validate({rules:rules}).form();
    $(".saveVoyageEfficiencyStatsBtn").unbind("click").bind("click",function(){
        if($("#portOfDeparture").val()==""){
            alert("请选择驶离港口!");
            return ;
        }
        if($("#portOfArrival").val()==""){
            alert("请选择到达港口!");
            return ;
        }
        if($("#shipVoyageEfficiencyStats").validate({rules:rules}).form()){
            $.ajax( {
                type : "POST",
                url : url+"shipvoyageefficiencystats/save",
                //contentType:'application/x-www-form-urlencoded',
                data : $("#shipVoyageEfficiencyStats").serialize(),
                success : function(data) {
                    if(data.state){
                        alert("保存成功!");
                        $('.mrv_mc_new_plan').addClass('hide');
                        getDate(url,typeNum,yearNum,monthNum,page,size);
                    }
                }
            });
        }
    });
    /**
     * 驶离港口 港口模糊搜索
     */
    $("#portNameOfDeparture").autocomplete({
        source:function(request,response) {
            $.get(url+"port?q="+$.trim(request.term),function(data){
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
        max : 12, //列表里的条目数
        scrollHeight : 300, //提示的高度，溢出显示滚动条
        minLength: 2,  // 输入框字符个等于2时开始查询
        select: function( event, ui ) { // 选中某项时执行的操作
            //$("#portOfDeparture").val(tool.defaultString(ui.item.id, '--'));
            $("#portOfDeparture").val(ui.item.id,'--')
        }
    });
    /**
     * 到达港口 港口模糊搜索
     */
    $("#portNameOfArrival").autocomplete({
        source:function(request,response) {
            $.get(url+"port?q="+$.trim(request.term),function(data){
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
            //$("#portOfArrival").val(tool.defaultString(ui.item.id, '--'));
            $("#portOfArrival").val(ui.item.id,'--')
        }
    });
});
//请求数据
function getDate(url,typeNum,yearNum,monthNum,page,size){
    $('#result_table').html('');
    var params = Params(typeNum,yearNum,monthNum);
    $.getJSON(url+"shipvoyageefficiencystats?page="+page+"&size="+size+"&"+params,function(data){
        if(data.state){
            data.result.contents.map(function(obj,index){
                $('#result_table').append('<tr class="tr_data"><td attrId="'+obj.id+'" class="cursor">'+obj.voyageNo+'</td><td>'+obj.portOfDeparture+'</td><td>'+obj.portOfArrival+'</td>' +
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
    $('#result_table .distanceTravelled').map(function(index,obj){
        distanceTravelled = accAdd(distanceTravelled,obj.innerText)
    });
    $('#result_table .timeAtsea').map(function(index,obj){
        timeAtsea = accAdd(timeAtsea,obj.innerText)
    });
    $('#result_table .cargo').map(function(index,obj){
        cargo = accAdd(cargo,obj.innerText)
    });
    $('#result_table .storageHfo').map(function(index,obj){
        storageHfo = accAdd(storageHfo,obj.innerText)
    });
    $('#result_table .storageFo').map(function(index,obj){
        storageFo = accAdd(storageFo,obj.innerText)
    });
    $('#result_table .consumptionHfo').map(function(index,obj){
        consumptionHfo = accAdd(consumptionHfo,obj.innerText)
    });
    $('#result_table .consumptionFo').map(function(index,obj){
        consumptionFo = accAdd(consumptionFo,obj.innerText)
    });
    $('#result_table .bunkeringHfo').map(function(index,obj){
        bunkeringHfo = accAdd(bunkeringHfo,obj.innerText)
    });
    $('#result_table .bunkeringFo').map(function(index,obj){
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