var fromStationList;
var toStationList;

var redStationList;
var blueStationList;
var greenStationList;
var yellowStationList;
var orangeStationList;
var silverStationList;

var codes = ["RD", "BL", "GR", "YL", "OR", "SV"];

var stationDir = {RD:redStationList,
		BL:blueStationList,
		GR:greenStationList,
		YL:yellowStationList,
		OR:orangeStationList,
		SV:silverStationList
		}

$( document ).ready(function() {
	$("#waitForStationFrom").hide();
	$("#waitForStationTo").hide();
	for (var cd in codes){
		retrieveStationNames(codes[cd]);
	}
});

function retrieveStationNames(lncd){
	var callback = function( data, status, xhr ) {
		stationDir[lncd] = data;
	}
	var errorCallBack = function(jqXHR, textStatus, errorThrown) {
		alert("Failure: " + errorThrown );
	}
	jQuery.ajax({ url:stationNamesUrl,
		dataType: 'json', 
		data: { LineCode: lncd }, 
		success: callback, 
		error: errorCallBack} );
	

}
/*
function updateStationNames(which){
	var callback = function( data, status, xhr ) {
		$("#selectStation"+which).show();
		$("#waitForStation"+which).hide();
		if (which == 'To'){
			fromStationList = data;
		}else if (which == 'From'){
			toStationList = data;
		}
		var options = $("#station"+which);
		options.append($("<option />").val(null).text('Select A Station'));
		$.each(data, function() {
		    options.append($("<option />").val(this.Code).text(this.Name));
		});
	}
	var errorCallBack = function(jqXHR, textStatus, errorThrown) {
		alert("Failure: " + errorThrown );
	}
	var lineCode = jQuery("#line"+which).val()
	if (lineCode != null){
	$("#selectStation"+which).hide();
	$("#waitForStation"+which).show();
	jQuery.ajax({ url:stationNamesUrl,
				dataType: 'json', 
				data: { LineCode: lineCode }, 
				success: callback, 
				error: errorCallBack} );
	}
}
*/
function updateStationNames(which){
	var lineCode = jQuery("#line"+which).val();
	var options = $("#station"+which);
	options.empty();
	if (lineCode != null){
		options.append($("<option />").val(null).text('Select A Station'));
		stationList = stationDir[lineCode];
		$.each(stationList, function() {
		    options.append($("<option />").val(this.Code).text(this.Name));
		});
	}
}
function updateStationInfo(which){
	var callback = function( data, status, xhr ) {
		var template = "{{Street}} {{City}}, {{State}} {{Zip}}";
		var html = Mustache.to_html(template, data.Address);
		$('#'+which+'Address').html(html);
	}
	var errorCallBack = function(jqXHR, textStatus, errorThrown) {
		alert("Failure: " + errorThrown );
	}
	var stationCode = jQuery("#station"+which).val();
	jQuery.ajax({ url:stationInfoUrl,
				dataType: 'json', 
				data: { stationCode: stationCode }, 
				success: callback, 
				error: errorCallBack} );
}

function getNextTrainTimesForStation(which){
	var callback = function( data, status, xhr ) {
		var template = "Line: {{Line}} Destination: {{DestinationName}} Min: {{Min}}";
		var html = "";
		for (var i = 0; i < data.length; i++){
			html += Mustache.to_html(template, {Line:data[i].Line, DestinationName:data[i].DestinationName, Min:data[i].Min} ) + "</br>";
		}
		$('#'+which+'Times').html(html);
	}
	var errorCallBack = function(jqXHR, textStatus, errorThrown) {
		alert("Failure: " + errorThrown );
	}
	var stationCodes = jQuery("#station"+which).val();//[jQuery("#stationFrom").val(), jQuery("#stationFrom").val()];
	jQuery.ajax({ url:stationTimesUrl,
				dataType: 'json', 
				data: { stationCodes: stationCodes },
				success: callback, 
				error: errorCallBack} );
}

function showIntersectingStation(){
	var LineCode1 = jQuery("#lineFrom").val();
	var LineCode2 = jQuery("#lineTo").val();
	var Station2 = jQuery("#stationTo").val();
	if (LineCode1 == 'null' || LineCode2 == 'null') return;
	var linez = stationDir[LineCode1];
	var sameLine = false;
	$.each(linez, function() {
	    if (this.Code == Station2 ||
	    		this.StationTogether1 == Station2 ||
	    		this.StationTogether2 == Station2){
	    	$('#TransferStation').html("No Transfer Required");
	    	$('#StationAddress').html("");
	    	sameLine = true;
	    }
	});
	if (sameLine)return;
	var iStation = getIntersectingStation(LineCode1, LineCode2);
	var template = "Transfer at: {{Name}}";
	var stationname = Mustache.to_html(template, {Name:iStation.Name} );
	$('#TransferStation').html(stationname);
	var template = "{{Street}} {{City}}, {{State}} {{Zip}}";
	var stationaddress = Mustache.to_html(template, iStation.Address);
	$('#StationAddress').html(stationaddress);
}

function getIntersectingStation(LineCode1, LineCode2){
	var Line1 = stationDir[LineCode1];
	var Line2 = stationDir[LineCode2];
	for (var i in Line1){
		for (var j in Line2){
			if (Line1[i].Code == Line2[j].Code ||
					Line1[i].Code == Line2[j].StationTogether1 ||
					Line1[i].Code == Line2[j].StationTogether2){
				return Line1[i];
			}			
		}
	}
}