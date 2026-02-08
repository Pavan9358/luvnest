# Quick Reference Guide - Love Page Builder

## 🚀 Quick Start Commands

### Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Server will run at: http://localhost:8080/

# Run in watch mode with auto-reload
npm run dev
```

### Testing
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Check TypeScript errors
npx tsc --noEmit

# Run linter
npm run lint
```

### Building
```bash
# Build for production
npm run build

# Build for development (with source maps)
npm run build:dev

# Preview production build locally
npm run preview
```

---

## 📁 Project Structure

```
love-page-builder/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── auth/         # Authentication components
│   │   ├── builder/      # Page builder components
│   │   ├── effects/      # Visual effects (hearts, confetti, etc.)
│   │   ├── layout/       # Layout components (Header, Footer)
│   │   ├── sharing/      # Share dialog and QR code
│   │   ├── ui/           # shadcn/ui components
│   │   └── viewer/       # Love page viewer components
│   ├── pages/            # Route pages
│   │   ├── Index.tsx     # Landing page
│   │   ├── Login.tsx     # Login page
│   │   ├── Dashboard.tsx # User dashboard
│   │   ├── CreatePage.tsx # Page builder
│   │   └── ...
│   ├── hooks/            # Custom React hooks
│   ├── contexts/         # React contexts (Theme, etc.)
│   ├── integrations/     # Supabase integration
│   ├── lib/              # Utility functions
│   └── types/            # TypeScript type definitions
├── supabase/
│   ├── functions/        # Edge functions
│   └── migrations/       # Database migrations
├── public/               # Static assets
└── dist/                 # Production build (generated)
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="your-publishable-key"
VITE_SUPABASE_URL="https://your-project.supabase.co"
```

---

## 🎨 Key Features

### User Features
- ✨ Create personalized love pages
- 💌 AI-powered love letter generation
- 📖 Comic-style story generation
- 🎵 YouTube music integration
- 📸 Photo gallery with drag-and-drop
- ⏰ Countdown timer
- 🎨 Multiple themes
- 🔒 Privacy settings
- 📱 QR code sharing
- 💳 Credit/wallet system

### Technical Features
- ⚡ Vite for fast development
- 🎯 TypeScript for type safety
- 🎨 Tailwind CSS for styling
- 🔐 Supabase for backend
- 🎭 Framer Motion for animations
- 📱 PWA support
- 🌓 Dark/Light theme toggle

---

## 🛠️ Common Tasks

### Adding a New Page
1. Create component in `src/pages/YourPage.tsx`
2. Add route in `src/App.tsx`
3. Update navigation in `src/components/layout/Header.tsx`

### Adding a New Component
1. Create component in appropriate `src/components/` subdirectory
2. Export from component file
3. Import where needed

### Updating Database Schema
1. Create migration in `supabase/migrations/`
2. Apply migration via Supabase dashboard or CLI
3. Update TypeScript types in `src/integrations/supabase/types.ts`

### Adding a New Hook
1. Create hook in `src/hooks/useYourHook.ts`
2. Follow React hooks naming convention (`use*`)
3. Export and import where needed

---

## 🐛 Troubleshooting

### Development Server Won't Start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Build Errors
```bash
# Check TypeScript errors
npx tsc --noEmit

# Check for linting issues
npm run lint
```

### Supabase Connection Issues
1. Verify `.env` file exists and has correct values
2. Check Supabase project is active
3. Verify API keys are valid
4. Check network connection

### Hot Reload Not Working
1. Restart dev server
2. Clear browser cache
3. Check file watchers limit (Linux/Mac):
   ```bash
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

---

## 📦 Deployment

### Deploy to Lovable (Recommended)
1. Open [Lovable Dashboard](https://lovable.dev)
2. Navigate to your project
3. Click Share → Publish
4. Follow deployment wizard

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Deploy to Netlify
```bash
# Build the project
npm run build

# Deploy dist folder via Netlify CLI or drag-and-drop
```

---

## 🔒 Security Best Practices

1. **Never commit `.env` file** - It's in `.gitignore`
2. **Use environment variables** for all secrets
3. **Enable RLS** on all Supabase tables
4. **Validate user input** with Zod schemas
5. **Keep dependencies updated** regularly

---

## 📚 Useful Resources

### Documentation
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Vite Guide](https://vitejs.dev/guide/)

### Tools
- [Supabase Dashboard](https://app.supabase.com)
- [Lovable Platform](https://lovable.dev)

---

## 🤝 Contributing

### Code Style
- Use TypeScript for all new files
- Follow existing naming conventions
- Add comments for complex logic
- Keep components small and focused
- Use functional components with hooks

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "feat: add your feature"

# Push to remote
git push origin feature/your-feature

# Create pull request
```

---

## 📊 Performance Tips

1. **Lazy load routes** for faster initial load
2. **Optimize images** before uploading
3. **Use React.memo** for expensive components
4. **Implement virtual scrolling** for long lists
5. **Monitor bundle size** with `npm run build`

---

## 🎯 Next Steps

After testing is complete:

1. ✅ Review test report (`TEST_REPORT.md`)
2. 🚀 Deploy to production
3. 📊 Set up analytics
4. 🔍 Monitor error logs
5. 📝 Gather user feedback
6. 🔄 Iterate and improve

---

**Last Updated:** February 5, 2026  
**Version:** 1.0.0
