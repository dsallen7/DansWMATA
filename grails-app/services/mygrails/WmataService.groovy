package mygrails

import grails.transaction.Transactional

import groovyx.net.http.HTTPBuilder
import groovyx.net.http.ContentType
import groovyx.net.http.Method
import groovyx.net.http.RESTClient

import grails.converters.JSON

@Transactional
class WmataService {

	static final String key = "9e85abce6f6c4c94847eb5c68d729205";
	
    def getLineNames() {
		RESTClient client = new RESTClient("https://api.wmata.com/")
		client.setHeaders([api_key:"9e85abce6f6c4c94847eb5c68d729205"])
		def resp = client.get(path:"Rail.svc/json/jLines")
		return resp.responseData
    }
	def getStationNamesForLine(String line) {
		RESTClient client = new RESTClient("https://api.wmata.com/")
		client.setHeaders([api_key:"9e85abce6f6c4c94847eb5c68d729205"])
		def resp = client.get(path:"Rail.svc/json/jStations", params:["LineCode": line])
		return resp.responseData
	}
	
	def getStationInfo(String code){
		RESTClient client = new RESTClient("https://api.wmata.com/")
		client.setHeaders([api_key:"9e85abce6f6c4c94847eb5c68d729205"])
		def resp = client.get(path:"Rail.svc/json/jStationInfo", params:["StationCode": code])
		return resp.responseData
	}
	
	def getNextTrainTimesForStation(String stationCodes){
		RESTClient client = new RESTClient("https://api.wmata.com/")
		client.setHeaders([api_key:"9e85abce6f6c4c94847eb5c68d729205"])
		def resp = client.get(path:"StationPrediction.svc/json/GetPrediction/" + stationCodes)//, params:["StationCodes": stationCodes])
		return resp.responseData
	}
}
