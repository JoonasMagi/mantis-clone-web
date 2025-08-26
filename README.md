# Mantis Clone Web

A modern web frontend for the Mantis Clone issue tracking system, built with React and Vite.

## Features

- **User Authentication**: Secure login and registration system
- **Issue Management**: Create, view, edit, and delete issues
- **Comments System**: Add and manage comments on issues
- **Labels Management**: Create and organize issues with custom labels
- **Milestones**: Track progress with milestone management
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Dynamic interface with proper error handling

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager
- Mantis Clone API server running (see backend repository)

## Installation

Install dependencies:
```bash
npm install
```

Create environment configuration:
```bash
cp .env.example .env
```

Update the `.env` file with your API server URL:
```
VITE_API_BASE_URL=http://localhost:3000
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Usage

### Getting Started

1. Start the backend API server
2. Start the frontend development server
3. Open your browser to `http://localhost:5173`
4. Register a new account or login with existing credentials

### Main Features

- **Dashboard**: Overview of issues, labels, and milestones
- **Issues**: Create, filter, and manage issues
- **Labels**: Organize issues with color-coded labels
- **Milestones**: Track project progress with milestones

### API Integration

The frontend communicates with the Mantis Clone API server. Ensure the API server is running and accessible at the URL specified in your `.env` file.

## Project Structure

```
src/
├── components/          # React components
│   ├── Auth/           # Authentication components
│   ├── Dashboard/      # Dashboard components
│   ├── Issues/         # Issue management components
│   ├── Labels/         # Label management components
│   ├── Milestones/     # Milestone management components
│   └── Layout/         # Layout components
├── contexts/           # React contexts
├── services/           # API service functions
└── utils/              # Utility functions
```

## Technologies Used

- **React 19**: Frontend framework
- **Vite**: Build tool and development server
- **React Router**: Client-side routing
- **React Hook Form**: Form handling and validation
- **Axios**: HTTP client for API requests
- **CSS Modules**: Component-scoped styling

## Contributing

1. Follow the existing code style and patterns
2. Ensure all forms have proper validation
3. Add error handling for all API calls
4. Test the application thoroughly before submitting changes

## License

This project is part of the Mantis Clone system.
