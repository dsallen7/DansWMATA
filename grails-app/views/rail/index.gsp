<html>
<head>

<meta name="layout" content="main"/>

<g:javascript>
	var stationNamesUrl = "${createLink(controller:'rail', action:'getStationNamesForLine')}";
	var stationInfoUrl = "${createLink(controller:'rail', action:'getStationInfo')}";
	var stationTimesUrl = "${createLink(controller:'rail', action:'getNextTrainTimesForStation')}";
</g:javascript>
<asset:javascript src="rail.js"/>
</head>

<body>
	<table>
		<tr>
			<td><g:select name="lineFrom"
			from="${lineNames}"
			optionKey="LineCode"
			optionValue="DisplayName"
			noSelection="${['null':'Select A Line']}"
			onchange="updateStationNames('From')" /></td>
			<td><div id="selectStationFrom"><g:select name="stationFrom"
			from="" onchange="getNextTrainTimesForStation('From')" /></div></td>
			<td><div id="waitForStationFrom">
			<asset:image src="spinner.gif" width="16" height="16"/>
			</div></td>
			<td><div id="FromAddress"></div><div id="FromTimes"></div></td>
		</tr>
		<tr>
			<td><g:select name="lineTo"
			from="${lineNames}"
			optionKey="LineCode"
			optionValue="DisplayName"
			noSelection="${['null':'Select A Line']}"
			onchange="updateStationNames('To')" /></td>
			<td><div id="selectStationTo"><g:select name="stationTo"
			from="" onchange="getNextTrainTimesForStation('To')" /></div></td>
			<td><div id="waitForStationTo">
			<asset:image src="spinner.gif" width="16" height="16"/>
			</div></td>
			<td><div id="ToAddress"></div><div id="ToTimes"></div></td>
		</tr>
	</table>
</body>

</html>