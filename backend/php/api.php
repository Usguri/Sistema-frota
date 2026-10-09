<?php
require 'AllArquivos.php';

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
    default:
        $response = ['error' => 'Ação inválida.'];
        break;
}

echo json_encode($response);


//////////////////////////////////////////////////


// date_default_timezone_set('America/Sao_Paulo');

// $inputJSON = file_get_contents('php://input');
// $data = json_decode($inputJSON, true);

// switch ($data['action']) {
//     case 'SalvaPlacaCarregamento':
//         SalvaPlacaCarregamento($data);
//         break;
//     case 'InformarLocalCarregamentoDoca':
//         InformarLocalCarregamentoDoca($data);
//         break;
//     case 'LimparDadosJson':
//         LimparDadosJson();
//         break;
//     case 'BuscaDadosArqJson':
//         BuscaDadosArqJson();
//         break;
//     case 'BuscaPlacaCarregamentoAgora':
//         BuscaPlacaCarregamentoAgora();
//         break;
//     default:
//         echo json_encode(['error' => 'Ação inválida']);
//         break;
// }




// function SalvaPlacaCarregamento($data)
// {

//     $dados_recebimento = [
//         'placa' => strtoupper($data['placa']),
//         'doca' => '',
//         'status' => filter_var($data['status'], FILTER_VALIDATE_BOOLEAN)
//     ];

//     $file = 'lista_placas.json';

//     if (file_exists($file)) {
//         $currentData = json_decode(file_get_contents($file), true);

//         if (!is_array($currentData)) {
//             $currentData = [];
//         }

//         $ultimoRegistro = end($currentData);
//         $ultimaPosicao = $ultimoRegistro ? $ultimoRegistro['id'] : 0;

//         $dados_recebimento['id'] = $ultimaPosicao + 1;

//         $currentData[] = $dados_recebimento;
//     } else {
//         $dados_recebimento['id'] = 1;
//         $currentData = [$dados_recebimento];
//     }

//     $jsonData = json_encode($currentData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

//     if (file_put_contents($file, $jsonData)) {

//         $currentData = json_decode(file_get_contents($file), true);
//         echo json_encode(['success' => true, 'data' => $currentData]);
//     } else {
//         echo json_encode(['success' => false, 'message' => 'Erro ao salvar o arquivo']);
//     }
// }

// function InformarLocalCarregamentoDoca($data)
// {
//     $registrocarregamento = $data['id'];
//     $Localcarregamento = $data['doca'];
//     $file = 'lista_placas.json';
//     $currentData = json_decode(file_get_contents($file), true);
//     $selecionaCaminhaoCarregamento = [];
//     $placa_carregamento = ['placa' => '', 'doca' => ''];

//     foreach ($currentData as $key => $value) {
//         if ($registrocarregamento == $value['id']) {
//             $currentData[$key]['doca'] = $Localcarregamento;
//             $currentData[$key]['status'] = true;
//             $currentData[$key]['datahora'] = date("m/d H:i", time());
//             $placa_carregamento['placa'] = $currentData[$key]['placa'];
//             $placa_carregamento['doca'] = $Localcarregamento;
//             array_push($selecionaCaminhaoCarregamento, $currentData[$key]);
//         }
//     }

//     $jsonData = json_encode($currentData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

//     if (file_put_contents($file, $jsonData)) {

//         SalvarPlacaCaregamento($placa_carregamento);
//         echo json_encode(['success' => true]);
//     } else {
//         echo json_encode(['success' => false, 'message' => 'Erro ao salvar o arquivo']);
//     }
// }

// function LimparDadosJson()
// {
//     $file = 'lista_placas.json';

//     file_put_contents($file, json_encode([]));
//     echo json_encode(['success' => true]);
// }

// function BuscaDadosArqJson()
// {
//     $file = 'lista_placas.json';
//     $currentData = json_decode(file_get_contents($file), true);

//     echo json_encode(['success' => true, 'placa' => $currentData]);
// }

// function SalvarPlacaCaregamento($dados_carregamento)
// {
//     $dados = [$dados_carregamento];
//     $json = json_encode($dados, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
//     file_put_contents('print_placa_carregamento.json', $json);
// }

// function BuscaPlacaCarregamentoAgora()
// {
//     $currentData = json_decode(file_get_contents('print_placa_carregamento.json'), true);
//     file_put_contents('print_placa_carregamento.json', json_encode([]));
//     echo json_encode(['dados' => $currentData]);
// }
