# Setup Guide - Budget App v2

## Problem Resolution Documentation

### Issue Encountered
When attempting to run `npm run dev`, the server failed to start because dependencies were not installed (`node_modules` folder was missing).

### Root Cause
The project was cloned/downloaded without running the initial `npm install` command to install all required dependencies from `package.json`.

### Solution Implemented
Created automated startup scripts that:
1. Check if dependencies are installed
2. Automatically run `npm install` if needed
3. Start the development server

---

## Quick Start Options

### Option 1: Automated Scripts (Recommended)

#### For PowerShell:
```powershell
.\start-dev.ps1
```

#### For Command Prompt:
```cmd
start-dev.bat
```

These scripts will:
- ✅ Check for existing dependencies
- ✅ Install dependencies if missing
- ✅ Start the development server automatically
- ✅ Display helpful status messages

### Option 2: Manual Setup

If you prefer manual control:

```bash
# 1. Install dependencies (first time only)
npm install

# 2. Start the development server
npm run dev
```

---

## Initial Setup Checklist

When setting up the project for the first time:

- [ ] Clone/download the repository
- [ ] Navigate to the project directory: `C:\Cursor Automations\budget-app-v2-main`
- [ ] Run one of the startup scripts OR manually run `npm install`
- [ ] Configure environment variables (see `.env.local` section below)
- [ ] Set up Supabase database (see `schema.sql`)
- [ ] Access the app at http://localhost:3000

---

## Environment Variables

Create a `.env.local` file in the root directory with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Anthropic Claude API
ANTHROPIC_API_KEY=your_anthropic_api_key
```

---

## Troubleshooting

### Issue: "Cannot find module" errors
**Solution:** Delete `node_modules` and `package-lock.json`, then run:
```bash
npm install
```

### Issue: Port 3000 already in use
**Solution:** Either stop the existing process or change the port:
```bash
npm run dev -- -p 3001
```

### Issue: PowerShell script won't run (execution policy)
**Solution:** Run this command first (as administrator):
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue: Changes not reflected in browser
**Solution:** Hard refresh the browser (Ctrl+Shift+R) or clear cache

---

## File Structure

```
budget-app-v2-main/
├── start-dev.ps1          # PowerShell startup script
├── start-dev.bat          # Batch startup script
├── package.json           # Project dependencies
├── package-lock.json      # Locked dependency versions
├── node_modules/          # Installed dependencies (auto-generated)
├── .env.local             # Environment variables (create manually)
├── src/                   # Application source code
├── public/                # Static assets
└── README.md              # Project documentation
```

---

## Key Points to Remember

1. **Always run from the correct directory:** `C:\Cursor Automations\budget-app-v2-main`
2. **Dependencies must be installed** before running the dev server
3. **Use the automated scripts** to avoid manual setup issues
4. **Don't commit `node_modules`** - it's already in `.gitignore`
5. **Keep `.env.local` secret** - never commit it to version control

---

## Additional Resources

- Full documentation: See `README.md`
- Database schema: See `schema.sql`
- Sample data: See `sample-data/` directory
- Next.js documentation: https://nextjs.org/docs

---

**Last Updated:** October 23, 2025
**Problem Fixed:** Missing dependencies causing server startup failure


