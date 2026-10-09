<?php

namespace Database;

class RedisConnection implements RedisConnectionInterface
{
    private string $host;
    private int $port;
    private ?\Redis $redis = null;

    public function __construct(string $host = 'redis', int $port = 6379)
    {
        $this->host = $host;
        $this->port = $port;
    }

    public function connect(): \Redis
    {
        if ($this->redis === null) {
            $this->redis = new \Redis();

            if (!$this->redis->connect($this->host, $this->port)) {
                throw new \Exception("Não foi possível conectar ao Redis em {$this->host}:{$this->port}");
            }
        }

        return $this->redis;
    }
}
