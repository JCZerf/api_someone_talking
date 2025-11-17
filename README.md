# Someone Talking Social API

API RESTful para uma rede social moderna, desenvolvida com NestJS. Permite cadastro, login, gerenciamento de perfil, feed de postagens e chat entre usuários. Ideal para portfólio e projetos profissionais.

## Funcionalidades

- Cadastro e autenticação de usuários (JWT)
- Perfil de usuário (consulta, edição, remoção)
- Feed social: criação, listagem e interação com postagens
- Chat em tempo real entre usuários (em desenvolvimento)
- Testes automatizados (unitários e e2e)

## Principais Rotas

### Autenticação

- `POST /auth/registration` — Cadastro de usuário
- `POST /auth/login` — Login e geração de token JWT

### Usuários

- `GET /users/:id` — Consulta de perfil
- `PUT /users/:id` — Atualização de dados
- `DELETE /users/:id` — Remoção de usuário

### Feed (em breve)

- `GET /feed` — Listar postagens
- `POST /feed` — Criar nova postagem
- `POST /feed/:id/like` — Curtir postagem

### Chat (em breve)

- `GET /chat/:userId` — Listar mensagens com usuário
- `POST /chat/:userId` — Enviar mensagem

## Tecnologias Utilizadas

- [NestJS](https://nestjs.com/) (Node.js, TypeScript)
- TypeORM (PostgreSQL)
- JWT para autenticação
- BcryptJS para hash de senhas
- WebSocket para chat (em breve)
- Jest para testes

## Instalação

```bash
git clone https://github.com/JCZerf/someone_talking_project.git
cd someone_talking_project/api_someone_talking
npm install
```

## Execução

```bash
# desenvolvimento
npm run start:dev

# produção
npm run start:prod
```

## Testes

```bash
# unitários
npm run test

# e2e
npm run test:e2e
```

## Exemplos de Requisição

### Cadastro

```http
POST /auth/registration
Content-Type: application/json

{
  "name": "João",
  "birthDate": "2000-01-01",
  "email": "joao@email.com",
  "phone": "11999999999",
  "password": "senha123"
}
```

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "password": "senha123"
}
```

### Feed (em breve)

```http
GET /feed
POST /feed
POST /feed/:id/like
```

### Chat (em breve)

```http
GET /chat/:userId
POST /chat/:userId
```

## Sobre o Projeto

Este projeto é parte de uma rede social em desenvolvimento, com foco em boas práticas, escalabilidade e segurança. Novas funcionalidades como feed e chat serão lançadas em breve.

## Sobre o Autor

Desenvolvido por **JCarlos Zerf**

- [GitHub](https://github.com/JCZerf)
- Email: josecarlosmrlt@outlook.com

---

## Roadmap

- [x] Cadastro e login de usuários
- [x] Gerenciamento de perfil
- [x] Testes automatizados
- [ ] Feed de postagens
- [ ] Sistema de curtidas e comentários
- [ ] Chat em tempo real
- [ ] Notificações push

## Status do Projeto

🚧 **Em desenvolvimento** - Versão atual: v1.0.0

A API está funcional para cadastro, login e gerenciamento de usuários. As funcionalidades de feed e chat estão em desenvolvimento.

---

## Licença

MIT © [JCarlos Zerf](https://github.com/JCZerf)
