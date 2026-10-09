<?php

namespace Database;

use PDO;

class MySQLConnection implements DatabaseConnectionInterface
{
    private $host = '';
    private $dbname = '';
    private $user = '';
    private $pass = '';

    public function connect(): PDO
    {
        return new PDO("mysql:host={$this->host};dbname={$this->dbname}", $this->user, $this->pass);
    }
}
