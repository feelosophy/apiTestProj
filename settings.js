const config = require('./config');

module.exports.connection = function connection() {
    return `${config.dbconnect.type}://${config.dbconnect.username}:${config.dbconnect.password}@${config.dbconnect.host}:${config.dbconnect.port}/${config.dbconnect.dbname}`;
};

module.exports.getSault = config.salt;