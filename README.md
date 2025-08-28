# Angular JWT Auth

Este projeto é uma aplicação de autenticação desenvolvida para praticar e demonstrar recursos modernos do Angular 19+, como signals para gerenciamento reativo de estado, control flow nativo (`@if`, `@for`), standalone components e outras boas práticas recomendadas pela equipe Angular. A aplicação implementa um sistema completo de autenticação JWT e utiliza Tailwind CSS para estilização moderna e responsiva.

## Sumário

- [Objetivo](#objetivo)
- [Funcionalidades](#funcionalidades)
- [Pré-requisitos](#pré-requisitos)
- [Como Executar](#como-executar)
- [Screenshots](#screenshots)
- [Estrutura do Projeto](#estrutura-do-projeto)

## Objetivo

O objetivo deste projeto é servir como um exemplo prático e didático de como construir aplicações Angular modernas e seguras, utilizando as funcionalidades mais recentes do framework para garantir código limpo, eficiente e de fácil manutenção. A aplicação de autenticação implementa:

- Autenticação JWT com login, registro e refresh de token
- Gerenciamento de estado local com signals
- Uso de control flow nativo no template
- Componentização seguindo o padrão standalone
- Proteção de rotas com guards (`authGuard` e `noAuthGuard`)
- Interceptação de requisições HTTP com token JWT via Interceptors
- Interface responsiva e estilização moderna com Tailwind CSS
- Lazy loading de rotas para otimização de performance
- Boas práticas de performance e arquitetura

## Funcionalidades

- **Login:** Autentica o usuário e armazena tokens JWT com validação de formulário
- **Registro:** Cria uma nova conta de usuário com validação de senha
- **Perfil:** Exibe dados do usuário autenticado e permite logout
- **Proteção de rotas:** Usuários não autenticados são redirecionados para login; usuários autenticados não acessam login/registro
- **Diálogo de logout:** Confirmação visual para encerrar sessão com segurança
- **Página de erro:** Exibe mensagem personalizada para rotas não encontradas
- **Refresh automático:** Renovação automática de tokens JWT antes da expiração

## Pré-requisitos

Escolha uma das opções para executar o projeto:

- [Node.js](https://nodejs.org/en/download) (versão recomendada: 18+)
- [Angular CLI](https://v19.angular.dev/installation) (versão 19+)
- [Docker](https://www.docker.com/)

> [!IMPORTANT]  
> Antes de executar o projeto, configure a URL da sua API nos arquivos de environment:
>
> - Edite `src/environments/environment.ts` e defina `apiUrl`
> - Edite `src/environments/environment.prod.ts` e defina `apiUrl`
>
> Exemplo:
>
> ```ts
> export const environment: Environment = {
>   apiUrl: 'http://localhost:4200/api', // URL da sua API
> };
> ```

## Como Executar

Você pode executar o projeto de duas formas:

1. **Com Docker** (recomendado para evitar configurações locais)
2. **Localmente com Node.js/Angular CLI**

### Clone o Projeto

Clone este repositório em sua máquina local:

```bash
git clone https://github.com/kauatwn/angular-jwt-auth.git
```

### Executar com Docker

1. Navegue até a pasta raiz do projeto:

   ```bash
   cd angular-jwt-auth
   ```

2. Construa a imagem Docker:

   ```bash
   docker build -t angular-jwt-auth .
   ```

3. Execute o container:

   ```bash
   docker run --rm -p 4200:80 angular-jwt-auth
   ```

Após executar os comandos acima, a aplicação estará disponível em [http://localhost:4200](http://localhost:4200).

### Executar Localmente

1. Acesse a pasta do projeto:

   ```bash
   cd angular-jwt-auth
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:

   ```bash
   npm start
   ```

4. Acesse a aplicação em [http://localhost:4200](http://localhost:4200).

## Screenshots

Abaixo alguns exemplos da interface da aplicação:

![Login Page](images/login.png)
![Register Page](images/register.png)
![User Profile Page](images/user-profile.png)
![Not Found Page](images/not_found.png)

## Estrutura do Projeto

O projeto está organizado da seguinte forma:

```plaintext
angular-jwt-auth/
└── src/
    ├── app/
    │   ├── core/
    │   │   ├── guards/
    │   │   │   ├── auth/
    │   │   │   └── no-auth/
    │   │   ├── interceptors/
    │   │   │   └── auth/
    │   │   ├── models/
    │   │   └── services/
    │   │       ├── auth/
    │   │       └── token/
    │   ├── features/
    │   │   ├── login/
    │   │   ├── not-found/
    │   │   ├── register/
    │   │   └── user-profile/
    │   │       └── components/
    │   │           └── logout-dialog/
    │   ├── shared/
    │   │   └── validators/
    │   ├── app.component.*
    │   ├── app.config.ts
    │   └── app.routes.ts
    ├── index.html
    ├── main.ts
    └── styles.css
```

Cada funcionalidade é independente, focada em uma única responsabilidade e utiliza signals para o gerenciamento de estado. O sistema de autenticação garante segurança e persistência dos tokens JWT com proteção automática de rotas e interceptação de requisições HTTP.
