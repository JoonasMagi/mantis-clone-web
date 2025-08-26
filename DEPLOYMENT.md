# Deployment Guide

This document provides instructions for deploying the Mantis Clone Web frontend.

## Prerequisites

- Node.js 16+ installed
- Backend API server deployed and accessible
- Web server (nginx, Apache, or similar) for production deployment

## Environment Configuration

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Update the `.env` file with your production API URL:
```
VITE_API_BASE_URL=https://your-api-domain.com
VITE_APP_NAME=Mantis Clone
VITE_APP_VERSION=1.0.0
```

## Building for Production

1. Install dependencies:
```bash
npm install
```

2. Build the application:
```bash
npm run build
```

This creates a `dist` folder with the production-ready files.

## Deployment Options

### Option 1: Static File Server

Deploy the contents of the `dist` folder to any static file server:

- Upload all files from `dist/` to your web server's document root
- Configure your web server to serve `index.html` for all routes (for client-side routing)

### Option 2: Nginx Configuration

Example nginx configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Option 3: Apache Configuration

Example Apache configuration (.htaccess):

```apache
RewriteEngine On
RewriteBase /

# Handle client-side routing
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Cache static assets
<FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 year"
</FilesMatch>
```

## Verification

After deployment:

1. Access your domain in a web browser
2. Verify the application loads correctly
3. Test user registration and login
4. Ensure API calls work with your backend server
5. Test all major features (issues, labels, milestones)

## Troubleshooting

### Common Issues

1. **Blank page**: Check browser console for errors, verify API URL in .env
2. **API errors**: Ensure backend server is running and accessible
3. **Routing issues**: Verify web server is configured for client-side routing
4. **CORS errors**: Configure backend to allow requests from your frontend domain

### Health Check

The application should:
- Load the login page for unauthenticated users
- Redirect to dashboard after successful login
- Display proper error messages for failed API calls
- Handle network errors gracefully

## Security Considerations

- Ensure HTTPS is enabled in production
- Configure proper CORS settings on the backend
- Set appropriate security headers
- Regularly update dependencies for security patches
