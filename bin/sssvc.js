#!/usr/bin/env node
var parsed = require('minimist')(process.argv.slice(2));

var fs = require('fs');
var path = require('path');


var Home = process.env.USERPROFILE;
var main = path.join(__dirname, '../lib/main.js');
var home = path.join(Home, 'sssvc');
var script = path.join(home, 'entry.js');
var jsonFile = path.join(home, 'config.json');
var _ = require('lodash');

// sssvc install
// sssvc uninstall
var svc = require('../index.js')({
    script: script,
    home: home
});

function install() {
    if (!fs.existsSync(home)) {
        fs.mkdirSync(home);
    }
    fs.writeFileSync(script, 'require(\'' + main.replace(/\\/g, '\\\\') + '\');\n');
    var prompt = require('prompt');
    prompt.start();
    var json = {};
    if(fs.existsSync(jsonFile)){
        try {
            json = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
        } catch (e) {
            console.log('parse json error, continue...');
        }
    }
    var keys = ['server', 'server_port', 'local_port', 'method', 'password'];
    prompt.override = _.defaults({}, _.pick(parsed, keys), json);
    prompt.get(keys, function(err, result){
        console.log(result);
        fs.writeFileSync(jsonFile, JSON.stringify(result, null, 4));
//        require('child_process').fork(script, {
//            cwd: home
//        });

        svc.on('install', function(){
            svc.start();
        });
        svc.on('alreadyinstalled ', function(){
            svc.start();
        });
        svc.install();
    });
}

function uninstall() {
    svc.on('uninstall', function(){
        console.log('service uninstalled');
    });
    svc.uninstall();
}

switch(parsed._[0]) {
    case 'install':
    case 'i':
        install();
        break;
    case 'uninstall':
    case 'remove':
    case 'rm':
        break;
}