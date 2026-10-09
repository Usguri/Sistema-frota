<?php

use Repository\RedisCacheRepository;

$dadosSaveTemporario = [
    'placa' => 12,
    'doca' => 12
];

SalvaDadosRedis($dadosSaveTemporario);

function SalvaDadosRedis($dadosSaveTemporario)
{
    $cache = new RedisCacheRepository();
    $jsonString = json_encode($dadosSaveTemporario);
    $cache->set('chave', $jsonString);
}
