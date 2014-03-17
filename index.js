var Service = require('node-windows').Service;
var path = require('path');

// Create a new service object


module.exports = function(opt){
    return new Service({
        name:'Shadow-socket',
        description: 'shadowsocks client.',
        script: opt.script,
        env: [{
            name: 'HOME',
            value: opt.home
        }]
    });
};