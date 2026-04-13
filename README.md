# TikTok Clone (Expo + Clerk + AWS + Supabase)

Este projeto consiste em um clone do TikTok desenvolvido com React Native (Expo), com foco no aprimoramento de práticas modernas de arquitetura mobile e integração com serviços em nuvem.

## Referência

https://www.youtube.com/watch?v=L2tz0WAfQIU

## Objetivo

O projeto tem como objetivo desenvolver experiência em:

- Integração com AWS para armazenamento de vídeos e thumbnails
- Autenticação utilizando Clerk
- Gerenciamento de dados com Supabase
- Organização de projetos escaláveis em React Native

## Arquitetura

A aplicação utiliza:

- Expo Router (file-based routing) para navegação
- Estrutura modular com separação de responsabilidades

### Estrutura principal

```
app/
 ├── (tabs)/# Navegação principal (home, explore, etc)
 ├── (protected)/# Rotas protegidas por autenticação
 ├── login.tsx# Tela de login
 ├── _layout.tsx# Layout global

components/# Componentes reutilizáveis
hooks/# Hooks customizados
lib/# Integrações (API, AWS, Supabase, Clerk)
constants/# Constantes globais
assets/# Recursos estáticos
```

## Autenticação

A autenticação é gerenciada pelo Clerk, com rotas protegidas organizadas no diretório `(protected)`.

## Backend e serviços

- AWS S3 para armazenamento de vídeos e thumbnails
- Supabase para persistência de dados de usuários e configurações
- Clerk para autenticação e gerenciamento de usuários

## Decisões de implementação

Durante o desenvolvimento, optei por:

- Organizar as rotas com base no nível de acesso (público e protegido)
- Utilizar layouts específicos por grupo de páginas
- Padronizar nomes de arquivos em minúsculo
- Nomear funções com inicial maiúscula
- Identificar telas de visualização com o sufixo `Screen`

Essas escolhas diferem do padrão apresentado no vídeo utilizado como referência, mas foram adotadas para melhorar a organização e a clareza do projeto.

## Aprendizados

Este projeto contribuiu para:

- Melhor entendimento de estruturação de aplicações escaláveis
- Separação entre interface, lógica e integrações externas
- Preparação para adoção futura de padrões como MVC ou Clean Architecture

## Próximos passos(Assim que possivel)

- Evoluir a arquitetura para um padrão mais estruturado (MVC ou Clean Architecture)
- Separar de forma mais clara a camada de serviços (API)
- Implementar estratégias de cache e otimização de performance
- Melhorar o gerenciamento de estado
