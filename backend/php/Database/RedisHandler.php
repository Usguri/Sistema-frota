<?php

namespace Database;

class RedisHandler
{
    private static ?\Redis $connection = null;

    public static function getConnection(): \Redis
    {
        if (self::$connection === null) {
            $redisConn = new RedisConnection();
            self::$connection = $redisConn->connect();
        }

        return self::$connection;
    }
}
