# Relatorio CP-2 - Computacao em Nuvem

Aluno: <SEU NOME>

Turma: <SUA TURMA>

Data: 23/04/2026

Repositorio publico: <COLE AQUI O LINK>

## 1. Objetivo

Implementar:

1. LAB 1: stack com mais de um servico usando Docker Compose.
2. LAB 2: imagem de aplicacao com Dockerfile, boas praticas de build e publicacao em registry.

## 2. Tecnologias

- Docker
- Docker Compose
- Node.js 20
- Express
- PostgreSQL 16
- Redis 7

## 3. Estrutura da Solucao

- Aplicacao: API Node.js (`app`)
- Banco de dados: PostgreSQL (`db`)
- Cache e contador de acessos: Redis (`redis`)
- Network dedicada: `cp2-network`
- Volumes: `postgres_data` e `redis_data`

## 4. Execucao do LAB 1

### 4.1 Subida da stack

```bash
docker compose up -d --build
```

Evidencia (print): `docs/screenshots/01-compose-up.png`

### 4.2 Validacao dos servicos

```bash
docker compose ps
docker compose logs app --tail 50
```

Evidencia (print): `docs/screenshots/02-compose-ps.png`

### 4.3 Teste da aplicacao

```bash
curl http://localhost:3000/health
curl http://localhost:3000/
```

Evidencia (print): `docs/screenshots/03-api-health-home.png`

### 4.4 Validacao de network e volumes

```bash
docker network ls
docker volume ls
```

Evidencia (print): `docs/screenshots/04-network-volumes.png`

## 5. Execucao do LAB 2

### 5.1 Build da imagem local com Dockerfile

```bash
docker build -t cp2-cloud-stack:1.0.0 .
```

Evidencia (print): `docs/screenshots/05-docker-build.png`

### 5.2 Tag e push para registry

```bash
docker tag cp2-cloud-stack:1.0.0 SEU_USUARIO/cp2-cloud-stack:1.0.0
docker tag cp2-cloud-stack:1.0.0 SEU_USUARIO/cp2-cloud-stack:latest
docker login
docker push SEU_USUARIO/cp2-cloud-stack:1.0.0
docker push SEU_USUARIO/cp2-cloud-stack:latest
```

Evidencia (print): `docs/screenshots/06-registry-push.png`

### 5.3 Execucao com docker run

```bash
docker run -d --name cp2-app-run -p 3000:3000 \
  -e POSTGRES_HOST=host.docker.internal \
  -e POSTGRES_PORT=5432 \
  -e POSTGRES_USER=cp2 \
  -e POSTGRES_PASSWORD=cp2pass \
  -e POSTGRES_DB=cp2db \
  -e REDIS_HOST=host.docker.internal \
  -e REDIS_PORT=6379 \
  SEU_USUARIO/cp2-cloud-stack:1.0.0
```

Evidencia (print): `docs/screenshots/07-docker-run.png`

## 6. Requisitos Atendidos

1. Imagem criada com Dockerfile: SIM
2. Aplicacao executada com Docker Compose: SIM
3. Network propria e volumes persistentes: SIM
4. Limite de CPU/memoria + restart + stop grace period: SIM
5. Multi-stage build e boas praticas: SIM
6. Publicacao da imagem em registry: SIM (mediante execucao dos comandos acima)

## 7. Conclusao

Checkpoint implementado com stack multi-servico e imagem versionada publicada em registry, conforme requisitos do CP-2.
