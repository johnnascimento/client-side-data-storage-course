function dbCallback() {
    console.log('dbCallback was created!');
}

window.onload = () => {
    // openDatabase(dbName, dbVersion, dbDescription, dbSize, callback);
    // transaction(callback);
    // executeSql(SQLText);

    console.log('OI');
    var dbSize = 5 * 1024 * 1024; // 5MB
    var dataBase = openDatabase('test', '1', 'it is test db', dbSize, dbCallback);

    dataBase.transaction(function(t) {
        t.executeSql('CREATE TABLE users (id, name, lastname)', [], function (transaction, response) {
            console.log('table created', response);
        }, function (transaction, err) {
            console.log('table not created', err);
        });

        t.executeSql('INSERT INTO users(\'id\', \'name\', \'lastname\') VALUES(\'5\', \'John\', \'LeNasc\')', [], function (transaction, response) {
            console.log('table created', response);
        }, function (transaction, err) {
            console.log('table not created', err);
        });
    });
};

