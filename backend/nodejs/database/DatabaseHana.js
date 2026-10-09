const hana = require('@sap/hana-client');

class DatabaseHana {
    constructor(config) {
        this.config = config;
        this.connection = null;
    }

    async connect() {
        if (!this.connection) {
            this.connection = hana.createConnection();
            await new Promise((resolve, reject) => {
                this.connection.connect(this.config, (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
        }
        return this.connection;
    }

    async query(sql, params = []) {
        const conn = await this.connect();
        return new Promise((resolve, reject) => {
            conn.exec(sql, params, (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    disconnect() {
        if (this.connection) {
            this.connection.disconnect();
            this.connection = null;
        }
    }
}

module.exports = DatabaseHana;
