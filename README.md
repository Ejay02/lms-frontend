# Frontend - Vue.js 3 Application

## Overview

This is the frontend of the school management system, built using Vue.js 3 and TailwindCSs. It provides a user-friendly interface for instructor, teacher, admin to interact with the system.

## Features

- Authentication with access and refresh tokens
- Role-based dashboard for Admin, Instructor, Student
- Interactive course management for LMS

## Live Demo

[DEMO](https://ej-lms.netlify.app)

** Note: Since its hosted on the free tier, you might need to wait a bit for it to spin up since they tend to go to sleep.

## Technologies Used

- **Vue.js 3** - Frontend framework
- **Pinia** - State management
- **Axios** - HTTP client
- **Tailwind CSS** - Styling framework
- **Vue Router** - Client-side routing

## Project Setup

### Prerequisites

Ensure you have the following installed:

- Node.js (>= 16.x)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Ejay02/lms-frontend.git
cd frontend

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root and configure the following:

```
VITE_API_URL=<backend-api-url>
VITE_APP_GOOGLE_CLIENT_ID=<your-stripe-client-id>
VITE_APP_GOOGLE_CLIENT_SECRET=<your-stripe-client-secret>
VITE_APP_GOOGLE_CLIENT_REDIRECT_URI=<your-stripe-client-redirect-uri>
```

### Running the Project

```bash
# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173/`.

### Building for Production

```bash
npm run build
```

The built files will be located in the `dist/` directory.

## Contributing

1. Fork the repository.
2. Create a new branch (`feature/your-feature`).
3. Commit your changes.
4. Push to your branch and create a Pull Request.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## 👥 Author

- Initial work - [Ej](https://github.com/Ejay02/lms-backend.git)
