# TikTok Clone (Expo + Clerk + AWS + Supabase)
Este projeto é um clone do TikTok desenvolvido com React Native (Expo) com o objetivo de aprofundar conhecimentos em arquitetura mobile moderna e integração com serviços cloud.

## Objetivo
O principal objetivo deste projeto é evoluir habilidades em:

- Integração com AWS (armazenamento de vídeos e thumbnails)
- Autenticação com Clerk
- Gerenciamento de dados com Supabase
- Estruturação de projetos escaláveis no React Native

## Arquitetura
O projeto utiliza:

- Expo Router (file-based routing) para navegação
- Arquitetura modular baseada em separação de responsabilidades

### Estrutura principal:

```bash
app/
 ├── (tabs)/        # Navegação principal (home, explore, etc)
 ├── (protected)/   # Rotas protegidas por autenticação
 ├── login.tsx      # Tela de login
 ├── _layout.tsx    # Layout global

components/         # Componentes reutilizáveis
hooks/              # Hooks customizados
lib/                # Integrações (API, AWS, Supabase, Clerk)
constants/          # Constantes globais
assets/             # Recursos estáticos

## Autenticação
- Gerenciada via Clerk
- Rotas protegidas organizadas dentro de (protected)

## Backend e Serviços
- AWS S3 para armazenamento de vídeos e thumbnails
- Supabase para dados de usuário e configurações
- Clerk para autenticação e gerenciamento de usuários

## Aprendizados
Este projeto foca em:
- Estruturação de apps escaláveis
- Separação entre UI, lógica e serviços
- Preparação para evolução futura para um padrão mais robusto (como MVC ou Clean Architecture)

## Próximos passos
- Refatorar para um padrão mais próximo de MVC ou Clean Architecture
- Separar camada de serviços (API) do front-end
- Implementar cache e otimizações de performance
- Melhorar gerenciamento de estado