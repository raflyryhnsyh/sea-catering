# SEA Catering - Web Application

## Description

**SEA Catering** is a modern daily catering service that offers a variety of healthy, delicious, and nutritious meal packages tailored to the customer's needs. This service is designed to simplify the process of fulfilling daily meal requirements, whether for individuals, families, or corporate clients.

SEA Catering is built on a subscription-based model with flexible features, such as meal type selection, delivery days, and subscription pause options. Its digital system allows users to order, manage, and track their subscriptions directly through a web application, providing a practical, transparent, and personalized catering experience.

## Features

### 🏠 Home Page
**Landing Page & Hero Section**  
Creates a strong first impression and introduces users to who we are and what we do.

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/1b84a8c4-9bcc-4d4e-a8f5-cbdd1fa7e003" alt="Home Screen" width="200"/>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/ab38b18e-7de6-412f-a359-07534159d1d8" alt="Home Screen" width="200"/>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/6f3d4e8e-9340-4bd0-b7c9-80255639aea3" alt="Home Screen" width="200"/>
    </td>
  </tr>
</table>

### 👤 Regular Users

#### 🔐 User Authentication & Authorization  
Login/register via email with secure form validation.

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/d6ce8267-6351-48ec-9cc2-79b6552689b1" alt="Login Screen" width="200"/>
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/ee42b67e-fdb5-48eb-af48-a80311a84f72" alt="Register Screen" width="200"/>
    </td>
  </tr>
</table>

#### 🍽️ Menu & Meal Plans  
Browse healthy meal packages with nutritional and pricing details.

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/485f9df1-8943-46b6-9907-daae2b97666f" alt="Menu Screen" width="200"/>
    </td>
  </tr>
</table>

#### 📝 Add Testimonial  
Submit reviews and ratings about the catering service.

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/af87ffe7-613e-49af-94a5-644b9c927b09" alt="Testimonial Screen" width="200"/>
    </td>
  </tr>
</table>

#### 📆 User Subscription  
Select meal plans, delivery days, and enter personal info with full validation.

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/6d1b0eb9-f78f-4499-855e-663791877e33" alt="Subscription Screen" width="200"/>
    </td>
  </tr>
</table>

#### 📞 Contact Us  
Get in touch with the SEA Catering team.

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/6fa453b3-6cc5-40fd-81e4-b7cc561c09fd" alt="Contact Screen" width="200"/>
    </td>
  </tr>
</table>

#### 📊 User Dashboard  
Manage active subscriptions flexibly through a user dashboard.

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/d5fd5455-4d3c-4f74-a4e8-2340325b40b4" alt="Dashboard Screen" width="200"/>
    </td>
  </tr>
</table>

#### 👤 Profile Management  
Manage profile information and food preferences.

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/69a6f3b1-1380-4e08-964e-e0c6d79e6e8d" alt="Profile Screen" width="200"/>
    </td>
  </tr>
</table>

### 🛠️ Admin

#### 📈 Admin Dashboard  
Visualize data such as new subscriptions, MRR, growth, and reactivation with charts.

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/696857f9-08b3-4091-b793-07a6f220ae9d" alt="Admin Screen" width="200"/>
    </td>
  </tr>
</table>

#### 👥 User Management  
Manage all registered users in the system.

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/28dc71ea-b56e-4bb1-aa7c-e1822b6b1ccf" alt="User Management Screen" width="200"/>
    </td>
  </tr>
</table>

#### 🍽️ Menu Management  
Add, edit, delete meal packages, and manage availability.

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/9bf8d1f8-4180-42b1-9575-ae95888885cc" alt="Menu Management Screen" width="200"/>
    </td>
  </tr>
</table>

#### 📦 Order Management  
Monitor and manage all customer orders and subscriptions.

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/19b6afc1-871e-4ee7-a3fd-d7f8f66691bc" alt="Order Management Screen" width="200"/>
    </td>
  </tr>
</table>

## Architecture & Tech Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom theming
- **UI Components**: Radix UI + Shadcn/ui
- **Routing**: React Router DOM
- **Form Handling**: React Hook Form + Zod validation
- **State Management**: React Context (Authentication)
- **Icons**: Lucide React + Tabler Icons
- **Charts**: Recharts for dashboard analytics

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime

### Development Tools
- **Type Safety**: TypeScript
- **Code Quality**: ESLint + Prettier
- **Version Control**: Git

## Installation & Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Modern browser (Chrome, Firefox, Safari, Edge)
- Supabase account

### Clone Repository
```bash
git clone https://github.com/raflyryhnsyh/sea-catering.git
cd sea-catering
```

### Environment Setup
1. Create your `.env` file based on the provided template:
```bash
cp .env.example .env
```

2. Configure the environment variables in your `.env` file:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Install Dependencies
```bash
npm install
```

### Running the App
```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Access the Application
- Development: `http://localhost:5173`
- Production: `https://sea-catering-one.vercel.app/`

### 🔐 Demo Login Credentials
#### 🛠️ Account Admin
- Email: `admin@example.com`
- Password: `Admin123$`

## Project Structure
```
sea-catering/
├── public/                 # Static assets (images, icons)
│   ├── logo-sea.svg       # App logo
│   ├── home.jpg           # Hero image
│   └── *Plan.jpg          # Meal plan images
├── src/
│   ├── app/               # App configuration
│   ├── components/        # Reusable UI components
│   │   ├── ui/            # Base UI components (Shadcn)
│   │   ├── home/          # Home page components
│   │   ├── menu/          # Menu components
│   │   ├── navbar/        # Navigation components
│   │   └── subscription/  # Subscription components
│   ├── hooks/             # Custom React hooks
│   ├── layouts/           # Page layouts
│   ├── lib/               # Utility functions
│   ├── pages/             # Page components
│   ├── routes/            # Routing configuration
│   ├── services/          # API services
│   ├── styles/            # Global styles
│   └── types/             # TypeScript definitions
├── components.json        # Shadcn UI config
├── vite.config.ts         # Vite configuration
└── vercel.json           # Deployment config
```

## Database Schema

### Tables
- `users` - User accounts and roles
- `meal_plan` - List of available meal packages
- `subscriptions` - Customer subscription data
- `testimonial` - Customer feedback and reviews
