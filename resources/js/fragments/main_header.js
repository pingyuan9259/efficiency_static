/**
 * 海图
 */
/**
 * 鼠标停止事件
 * @param $
 * @returns
 */
(function($){
 $.fn.moveStopEvent = function(callback){
  return this.each(function() {
   var x = 0,
    y = 0,
    x1 = 0,
    y1 = 0,
    isRun = false,
    si,
    self = this;
   var sif = function(){
    si = setInterval(function(){
         if(x == x1 && y ==y1){
          clearInterval(si);
          isRun = false;
          callback && callback.call(self);
         }
         x = x1;
         y = y1;
        }, 500);
   }
   $(this).mousemove(function(e){
    x1 = e.pageX;
    y1 = e.pageY;
    !isRun && sif(), isRun = true;
   }).mouseout(function(){
    clearInterval(si);
    isRun = false;
   });
 });
 }
})(jQuery);

$(function(){
	$(".nt_indexjtLeft").hide();
	$(".nt_indexjtRight").hide();
	mainHeader.init();
	
	//每5秒刷新    获取最新更新时间 
	// setInterval(function(){
	// 	$.ajax({
	//         type: "post",
	//         url:server_url+"/shipdrivinginfo",
	//         dataType: "json",
	//         success: function(data){
	//         	if(data.state){
	//         		$("#updateTime").text(tool.getLocalTime(data.result.utc));
	//         	}
	//         }
	//     });
	// },5000);
});

var mainHeader = {
	/**
	 * 初始化
	 */
	init:function(){
		
		//获取最新更新时间
		$.ajax({
	        type: "post",
	        url:server_url+"/shipdrivinginfo",
	        dataType: "json",
	        success: function(data){
	        	if(data.state){
	        		$("#updateTime").text(tool.getLocalTime(data.result.utc));
	        	}
	        }
	    });
		
		$("#options").multiSelect({
			noneSelected: "====请选择====",
			selectAll:false,
	        listHeight:200
	    });
		$.getJSON(server_url+"/checklogin",function(data){
			if(data.state){
				$("#loginname").text(tool.defaultString(data.result.username, '--'));
				$("#loginNameSpan").show();
				$("#logout").show();
				$("#login").hide();
			}else{
				$("#loginNameSpan").hide();
				$("#logout").hide();
				$("#login").show();
			}
		});
		
		$("#loginNameSpan").on("click",function(){
			if($(this).hasClass("nt_top_seton")){
				$(this).removeClass("nt_top_seton");
			}else{
				$(this).addClass("nt_top_seton");
			}
		});
		
		//设置
		$("#setting").click(function(){
			tool.showDialog('setting_dialog');
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
				$.post(server_url+"/sysparam/save",{code:"co2",value:$("#co2Value").val(),carge:"carge",cargeval:$("#carge").val(),options:options.join(";")},function(data){
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
			}
		});
		
		$("#exit").bind("click",function(){
			if (confirm("您真的确定要退出吗？\n\n请确认！")==true){ 
				var browser = navigator.userAgent
				 if(browser.indexOf("Chrome")!= -1 || browser.indexOf("Firefox") != -1){
					 $("#exitSystem").click();
				 }else{
					 window.close(222);
				 }
			}
		});
		
		$(document).mousemove(function(e){
			$(".nt_indexjtLeft").show();
			$(".nt_indexjtRight").show();
		});
		
		$(document).moveStopEvent(function(){
			setTimeout(function () {
				$(".nt_indexjtLeft").hide();
				$(".nt_indexjtRight").hide();
            }, 3000);
		});
		
	}
}
