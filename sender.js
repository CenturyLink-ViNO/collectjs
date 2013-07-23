var dgram = require('dgram');
var Bridge = require('./packet');

var bridge = Bridge.create({
    host: 'NodeJS',
    interval: 10
});

var packet = bridge.packet({
    plugin: 'Test',
    pluginInstance: '1',
    type: 'percent',
    typeInstance: 'Test',
    values: [
        {
            type: 1, value: 42
        }
    ]
});

var message = packet;

console.log(message);

var client = dgram.createSocket("udp4");
client.send(message, 0, message.length, 25826, "deneb.yarekt.co.uk", function(err, bytes) {
//client.send(message, 0, message.length, 25827, "localhost", function(err, bytes) {
    client.close();
});
