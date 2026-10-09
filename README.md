# 🚛 Chamada Caminhões

Sistema de chamada e acompanhamento de caminhões em tempo real. As solicitações feitas no painel web são exibidas automaticamente em uma TV na sala de espera, e o status de cada chamada (aguardando, em atendimento, finalizado) é identificado a partir dos dados do SAP HANA, com notificações automáticas por e-mail.

---

## 🔥 Funcionalidades

- Registro e chamada de caminhões pelo painel web
- Exibição automática na TV da sala de espera
- Identificação e exibição de status em tempo real
- Integração com SAP HANA para busca de dados por serial
- Jobs automáticos de notificação por e-mail
- Cache e tempo real com Redis
- Relatórios gráficos com ApexCharts
- Exportação para Excel
- Geração de Romaneio

---

## ⚙️ Tecnologias

| Camada          | Stack                                                 |
| --------------- | ----------------------------------------------------- |
| Frontend        | React, React Router DOM, Vite, ApexCharts             |
| Backend PHP     | PHP 8.0, Apache, PDO                                  |
| Backend Node.js | Node.js 18, Express, MySQL2, SAP HANA Client, Nodemon |
| Bancos e cache  | MySQL, SAP HANA, Redis                                |
| Infraestrutura  | Docker, Docker Compose, Apache                        |

---

## 🧠 Arquitetura e conceitos

- Arquitetura multi-backend (PHP + Node.js)
- Repository Pattern
- Jobs agendados com `setInterval`
- Integração com SAP HANA
- Cache com Redis
- Envio de e-mails automatizado
- Containerização com Docker Compose
- Variáveis de conexão configuráveis por ambiente

---

## 🧩 Estrutura do projeto

```
frontend/              Aplicação React (painel e TV)
backend/
├── php/                API PHP e regras de negócio
└── nodejs/              API Node.js, jobs e integrações
docker-compose.yml      Orquestração das APIs e do Redis
Painel de patio/        Versão legada, independente da aplicação atual
```

---

## 🚀 Como executar

Suba as APIs e o Redis com Docker Compose:

```bash
docker compose up --build -d
```

Instale as dependências e inicie o frontend em outro terminal:

```bash
cd frontend
npm ci
npm run dev
```

O frontend estará disponível em `http://localhost:5173`. A API PHP usa a porta
`8191`, a API Node.js usa a porta `4002` e o Redis usa a porta `6379`.

---

## ⚠️ Pontos de atenção

- Mover as credenciais de banco do código Node.js para `.env`
- Restringir o CORS (hoje `*` no PHP) em produção
- Reativar o `React.StrictMode` no frontend

---

## 👨‍💻 Autor

**Vinícius Mendes**, Desenvolvedor Full Stack
