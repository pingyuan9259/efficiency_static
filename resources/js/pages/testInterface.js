function interface1001() {	
	var dataID = "Lon";
	$.ajax({
		type : "POST",
		url : "http://localhost:8081/soms/v2/interface1001",
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
	var paramsets = [];
	paramsets.push({"name":"WindDiration","key":"WindDiration"});
	paramsets.push({"name":"WindDiration1","key":"WindDiration"});
	paramsets.push({"name":"WindSpeed","key":"WindSpeed"});

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
			console.log(data.result);
			
			$("#windDiration").text(data.result.WindDiration);
			$("#WindSpeed").text(data.result.WindSpeed);

		}
	});
}

function interface1004() {	
	
	$.ajax({
		type : "POST",
		url : "http://localhost:8081/soms/v2/interface1004",
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

function interface0102() {	
	alert("start");
	$.ajax({
		type : "POST",
		url : "http://localhost:8081/soms/v2/interface0102",
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

function interface0161() {	
	alert("start");
	$.ajax({
		type : "POST",
		url : "http://localhost:8081/soms/v2/interface0161",
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

function interface0801() {	
	alert("start");
	$.ajax({
		type : "POST",
		url : "http://localhost:8081/soms/v2/interface0801",
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

function interface0121() {	
	
	var paramsets = {};
	paramsets.startTime = "1520816584";
	paramsets.endTime = "1521024684";
	
	$.ajax({
		type : "POST",
		url : "http://localhost:8081/soms/v2/interface0121",
		contentType:'application/json',
		data : JSON.stringify(paramsets),		
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
		url : "http://localhost:8081/soms/v2/interface1005",
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
		url : "http://localhost:8081/soms/v2/interface1006",
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
	
	var paramsets = {};
	paramsets.startTime = "2018-03-06 14:09:44";
	paramsets.endTime = "2018-03-06 16:24:44";
	paramsets.jsonParams = [
	{"name":"H00016000","key":"H00016000"},
	{"name":"Lat","key":"Lat"},
	{"name":"Lon","key":"Lon"}
	];
	
	$.ajax({
		type : "POST",
		url : "http://localhost:8081/soms/v2/interface1007",
		contentType:'application/json',
		data : JSON.stringify(paramsets),	
		error : function() {
			alert('receive data error');
		},
		success : function(data) {
			alert('receive data success');
			console.log(data);		
		}
	});
}

function interface1007period() {	
	
	var paramsets = {};
	paramsets.period = "90";
	
	paramsets.jsonParams = [
	{"name":"H00016000","key":"H00016000"},
	{"name":"Lat","key":"Lat"},
	{"name":"Lon","key":"Lon"}
	];
	
	$.ajax({
		type : "POST",
		url : "http://localhost:8081/soms/v2/interface1007period",
		contentType:'application/json',
		data : JSON.stringify(paramsets),	
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
	
	var paramsets = {};
	paramsets.startTime = "1523955000";
	paramsets.endTime = "1523965000";
	paramsets.rpmLow = "0";
	paramsets.rpmHigh = "60";
	paramsets.jsonParams = [
	{"name":"H00016000","key":"H00016000"},
	{"name":"Lat","key":"Lat"},
	{"name":"Lon","key":"Lon"}
	];
	
	$.ajax({
		type : "POST",
		url : "http://localhost:8081/soms/v2/interface1009",
		contentType:'application/json',
		data : JSON.stringify(paramsets),		
		error : function() {
			alert('receive data error');
		},
		success : function(data) {
			alert('receive data success');
			console.log(data);		
		}
	});
}

function interface1021() {	
	
	var paramsets = {};
	paramsets.startTime = "1523955000";
	paramsets.endTime = "1523965000";
	paramsets.jsonParams = [
	{"name":"H00016000","key":"H00016000"},
	{"name":"Lat","key":"Lat"},
	{"name":"Lon","key":"Lon"},
	{"name":"test","key":"test"}
	];
	
	$.ajax({
		type : "POST",
		url : "http://localhost:8081/soms/v2/interface1021",
		contentType:'application/json',
		data : JSON.stringify(paramsets),	
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
		url : "http://localhost:8081/soms/v2/interface0106",
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
//	url = $("#test").val();
	$.ajax({
		type : "POST",
		url : "http://localhost:8081/soms/v2/interface0110",
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
//	interface1003();
//	interface1004();
//	interface1005();
//	interface1006();
//	interface1007();
//	interface1007period();
//	interface1009();
//	interface1021();
//	interface0102();
//	interface0106();
//	interface0110();
	interface0121();
//	interface0161();
//	interface0801();
});
