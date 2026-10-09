<?php

namespace Database;

use PDO;

class DatabaseHandler
{
    private static ?PDO $connection = null;

    public static function getConnection(): PDO
    {
        if (self::$connection === null) {
            $mysql = new MySQLConnection();
            self::$connection = $mysql->connect();
        }

        return self::$connection;
    }
}
