/**
 * 工具
 */
var tool = {
	/**
	 * 打开弹层
	 */
	showDialog:function(divId){
		easyDialog.open({
			container :divId, //打开弹层的id
			fixed:true,         //跟随
			overlay:true       //是否遮罩
			//autoClose : 5000    //5秒后自动关闭
		});
	},
	/**
	 * 关闭弹层
	 */
	closeDialog:function(){
		easyDialog.close()  //关闭弹层
	},
	getLocalTime:function(nS) {
		var now=new Date(nS);
		var year=now.getYear()+1900;
		var month=now.getMonth()+1;
		var date=now.getDate();
		var hour=now.getHours();
		var minute=now.getMinutes();
		var second=now.getSeconds();
		return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
	},
	
	/**
	 * 获取当前日期时间“yyyy-MM-dd HH:MM:SS
	 */
	getNowFormatDate:function () {
	    var now = new Date();
	    var seperator1 = "-";
	    var seperator2 = ":";
	    var month = now.getMonth() + 1;
	    var date = now.getDate();
	    var hours = now.getHours();
	    var minutes = now.getMinutes();
	    var seconds = now.getSeconds();
	    
	    if (month >= 1 && month <= 9) {
	        month = "0" + month;
	    }
	    if (date >= 0 && date <= 9) {
	    	date = "0" + date;
	    }
	    
	    if (hours >= 0 && hours <= 9) {
	    	hours = "0" + hours;
	    }
	    if (minutes >= 0 && minutes <= 9) {
	    	minutes = "0" + minutes;
	    }
	    if (seconds >= 0 && seconds <= 9) {
	    	seconds = "0" + seconds;
	    }
	    var currentdate = now.getFullYear() + seperator1 + month + seperator1 + date
	            + " " + hours + seperator2 + minutes + seperator2 + seconds;
	    return currentdate;
	},
	
	/**
	 * 判断字符串，返回值
	 */
	defaultString:function(str, defaultStr){
		if(str==undefined||str==null||str==""||str=="--"){
			return defaultStr;
		}else{
			if(!isNaN(str)){
				return str.toFixed(2);
			}else{
				return str;
			}
		}
	},
	/**
	 * 判断字符串，返回值
	 * str
	 * defaultStr:默认
	 * unit:单位
	 */
	defaultStringUnit:function(str,unit, defaultStr){
		if(str==null||str==""){
			return defaultStr;
		}else{
			if(!isNaN(str)){
				return str.toFixed(2)+unit;
			}else{
				return str+unit;
			}
		}
	},
	
	//20170812111659
	getFormatTime:function(dateString) {
		dateString=dateString.toString();
		var year=dateString.substr(0,4);
		var month=dateString.substr(4,2);
		var date=dateString.substr(6,2);
		var hour=dateString.substr(8,2);
		var minute=dateString.substr(10,2);
		var second=dateString.substr(12,2);
		return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
	},
	/**
	 * 将度转换成为度分秒
	 */
	formatDegree:function (value) {  
        value = Math.abs(value);  
        var v1 = Math.floor(value);//度  
        var v2 = Math.floor((value - v1) * 60);//分  
        var v3 = Math.round((value - v1) * 3600 % 60);//秒  
        return v1 + '°' + v2 + '\'' + v3 + '"';  
    },  
   

     /**
      * 度分秒转换成为度
      */ 
    degreeConvertBack:function (value){ 
        var du = value.split("°")[0];  
        var fen = value.split("°")[1].split("'")[0];  
        var miao = value.split("°")[1].split("'")[1].split('"')[0];  
        return Math.abs(du) + "." + (Math.abs(fen)/60 + Math.abs(miao)/3600);  
    },
    
    /**
	 * 按照距离生成点轨迹，每隔5米一个点
	 */
	makePath:function(dataList,distance){
		if(dataList == null)return;
		// 轨迹点集合
		var points = [];
		// 构造轨迹点集合
		var latitudeTemp,longitudeTemp;
		for(var i=0;i<dataList.length-1;i++){
			if(dataList[i]==null)continue;
			if(dataList[i+1]==null)continue;
			
			var point1 = dataList[i];
			var point2 = dataList[i+1];
			if(point2[0]!=point1[0]&&point2[1]!=point1[1]){
				// 根据长度求每段生成的轨迹点个数
				var length =new ol.geom.LineString([point1,point2]).getLength()
				var count = length/distance;
				for(var j=0;j<count;j++){
					// 计算每个点的坐标
					latitudeTemp = distance*j*(point2[1]-point1[1])/length+point1[1];
					longitudeTemp = (latitudeTemp-point1[1])*(point2[0]-point1[0])/(point2[1]-point1[1]) + point1[0];
					points.push([longitudeTemp,latitudeTemp,i]);
				}
			}
		}
		return points;
	},
	//写cookies
	setCookie:function(name,value){
		var Days = 30;
		var exp = new Date();
		exp.setTime(exp.getTime() + Days*24*60*60*1000);
		document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
	},
	//读取cookies
	getCookie:function(name){
		var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		if(arr=document.cookie.match(reg))
			return unescape(arr[2]);
		else
			return null;
	},
	//删除cookies
	delCookie:function(name){
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		var cval=this.getCookie(name);
		if(cval!=null)
		document.cookie= name + "="+cval+";expires="+exp.toGMTString();
	}
    
}