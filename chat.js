var net = require('net');

var chatServer = net.createServer();
var clientList = [];

chatServer.on('connection',function(client){
	client.name = client.remoteAddress + ':' + client.remotePort;
	client.write('['+ client.name +']:connected!\n');
	clientList.push(client);
	
	client.on('data',function(data){
		broadcast(data,client);
	});
	
	client.on('end',function(){
		clientList.splice(clientList.indexOf(client),1);
	});

});

function broadcast(message,client){
	var cleanup = [];
	for(var i=0;i<clientList.length;i++){
		if(clientList[i] !== client){
			if(clientList[i].writable){
				clientList[i].write('[' + client.name + ']:' + message);
			}else{
				cleanup.push(clientList[i]);
				clientList[i].destroy();
			}
		}
	}
	for(i=0;i<cleanup.length;i++){
		clientList.splice(clientList.indexOf(cleanup[i]),1);
	}
}


chatServer.listen(9000);

