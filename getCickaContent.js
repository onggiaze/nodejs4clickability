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
	
	var reqObject = {};
	reqObject.contentID = '390597482';
	
	client.getContent( reqObject, function(err, response, xmlBody) {
		
		xmlreader.read(xmlBody, function (err, res){
			
			if(err) return console.log(err);
			
			var soapBody = res['soap:Envelope']['soap:Body']; 
			var soapFault = soapBody['soap:Fault'];
			
			if (typeof soapFault !== 'undefined') {
				
				var soapFaultCode = soapFault['faultcode'].text();
				var soapFaultString = soapFault['faultstring'].text();
				
				return console.log("ERROR " + soapFaultCode + ": " + soapFaultString);
			}
			
			var content = soapBody['ns12:getContentResponse']['content'];
			
			// console.log(content);
			
			ns3_field = content.at(1)['ns3:field'];
			
			console.log(content.count());
			console.log("----");
			console.log(content.at(1)['ns3:field'].count());
			
			// looping through each field
			for(var i = 0; i < ns3_field.count(); i++){
				
				var fld_name = ns3_field.at(i).attributes().name;
				var fld_value = ns3_field.at(i)['ns3:value'];
				var fld_values = ns3_field.at(i)['ns3:values'];
				
				
				// Handling single value field
				if (typeof fld_value !== 'undefined') {
					// console.log(fld_value);
					
					if ( (typeof fld_value.text == 'function') && (fld_value.text()!=="") ){
						console.log( ">>>> " + fld_name + " >>>>> ["+fld_value.text()+"]");
					} else {
						console.log( ">>>> " + fld_name + " >>>>> E M P T I E D" );
						// console.log(fld_value);
						// fld_value.each(function (i, obj){
						// 	console.log( obj );
						// });
					}
				}
				
				// Handling multi-values field
				if (typeof fld_values !== 'undefined') {
					
					// console.log(fld_values);
					// will need to find an example here, possible looping through an array
					// console.log( JSON.stringify( fld_values ) );
					if (typeof fld_values['ns3:value'] !== 'undefined') {
						console.log( ">>>> " + fld_name + " >>>>> MULTI-VALUES" );
						fld_values['ns3:value'].each(function (i, item){
							console.log( item.text() );
						});
					} else {
						console.log( ">>>> " + fld_name + " >>>>> MULTI-VALUES emptied" );
					}
				}
				
			}
			
		}); // - end xmlreader.read
		
	});  // - end client.getContent

}); // - end soap.createClient
  
console.log("DONE");

