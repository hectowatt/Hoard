<div align="center">

![Hoard logo](./assets/Hoard_logo_colored.png)

**🖊️ A Notes app with table and password lock! 🔐**

---

<a href="https://nginx.org/">
<img src="https://img.shields.io/badge/Nginx-009639?logo=nginx&logoColor=white&style=for-the-badge" alt="Nginx"/></a>

<a href="https://nextjs.org/">
<img src="https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"/></a>

<a href="https://www.postgresql.org/">
<img src="https://img.shields.io/badge/postgresql-4169e1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/></a>

<a href="https://expressjs.com/">
<img src="https://img.shields.io/badge/express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"/></a>


<a href="https://www.docker.com/">
<img src="https://img.shields.io/badge/docker-257bd6?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/></a>

<a href="https://redis.io/">
<img src="https://img.shields.io/badge/-Redis-D82C20.svg?logo=redis&style=for-the-badge&logoColor=white" alt="Redis"/></a>

</div>

## Installation

After cloning source, you have to copy `docker-compose_sample.yml` and `.env_sample`.
```
cp docker-compose_sample.yml docker-compose.yml

cp .env_sample .env
```

If you want to customise connection setting, edit these files;

After building docker container with docker compose, you can launch Hoard;

## Languages
Hoard supports Japanese and English(US).

## Development
To develop Hoard, Devcontainer is usefull.

Copy setting file and build container;
```
cp ./.devcontainer/devcontainer_sample.json ./.devcontainer/devcontainer.json

```

## Mobile
Hoard supports PWA.

If you use Hoard in Mobile, PWA is usefull for you.
