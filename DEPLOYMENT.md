# Netlify Deployment Guide

## Prerequisites

1. **MongoDB Atlas Account** (Free tier available)
   - Go to https://www.mongodb.com/cloud/atlas
   - Create a free account
   - Create a new cluster (free M0 tier)
   - Create a database user
   - Whitelist all IPs (0.0.0.0/0) for Netlify access
   - Get your connection string

2. **Netlify Account**
   - Sign up at https://www.netlify.com
   - Connect your GitHub account

## Step 1: Set up MongoDB Atlas

1. Visit https://www.mongodb.com/cloud/atlas
2. Click "Sign Up" or "Try Free"
3. Create a new project
4. Build a cluster (choose FREE M0 tier)
5. Create a database user:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose password authentication
   - Save username and password
6. Whitelist IP addresses:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm
7. Get connection string:
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `payable`

Example connection string:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/payable?retryWrites=true&w=majority
```

## Step 2: Deploy to Netlify

### Option A: Deploy via Netlify Website (Easiest)

1. Push your code to GitHub (already done)
2. Go to https://app.netlify.com
3. Click "Add new site" → "Import an existing project"
4. Choose "GitHub" and authorize Netlify
5. Select your repository: `payable`
6. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Functions directory:** `netlify/functions`
7. Click "Show advanced" → "New variable"
   - Add environment variable:
     - **Key:** `MONGODB_URI`
     - **Value:** Your MongoDB connection string from Step 1
8. Click "Deploy site"

### Option B: Deploy via Netlify CLI

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Initialize site:
   ```bash
   netlify init
   ```
   - Choose "Create & configure a new site"
   - Choose your team
   - Enter site name (or leave blank for random)

4. Set environment variable:
   ```bash
   netlify env:set MONGODB_URI "your-mongodb-connection-string"
   ```

5. Deploy:
   ```bash
   netlify deploy --prod
   ```

## Step 3: Verify Deployment

1. Visit your Netlify site URL (e.g., https://your-site.netlify.app)
2. Try logging in with test accounts:
   - Admin: `admin@company.com`
   - Viewer: `viewer@company.com`
   - Creator: `creator@company.com`
   - Payer: `payer@company.com`
3. Test creating expenses, categories, and user requests

## Troubleshooting

### Functions not working
- Check Netlify function logs in the dashboard
- Verify MONGODB_URI is set correctly
- Make sure MongoDB cluster allows connections from anywhere (0.0.0.0/0)

### Database connection errors
- Double-check your MongoDB connection string
- Ensure password doesn't contain special characters (or URL-encode them)
- Verify network access settings in MongoDB Atlas

### Build failures
- Check build logs in Netlify dashboard
- Ensure all dependencies are in package.json
- Try deploying again

## Environment Variables

Required environment variable:
- `MONGODB_URI` - MongoDB connection string

## Automatic Deployments

Once connected to GitHub, Netlify will automatically deploy:
- When you push to the `main` branch
- When you merge pull requests

## Custom Domain (Optional)

1. Go to your site settings in Netlify
2. Click "Domain management"
3. Click "Add custom domain"
4. Follow the instructions to configure your DNS

## Support

- Netlify Docs: https://docs.netlify.com
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- GitHub Issues: https://github.com/BobJunior-hub/payable/issues

