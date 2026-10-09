<?php

namespace Repository;

use PDO;
use Database\DatabaseHandler;

class UserRepository
{
    private $connection;

    public function __construct()
    {
        $this->connection = DatabaseHandler::getConnection();
    }

    public function SalvaPlacaCarregamento($data): array
    {

        $stmt = $this->connection->query("SELECT MAX(IDCHAMARCAMINHAO) AS ID FROM F_CADASTRO_CHAMAR_CAMINHAO;");
        $retornoBusca = $stmt->fetch(PDO::FETCH_ASSOC);
        $nextId = $retornoBusca['ID'] + 1;
        $datahoraatual = date("Y-m-d H:i:s", time());

        $stmt = $this->connection->prepare("INSERT INTO F_CADASTRO_CHAMAR_CAMINHAO (IDCHAMARCAMINHAO,PLACA,STATUSCARREGAMENTO,TIPO_DE_CARREGAMENTO,DATAHORA) VALUES ($nextId,'$data[placa]',$data[statuscarregamento],$data[tipocarregamento],'$datahoraatual');");

        if ($stmt->execute()) {
            return ['success' => true, 'message' => 'Placa salva com sucesso'];
        } else {
            return ['success' => false, 'error' => $stmt->errorInfo()];
        }
    }

    public function BuscaDadosTipoCarregamento(): array
    {
        $stmt = $this->connection->query("SELECT * FROM F_TIPO_CARREGAMENTO");
        $retornoBusca = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return ['data' => $retornoBusca];
    }

    public function BuscaDadosTabelaCarregamento(): array
    {
        $stmt = $this->connection->query("SELECT * FROM F_CADASTRO_CHAMAR_CAMINHAO");
        $retornoBusca = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return ['data' => $retornoBusca];
    }

    public function InformarLocalCarregamentoDoca($data): array
    {

        $placaCaminhao = $this->BuscaNumeroPlaca($data['id']);
        $datahoraatual = date("Y-m-d H:i:s", time());
        $dadosSaveTemporario = [
            'placa' => $placaCaminhao,
            'doca' => $data['doca'],
            'datahora' => $datahoraatual
        ];

        $stmt = $this->connection->prepare("UPDATE F_CADASTRO_CHAMAR_CAMINHAO SET STATUSCARREGAMENTO = 2, LOCALCARREGAMENTO = '$data[doca]', DATAHORA = '$datahoraatual' WHERE IDCHAMARCAMINHAO = $data[id]");

        if ($stmt->execute()) {
            return ['success' => true, 'message' => 'Local de carregamento atualizado', 'saveredis' => $dadosSaveTemporario];
        } else {
            return ['success' => false, 'error' => $stmt->errorInfo()];
        }
    }

    public function BuscaListaCarregamento(): array
    {

        $stmt = $this->connection->query("SELECT * FROM F_CADASTRO_CHAMAR_CAMINHAO WHERE STATUSCARREGAMENTO = 2");
        $retornoBusca = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return ['data' => $retornoBusca];
    }

    public function FinalizaCarregamento($data): array
    {
        $datahoraatual = date("Y-m-d H:i:s", time());
        $stmt = $this->connection->prepare("UPDATE F_CADASTRO_CHAMAR_CAMINHAO SET STATUSCARREGAMENTO = 3, DATAHORA = '$datahoraatual' WHERE IDCHAMARCAMINHAO = $data[idcaminhao]");

        if ($stmt->execute()) {
            return ['success' => true, 'message' => 'Finalizado carregamento'];
        } else {
            return ['success' => false, 'error' => $stmt->errorInfo()];
        }
    }

    public function DeletarCaminhao($data): array
    {
        $stmt = $this->connection->prepare("DELETE FROM F_CADASTRO_CHAMAR_CAMINHAO WHERE IDCHAMARCAMINHAO = $data[idcaminhao]");

        if ($stmt->execute()) {
            return ['success' => true, 'message' => 'Placa deletado'];
        } else {
            return ['success' => false, 'error' => $stmt->errorInfo()];
        }
    }

    public function BuscaNumeroPlaca($id): string
    {
        $stmt = $this->connection->query("SELECT PLACA FROM F_CADASTRO_CHAMAR_CAMINHAO WHERE IDCHAMARCAMINHAO = $id");
        $placa = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $placa[0]['PLACA'];
    }
}
