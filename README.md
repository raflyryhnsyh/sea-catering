# SEA Catering - Web Application

## Deskripsi

SEA Catering adalah sebuah layanan katering harian modern yang menyediakan berbagai pilihan paket makanan sehat, lezat, dan bergizi yang dapat disesuaikan dengan kebutuhan pelanggan. Layanan ini dirancang untuk memudahkan pelanggan dalam memenuhi kebutuhan konsumsi sehari-hari, baik untuk individu, keluarga, maupun perusahaan.

SEA Catering mengusung konsep berlangganan (subscription) dengan fitur fleksibel seperti pilihan jenis makanan, hari pengiriman, hingga jeda langganan. Sistem digitalnya memungkinkan pengguna untuk memesan, mengelola, dan memantau status langganan mereka langsung dari aplikasi web, menjadikan pengalaman katering lebih praktis, transparan, dan personal.

## Fitur

### 🏠 Halaman Utama
**Landing Page & Hero Section**  
Membuat kesan pertama yang baik dan memperkenalkan pengunjung kepada siapa kami dan apa yang kami lakukan.
![Uploading WhatsApp Image 2025-07-01 at 19.38.33_93589b36.jpg…]()


### 👤 Pengguna Biasa

#### 🔐 User Authentication & Authorization  
Login/register dengan email dan validasi form yang aman.

#### 🧭 Interactive Navigation  
Antarmuka intuitif untuk menjelajahi paket katering dengan desain responsif.

#### 🍽️ Menu & Meal Plans  
Jelajahi berbagai paket makanan sehat dengan detail nutrisi dan harga.

#### 📝 Add Testimonial  
Memberikan ulasan dan rating terhadap layanan katering.

#### 📆 User Can Subscribe  
Form untuk memilih paket, hari pengiriman, dan data pribadi pengguna dengan validasi lengkap.

#### 📆 View, Pause & Cancel Subscription  
Fleksibilitas dalam mengelola langganan aktif langsung dari dashboard pengguna.

#### 👤 Profile Management  
Kelola informasi profil dan preferensi makanan.

### 🛠️ Admin

#### 📊 Admin Dashboard  
Melihat statistik lengkap seperti new subscriptions, MRR, growth, dan reaktivasi dengan visualisasi grafik.

#### 👥 User Management  
Kelola semua pengguna yang terdaftar dalam sistem.

#### 🍽️ Menu Management  
Tambah, edit, dan hapus paket makanan serta kelola ketersediaan menu.

#### 📦 Order Management  
Pantau dan kelola semua pesanan dan langganan pelanggan.

## Architecture & Tech Stack

### Frontend
- **Framework**: React 19 dengan TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS dengan custom theming
- **UI Components**: Radix UI + Shadcn/ui
- **Routing**: React Router DOM
- **Form Handling**: React Hook Form + Zod validation
- **State Management**: React Context (Authentication)
- **Icons**: Lucide React + Tabler Icons
- **Charts**: Recharts untuk dashboard analytics

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
- Node.js 18+ atau lebih baru
- npm atau yarn
- Browser modern (Chrome, Firefox, Safari, Edge)
- Akun Supabase

### Clone Repository
```bash
git clone https://github.com/raflyryhnsyh/sea-catering.git
cd COMPFEST_SEA_17/Submission
```

### Environment Setup
1. Buat file `.env` dari template:
```bash
cp .env.example .env
```

2. Konfigurasi environment variables:
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
#### 🛠️ Akun Admin
- Email: `admin@example.com`
- Password: `Admin123$`

## Project Structure
```
sea-catering-fe/
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
- `users` - User accounts dan roles
- `meal_plan` - Daftar paket makanan
- `subscriptions` - Langganan pelanggan
- `testimonial` - Ulasan pelanggan
