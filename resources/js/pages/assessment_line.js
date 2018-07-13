/**
 * 暂无
 */
$(function(){
	assessmentLine.init();
	//每5分钟刷新
	setInterval(function(){
		$("#analysisBtn").trigger("click");
	},300000);
});
var assessmentLine = {
	charts:{},
	datas:[],
	seriesIndex:0,
	colors:['#308FBE','#81262B','#FEBF00','#397237'],
	/**
	 * 初始化	锅炉
	 */
	init:function(){
		var self=this;
		var lang=$("#hdlang").val();
		$("#control_1").multiSelect({
			noneSelected: "====请选择====",
			selectAll:false,
	        listHeight:250
	    });
		$("#analysisBtn").click(function(){
			var values=[];
			$("#control_1").parent().children(".multiSelectOptions").find("input:checkbox:checked").each(function(i,item){
	        	values.push($(item).attr("value"));
	        }); 
			
	        if(values.length>4){
	        	alert("最多只能选择4项!");
	        }else{
	        	$("#control_1").children("span").text("选中 "+values.length+"个");
	        	self.initChartData(true,lang,values);
	        }
		});
		
		$("#analysisBtn").trigger("click");
		
		//选择天数进行查询
		$("#selectDay").change(function(){
			$("#analysisBtn").trigger("click");
		});
	},
	
	/**
	 * 
	 */
	initChartData:function(isInitLineChart,lang,values){
		var self=this,day=$("#selectDay").val();
		$.getJSON(server_url+"/indicatorfilter?lang="+lang+"&period="+day+"&selected="+values.join(";"),function(data){
    		console.log(data);
			var xData=new Array(),yData=new Array();
    		self.datas=new Array();
    		
    		var titles=new Array(),grids=new Array(),
    		xAxis=new Array(),yAxis=new Array(),series=new Array();
    		$.each(data, function(index1, obj1) {
    			titles.push(
    				{
						text:obj1.name,
						gridIndex: index1,
						textStyle:{
							color:"#9D9D9F",
							fontSize:15
						},
						top: index1*23+22+'%',
				        left: (50-(obj1.name.length*180/100)/2)+'%'
					}
				);
    			grids.push({
    		    	top: index1*23+5+'%',
    		        left: '12%',
    		        right: '2%',
    		        height: '16%'
    		    });
    			xData=new Array(),yData=new Array();
    			$.each(obj1.results, function(index2, obj2) {	
    				xData.push(obj2.time);
    				yData.push(obj2.value);
                });
    			
    			xAxis.push({
    				show:false,
    		        type: 'category',
    		        data: xData,
    		        interval:10,
    		        splitNumber :17,
    		        gridIndex: index1,
    		        boundaryGap: false,
    		        splitLine:{
    		            show:true,
    		            lineStyle:{
    		                type:'solid',
    		                color: '#9C9D9D',
    		        		width: 2
    		            }
    		        },
    		        axisLabel:{
    		        	textStyle:{
    		        		color:"#9C9D9D"
    		        	}
    		        }
    		    });
    			yAxis.push({
    		        type: 'value',
    		        gridIndex: index1,
    		        name:obj1.unit,
			        nameTextStyle:{
			        	color:'#9C9D9D',
		        		fontWeight:'bolder',
			        	fontSize:14
			        },
    		        splitLine:{
    		        	lineStyle :{
    		        		color: '#fff',
    		        		width: 2
    		        	}
    		        },
    		        axisLabel:{
    		        	textStyle:{
    		        		color:"#9C9D9D"
    		        	}
    		        }
    		    });
    			series.push({
    		        name: obj1.name,
    		        type: 'line',
    		        xAxisIndex:index1,
    		        yAxisIndex:index1,
    		        data: yData,
    		        itemStyle: {
    	                normal: {
    	                    lineStyle:{
    	                    	color:self.colors[index1],
    	                    },
    	                    label: {
    	                        show: true,
    	                        position: 'top',
    	                    }
                    	}
    	            }
    		    });
    			self.datas.push({xData:xData,yData:yData,name:obj1.name,unit:obj1.unit});
        		
            });
    		if(isInitLineChart){
				self.initLineChart(0);
			}
    		self.initChart("chart",titles,grids,xAxis,yAxis,series);
		});
	},
	
	/**
	 * 初始化左边图表
	 */
	initChart(domid,titles,grids,xAxis,yAxis,series){
		var self=this;
		var myChart =  echarts.init(document.getElementById(domid));
		var datazoom=new Array();
		for(var i=0;i<titles.length;i++){
			datazoom.push(i);
		}
		var option = {
				title:titles,
				tooltip: {
		            trigger: 'axis',
		            axisPointer: {
		                type: 'cross'
		            },
		            backgroundColor: '#050505',
		            borderWidth: 1,
		            borderColor: '#ccc',
		            padding: 2,
		            textStyle: {
		                color: '#fff',
		                fontSize:11
		            },
		            position: function (pos, params, el, elRect, size) {
		                var obj = {top: 10};
		                obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
		                return obj;
		            },
		            extraCssText: 'width: 170px'
		        },
		        axisPointer: {
		            link: {xAxisIndex: 'all'},
		            label: {
		                backgroundColor: '#777'
		            }
		        },
			    grid:grids,
			    dataZoom: [
			        {
			            show: true,
			            realtime: true,
			            start: 0,
			            end: 100
			        },
			        {
			            type: 'inside',
			            realtime: true,
			            xAxisIndex:datazoom,
	    		        yAxisIndex:datazoom,
			            start: 0,
			            end: 100
			        }
			    ],
			    xAxis:xAxis,
			    yAxis:yAxis,
			    series: series
			};
		myChart.on("click", function(param){
			if(param.seriesIndex!=undefined&&self.seriesIndex!=param.seriesIndex){
				self.initLineChart(param.seriesIndex);
				self.seriesIndex=param.seriesIndex;
			}
		});
		myChart.setOption(option, true);
	},
	
	/**
	 * 初始化线形图表
	 */
	initLineChart:function(index){
		var self=this;
		var myChart = echarts.init(document.getElementById("lineChart"));
		var option = {
				tooltip: {
			        trigger: 'axis'
			    },
			    legend: {
			    	show:true,
			        data:[self.datas[index].name],
			        textStyle:{
			        	color:'#575758',
		        		fontWeight:'bolder',
			        	fontSize:18
			        }
			    },
			    brush: {
			        toolbox: ['lineX', 'clear'],
			        xAxisIndex: 0
			    },
			    toolbox: {
			        show: true,
			        x: 10
			    },
			    dataZoom: [
			        {
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
			    	y2:80
			    },
			    xAxis:  {
			    	show:true,
			        type: 'category',
			        data: self.datas[index].xData,
			        interval:10,
			        splitNumber :10,
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
			        }
			    },
			    yAxis: {
			        type: 'value',
			        name:self.datas[index].unit,
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
			    series: [
			        {
			            name:self.datas[index].name,
			            type:'line',
			            data:self.datas[index].yData,
			            lineStyle:{
				        	normal:{
				        		color: '#FFC000',
				        		width: 3
				        	}
				        }
			           
			        }
			    ]
			};
			//区域选择 显示平均值、最小值、最大值
			myChart.on('brushSelected', function(params) {
				var sum = 0;
		        var min =Infinity;
		        var max =0;
		        var average=0;
		        myChart.setOption({
	 		        title: {
	 		        	show:false
	 		        }
	 		    });
		        if(params.batch.length>0){
		        	 if(params.batch[0].areas.length>0){
		        		 var coordRange=params.batch[0].areas[0].coordRange;
		        		 var n=0;
	    	        	 for(var i=0;i<self.datas[index].yData.length;i++){
	    	        		 if(i<=coordRange[1]&&i>=coordRange[0]){
	    	        			 n++;
	    	        			 sum += self.datas[index].yData[i];
	    	        			 min = Math.min(self.datas[index].yData[i], min);
	            	             max = Math.max(self.datas[index].yData[i], max);
	    	        		 }
	    	        	 }
	    	        	 average=(sum/n).toFixed(2); 
	    	        	 myChart.setOption({
	         		        title: {
	         		        	show:true,
	         		            backgroundColor: '#333',
	         		            text: '平均值:'+average+' \n' 
	         		            	+ '最小值:'+min+'\n'
	         		            	+ '最大值:'+max+'\n',
	         		            bottom: 100,
	         		            right: 100,
	         		            width: 100,
	         		            textStyle: {
	         		                fontSize: 16,
	         		                color: '#fff'
	         		            }
	         		        }
	         		    });
	    	         }
		         }
			   
			});
			myChart.setOption(option, true);
	}

}