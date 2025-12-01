# 🔗 Configurar Git Remote e Push

## ✅ Commit Realizado!

O commit inicial foi feito com sucesso:
```
21157f8 Initial commit: TDash MedUp - Sistema completo com Docker e Coolify
```

## 📤 Para fazer Push

### Opção 1: GitHub

```bash
# Adicionar remote
git remote add origin https://github.com/SEU_USUARIO/tdash-medup.git

# Fazer push
git push -u origin main
```

### Opção 2: GitLab

```bash
# Adicionar remote
git remote add origin https://gitlab.com/SEU_USUARIO/tdash-medup.git

# Fazer push
git push -u origin main
```

### Opção 3: Bitbucket

```bash
# Adicionar remote
git remote add origin https://bitbucket.org/SEU_USUARIO/tdash-medup.git

# Fazer push
git push -u origin main
```

## 🔧 Se já tiver um repositório remoto

```bash
# Verificar remote atual
git remote -v

# Se precisar alterar
git remote set-url origin https://github.com/SEU_USUARIO/tdash-medup.git

# Fazer push
git push -u origin main
```

## 📋 Próximos Passos

1. Crie um repositório no GitHub/GitLab/Bitbucket
2. Copie a URL do repositório
3. Execute os comandos acima
4. Conecte no Coolify usando a URL do repositório

## ⚠️ Importante

- Não commite o arquivo `.env` (já está no .gitignore)
- Use variáveis de ambiente no Coolify para dados sensíveis
- O arquivo `.env.example` pode ser commitado como template

