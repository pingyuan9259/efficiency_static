/**
 * 首页
 */
$(function(){
	$("#ship-image").rotate(10);//上:-30(min=-10),下:30 (max=10)
	$("#trim-image").rotate(30);//开始:16(min=10),结束:142(max=-10) 
	$("#slip-image").rotate(-15);//开始:6(min=-100),结束:192(max=100) 
	$("#rotation-image").rotate(-20);//开始:-32(min=0),结束:-170(max=100) 
	
	$(".nt_indLeft_main li").hover(function(){
		$(this).find(".nt_indLeft_main_dndiv").show();
	},function(){
		$(this).find(".nt_indLeft_main_dndiv").hide();
	});
});
