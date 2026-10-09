<?php

namespace Service;

use Repository\UserRepository;
use Repository\RedisCacheRepository;

class UserService
{
    private UserRepository $userRepo;
    private RedisCacheRepository $cacheRepo;

    public function __construct(UserRepository $userRepo, RedisCacheRepository $cacheRepo)
    {
        $this->userRepo = $userRepo;
        $this->cacheRepo = $cacheRepo;
    }

    public function informarLocalCarregamento(array $data): array
    {
        $resultado = $this->userRepo->InformarLocalCarregamentoDoca($data);

        if (isset($resultado['success']) && $resultado['success']) {
            $this->cacheRepo->setRedis($resultado['saveredis']);
        }

        return $resultado;
    }
}
