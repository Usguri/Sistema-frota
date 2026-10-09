<?php

namespace Repository;

use Database\RedisHandler;

class RedisCacheRepository
{
    private \Redis $redis;

    public function __construct()
    {
        $this->redis = RedisHandler::getConnection();
    }

    public function setRedis(array $data): void
    {
        $this->redis->set('chave', json_encode($data));
    }

    public function getRedis(): array
    {
        $get_dados = $this->redis->get('chave');
        return json_decode($get_dados, true);
    }
}
