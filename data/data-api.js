const dataPg = require('./data-pg.js');

getTableInfo = function(callback) { 
    dataPg.getTableInfo(callback);
}

module.exports.getTableInfo = getTableInfo;