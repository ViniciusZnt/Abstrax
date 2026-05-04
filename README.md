# Abstrax 
**Gerador de Arte Abstrata**  
*Crie, explore e compartilhe obras de arte únicas através de algoritmos generativos.*

psql -U admin -d abstrax -h localhost -p 5432


---

## Visão Geral
O Abstrax é uma plataforma web que combina arte generativa com ferramentas modernas de desenvolvimento para oferecer:
-  Geração de arte abstrata com parâmetros personalizáveis  
-  Galeria pública para compartilhamento de obras  
-  Sistema de autenticação e perfil de usuário  
-  Painel de controle para gerenciamento de criações  

**Stack Tecnológica**:
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS  
- **Backend**: Go (Echo Framework)  
- **Banco de Dados**: PocketBase (PostgreSQL)  
- **Autenticação**: Supabase Auth  
- **UI**: shadcn/ui, Radix UI  

---

##  Instalação e Configuração

### Pré-requisitos
- [Node.js 18+](https://nodejs.org/)
- [Go 1.20+](https://go.dev/dl/)
- [PocketBase](https://pocketbase.io/) (para banco de dados local)
- [Git](https://git-scm.com/)

---

### Passo 1: Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/abstrax.git
cd abstrax
``

cd frontend

# Instalar dependências
npm install

Passo 5: Executar a Aplicação


Frontend:

cd frontend
npm run build
npm run dev
