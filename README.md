CollectJS
=========
Collectd binary network protocol implementation in NodeJS. Part of the StatsD <=> CollectD series

Requires:

    npm install put bignum

Example:
--------

    var collectjs = require('collectjs');
    var bridge = collectjs.create({host: 'NodeJS'});
    var packet = bridge.packet({
        plugin: 'Test',
        type: 'gauge',
        values: [{type: 1, value: 42}]
    });
    var client = require('dgram').createSocket("udp4");
    client.send(packet, 0, packet.length, 25826, "collectd.example.com", function() {
        client.close();
    });
