<h3 align="center">
    Poto API
</h3>

<p align="center">
  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/Guribeiro/poto-api?color=87403A">
  <a href="https://www.linkedin.com/in/gustavohribeiro/" target="_blank" rel="noopener noreferrer">
    <img alt="Made by" src="https://img.shields.io/badge/made%20by-Gustavo%20Henrique-87403A">
  </a>
  <img alt="Repository size" src="https://img.shields.io/github/repo-size/Guribeiro/poto-api?color=87403A">
  <a href="https://github.com/Guribeiro/poto-api/commits">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/Guribeiro/poto-api?color=87403A">
  </a>
  <a href="https://github.com/Guribeiro/poto-api/stargazers">
    <img alt="GitHub last commit" src="https://img.shields.io/github/stars/Guribeiro/poto-api?color=87403A">
  </a>
  <a href="https://github.com/Guribeiro/poto-api/issues">
    <img alt="Repository issues" src="https://img.shields.io/github/issues/Guribeiro/poto-api?color=87403A">
  </a>
  <img alt="GitHub" src="https://img.shields.io/github/license/Guribeiro/poto-api?color=87403A">
</p>

<p align="center">
  <a href="#%EF%B8%8F-about-the-project">About the project</a>&nbsp; &nbsp; &nbsp; |&nbsp; &nbsp; &nbsp;
  <a href="#-technologies">Technologies</a>&nbsp; &nbsp; &nbsp; |&nbsp; &nbsp; &nbsp;
  <a href="#-getting-started">Getting started</a>&nbsp; &nbsp; &nbsp; |&nbsp; &nbsp; &nbsp;
  <a href="#-license">License</a>
</p>

## ⚡ About the project

this api provides everything you need to manage your moments with photos

## 🚀 Technologies

Technologies that I used to develop this api

* [Node.js](https://nodejs.org/en/)
* [TypeScript](https://www.typescriptlang.org/)
* [Prisma](https://www.prisma.io/docs)
* [Express](https://expressjs.com/pt-br/)
* [Multer](https://github.com/expressjs/multer)
* [Tsyringe](https://github.com/microsoft/tsyringe)
* [JWT-token](https://jwt.io/)
* [BCrypt](https://github.com/kelektiv/node.bcrypt.js)
* [uuid v4](https://github.com/thenativeweb/uuidv4/)
* [PostgreSQL](https://www.postgresql.org/)
* [Date-fns](https://date-fns.org/)
* [EditorConfig](https://editorconfig.org/)

## 💻 Getting started

Import the `poto.insomnia.json` on Insomnia App.

### Requirements

* [Node.js](https://nodejs.org/en/)
* [Yarn](https://classic.yarnpkg.com/) or [npm](https://www.npmjs.com/)
* One instance of [PostgreSQL](https://www.postgresql.org/)

> Obs.: I recommend you to use docker

**Clone the project and access the folder**

```
$ git clone git@github.com:Guribeiro/poto-api.git && cd poto-api
```

**Follow the steps below**

### Install the dependencies

```
yarn
```

### Make a copy of '.env.example' to '.env'

### and set with YOUR environment variables.

```
cp .env.example .env
```

<div>
  <p>Create the instance of postgreSQL using docker</p>
  <p>I'm using port 5433, you can see it in the ormconfig.json file, feel free to use any port you prefer</p>
  <p>I recommend you to use the same port as i'm using, if you just don't remember to change it in the command below</p>
</div>

```
$ docker run --name some-postgis -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5433:5432 -d postgis/postgis
```

### Run the migrations

```
yarn migrate:dev
```

### Once the migrations was created, run

```
yarn dev
```

### Well done, project is started!

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with 💜 &nbsp; by Gustavo Henrique 👋 &nbsp; [See my linkedin](https://www.linkedin.com/in/gustavohribeiro/)
