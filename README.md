# Incubadora de Empresas – Sistema de Gestão de Startups

> Trabalho 2 — React, TypeScript e Bootstrap  
> Disciplina: Desenvolvimento de Software WEB  
> Prof. Alexandre Cláudio de Almeida

---

## Sobre o Projeto

Aplicação web para gerenciamento interno da Incubadora de Empresas da PUC Goiás, desenvolvida com **React + Vite + TypeScript** e **Bootstrap 5 (CDN)**.

O sistema permite acompanhar as startups em cada ciclo da incubadora:
- **Ciclo 1** — Pré-incubação (Ideação)
- **Ciclo 2** — Incubação (Tração)
- **Ciclo 3** — Pós-incubação (Aceleração)

---

## Justificativa da Arquitetura
 
A divisão de componentes seguiu o princípio de que **cada componente faz apenas uma coisa**.
 
| Componente         | O que faz |
|--------------------|-----------|
| `Navbar`           | Exibe a logo, o título e o botão de nova startup. Não precisa saber nada além disso. |
| `Sidebar`          | Exibe os filtros por ciclo. Não conhece as startups, apenas recebe callbacks. |
| `Dashboard`        | Mostra os 6 contadores. Recebe apenas os números via props — só renderiza, não pensa. |
| `StartupCard`      | Representa uma startup individual com os botões de ação disponíveis para o seu status atual. |
| `Modal`            | Exibe os detalhes completos de uma startup selecionada. |
| `ModalNovaStartup` | Formulário para cadastrar uma nova startup no sistema, com escolha do ciclo de entrada. |
| `Footer`           | Exibe a identificação acadêmica com a tag `<address>`. |
| `App`              | Único lugar com estado (`useState`). Calcula os contadores com `useMemo` e passa tudo para baixo via props. |
 
### Fluxo de dados
 
```
App (único estado: startups[])
├── Navbar              ← recebe título + callback para abrir ModalNovaStartup
├── Sidebar             ← recebe filtro ativo + contadores + callbacks
├── Dashboard           ← recebe contadores (só leitura)
├── StartupCard         ← recebe startup + callbacks de ação
│   └── Modal           ← recebe startup selecionada
└── ModalNovaStartup    ← recebe callbacks de salvar e fechar
```

Quando o administrador clica em **"Avançar Ciclo"**, o `StartupCard` chama `onAvancarCiclo(id)` → `App` atualiza o estado → React re-renderiza o `Dashboard` e a lista automaticamente.
 
Quando o administrador clica em **"+ Nova Startup"**, o `Navbar` chama `onNovaStartup()` → `App` abre o `ModalNovaStartup` → ao salvar, a nova startup é adicionada à lista e os contadores atualizam automaticamente.
 
### Por que o estado fica todo no `App.tsx`?
 
Quando uma ação acontece num `StartupCard` (ex: avançar ciclo), os contadores do `Dashboard` precisam atualizar imediatamente. Para isso funcionar, o estado precisa estar num lugar só — o `App.tsx` — e ser passado para os filhos via props. Isso segue o padrão **lifting state up** do React.
 
### Por que `useMemo`?
 
Os contadores e a lista filtrada são recalculados toda vez que o estado muda. Com `useMemo`, o React só refaz esse cálculo quando necessário, evitando processamento desnecessário.
 
### Por que centralizar as interfaces em `types/index.ts`?
 
Com todas as interfaces num arquivo só, qualquer componente que precise de um tipo importa do mesmo lugar. Isso evita duplicação e garante consistência nos dados da aplicação.
 
---
 
## Estrutura de Pastas
 
```
src/
├── components/
│   ├── Navbar/            # Barra superior (<header>) + botão nova startup
│   ├── Sidebar/           # Filtros laterais (<aside>)
│   ├── Dashboard/         # Contadores dinâmicos (<section>)
│   ├── StartupCard/       # Card de cada projeto (<article>)
│   ├── Modal/             # Detalhes da startup
│   ├── ModalNovaStartup/  # Formulário de cadastro de nova startup
│   └── Footer/            # Rodapé com identificação (<address>)
├── data/
│   └── startups.ts        # Dados iniciais das startups
├── styles/
│   └── global.css         # Estilos personalizados
├── types/
│   └── index.ts           # Interfaces TypeScript
├── App.tsx                # Estado global da aplicação
└── main.tsx               # Ponto de entrada
```
 
---
 
## Funcionalidades
 
| Ação | Descrição |
|---|---|
| Adicionar startup | Cadastra uma nova startup escolhendo o ciclo de entrada |
| Filtrar por ciclo | Sidebar filtra as startups por Ciclo 1, 2, 3 ou Desclassificadas |
| Avançar ciclo | Move a startup do ciclo atual para o próximo |
| Registrar relatório | Marca o relatório como enviado |
| Desclassificar | Remove a startup da lista de ativas |
| Ver detalhes | Abre modal com informações completas |
| Dashboard | Contadores atualizam automaticamente a cada ação |
 
---

## Semântica HTML5 utilizada
 
`<header>` · `<main>` · `<section>` · `<aside>` · `<article>` · `<footer>` · `<address>`
 
---
 
## Como rodar
 
```bash
npm install
npm run dev
```
 
Acesse: `http://localhost:5173`
 
---
 
## Identificação
 
**Hemily Ramos**  
Análise e Desenvolvimento de Sistemas — Escola Politécnica e de Artes da PUC Goiás  
Desenvolvimento de Software WEB — Prof. Alexandre Cláudio de Almeida — Abril de 2026
 
