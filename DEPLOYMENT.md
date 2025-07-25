# Deployment Guide for Kiwify Mortgage Simulator

## ✅ Netlify Deployment

This application is configured for easy deployment on Netlify with all necessary configurations in place.

### Prerequisites
1. Supabase project configured with the database schema (see `supabase-schema.sql`)
2. Environment variables properly set

### Deployment Steps

#### Option 1: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

#### Option 2: Git Integration
1. Push code to GitHub/GitLab/Bitbucket
2. Connect repository to Netlify
3. Netlify will automatically use the `netlify.toml` configuration

### Environment Variables
Set these variables in Netlify dashboard (Site settings → Environment variables):

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Build Settings
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18

## 📦 Dependencies

### Production Dependencies
All runtime dependencies have been moved to `dependencies` section:
- React & React DOM
- Supabase client
- PDF generation libraries (jsPDF, html2canvas)
- Signature canvas component

### Development Dependencies
Build tools, TypeScript, linting, and Tailwind CSS are in `devDependencies`.

## 🔧 Configuration Files

### `netlify.toml`
- Build configuration
- SPA routing support
- Security headers
- Cache optimization

### `public/_redirects`
- Backup SPA routing configuration
- Ensures all routes serve index.html

## 🚀 Performance

### Build Output
- Optimized bundle with Vite
- CSS extracted and minified
- Assets with proper caching headers

### Mobile Optimization
- Appropriate `inputMode` attributes for mobile keyboards
- Responsive design
- Touch-friendly interfaces

## 🔒 Security Features

### Headers
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection enabled
- Referrer-Policy: strict-origin-when-cross-origin

### Supabase
- Row Level Security enabled
- Secure file storage configuration
- Environment variable based configuration

## 🎯 Features Implemented

### ✅ Admin Panel
- View all financing proposals
- Access signed PDFs
- Mobile-responsive interface
- Real-time data from Supabase

### ✅ Input Masks & Validation
- Brazilian Real currency formatting
- CPF with proper validation
- Brazilian phone number formatting
- Mobile keyboard optimization

### ✅ Mobile Experience
- `inputMode` attributes for appropriate keyboards
- `autoComplete` for better UX
- `autoCapitalize` for name fields
- Responsive design

## 📱 Mobile Keyboard Types

| Field Type | inputMode | autoComplete | autoCapitalize |
|------------|-----------|--------------|----------------|
| Currency   | numeric   | -            | -              |
| Name       | text      | name         | words          |
| CPF        | numeric   | off          | -              |
| Email      | email     | email        | none           |
| Phone      | numeric   | tel          | -              |

## 🔍 Testing

### Build Verification
```bash
npm run build
npm run preview
```

### Production Test
1. Deploy to Netlify
2. Test all form steps
3. Verify admin panel functionality
4. Test PDF generation and signing
5. Verify mobile experience

## 📋 Post-Deployment Checklist

- [ ] Environment variables configured
- [ ] Supabase database schema applied
- [ ] Supabase storage bucket created
- [ ] SSL certificate active
- [ ] Mobile keyboard types working
- [ ] Admin panel accessible
- [ ] PDF generation working
- [ ] Signature capture functional
- [ ] All form validations working
- [ ] Email/phone formatting correct

## 🐛 Troubleshooting

### Common Issues

1. **Build fails on TypeScript**
   - Ensure all dependencies are properly typed
   - Check for unused variables

2. **Supabase connection issues**
   - Verify environment variables
   - Check network policies

3. **PDF generation fails**
   - Ensure html2canvas and jsPDF are in dependencies
   - Check browser compatibility

4. **Mobile keyboard not showing**
   - Verify `inputMode` attributes are set
   - Test on actual mobile devices

## 🔄 Updates

To update the application:
1. Make changes to the code
2. Test locally with `npm run dev`
3. Build and test with `npm run build && npm run preview`
4. Deploy via git push (if using Git integration) or Netlify CLI