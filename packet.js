var Put = require('put');
var bignum = require('bignum');

function writeString(type, string, put) {
    // Host <type>
    put.word16be(type);
    // string
    var b = new Buffer(string, 'utf-8');
    // Length xx
    put.word16be(b.length+4+1);
    put.put(b);
    put.word8(0);
}

function writeNumber(type, number, put) {
    put.word16be(type);
    put.word16be(8+4);
    var b = bignum(number).toBuffer({size: 8});
    put.put(b);
}

function writeValues(array, put) {
    put.word16be(6);
    put.word16be(4+2+(array.length * 16));
    put.word16be(array.length); //Number of values

    // Write types
    array.forEach(function(value) {
        put.word8(value.type);
    });
    // Write values
    array.forEach(function(value) {
        // @TODO: Fix for different value types
        put.put(bignum(value.value).toBuffer({size: 8}));
    });
}

/*
writeString(0, 'testing', p);
writeNumber(1, new Date().getTime()/1000, p);

writeString(2, 'testPlugin', p);
writeString(3, 'testPluginInstance', p);
writeString(4, 'testType', p);
writeString(5, 'testTypeInstance', p);
writeNumber(7, 10, p);

writeValues([{type:0, value: 100}], p);
*/


exports.create = function(options) {
    _host = options.host;
    _interval = options._interval || 10;
    var _prepare = function() {
        var buffer = new Put();
        writeString(0, _host, buffer);
        writeNumber(1, new Date().getTime()/1000, buffer);
        writeNumber(7, _interval, buffer);
        return buffer;
    };
    return {
        packet: function(params) {
            var b = _prepare();
            writeString(2, params.plugin, b);
            writeString(3, params.pluginInstance, b);
            writeString(4, params.type, b);
            writeString(5, params.typeInstance, b);

            writeValues(params.values, b);
            return b.buffer();
        }
    };
};