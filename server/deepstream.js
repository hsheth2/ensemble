const DeepstreamServer = require('deepstream.io');
const DeepstreamClient = require("deepstream.io-client-js");
const microtime = require("microtime");
const fs = require("fs");
const C = DeepstreamServer.constants;

const server = new DeepstreamServer({
	host: "0.0.0.0"
});

server.start();

server.addListener("started", function() {
	// Initialize default values
	const client = DeepstreamClient("127.0.0.1:6020").login({username: "server"});
	// record.set(JSON.parse(fs.readFileSync("default-data.json", "utf-8")));

	client.rpc.provide("time", function(data, response) {
		response.send(microtime.now() / 1000);
	});
});