# World-Class Portfolio CMS

A futuristic, full-stack portfolio application with a built-in CMS.

## Features
- **Dark Futuristic UI**: Built with Tailwind CSS and Framer Motion.
- **Dynamic Content**: Manage your profile, education, experience, and projects via the Admin Panel.
- **Image Hosting**: Integrated Cloudinary support for avatars, logos, and project images.
- **Secure Auth**: JWT-based authentication with access and refresh tokens.
- **Responsive**: Mobile-first design that looks great on all devices.

## Tech Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, TypeScript, MongoDB, Mongoose
- **Storage**: Cloudinary, Multer
- **Auth**: JWT, BcryptJS

## Prerequisites
- Node.js installed
- MongoDB installed locally or a MongoDB Atlas URI
- Cloudinary account for image hosting

## Getting Started

### 1. Clone and Install Dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

Create `.env` files in both `server/` and `client/` directories.

**server/.env**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:3000
```

**client/.env**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed Default Admin
Run the seeder to create the initial superadmin account.
```bash
npm run seed
```
**Default Credentials:**
- **Email**: `admin@portfolio.com`
- **Password**: `Admin@123456`

### 4. Run Development Server
From the root directory:
```bash
npm run dev
```
The server will run on `http://localhost:5000` and the client on `http://localhost:3000`.

## Adding New Sections
To add a new section (e.g., Blog):
1. Create a Mongoose model in `server/src/models/`.
2. Create a controller in `server/src/controllers/`.
3. Create routes in `server/src/routes/` and register them in `server/src/index.ts`.
4. Create a React component in `client/src/components/sections/`.
5. Create an admin page in `client/src/pages/admin/`.
6. Add the route to `client/src/App.tsx`.

## License
MIT
