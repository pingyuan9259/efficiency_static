$(function(){
    var t = window.setInterval(getData(1003),5000);
});

function trimcallback(obj,value){
    console.log(obj);
    console.log(value);
}

function getData(num){
    var list = [];
    var n = '.'+num;
    $(n).each(function(){
        var id = $(this).attr('id');
        var key = $(this).attr('data-key');
        list.push({"name":id,"key":key});
    });

    console.log("exec 1003 interface!");
    $.ajax({
        type : "POST",
		url : rootpath+"/interface"+num,
        contentType:'application/json',
        data : JSON.stringify(list),
        error : function() {
        },
        success : function(data) {
        	console.log(data);
            var list = data.result;
            list.map(function(obj,index){
                var id = obj.name;
                var val = obj.value;
                var nid = '#'+id;
                if(val == null || val == ""){
                    $(nid).text($(nid).attr('data-default'))
                }else{
                    if($(nid).attr('data-callback')!='' && $(nid).attr('data-callback') != undefined){
                    	console.log("callback:"+$(nid).attr('data-callback'));
                        window['trimcallback']($(nid),val)
                    }else{
                        $(nid).html(val);
                    }
                }
            })
        }
    });
}