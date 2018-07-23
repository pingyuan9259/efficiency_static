function interface1001() {	

	var dataID ="Lon";
	
	$.ajax({
		type : "POST",
		url : "http://localhost:8080/interface1001",
		data : {
			dataID:dataID
		},
		error : function() {
			alert('receive data error');
		},
		success : function(data) {
			alert('receive data success');
			console.log(data);		
		}
	});
}

function interface1003() {
	var url = $("#hiddel").val();
	var paramsets = new Object();
		paramsets.startTime = "1";
		paramsets.endTime = "1";
		paramsets.jsonParams = [
		{"name":"WindDiration","key":"WindDiration"},
		{"name":"WindSpeed","key":"WindSpeed"}
		];
	
	console.log(paramsets);
	
	$.ajax({
		type : "POST",
//		url : "http://localhost:8080/interface1003",
		url : url,
		contentType:'application/json',
		data : JSON.stringify(paramsets),
		error : function() {
			alert('receive data error');
		},
		success : function(data) {
			alert('receive data success');
			console.log(data.result.WindDiration);
			
			$("#windDiration").text(data.result.WindDiration);
			$("#WindSpeed").text(data.result.WindSpeed);

		}
	});
}

function interface1004() {	
	
	$.ajax({
		type : "POST",
		url : "http://localhost:8080/interface1004",
		data : null,
		error : function() {
			alert('receive data error');
		},
		success : function(data) {
			alert('receive data success');
			console.log(data);		
		}
	});
}

function interface1005() {	
	var dataID ="H00016000";
	var startTime ="1520316584";
	var endTime ="1520324684";
	
	$.ajax({
		type : "POST",
		url : "http://localhost:8080/interface1005",
		data : {
			dataID:dataID,
			startTime:startTime,
			endTime:endTime
		},	
		error : function() {
			alert('receive data error');
		},
		success : function(data) {
			alert('receive data success');
			console.log(data);		
		}
	});
}

function interface1006() {	
	var dataID ="H00016000";
	var startTime ="1520316584";
	var endTime ="1520324684";
	var pointCount ="3000";
	
	$.ajax({
		type : "POST",
		url : "http://localhost:8080/interface1006",
		data : {
			dataID:dataID,
			startTime:startTime,
			endTime:endTime,
			pointCount:pointCount
		},	
		error : function() {
			alert('receive data error');
		},
		success : function(data) {
			alert('receive data success');
			console.log(data);		
		}
	});
}

function interface1007() {	
	
	var dataID ="H00016000";
	var dataArray = "H00016000,Lat,Lon";
	var startTime ="1520316584";
	var endTime ="1520324684";
	
	$.ajax({
		type : "POST",
		url : "http://localhost:8080/interface1007",
		data : {
			dataID:dataID,
			dataArray:dataArray,
			startTime:startTime,
			endTime:endTime,
		},	
		error : function() {
			alert('receive data error');
		},
		success : function(data) {
			alert('receive data success');
			console.log(data);		
		}
	});
}

function interface1009() {	
	
	var dataArray = "H00016000,Lat,Lon";
	var startTime ="1523955000";
	var endTime ="1523965000";
	var rpmLow ="0";
	var rpmHigh ="60";
	
	$.ajax({
		type : "POST",
		url : "http://localhost:8080/interface1009",
		data : {
			dataArray:dataArray,
			startTime:startTime,
			endTime:endTime,
			rpmLow:rpmLow,
			rpmHigh:rpmHigh,
		},	
		error : function() {
			alert('receive data error');
		},
		success : function(data) {
			alert('receive data success');
			console.log(data);		
		}
	});
}

function interface0106() {	
	
	$.ajax({
		type : "POST",
		url : "http://localhost:8080/interface0106",
		data : null,
		error : function() {
			alert('receive data error');
		},
		success : function(data) {
			alert('receive data success');
			console.log(data);		
		}
	});
}

function interface0110() {
	url = $("#test").val();
	$.ajax({
		type : "POST",
		url : url,
		data : null,
		error : function() {
			alert('receive data error');
		},
		success : function(data) {
			alert('receive data success');
			console.log(data);		
		}
	});
}


$(document).ready(function() {
//	interface1001();
	interface1003();
//	interface0106();
//	interface0110();
//	interface1004();
//	interface1005();
//	interface1006();
//	interface1007();
//	interface1009();
});
