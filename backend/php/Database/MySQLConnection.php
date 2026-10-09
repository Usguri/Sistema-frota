<?php

namespace Database;

use PDO;

class MySQLConnection implements DatabaseConnectionInterface
{
    private $host = 'ip:porta';
    private $dbname = 'banco';
    private $user = 'root';
    private $pass = 'password';

    public function connect(): PDO
    {
        return new PDO("mysql:host={$this->host};dbname={$this->dbname}", $this->user, $this->pass);
    }
}
