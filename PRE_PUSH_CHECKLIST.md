# Pre-Push Checklist for Indi-Puzzler

Complete this checklist before pushing code to GitHub.

## ✅ Security Checklist

### 1. Environment Files
- [ ] `backend/.env` is NOT in the repository (should be ignored)
- [ ] `backend/.env.example` has NO real credentials
- [ ] `.env.example` files contain only placeholder values
- [ ] All `.env*` files are in `.gitignore`

### 2. API Keys & Secrets
- [ ] No API keys hardcoded in source files
- [ ] No MongoDB connection strings in source files
- [ ] No JWT secrets in source files
- [ ] Check for `GEMINI_API_KEY`, `OPENAI_API_KEY`, `MONGODB_URI`, `JWT_SECRET`

### 3. Credentials & Test Data
- [ ] No test usernames/passwords in code
- [ ] No demo credentials in Login/Register pages
- [ ] No hardcoded admin credentials

### 4. Cache & Build Files
- [ ] `node_modules/` is in `.gitignore`
- [ ] `backend/data/*.json` cache files are in `.gitignore`
- [ ] `dist/` and `build/` folders are in `.gitignore`

### 5. Documentation
- [ ] `README.md` has setup instructions
- [ ] `SETUP.md` explains how to get API keys
- [ ] No sensitive information in documentation

## 🧹 Files to Remove/Check

Run these commands before pushing:

```bash
# Remove sensitive files if they exist
cd Intern-Katapayadi
rm -f backend/.env
rm -f .env

# Check for .env files
find . -name ".env" -not -path "*/node_modules/*"

# Should only show .env.example files
find . -name ".env*" -not -path "*/node_modules/*"

# Check git status
git status

# Files that should NOT appear:
# - backend/.env
# - frontend/.env
# - backend/data/embeddings-cache.json
# - backend/data/processed-documents.json
```

## 📝 Files That SHOULD Be Committed

### Configuration Templates
✅ `backend/.env.example` (with placeholder values)
✅ `.env.example` (with placeholder values)
✅ `.gitignore` (properly configured)
✅ `backend/.gitignore`

### Documentation
✅ `README.md`
✅ `SETUP.md`
✅ `QUICKSTART.md`
✅ `AI_PROVIDER_GUIDE.md`
✅ `AUTHENTICATION_IMPLEMENTATION.md`

### Source Code
✅ All files in `src/`
✅ All files in `backend/src/`
✅ All `package.json` files
✅ TypeScript configs

## 🚫 Files That Should NOT Be Committed

### Secrets & Credentials
❌ `backend/.env` (real API keys)
❌ `.env` (any real environment file)
❌ Any file with `GEMINI_API_KEY=AIza...`
❌ Any file with `MONGODB_URI=mongodb+srv://username:password...`
❌ Any file with real `JWT_SECRET`

### Generated/Cache Files
❌ `node_modules/`
❌ `backend/data/embeddings-cache.json`
❌ `backend/data/processed-documents.json`
❌ `dist/` or `build/` folders
❌ `.vscode/` or `.idea/` folders

## 🔍 Quick Scan Commands

```bash
# Search for API keys in code
grep -r "AIzaSy" . --exclude-dir=node_modules --exclude-dir=.git

# Search for MongoDB connection strings
grep -r "mongodb+srv://" . --exclude-dir=node_modules --exclude-dir=.git --exclude="*.md"

# Search for JWT secrets (excluding examples)
grep -r "JWT_SECRET" . --exclude-dir=node_modules --exclude-dir=.git | grep -v "example" | grep -v ".md"

# All searches should return:
# - Only .env.example files
# - Only documentation (.md files)
# - No actual secrets
```

## 🎯 Final Steps Before Push

1. **Remove .env file:**
   ```bash
   rm backend/.env
   ```

2. **Create .env from example (locally only):**
   ```bash
   cp backend/.env.example backend/.env
   # Then manually add your real API keys
   ```

3. **Verify .gitignore:**
   ```bash
   cat .gitignore | grep ".env"
   # Should show: .env*
   ```

4. **Check git status:**
   ```bash
   git status
   # Should NOT show: backend/.env
   ```

5. **Stage all changes:**
   ```bash
   git add .
   ```

6. **Check what will be committed:**
   ```bash
   git status
   # Verify no .env files are staged
   ```

7. **Commit:**
   ```bash
   git commit -m "feat: Add multiplayer quiz system with real-time sync"
   ```

8. **Push:**
   ```bash
   git push origin master
   ```

## ⚠️ If You Accidentally Commit Secrets

If you accidentally committed API keys or passwords:

```bash
# Remove file from Git history (for last commit)
git rm --cached backend/.env
git commit --amend -m "Remove sensitive file"
git push --force

# For older commits, use git filter-branch or BFG Repo-Cleaner
# IMPORTANT: Rotate all exposed API keys immediately!
```

### Rotate Compromised Keys:
1. **Gemini API Key:** Delete and create new at https://aistudio.google.com/app/apikey
2. **MongoDB:** Change password in Atlas dashboard
3. **JWT Secret:** Generate new random string

## ✨ Clean Repository Checklist

Before declaring the repo ready:

- [ ] No `.env` files committed
- [ ] All `.env.example` files have placeholders only
- [ ] `.gitignore` properly configured
- [ ] No hardcoded credentials in source code
- [ ] No test passwords in UI
- [ ] Documentation explains setup process
- [ ] `SETUP.md` has clear instructions for getting API keys
- [ ] Cache files (`embeddings-cache.json`) are ignored
- [ ] No `node_modules/` committed

## 📚 Resources

- [GitHub: Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [Git Secrets Scanning](https://github.com/awslabs/git-secrets)
- [How to rotate API keys](https://cloud.google.com/docs/authentication/api-keys#securing_an_api_key)

---

**Remember:** Once secrets are pushed to GitHub, consider them compromised and rotate immediately!
