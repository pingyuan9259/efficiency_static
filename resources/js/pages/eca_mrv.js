/**
 * 海图
 */
$(function(){
	ecaMrv.init();
});

var ecaMrv = {
	init:function(){
		var self = this;

		$("#select_type").change(function(){
			var val = $("#select_type").children('option:selected').val();
			if(val=="1"){
				$("#select_year").show();
				$("#select_month").show();
				$("#select_voyageNo").hide();
			}
			else{
				$("#select_year").hide();
				$("#select_month").hide();
				$("#select_voyageNo").show();
			}
		});
		
		// 航程列表
		$.getJSON(server_url+"/shipvoyageefficiencystats/voyageno",function(data){
			if(data.state){
				var opts = "<option value=''>全部</option>";
				for(var i = 0;i<data.result.length;i++){
					var val = data.result[i].voyageNo;
					var text = data.result[i].portNameOfDeparture;
					opts+="<option value='"+val+"'>"+text+"</option>";
				}
				$("#select_voyageNo").html(opts);
				$("#select_voyageNo").multiSelect({
					noneSelected: "==请选择==",
					selectAll:false,
			        listHeight:250
			    });
				$("#select_voyageNo").hide();
			}
		});
		
		$("#btn_query").bind("click",function(){
			self.loadData(0,10);
		});
		
		self.loadData(0,10);

		$("#nav_first").bind("click",function(){
			self.loadData(0,10);
		});

		$("#nav_prev").bind("click",function(){
			var totalPage = parseInt($("#nav_total").text());
			var page = $("#nav_curr").text()-2;
			if(parseInt(page)<0 || parseInt(page)>=totalPage)return;
			self.loadData(page,10);
		});
		
		$("#strDateOfDepature").unbind("blur").bind("blur",function(){
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
			$.get(server_url+"/shipvoyageefficiencystats/co2?begin="+depature+"&end="+arrival,function(data){
				if(data.state){
					$("#co2emittedTotal").val((data.result.co2emittedTotal*1).toFixed(3) + " kg");
					$("#co2emittedVoyages").val((data.result.co2emittedVoyages*1).toFixed(3) + " kg");
					$("#co2emittedToports").val((data.result.co2emittedToports*1).toFixed(3) + " kg");
					$("#co2emittedDeparted").val((data.result.co2emittedDeparted*1).toFixed(3) + " kg");
					$("#co2emittedWithinports").val((data.result.co2emittedWithinports*1).toFixed(3) + " kg");
			    }
			});
		});
		
		$("#strDateOfArrival").unbind("blur").bind("blur",function(){
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
			$.get(server_url+"/shipvoyageefficiencystats/co2?begin="+depature+"&end="+arrival,function(data){
				if(data.state){
					$("#co2emittedTotal").val((data.result.co2emittedTotal*1).toFixed(3) + " kg");
					$("#co2emittedVoyages").val((data.result.co2emittedVoyages*1).toFixed(3) + " kg");
					$("#co2emittedToports").val((data.result.co2emittedToports*1).toFixed(3) + " kg");
					$("#co2emittedDeparted").val((data.result.co2emittedDeparted*1).toFixed(3) + " kg");
					$("#co2emittedWithinports").val((data.result.co2emittedWithinports*1).toFixed(3) + " kg");
			    }
			});
		});

		$("#nav_next").bind("click",function(){
			var totalPage = parseInt($("#nav_total").text());
			var page = $("#nav_curr").text();
			if(parseInt(page)<0 || parseInt(page)>=totalPage)return;
			self.loadData(page,10);
		});

		$("#nav_last").bind("click",function(){
			var totalPage = $("#nav_total").text();
			self.loadData(totalPage-1,10);
		});

		$("#newVoyageEfficiencyStats").click(function(){
			$("#voyageEfficiencyStatsid").val("");
			$(".deleteVoyageEfficiencyStatsBtn").hide();
			$("#shipVoyageEfficiencyStats")[0].reset();
			tool.showDialog('nt_dialog');
		});
		
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
			 }
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
		                url : server_url+"/shipvoyageefficiencystats/save",  
		                data : $("#shipVoyageEfficiencyStats").serialize(),  
		                success : function(data) { 
		                	if(data.state){
						    	alert("保存成功!");
						    	tool.closeDialog();
								var curr = $("#nav_curr").text();
								self.loadData(curr-1,10);
						    }
		                }  
		            }); 
				}
				
			});
			
			$(".deleteVoyageEfficiencyStatsBtn").unbind("click").bind("click",function(){
				if (confirm("您真的确定要删除吗？\n\n请确认！")==true){ 
					$.get(server_url+"/shipvoyageefficiencystats/del/"+$("#voyageEfficiencyStatsid").val(),function(data){
						if(data.state){
					    	alert("删除成功!");
					    	tool.closeDialog();
					    	var curr = $("#nav_curr").text();
							self.loadData(curr-1,10);
					    }
					});
				}
			});
			
			$("#export").unbind("click").bind("click",function(){
				if (confirm("您真的确定要导出吗？\n\n请确认！")==true){ 
					window.open(server_url+"/shipvoyageefficiencystats/download?"+self.getParams()) 
				}
			});
			
			/**
			 * 驶离港口 港口模糊搜索
			 */
			$("#portNameOfDeparture").autocomplete({
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
				max : 12, //列表里的条目数
                scrollHeight : 300, //提示的高度，溢出显示滚动条
				minLength: 2,  // 输入框字符个等于2时开始查询            
				select: function( event, ui ) { // 选中某项时执行的操作
					$("#portOfDeparture").val(tool.defaultString(ui.item.id, '--'));
				}                           
			});
			/**
			 * 到达港口 港口模糊搜索
			 */
			$("#portNameOfArrival").autocomplete({
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
					$("#portOfArrival").val(tool.defaultString(ui.item.id, '--'));
				} 
			});
	},
	
	// 请求数据
	loadData:function(page,size){
		var self = this;
		var params = self.getParams();
		$.getJSON(server_url+"/shipvoyageefficiencystats?page="+page+"&size="+size+"&"+params,function(data){
			self.refresh(data);
		});
	},
	
	getParams:function(){
		var type = $("#select_type").children('option:selected').val();
		var params="";
		if(type=="1"){
			var year = $("#select_year").val();
			var month = $("#select_month").val();
			params="type=1&year="+year+"&month="+month;
		}
		else{
			var values=[];
	        $("#select_voyageNo").parent().children(".multiSelectOptions").find("input:checkbox:checked").each(function(i,item){
	        	values.push($(item).attr("value"));
	        }); 
			params="type=2&voyageno="+values.join(";");
		}
		return params;
	},

	// 刷新数据
	refresh:function(data){
		if(data.state){
    		$('#nav_curr').text(tool.defaultString(data.result.number, '--'));
    		$('#nav_total').text(tool.defaultString(data.result.totalPages, '--'));
    		
    		var html ="";
    		$("#result_table").html(html);
    		var distanceTravelled = 0;
    		var timeAtsea = 0;
    		var cargo = 0;
    		var storageHfo = 0;
    		var storageFo = 0;
    		var consumptionHfo = 0;
    		var consumptionFo = 0;
    		var bunkeringHfo = 0;
    		var bunkeringFo = 0;
    		
    		for(var i=0;i<data.result.contents.length;i++){
    			var obj = data.result.contents[i];
    			
    			distanceTravelled+=parseFloat(obj.distanceTravelled);
    			
    			timeAtsea+=parseFloat(obj.timeAtsea);
    			cargo+=parseFloat(obj.cargo);
    			storageHfo+=parseFloat(obj.storageHfo);
    			storageFo+=parseFloat(obj.storageFo);
    			
    			consumptionHfo+=parseFloat(obj.consumptionHfo);
    			consumptionFo+=parseFloat(obj.consumptionFo);
    			bunkeringHfo+=parseFloat(obj.bunkeringHfo);
    			bunkeringFo+=parseFloat(obj.bunkeringFo);
    			
    			html+="<tr class='tr_data'>"+
		        "<td><a href='javascript:void(0)' class='editVoyageEfficiencyStatsBtn' voyageEfficiencyStatsid='"+obj.id+"'>"+obj.voyageNo+"</a></td>"+
		        "<td>"+obj.portNameOfDeparture+"</td>"+
		        "<td>"+obj.portNameOfArrival+"</td>"+
		        "<td>"+tool.getLocalTime(obj.dateOfDepature)+"</td>"+
		        "<td>"+tool.getLocalTime(obj.dateOfArrival)+"</td>"+
		        "<td>"+obj.distanceTravelled+"</td>"+
		        "<td>"+obj.timeAtsea+"</td>"+
		        "<td>"+obj.cargo+"</td>"+
		        "<td>"+obj.storageHfo+"</td>"+
		        "<td>"+obj.storageFo+"</td>"+
		        "<td>"+obj.consumptionHfo+"</td>"+
		        "<td>"+obj.consumptionFo+"</td>"+
		        "<td>"+obj.bunkeringHfo+"</td>"+
		        "<td>"+obj.bunkeringFo+"</td>"+
		        "<td>"+obj.co2emittedTotal+"</td>"+
		        "<td>"+obj.co2emittedVoyages+"</td>"+
		        "<td>"+obj.co2emittedDeparted+"</td>"+
		        "<td>"+obj.co2emittedToports+"</td>"+
		        "<td>"+obj.co2emittedWithinports+"</td>"
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
		        "<td>"+"</td>"
		        +"</tr>";
    		}
    		
    		$("#result_table").html(html);
    		
    		$("#total_distanceTravelled").text(tool.defaultString(distanceTravelled), '--');
    		$("#total_timeAtsea").text(tool.defaultString(timeAtsea, '--'));
    		$("#total_cargo").text(tool.defaultString(cargo, '--'));
    		$("#total_storageHfo").text(tool.defaultString(storageHfo, '--'));
    		$("#total_storageFo").text(tool.defaultString(storageFo, '--'));
    		$("#total_consumptionHfo").text(tool.defaultString(consumptionHfo, '--'));
    		$("#total_consumptionFo").text(tool.defaultString(consumptionFo, '--'));
    		$("#total_bunkeringHfo").text(tool.defaultString(bunkeringHfo, '--'));
    		$("#total_bunkeringFo").text(tool.defaultString(bunkeringFo, '--'));
    		
    		$(".editVoyageEfficiencyStatsBtn").unbind("click").bind("click",function(){
    			var voyageEfficiencyStatsid=$(this).attr("voyageEfficiencyStatsid");
    			$.getJSON(server_url+"/shipvoyageefficiencystats/"+voyageEfficiencyStatsid,function(data){  
    			    if(data.state){
    			    	$("#voyageNo").val(tool.defaultString(data.result.voyageNo, '--'));
    			    	$("#portOfDeparture").val(tool.defaultString(data.result.portOfDeparture, '--'));
    			    	$("#portOfArrival").val(tool.defaultString(data.result.portOfArrival, '--'));
    			    	$("#portNameOfDeparture").val(tool.defaultString(data.result.portNameOfDeparture, '--'));
    			    	$("#portNameOfArrival").val(tool.defaultString(data.result.portNameOfArrival, '--'));
    			    	$("#strDateOfDepature").val(tool.getLocalTime(data.result.dateOfDepature));
    			    	$("#strDateOfArrival").val(tool.getLocalTime(data.result.dateOfArrival));
    			    	$("#distanceTravelled").val(tool.defaultString(data.result.distanceTravelled, '--'));
    			    	$("#timeAtsea").val(tool.defaultString(data.result.timeAtsea, '--'));
    			    	$("#cargo").val(tool.defaultString(data.result.cargo, '--'));
    			    	$("#storageHfo").val(tool.defaultString(data.result.storageHfo, '--'));
    			    	$("#storageFo").val(tool.defaultString(data.result.storageFo, '--'));
    			    	$("#consumptionHfo").val(tool.defaultString(data.result.consumptionHfo, '--'));
    			    	$("#consumptionFo").val(tool.defaultString(data.result.consumptionFo, '--'));
    			    	$("#bunkeringHfo").val(tool.defaultString(data.result.bunkeringHfo, '--'));
    			    	$("#bunkeringFo").val(tool.defaultString(data.result.bunkeringFo, '--'));
    			    	$("#co2emittedTotal").val(tool.defaultString(data.result.co2emittedTotal, '--'));
    			    	$("#co2emittedVoyages").val(tool.defaultString(data.result.co2emittedVoyages, '--'));
    			    	$("#co2emittedDeparted").val(tool.defaultString(data.result.co2emittedDeparted, '--'));
    			    	$("#co2emittedToports").val(tool.defaultString(data.result.co2emittedToports, '--'));
    			    	$("#co2emittedWithinports").val(tool.defaultString(data.result.co2emittedWithinports, '--'));
    			    }  
    			});  
    			$("#voyageEfficiencyStatsid").val(tool.defaultString(voyageEfficiencyStatsid, '--'));
    			$(".deleteVoyageEfficiencyStatsBtn").show();
    			$("#portNameOfArrival,#portNameOfDeparture").parent().children("ul").hide();
    			tool.showDialog('nt_dialog');
    		});
    	}
	}
}