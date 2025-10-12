# 📝 Minhas Notas - App de Notas e Checklists

Um aplicativo web moderno e intuitivo para organizar suas ideias, tarefas e projetos com categorias personalizáveis.

🔗 **[Acessar o App](https://notas-checklist-app.vercel.app)**

## ✨ Funcionalidades

- 📂 **Categorias Personalizáveis** - Organize suas notas com emojis e cores
- 📝 **Notas de Texto** - Escreva notas livres com formatação
- ✅ **Checklists** - Crie listas de tarefas marcáveis
- 🔄 **Notas Mistas** - Combine texto e checklist na mesma nota
- 🔍 **Busca e Filtros** - Encontre suas notas rapidamente por título ou conteúdo
- 🎯 **Prioridades** - Marque notas como alta, média ou baixa prioridade
- 📦 **Arquivamento** - Arquive notas sem deletá-las
- 🔀 **Reordenação** - Mova notas para cima ou para baixo
- 📋 **Duplicar Notas** - Copie notas existentes rapidamente
- 📤 **Exportar/Importar** - Faça backup dos seus dados em JSON
- 🌙 **Modo Escuro** - Alterne entre tema claro e escuro
- 📱 **Responsivo** - Funciona perfeitamente em celular, tablet e desktop
- 💾 **Salvamento Automático** - Seus dados ficam salvos no navegador
- 📅 **Datas** - Visualize quando a nota foi criada e modificada

## 🎨 Paleta de Cores

- **#604D53** (Wenge) - Textos principais e botões secundários
- **#3C6E71** (Caribbean Current) - Abas ativas e ações principais
- **#FFFFFF** (White) - Fundo dos containers e cards
- **#D9D9D9** (Platinum) - Fundo geral e elementos secundários
- **#EF2917** (Off Red) - Botões de ação e alertas

## 🚀 Tecnologias

- [Next.js 14](https://nextjs.org/) - Framework React para produção
- [React 18](https://react.dev/) - Biblioteca JavaScript para interfaces
- [Tailwind CSS 3](https://tailwindcss.com/) - Framework de estilização utility-first
- [Lucide React](https://lucide.dev/) - Biblioteca de ícones moderna
- [Vercel](https://vercel.com/) - Plataforma de hospedagem e deploy

## 💻 Como Executar Localmente

### Pré-requisitos

- Node.js 16+ instalado
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/Notas-Checklist-App.git

# Entre na pasta do projeto
cd Notas-Checklist-App

# Instale as dependências
npm install
# ou
yarn install
```

### Desenvolvimento

```bash
# Execute o servidor de desenvolvimento
npm run dev
# ou
yarn dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador para ver o aplicativo rodando.

O servidor recarrega automaticamente quando você faz alterações nos arquivos.

## 📦 Build para Produção

```bash
# Gerar build otimizado
npm run build

# Iniciar servidor de produção
npm start
```

## 📁 Estrutura do Projeto

```
Notas-Checklist-App/
├── pages/
│   ├── _app.js          # Configuração global do app
│   └── index.js         # Página principal do aplicativo
├── styles/
│   └── globals.css      # Estilos globais e Tailwind
├── public/              # Arquivos estáticos
├── package.json         # Dependências e scripts
├── next.config.js       # Configuração do Next.js
├── tailwind.config.js   # Configuração do Tailwind CSS
├── postcss.config.js    # Configuração do PostCSS
└── README.md            # Este arquivo
```

## 🎯 Como Usar

1. **Criar uma Categoria**: Clique em "Nova Categoria", escolha um emoji, cor e nome
2. **Adicionar Nota**: Selecione uma categoria e clique em "Nova Nota"
3. **Escolher Tipo**: Defina se será texto, checklist ou ambos
4. **Definir Prioridade**: Marque a importância da nota
5. **Visualizar**: Clique na nota para ver detalhes e marcar checkboxes
6. **Editar**: Use o botão "Editar" para modificar a nota
7. **Organizar**: Use as setas ↑↓ para reordenar suas notas
8. **Arquivar**: Mova notas concluídas para o arquivo
9. **Backup**: Exporte seus dados periodicamente

## 🔐 Privacidade

Todos os dados são armazenados localmente no navegador (localStorage). Nenhuma informação é enviada para servidores externos. Seus dados são privados e permanecem apenas no seu dispositivo.

## 🐛 Encontrou um Bug?

Se você encontrar algum problema, por favor [abra uma issue](https://github.com/seu-usuario/Notas-Checklist-App/issues) descrevendo:
- O que aconteceu
- O que você esperava que acontecesse
- Passos para reproduzir o problema
- Screenshots (se aplicável)

## 🤝 Contribuindo

Contribuições são muito bem-vindas! Se você quer melhorar este projeto:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👤 Autor

Desenvolvido por **Jhana & Claude**

- GitHub: [@Jhana-Sardinha](https://github.com/Jhana-Sardinha)
- LinkedIn: [Jhanaína Sardinha](https://www.linkedin.com/in/jhana%C3%ADna-sardinha-4baa84289/)

## ⭐ Mostre seu Apoio

Se este projeto foi útil para você, considere dar uma ⭐ no repositório!

---

**Desenvolvido com ❤️ usando React e Next.js**
