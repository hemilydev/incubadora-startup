# Incubadora de Empresas – Sistema de Gestão de Startups

> Trabalho Final — React, TypeScript, Bootstrap e integração com Spring Boot  
> Disciplina: Desenvolvimento de Software WEB  
> Prof. Alexandre Cláudio de Almeida

---

## Sobre o Projeto

Aplicação web para gerenciamento interno da Incubadora de Empresas da PUC Goiás, desenvolvida com **React + Vite + TypeScript** e **Bootstrap 5 (CDN)**, integrada a um back-end Spring Boot com autenticação JWT.

O sistema permite acompanhar as startups em cada ciclo da incubadora:
- **Ciclo 1** — Pré-incubação (Ideação)
- **Ciclo 2** — Incubação (Tração)
- **Ciclo 3** — Pós-incubação (Aceleração)

---

## Funcionalidades

| Ação | Descrição |
|------|-----------|
| Login com JWT | Autenticação segura — sem login, nenhum endpoint é acessível |
| Cadastrar startup | Formulário com nome, fundador, setor, ciclo, data de entrada e descrição |
| Editar startup | Atualiza qualquer campo de uma startup existente |
| Avançar ciclo | Move a startup para o próximo ciclo com confirmação |
| Voltar ciclo | Retorna a startup ao ciclo anterior com confirmação |
| Registrar contrato | Marca o contrato da startup como assinado |
| Cancelar contrato | Desfaz o registro de contrato |
| Desclassificar | Remove a startup das ativas com confirmação |
| Reativar startup | Reativa uma startup desclassificada, voltando para o Ciclo 1 |
| Ver detalhes | Modal com informações completas da startup |
| Filtrar por ciclo | Sidebar filtra por Ciclo 1, 2, 3 ou Desclassificadas |
| Pesquisar | Barra de pesquisa no navbar por nome do projeto ou fundador |
| Dashboard | Contadores atualizam automaticamente a cada ação |
| Logout | Encerra a sessão removendo o token do localStorage |

---

## Justificativa da Arquitetura

A divisão de componentes seguiu o princípio de que **cada componente faz apenas uma coisa**.

| Componente | O que faz |
|------------|-----------|
| `Navbar` | Logo, título, barra de pesquisa, botão nova startup e logout. |
| `Sidebar` | Filtros por ciclo. Não conhece as startups, apenas recebe callbacks. |
| `Dashboard` | Mostra os 6 contadores. Recebe apenas números via props. |
| `StartupCard` | Representa uma startup com todos os botões de ação. |
| `Modal` | Exibe detalhes completos de uma startup selecionada. |
| `ModalNovaStartup` | Formulário de cadastro com todos os campos incluindo data. |
| `ModalEditarStartup` | Formulário de edição pré-preenchido com os dados atuais. |
| `Footer` | Identificação acadêmica com a tag `<address>`. |
| `Login` | Tela de autenticação com email e senha. |
| `App` | Estado global. Carrega dados do back-end e passa para os filhos via props. |

### Fluxo de dados

```
App (estado global: startups[])
├── Navbar              ← pesquisa, nova startup, logout
├── Sidebar             ← filtro ativo + contadores + callbacks
├── Dashboard           ← contadores (só leitura)
├── StartupCard         ← startup + todos os callbacks de ação
│   ├── Modal           ← startup selecionada para detalhes
│   └── ModalEditarStartup ← startup selecionada para edição
└── ModalNovaStartup    ← callbacks de salvar e fechar
```

### Integração com o back-end

O front-end consome a API REST do back-end via **axios** com interceptor JWT:

```
src/services/
├── api.ts              # Instância do axios com interceptor JWT automático
├── authService.ts      # Login, logout e verificação de autenticação
└── startupService.ts   # Todas as operações CRUD e ações sobre startups
```

---

## Estrutura de Pastas

```
src/
├── components/
│   ├── Navbar/                # Barra superior com pesquisa e logout
│   ├── Sidebar/               # Filtros laterais
│   ├── Dashboard/             # Contadores dinâmicos
│   ├── StartupCard/           # Card de cada projeto com ações
│   ├── Modal/                 # Detalhes da startup
│   ├── ModalNovaStartup/      # Formulário de cadastro
│   ├── ModalEditarStartup/    # Formulário de edição
│   ├── Footer/                # Rodapé com identificação
│   └── Login.tsx              # Tela de login
├── services/
│   ├── api.ts                 # Axios configurado com JWT
│   ├── authService.ts         # Serviço de autenticação
│   └── startupService.ts      # Serviço de startups
├── data/
│   └── startups.ts            # Dados iniciais (substituídos pela API)
├── styles/
│   └── global.css             # Estilos personalizados
├── types/
│   └── index.ts               # Interfaces TypeScript
├── App.tsx                    # Estado global da aplicação
└── main.tsx                   # Ponto de entrada
```

---

## Semântica HTML5 utilizada

`<header>` · `<main>` · `<section>` · `<aside>` · `<article>` · `<footer>` · `<address>`

---

## Como rodar

### Pré-requisitos
- Node.js 18+
- Back-end Spring Boot rodando na porta 8080

```bash
npm install
npm run dev
```

Acesse: `http://localhost:5173`

**Login padrão:**
- Email: `admin@incubadora.com`
- Senha: `admin123`

---

## Identificação

**Hemily Ramos**  
Análise e Desenvolvimento de Sistemas — Escola Politécnica e de Artes da PUC Goiás  
Desenvolvimento de Software WEB — Prof. Alexandre Cláudio de Almeida — Junho de 2026
