<?php

namespace Database;

use PDO;

interface DatabaseConnectionInterface
{
    public function connect(): PDO;
}
