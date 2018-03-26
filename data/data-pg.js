const { Client } = require('pg');


module.exports.getTableInfo = function(callback) {

    let databaseUrl = process.env.DATABASE_URL;
    console.log(databaseUrl);

    // Required by Heroku
    let isEnableSSL = true;
    if (process.env.DATABASE_DISABLE_SSL) {
        isEnableSSL = false;
    }

    const client = new Client({
        connectionString: databaseUrl,
        ssl: isEnableSSL
    });

    client.connect();

    client.query('SELECT table_schema, table_name FROM information_schema.tables;', (err, res) => {
        console.log(err, res);
        if (err) throw err;
        for (let row of res.rows) {
            console.log(JSON.stringify(row));
        }
        client.end();
        callback(res.rows);
    });
}