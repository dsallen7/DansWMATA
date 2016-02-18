package mygrails

import groovy.json.StringEscapeUtils

import grails.converters.JSON

class RailController {

	mygrails.WmataService wmataService;
	
    def index() {
		def lineList = wmataService.getLineNames()
		def lineNames = []
		Map mdl = [lineNames:lineList.Lines]
		render(view:"index", model:mdl)
	}
		
	def getStationNamesForLine = {
		def line = params.LineCode
		def stationList = wmataService.getStationNamesForLine(line)
		render stationList.Stations as JSON
	}
	
	def getStationInfo = {
		def stationCode = params.stationCode
		def stationInfo = wmataService.getStationInfo(stationCode)
		render stationInfo as JSON
	}
	
	def getNextTrainTimesForStation = {
		def stationCodes = params.stationCodes
		def time = wmataService.getNextTrainTimesForStation(stationCodes);
		render time.Trains as JSON
	}
	
	def getTripInfo= { RailTransfer cmd ->
		
	}
	
}
class RailTransfer{
	String station1;
	String station2;
}