# Someone Talking Social API

API RESTful para uma rede social moderna, desenvolvida com NestJS. Permite cadastro, login, gerenciamento de perfil, feed de postagens e chat entre usuários. Ideal para portfólio e projetos profissionais.

## Funcionalidades

- Cadastro e autenticação de usuários (JWT)
- Cadastro de usuário com foto de perfil (upload)
- Perfil de usuário (consulta, edição, remoção, foto de perfil)
- Feed social: criação, edição (com troca ou remoção de imagem), listagem, curtidas (com contador e status do usuário logado) e comentários (em desenvolvimento)
- Sistema de curtidas em postagens
- Testes automatizados (unitários e e2e)
- Chat em tempo real entre usuários (em desenvolvimento)

## Principais Rotas

### Autenticação

- `POST /auth/registration` — Cadastro de usuário
- `POST /auth/login` — Login e geração de token JWT

### Usuários

- `GET /users/:id` — Consulta de perfil
- `PUT /users/:id` — Atualização de dados
- `POST /users/:id/profile-photo` — Upload/atualização da foto de perfil
- `DELETE /users/:id` — Remoção de usuário

### Feed

- `GET /feed` — Listar postagens (retorna também o nome do autor, quantidade de likes e se o usuário logado curtiu cada post)
- `POST /feed` — Criar nova postagem
- `PUT /feed/:id` — Editar postagem (permite trocar ou remover imagem)
- `POST /feed/:id/like` — Curtir postagem
- `POST /feed/:id/comment` — Comentar postagem (em desenvolvimento)

### Chat (em desenvolvimento)

- `GET /chat/:userId` — Listar mensagens com usuário
- `POST /chat/:userId` — Enviar mensagem

## Tecnologias Utilizadas

- [NestJS](https://nestjs.com/) (Node.js, TypeScript)
- TypeORM (PostgreSQL)
- JWT para autenticação
- BcryptJS para hash de senhas
- Multer para upload de arquivos
- WebSocket para chat (em breve)
- Jest para testes

## Instalação

```bash
git clone https://github.com/JCZerf/someone_talking_project.git
cd someone_talking_project/api_someone_talking
npm install
```

## Ambiente de Desenvolvimento

### Configuração do Banco de Dados com Docker

O projeto inclui um arquivo `docker-compose.yml` para facilitar a criação do banco PostgreSQL localmente.  
Para subir o banco:

```bash
docker-compose up -d
```

### Configuração de Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e ajuste os dados conforme necessário:

```bash
cp .env.example .env
```

Exemplo de `.env`:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=someone_talking_user
DB_PASSWORD=someone_talking_pass
DB_DATABASE=someone_talking
```

### Migrations

Após instalar as dependências e subir o banco, rode as migrations para criar as tabelas:

```bash
npx ts-node ./node_modules/typeorm/cli.js migration:run -d src/data-source.ts
```

### Seed de Dados

Para popular o banco com dados de exemplo (usuários, posts, likes), execute:

```bash
npx ts-node src/seed.ts
```

O seed inclui um usuário fixo para desenvolvimento:

- **Email:** teste@teste.com
- **Senha:** teste123

---

**Resumo do fluxo de desenvolvimento:**

1. Configure o `.env` usando o `.env.example`.
2. Suba o banco com `docker-compose up -d`.
3. Rode as migrations.
4. Execute o seed para popular o banco.
5. Inicie a API com `npm run start:dev`.

---

Essas instruções garantem que qualquer desenvolvedor possa iniciar rapidamente o projeto em ambiente local!

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

### Feed

```http
# Listar postagens (retorna nome do autor, quantidade de likes, se o usuário logado curtiu)
GET /feed

# Criar nova postagem
POST /feed
Content-Type: multipart/form-data

{
  "caption": "Primeiro post!",
  "file": <imagem opcional>
}

# Editar postagem (trocar ou remover imagem)
PUT /feed/:id
Content-Type: multipart/form-data

{
  "caption": "Novo texto",
  "file": <nova imagem opcional>,
  "removeImage": true
}

# Curtir postagem
POST /feed/:id/like
```

### Chat (em breve)

```http
GET /chat/:userId
POST /chat/:userId
```

## Sobre o Projeto

Este projeto é parte de uma rede social em desenvolvimento, com foco em boas práticas, escalabilidade e segurança. Novas funcionalidades como feed (com edição de imagem, likes otimizados e status do usuário logado) e chat serão lançadas em breve.

## Sobre o Autor

Desenvolvido por **JCarlos Zerf**

- [GitHub](https://github.com/JCZerf)
- Email: josecarlosmrlt@outlook.com

---

## Roadmap

- [x] Cadastro e login de usuários
- [x] Gerenciamento de perfil e foto de perfil
- [x] Testes automatizados
- [x] Feed de postagens
- [x] Sistema de curtidas
- [ ] Sistema de comentários
- [ ] Chat em tempo real
- [ ] Notificações push

## Status do Projeto

🚧 **Em desenvolvimento** - Versão atual: v2.0.0

A API está funcional para cadastro, login, gerenciamento de usuários, feed de postagens e sistema de curtidas. Funcionalidades de comentários e chat estão em desenvolvimento.

---

## Licença

MIT © [JCarlos Zerf](https://github.com/JCZerf)
