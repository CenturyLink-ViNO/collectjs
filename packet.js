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
    put.word16be(4+2+(array.length * 9));
    put.word16be(array.length); //Number of values

    // Write types
    array.forEach(function(value) {
        put.word8(value.type);
    });
    // Write values
    array.forEach(function(value) {
        switch (value.type) {
            case 0:
                put.put(bignum(value.value).toBuffer({endian: 'big', size: 8}));
                break;
            case 1:
                var _doubleBuffer = new Buffer(8);
                _doubleBuffer.writeDoubleLE(value.value, 0);
                put.put(_doubleBuffer);
                break;
        }
        //console.log(put.buffer().slice(put.buffer().length-(4+2+(array.length * 9))).toJSON());
    });
}

exports.create = function(options) {
    _host = options.host;
    _interval = options._interval || 10;
    var _prepare = function() {
        _now = new Date().getTime()/1000 |0;
        var buffer = new Put();
        writeString(0, _host, buffer);
        writeNumber(1, _now, buffer);
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