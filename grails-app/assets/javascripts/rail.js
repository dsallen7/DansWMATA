var fromStationList;
var toStationList;

$( document ).ready(function() {
	$("#bullFuck").hide();
	$("#waitForStationFrom").hide();
	$("#waitForStationTo").hide();
});

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
	$("#selectStation"+which).hide();
	$("#waitForStation"+which).show();
	jQuery.ajax({ url:stationNamesUrl,
				dataType: 'json', 
				data: { LineCode: lineCode }, 
				success: callback, 
				error: errorCallBack} );
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
		console.log(html);
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