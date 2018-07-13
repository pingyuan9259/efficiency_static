/**
 * 首页
 */
$(function(){
	analysisEquitment.init();
});
var analysisEquitment = {
	colors:['#6BA659','#8C74CA','#3EACC9','#F4A31F'],
	/**
	 * 初始化
	 */
	init:function(){
		var self=this;
		$("#analysisBtn").click(function(){
			var begin=$("#startDate").val(),end=$("#endDate").val();
			if(begin!=""&&end!=""){
				if($("#select").val()!=""){
					$.getJSON(server_url+"/singleindicatorfilter?begin="+begin+"&end="+end+"&selected="+$("#select").val(),function(data){
						var xAxisData=new Array(),seriesData=new Array(),series=new Array(),unit="";
		        		$.each(data, function(index1, obj1) {
		        			$("#legend"+index1).text(tool.defaultString(obj1.name, '--'));
		        			unit=obj1.unit;
		        			xAxisData=new Array(),seriesData=new Array();
		        			$.each(obj1.results, function(index2, obj2) {	
		        				xAxisData.push(obj2.time);
		        				if(obj2.value==null){
		        					seriesData.push({value:[index2, ''],symbol:'circle'});
		        				}else{
		        					seriesData.push({value:[index2, obj2.value],symbol:'circle'});
		        				}
		        				
			                });
		        			series.push({
					            name:obj1.name,
					            type: 'line',
					            smooth: false,
					            symbolSize: 16,
					            data:seriesData,
				                itemStyle: {
				                    normal: {
				                        color: self.colors[index1]
				                    }
				                }
					        });
		        			
		                });
		        		
		        		var myChart = echarts.init(document.getElementById("analysisEquitmentChart"));
						var option = {
								tooltip: {
							        trigger: 'axis'
							    },
		        			    dataZoom: [{
		        			            show: true,
		        			            realtime: true,
		        			            start: 0,
		        			            end: 100
		        			        },
		        			        {
		        			            type: 'inside',
		        			            realtime: true,
		        			            start: 0,
		        			            end: 100
		        			        }
		        			    ],
		        			    grid:{
		        			    	right:10,
		        			    	y2:80
		        			    },
							    xAxis:  {
							    	show:true,
							        type: 'category',
							        boundaryGap: false,
							        splitLine:{
							            show:true,
							            lineStyle:{
							                type:'solid'
							            }
							        },
							        axisLine:{
							            lineStyle:{
							                color:'#FFF'
							            }
							        },
							        axisLabel: {
							        	textStyle:{
							        		color:'#575758',
							        		fontWeight:'bolder',
								        	fontSize:18
							        	}
							        },
							        data:xAxisData
							    },
							    yAxis: {
							        type: 'value',
							        name:unit,
							        nameTextStyle:{
							        	color:'#575758',
						        		fontWeight:'bolder',
							        	fontSize:18
							        },
							        axisLabel: {
							        	textStyle:{
							        		color:'#575758',
							        		fontWeight:'bolder',
								        	fontSize:18
							        	}
							        }
							    },
							    series: series
							};
						myChart.setOption(option, true);
					});
				}
			}
		});
		
		$("#analysisBtn").trigger("click");
	}
}