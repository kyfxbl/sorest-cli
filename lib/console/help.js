'use strict';

var chalk = require('chalk');

module.exports = function (args) {

    console.log('Usage: sorest <command>\n');

    printList('Commands', [
        {name: 'help', desc: 'Get help on Sorest.'},
        {name: 'init', desc: 'Create a new Sorest folder.'},
        {name: 'version', desc: 'Display version information.'}
    ]);

    printList('Global Options', [
        {name: '--cwd', desc: 'Specify the CWD'},
        {name: '--debug', desc: 'Display all verbose messages in the terminal'},
        {name: '--silent', desc: 'Hide output on console'}
    ]);

    console.log('For more help, you can use \'sorest help [command]\' for the detailed information');
    console.log('or you can check the docs:', chalk.underline('https://github.com/kyfxbl/sorest/'));
};

function printList(title, list) {
    var length = 0;
    var str = title + ':\n';

    list.sort(function (a, b) {
        var nameA = a.name;
        var nameB = b.name;
        var cmp = nameA.length - nameB.length;

        if (cmp > 0) {
            if (nameA.length > length) length = nameA.length;
        } else {
            if (nameB.length > length) length = nameB.length;
        }

        if (nameA < nameB) return -1;
        else if (nameA > nameB) return 1;
        else return 0;
    }).forEach(function (item) {
        var padding = length - item.name.length + 2;
        str += '  ' + chalk.bold(item.name);

        while (padding--) {
            str += ' ';
        }

        str += (item.description || item.desc) + '\n';
    });

    console.log(str);
}