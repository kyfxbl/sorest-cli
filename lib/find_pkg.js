'use strict';

var pathFn = require('path');
var fs = require('fs');

exports = module.exports = function(cwd, args, callback){

    if(!args.cwd){
        findPkg(cwd, callback);
        return;
    }

    // 以下是命令行参数通过cwd指定了子目录的情况
    var path = pathFn.resolve(cwd, args.cwd);
    var pkgPath = pathFn.join(path, 'package.json');

    fs.exists(pkgPath, function (exists) {

        if(!exists){
            callback();// 未找到package.json
            return;
        }

        checkPkg(pkgPath, function (valid) {

            if (!valid) {
                callback();// package.json中不包含sorest
                return;
            }

            callback(path);// package.json存在，且包含sorest，返回此路径
        });
    });
};

function findPkg(path, callback){

    var pkgPath = pathFn.join(path, 'package.json');

    fs.exists(pkgPath, function(exists){

        if(exists){

            checkPkg(pkgPath, function(valid){

                if(!valid){
                    callback();
                    return;
                }

                callback(path);
            });

            return;
        }

        var parent = pathFn.dirname(path);

        // 已经是根目录
        if(parent === path){
            callback();
            return;
        }

        findPkg(parent, callback);// 递归查找上级目录
    });
}

function checkPkg(path, callback){

    fs.readFile(path, function(err, content){

        if(err){
            callback(false);
            return;
        }

        var json = JSON.parse(content);
        var valid = (typeof json.sorest === "object");
        callback(valid);
    });
}