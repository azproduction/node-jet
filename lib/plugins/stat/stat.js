/**
 * @fileOverview Customiseable node platform statistics
 *
 *
 * @example
 *
 *     var server = http.createServer();
 *     server.listen(80);
 *
 *     Stat.log(sever);
 *
 *     Output:
 *     Server
 *     - Interface:           0.0.0.0:80
 *     - Connections:         0
 *     - uid:                 500
 *     - gid:                 513
 *     - pid:                 2544
 *     - Platform:            cygwin
 *     Node
 *     - Version:             v0.4.7
 *     - Working directory:   /home/azproduction/node-jet/examples
 *     - Require paths:       /home/azproduction/.node_modules
 *                            /home/azproduction/.node_libraries
 *                            /usr/local/lib/node
 *     Memory
 *     - Resident Size:       197 Mb
 *     - Virtual Size:        11 Mb
 *     - V8 Heap used/total:  2/3 Mb
 *     OS
 *     - Host name:           DNAPC
 *     - Name and version:    CYGWIN_NT-6.1-WOW64 1.7.9(0.237/5/3)
 *     - Uptime:              6h 31m (23510.92)
 *     - Load avg:            ???
 *     - Memory free/total:   0/4087 Mb
 *     - CPU:                 4X Intel(R) Core(TM) i5 CPU 760 @ 2.80GHz
 *
 * Copyright(c) 2011 azproduction <azazel.private@gmail.com>
 * @author  azproduction
 * @licence MIT
 */

/*jshint node: true, white: true, newcap: true, eqnull: true, eqeqeq: true, curly: true, boss: true */
/*global console: true*/

var fs = require('fs'),
    os = require('os');

var Stat = {
    getStatStruct: function (httpServer) {
        var serverUp = !!httpServer.fd,
            memoryStat = process.memoryUsage(),
            view = [];

        if (serverUp) {
            var fileStat = fs.fstatSync(httpServer.fd),
                serverStat = httpServer.address();

            view.push('Server');
            if (serverStat.address) {
                view.push(['Interface', serverStat.address + ':' + serverStat.port]);
            } else {
                view.push(['Interface', 'Socket inode ' + fileStat.ino]);
            }
            view.push(['Connections', httpServer.connections]);
            view.push(['uid', fileStat.uid]);
            view.push(['gid', fileStat.gid]);
            view.push(['pid', process.pid]);
            view.push(['Platform', process.platform]);
        } else {
            view.push('Server');
            view.push(['Status', 'down']);
        }

        view.push('Node');

        view.push(['Version', process.version]);
        view.push(['Working directory', process.cwd()]);
        view.push(['Require paths', require.paths]);

        view.push('Memory');

        view.push(['Resident Size', ~~(memoryStat.rss / 1048576) + ' Mb']);
        view.push(['Virtual Size', ~~(memoryStat.vsize / 1048576) + ' Mb']);
        view.push(['V8 Heap used/total', ~~(memoryStat.heapUsed / 1048576) + '/' + ~~(memoryStat.heapTotal / 1048576) + ' Mb']);

        view.push('OS');

        view.push(['Host name', os.hostname()]);
        view.push(['Name and version', os.type() + ' ' + os.release()]);
        var upTime = os.uptime();
        var hours = ~~(upTime / 3600);
        var minutes = ~~((upTime - hours * 3600) / 60);
        view.push(['Uptime', hours + 'h ' + minutes + 'm (' + upTime + ')']);
        view.push(['Load avg', os.loadavg()]);
        view.push(['Memory free/total', ~~(os.freemem() / 1048576) + '/' + ~~(os.totalmem() / 1048576) + ' Mb']);

        var cpus = os.cpus();
        view.push(['CPU', cpus.length + 'X ' + cpus[0].model.replace(/\s+/g, ' ')]);

        return view;
    },
    renderConsole: function (statStruct) {
        statStruct = statStruct.map(function (items) {
            if (typeof items === "string") {
                return ' \033[35m' + items + '\033[39m';
            }
            return ' - \033[1m' + items[0] + '\033[22m\r\t\t\t' + ([].concat(items[1]).join('\n\t\t\t') || '???');
        });

        return statStruct.join('\n');
    },
    renderHtml: function (statStruct) {
        statStruct = statStruct.map(function (items, index) {
            if (typeof items === "string") {
                if (index === 0) {
                    return '<u>' + items + '</u><ul>';
                } else {
                    return '</ul><u>' + items + '</u><ul>';
                }
            }
            return '<li><strong>' + items[0] + '</strong> ' + ([].concat(items[1]).join(', ').replace(/</g, '&lt;').replace(/>/g, '&gt;') || '???') + '</li>';
        });

        return statStruct.join('') + '</ul>';
    },
    log: function (httpServer) {
        console.log(this.renderConsoleStat(this.getStatStruct(httpServer)));
    }
};

module.exports = Stat;