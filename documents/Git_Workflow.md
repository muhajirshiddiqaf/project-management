# Git Workflow & Branching Strategy

## 🌿 Branch Structure

### Main Branches
- **`main`**: Production-ready code
- **`develop`**: Integration branch for features

### Feature Branches
- **`feature/phase1-infrastructure`**: Phase 1 development
- **`feature/phase2-backend`**: Backend development
- **`feature/phase3-frontend`**: Frontend development
- **`feature/phase4-integration`**: Integration & testing
- **`feature/phase5-deployment`**: Deployment & documentation

### Hotfix Branches
- **`hotfix/critical-bug`**: Critical production fixes

## 🔄 Workflow

### Development Flow
1. **Create feature branch** from `develop`
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/phase1-infrastructure
   ```

2. **Develop and commit** on feature branch
   ```bash
   git add .
   git commit -m "feat: implement task 1.1.1"
   ```

3. **Push feature branch** to remote
   ```bash
   git push origin feature/phase1-infrastructure
   ```

4. **Create Pull Request** to `develop`
   - Review code
   - Run tests
   - Merge to `develop`

5. **Merge to main** when ready for production
   ```bash
   git checkout main
   git merge develop
   git push origin main
   ```

### Commit Message Convention
```
type(scope): description

feat: new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: adding tests
chore: maintenance tasks
```

### Examples
- `feat(auth): implement JWT authentication`
- `fix(api): resolve user registration bug`
- `docs(readme): update installation guide`
- `refactor(database): optimize query performance`

## 📋 Branch Protection Rules

### Main Branch
- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date
- Restrict pushes to main branch

### Develop Branch
- Require pull request reviews
- Require status checks to pass
- Allow force pushes for maintainers

## 🚀 Release Strategy

### Versioning
- **Major.Minor.Patch** (e.g., 1.0.0)
- **Major**: Breaking changes
- **Minor**: New features
- **Patch**: Bug fixes

### Release Process
1. Create release branch from `develop`
2. Update version numbers
3. Create pull request to `main`
4. Merge and tag release
5. Deploy to production

## 📝 Current Status

### Active Branches
- ✅ `main` - Production branch
- ✅ `develop` - Development integration
- ✅ `feature/phase1-infrastructure` - Phase 1 development

### Next Steps
1. Complete Phase 1 tasks on `feature/phase1-infrastructure`
2. Create pull request to `develop`
3. Merge and continue with Phase 2

---

**Last Updated**: [Tanggal saat ini]
**Next Review**: [Tanggal + 1 minggu] 