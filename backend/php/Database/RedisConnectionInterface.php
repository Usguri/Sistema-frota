<?php

namespace Database;

interface RedisConnectionInterface
{
    public function connect(): \Redis;
}
