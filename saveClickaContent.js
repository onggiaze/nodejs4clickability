const util = require('util');
var soap = require('soap');
var url = 'https://cms.clickability.com/api/API?wsdl';
var parseString = require('xml2js').parseString; // Parsing XML to JSON

var xmlreader = require('xmlreader');

var wsdlOptions = {
    ignoredNamespaces: {
      namespaces: [],
      override: true
    },
	trace: 1,
	exceptions: 1,
}
  
  
soap.createClient(url, wsdlOptions, function(err, client) {

     client.addSoapHeader({
		 'ns1:credentials': {
			 attributes: {
				 username: 'tdang@phillynews.com',
				 password: 'xxxxxxxxxx',
				 customerID: '8500281'
			 }
		 }
     });
	 
	 var reqObject = {
		 content : {
			 attributes: {
				 id : "390597482",
				 type : "Article"
			 },
			 categorization : {
			 	set : [
					// 1766: Topic
			 		{ attributes: {id: "1766"} },
					// 2066: Critic Ratings
					{ attributes: {"id" : "2066"}, category : { attributes : {"id" : "84766"} } },
					// 1816: Source
					{ attributes: {"id" : "1816"}, category : { attributes : {"id" : "73566"} } },
					// 2042: Web Publication ****
					{ attributes: {"id" : "2042"}, category : { attributes : {"id" : "83767"} } },
					// 5529: Faux Content Type
					{ attributes: {"id" : "5529"}, category : { attributes : {"id" : "235859"} } },
					// 3576: Ad Channel
					{ attributes: {"id" : "3576"}, category : { attributes : {"id" : "178411"} } },
					// 5124: Feed Output Options
					{ attributes: {"id" : "5124"}, category : { attributes : {"id" : "1362621"} } }
			 	]
			},
			field : [
				{ attributes: { name: "title" }, value: "Updated with NodeJS" },
				{ attributes: { name: "author" }, value: "NodeJS" },
			]
		 }
	 };			 
					
	 
	 client.saveContent( reqObject, function(err, response, xmlBody) {

		 xmlreader.read(xmlBody, function (err, res){
			 if(err) return console.log(err);
			 
			 var soapBody = res['soap:Envelope']['soap:Body'];
			 var soapFault = soapBody['soap:Fault'];
			 
			 if (typeof soapFault !== 'undefined') {
				 var soapFaultCode = soapFault['faultcode'].text();
				 var soapFaultString = soapFault['faultstring'].text();
				 
				 console.log( "----- LAST REQUEST -----");
				 console.log( client.lastRequest );
				 console.log( "----- END LAST REQUEST -----")
				 
				 return console.log("ERROR " + soapFaultCode + ": " + soapFaultString);
			 }
			 
			 var savedContentInfo = soapBody['ns12:saveContentResponse']['savedContentInfo'];
			 
			 // console.log(savedContentInfo.attributes());
			 var json = JSON.stringify(savedContentInfo.attributes());
			 
			 console.log( json );
			 
		 });
		
	});  // - end client.getContent

}); // - end soap.createClient
  
console.log("DONE");

