const mysql = require('mysql2/promise')

class Database {
    constructor(config) {
        this.config = config;
        this.connection = null;
    }

    async connect() {
        if (!this.connection) {
            this.connection = await mysql.createConnection(this.config);
        }
        return this.connection;
    }

    async query(sql, params) {
        const conn = await this.connect();
        const [rows] = await conn.execute(sql, params);
        return rows;
    }
}

module.exports = Database
