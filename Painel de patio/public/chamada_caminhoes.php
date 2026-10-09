<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="image/costab.jpeg" type="image/jpeg">
    <title>Aviso de Carregamento</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-LN+7fdVzj6u52u30Kp6M/trliBMCMKTyK833zpbD+pXdCLuTusPj697FH4R/5mcr" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js" integrity="sha384-ndDqU0Gzau9qJ1lfW4pNLlhNTkCfHzAVBReH9diLvGRem5+R9g2FzA8ZGN954O5Q" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>

<style>
    .my-big-popup {
        width: 90% !important;
        height: '1000px' !important;
        font-size: 30px;
    }

    .small-alert {
        font-size: 70px;
        display: inline-block;
    }

    #table_list_carregando_agora th,
    #table_list_carregando_agora td {
        text-align: center;
        vertical-align: middle;
    }

    #table_list_carregando_agora th:nth-child(1),
    #table_list_carregando_agora td:nth-child(1) {
        width: 22%;
    }

    #table_list_carregando_agora th:nth-child(2),
    #table_list_carregando_agora td:nth-child(2) {
        width: 35%;
    }

    #table_list_carregando_agora th:nth-child(3),
    #table_list_carregando_agora td:nth-child(3) {
        width: 22%;
    }

    #table_list_carregando_agora th:nth-child(4),
    #table_list_carregando_agora td:nth-child(4) {
        width: 25%;
    }

    #custom-alert {
        position: fixed;
        top: 10%;
        left: 50%;
        transform: translateX(-50%);
        background-color: red;
        color: white;
        padding: 50px 80px;
        font-size: 80px;
        border-radius: 20px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        display: none;
        z-index: 9999;
        text-align: center;
        width: 70%;
    }
</style>

<body>
    <div class="container-fluid">
        <div class="row justify-content-center mt-1" style="margin-top: 5px;">
            <table class="table table-striped text-center align-middle" id="table_list_carregando_agora">
                <thead>
                    <tr>
                        <th scope="col" id="placa">Placa</th>
                        <th scope="col">Doca</th>
                        <th scope="col">Data/hora</th>
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
        <div id="custom-alert"></div>
    </div>

    <script src="js/pagListPlacas.js?= time() ?>"></script>
    <script src="js/helpers/helpers.js"></script>

</body>

</html>