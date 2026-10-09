<?php
require 'AllArquivos.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

use Repository\UserRepository;
use Repository\RedisCacheRepository;
use Service\UserService;

date_default_timezone_set('America/Sao_Paulo');
$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? null;

$response = [];

switch ($action) {
    case 'SalvaPlacaCarregamento':
        $repo = new UserRepository();
        $response = $repo->SalvaPlacaCarregamento($input);
        break;
    case 'BuscaDadosTipoCarregamento':
        $repo = new UserRepository();
        $response = $repo->BuscaDadosTipoCarregamento();
        break;
    case 'BuscaDadosTabelaCarregamento':
        $repo = new UserRepository();
        $response = $repo->BuscaDadosTabelaCarregamento();
        break;
    case 'InformarLocalCarregamentoDoca':
        $userRepo  = new UserRepository();
        $cacheRepo = new RedisCacheRepository();
        $service = new UserService($userRepo, $cacheRepo);
        $response = $service->informarLocalCarregamento($input);
        break;
    case 'BuscaListaCarregamento':
        $repo = new UserRepository();
        $response = $repo->BuscaListaCarregamento();
        break;
    case 'FinalizaCarregamento':
        $repo = new UserRepository();
        $response = $repo->FinalizaCarregamento($input);
        break;
    case 'DeletarCaminhao':
        $repo = new UserRepository();
        $response = $repo->DeletarCaminhao($input);
        break;
    case 'BuscarPlacaCarregarAgora':
        $cacheRepo = new RedisCacheRepository();
        $response = $cacheRepo->getRedis($input);
        break;
    case 'ListaCaminhoesCarregados':
        $CreateListCaminhoes = new UserRepository();
        $response = $CreateListCaminhoes->ListaCaminhoesCarregados($input);
        break;
    case 'SelecionaDeterminadoStatus':
        $CreateListByStatus = new UserRepository();
        $response = $CreateListByStatus->SelecionaDeterminadoStatus($input);
        break;
    case 'SalvaEmailProcessosStatus':
        $CreateSaveEmail = new UserRepository();
        $response = $CreateSaveEmail->SalvaEmailProcessosStatus($input);
        break;
    case 'BuscaListaEmails':
        $CreateListEmails = new UserRepository();
        $response = $CreateListEmails->BuscaListaEmails($input);
        break;
    case 'SalvaStatusUsuario':
        $UpdateStatusEmail = new UserRepository();
        $response = $UpdateStatusEmail->SalvaStatusUsuario($input);
        break;
    case 'DeletarEmailUsuario':
        $DeleteEmailUser = new UserRepository();
        $response = $DeleteEmailUser->DeletarEmailUsuario($input);
        break;
    case 'SalvaLimiteTempoStatus':
        $CreateLimiteTempo = new UserRepository();
        $response = $CreateLimiteTempo->SalvaLimiteTempoStatus($input);
        break;
    case 'BuscaLimiteTempo':
        $LimiteTempo = new UserRepository();
        $response = $LimiteTempo->BuscaLimiteTempo();
        break;

    default:
        $response = ['error' => 'Ação inválida.'];
        break;
}

echo json_encode($response);
