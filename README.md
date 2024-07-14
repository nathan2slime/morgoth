<div align="center">
  <h2>Morgoth</h2>
</div>

```
Name: Francisco Cajlon Jhonathan Moura Batista
Email: nathan3boss@gmail.com
LinkedIn: https://www.linkedin.com/in/nathan2slime/
Portfolio: https://www.nathan3boss.dev/
```

### Requisitos

Lista de softwares necessários para executar este aplicativo

- [Node.js](https://nodejs.org/)

  > Usei a versão 20, atualmente a LTS

- [pnpm](https://pnpm.io/installation)
- [git](https://git-scm.com/)
- [MongoDB](https://www.mongodb.com/try/download/community/)

### Variáveis de ​​ambiente

São variáveis nomeadas para o computador e usadas por algum software. Abaixo estão todas as variáveis de ambiente dessa aplicação.

| Variável                     | Descrição                                                                                                       |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `PORT`                       | Porta que a aplicação vai usar, certifique-se que ela não esteja sendo usada por outro processo.                |
| `DATABASE_URL`               | URI de conexão com o banco de dados, você deve modificar as credenciais e host de acordo com o seu banco local. |
| `SECRET_KEY`                 | Usada para geração de refresh tokens e access tokens.                                                           |
| `ACCESS_TOKEN_EXPIRES_IN`    | Tempo de validade de um access token (3d).                                                                      |
| `REFRESH_TOKEN_EXPIRES_IN`   | Tempo de validade de um refresh token (30d).                                                                    |
| `MONGO_INITDB_ROOT_USERNAME` | Define o nome do usuário admin (Usada pelo ambiente Docker).                                                    |
| `MONGO_INITDB_ROOT_PASSWORD` | Define a senha do usuário admin (Usada pelo ambiente Docker).                                                   |
| `MONGO_INITDB_ROOT_DATABASE` | Define o banco de dados inicial (Usada pelo ambiente Docker).                                                   |

Você deve criar um arquivo `.env` no diretório raiz, com o conteúdo abaixo. Outra opção seria usar o arquivo `.env.example` e renomear ele para `.env`

```
PORT="3000"
DATABASE_URL="mongodb://user:password@mongo:27017/morgoth?directConnection=true&serverSelectionTimeoutMS=2000&authSource=admin&appName=mongosh+2.2.6"
SECRET_KEY="31239012839"


ACCESS_TOKEN_EXPIRES_IN="3d"
REFRESH_TOKEN_EXPIRES_IN="30d"

MONGO_INITDB_ROOT_USERNAME="user"
MONGO_INITDB_ROOT_PASSWORD="password"
MONGO_INITDB_ROOT_DATABASE="morgoth"
```

> Para rodar o projeto em ambiente Docker, você vai precisar criar um arquivo `.env.production.local`.

### Instalar dependências

Depois de configurar as variáveis de ambiente, instale as dependências do projeto usando o gerenciador de pacotes **pnpm**.
Rode o comando abaixo pra instalar as dependências

```bash
pnpm install
```

### Executar a aplicação

Você pode usar o comando abaixo para executar a aplicação

```bash
pnpm start
```

### Testes

Você pode rodar os testes unitários com o comando abaixo

```bash
pnpm test
```

Rode o comando abaixo para rodar a cobertura de testes unitários

```bash
pnpm test:cov
```

Você pode rodar os testes de integração com o comando abaixo

```bash
pnpm test:e2e
```

### CLI

Foi criado um CLI com comandos para criação de usuários com role **ADMIN**. Rode os comandos abaixo para criar um novo usuário com role ADMIN.

```bash
pnpm build
```

```bash
pnpm cli admin
```

Os dados do usuário aparecerão em formato json no console.

```json
{
  "data": {
    "email": "Aurelie.Fadel@hotmail.com",
    "name": "Katherine Barrows",
    "password": "QrNZdnBfYY0yjyF",
    "role": "ADMIN"
  },
  "level": "info",
  "message": "user admin created"
}
```

### Docker
Primeiro, ceritifique-se de as portas 3000 e 27017 não estejam sendo usadas por outro processo e que o arquivo de variáveis de ambiente `.env.production.local` esteja criado e com as variáveis devidamente configuradas.

Para rodar a aplicação em ambiente Docker, você pode usar o comando abaixo:

```bash
docker compose up
```
