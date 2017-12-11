const fs = require('fs');
const path = require('path');

// Parameters
const assign = key => process.argv
    .map(item => item.startsWith(key) ? item.substr(key.length) : '')
    .reduce((prev, curr) => prev + curr);

const dir = assign('--DIR=');			    // base lookup directory | required
const type = assign('--TYPE=');				// [D|F] D - directory, F - file
const pattern = assign('--PATTERN='); 		// regular expression to test file/directory name
const minSize = assign('--MIN-SIZE=');		// minimum file size [B|K|M|G], should be skipped for directories
const maxSize = assign('--MAX-SIZE=');		// maximum file size [B|K|M|G], should be skipped for directories

// Parameters transformation and check functions
const reg = new RegExp(`(.*${pattern}$)`);
const testPattern = file => pattern ? reg.test(file) : true;

const units = {
    'B': 1,
    'K': 1024,
    'M': 1048576,
    'G': 1073741824
};

const toBytes = item => item.slice(0, -1) * units[item.slice(-1)];
const compareSize = (limitSize, sign) => fileSize => limitSize ? fileSize * sign <= limitSize * sign : true;

const testMin = compareSize(toBytes(minSize), -1);
const testMax = compareSize(toBytes(maxSize), 1);

// Algorithm
const fileSearch = (dir, callback) => {
    let result = [];

    fs.readdir(dir, (err, files) => {
        if (err) {
            return console.error('DIR is not valid or not specified!');
        }

        if (!files.length) {
            callback(null, result);
        }

        files.forEach(file => {
            file = dir + '/' + file;

            fs.stat(file, (err, stats) => {
                if (err) {
                    throw err;
                }

                if (stats && stats.isDirectory()) {
                    if (type !== 'F' && testPattern(file)) {
                        result.push(file)
                    }
                    fileSearch(file, (err, item) => {
                        result = result.concat(item);
                        if (!--files.length) {
                            callback(null, result);
                        }
                    })
                } else {
                    if (type !== 'D' && testPattern(file) && testMin(stats.size) && testMax(stats.size)) {
                        result.push(file)
                    }
                    if (!--files.length) {
                        callback(null, result);
                    }
                }
            });
        });
    });
};

fileSearch(dir, function (err, result) {
    if (err) {
        throw err;
    }

    console.log(result);
});