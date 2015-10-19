'use strict';

var minimist = require('minimist');
var args = minimist(process.argv.slice(2));// 处理命令行参数
var cwd = process.cwd();// 当前工作目录
var findPkg = require('./find_pkg');
var pathFn = require("path");
var fs = require("fs");
var chalk = require('chalk');
var tildify = require('tildify');
var commands = require('./console');
var abbrev = require('abbrev');
var alias = abbrev(Object.keys(commands));
var Logger = require('./logger');
var log = new Logger(args);

// Change the title in console
process.title = 'sorest';

module.exports = function () {

    var sorest;

    findPkg(cwd, args, function (path) {

        // 如果findPkg没有找到正确的package.json，则path为空
        if (!path) {
            runCLICommand(args);
            return;
        }

        var modulePath = pathFn.join(path, 'node_modules', 'sorest');

        fs.exists(modulePath, function (exists) {

            if (!exists) {
                log.error('Local sorest not found in %s', chalk.magenta(tildify(path)));
                log.error('Try running: \'npm install sorest --save\'');
                return;
            }

            var Sorest = require(modulePath);
            sorest = new Sorest(path, args);
            log = sorest.log;

            sorest.init().then(runSorestCommand);
        });
    });

    function runSorestCommand(){

        var cmd = args._.shift();

        if (cmd){
            var c = sorest.extend.console.get(cmd);
            if (!c){
                cmd = 'help';
            }
        } else if (args.v || args.version){
            cmd = 'version';
        } else {
            cmd = 'help';
        }

        // Listen to Ctrl+C (SIGINT) signal
        process.on('SIGINT', function(){
            log.info(goodbye());
        });

        return sorest.call(cmd, args);
    }
};

function runCLICommand(args) {

    var cmd = args._.shift();// 取出第一个命令行参数

    if (alias.hasOwnProperty(cmd)) {
        cmd = alias[cmd];
    } else if (args.v || args.version) {
        cmd = 'version';
    } else {
        cmd = 'help';
    }

    // function call
    return commands[cmd].call({
        base_dir: cwd,
        log: log
    }, args);
}