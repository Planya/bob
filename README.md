# Bob

### Discord бот - Nest.js, PostgreSQL, Discord.js

#### Requirements

- Debian/Ubuntu
-  make - `apt-get -y install make`
- Docker
-  [NodeJS v16+](https://github.com/nvm-sh/nvm)
-  [Yarn](https://classic.yarnpkg.com/lang/en/docs/install)

-  [Google Cloud API Key](https://console.cloud.google.com/) - ключ с правами на доступ к `YouTube Data API v3`

-  [Discord App](https://discord.com/developers/applications) - Права `https://discord.com/oauth2/authorize?client_id=CLIENT_ID_HERE&scope=bot&permissions=17448312848`

-  [Twitch App](https://dev.twitch.tv/console/apps) - нужны `client_key` и `secret_key`

#### .env и БД

 - Скопировать `.env.example` и создать `.env` в корне, заполнить переменные среды
 - Скопировать `start-db.example.sh` и создать `start-db.sh` в корне, отредактировать доступы к БД
 
#### Первый запуск
 - `make install` - установятся зависимости NodeJS
 - `make db` - установится и запустится docker образ postgres
 - `make dev/build` - запуск в dev режиме или билд для прода

  

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)

![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&logo=discord&logoColor=white)

  

![bob.png](https://aspectro.pw/img/bob_github.png)