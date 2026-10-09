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
            $data['IDTDP'] = $nextId;
            $this->SalvarPlacaTableEtapaProcessos($data);
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
            $data['status'] = 2;
            $data['idcaminhao'] = $data['id'];
            $this->SalvarStatusProcessos($data);
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
            $data['status'] = 3;
            $this->SalvarStatusProcessos($data);
            return ['success' => true, 'message' => 'Finalizado carregamento'];
        } else {
            return ['success' => false, 'error' => $stmt->errorInfo()];
        }
    }

    public function DeletarCaminhao($data): array
    {
        $stmt = $this->connection->prepare("DELETE FROM F_CADASTRO_CHAMAR_CAMINHAO WHERE IDCHAMARCAMINHAO = $data[idcaminhao]");

        if ($stmt->execute()) {
            $data['status'] = 4;
            $this->SalvarStatusProcessos($data);
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

    public function SalvarPlacaTableEtapaProcessos($array): void
    {
        $datahoraatual = date("Y-m-d H:i:s", time());
        $stmt = $this->connection->prepare("INSERT INTO F_TEMPO_DURACAO_PROCESSOS (IDTDP,PLACA,STATUS_ESPERA,TIPO_CARREGAMENTO,STATUS1,STATUS2,STATUS3) VALUES ($array[IDTDP],'$array[placa]','$datahoraatual',$array[tipocarregamento],0,0,0)");
        $stmt->execute();
    }

    public function SalvarStatusProcessos($array): void
    {
        $datahoraatual = date("Y-m-d H:i:s");

        $statusMap = [
            2 => 'STATUS_CARREGANDO',
            3 => 'STATUS_CARREGADO'
        ];

        $tipo_status = $statusMap[$array['status']] ?? 'STATUS_FINALIZADO';

        if ($array['status'] == 2) {
            $sql = "UPDATE F_TEMPO_DURACAO_PROCESSOS SET {$tipo_status} = ?, LOCAL_CARREGAMENTO = ? WHERE IDTDP = ?";

            preg_match('/\d+/', $array['doca'], $matches);
            $numero = $matches[0];

            $params = [$datahoraatual, $numero, $array['idcaminhao']];
        } else {
            $sql = "UPDATE F_TEMPO_DURACAO_PROCESSOS SET {$tipo_status} = ? WHERE IDTDP = ?";
            $params = [$datahoraatual, $array['idcaminhao']];
        }

        $stmt = $this->connection->prepare($sql);
        $stmt->execute($params);
    }

    public function ListaCaminhoesCarregados($array): array
    {
        $stmt = $this->connection->query("SELECT * FROM F_TEMPO_DURACAO_PROCESSOS WHERE STATUS_ESPERA >= '$array[datainicial] 00:00:00' AND STATUS_ESPERA <= '$array[datafinal] 23:59:59'");
        $ListaCaminhoesCarregador = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return ['data' => $ListaCaminhoesCarregador];
    }

    public function SelecionaDeterminadoStatus($array): array
    {
        $stmt = $this->connection->query("SELECT PLACA,STATUS_ESPERA,STATUS_CARREGANDO,STATUS_CARREGADO,STATUS_FINALIZADO,LOCAL_CARREGAMENTO,TIPO_CARREGAMENTO FROM F_TEMPO_DURACAO_PROCESSOS WHERE STATUS_ESPERA >= '$array[data] 00:00:00' AND STATUS_ESPERA <= '$array[data] 23:59:59'");
        $ListaCaminhoesCarregador = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return ['data' => $ListaCaminhoesCarregador];
    }

    public function SalvaEmailProcessosStatus($array): bool
    {

        $stmt = $this->connection->query("SELECT MAX(IDEMAIL) AS ID FROM F_SEND_EMAIL_ALERT;");
        $retornoBusca = $stmt->fetch(PDO::FETCH_ASSOC);
        $nextId = $retornoBusca['ID'] + 1;
        $stmt = $this->connection->prepare("INSERT INTO F_SEND_EMAIL_ALERT (IDEMAIL,EMAIL,STATUS_ESPERA,STATUS_CARREGANDO,STATUS_CARREGADO) VALUES ($nextId,'$array[email]',0,0,0)");
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function BuscaListaEmails(): array
    {
        $stmt = $this->connection->query("SELECT * FROM F_SEND_EMAIL_ALERT ");
        $ListaEmails = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return ['data' => $ListaEmails];
    }

    public function SalvaStatusUsuario($array): bool
    {
        $array['checked'];
        $check = $array['checked'] ? 1 : 0;

        $stmt = $this->connection->prepare("UPDATE F_SEND_EMAIL_ALERT SET $array[processostatus] = $check WHERE IDEMAIL = $array[idemail]");

        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function DeletarEmailUsuario($array): bool
    {
        $stmt = $this->connection->prepare("DELETE FROM F_SEND_EMAIL_ALERT WHERE IDEMAIL = $array[idemail]");

        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function SalvaLimiteTempoStatus($array): bool
    {
        $stmt = $this->connection->prepare("UPDATE F_DEFINICAO_TEMPO_STATUS SET STATUS_ESPERA = $array[statusespera], STATUS_CARREGANDO = $array[statuscarregando], STATUS_CARREGADO = $array[statuscarregado]");

        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function BuscaLimiteTempo(): array
    {
        $stmt = $this->connection->prepare("SELECT * FROM F_DEFINICAO_TEMPO_STATUS");
        $stmt->execute();
        $DefinicaoTempo = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return ['data' => $DefinicaoTempo];
    }
}
