<div align="center">
  <img src="public/logo.png" alt="Vertex Market Logo" width="100"/>
  <h1>🌟 Vertex Market 🌟</h1>
  <p><strong>Enterprise-Grade MERN eCommerce Frontend</strong></p>

  [![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-8.1-646CFF.svg)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.3-38B2AC.svg)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
</div>

<br />

Welcome to **Vertex Market**! A highly scalable, performant, and deeply customizable eCommerce frontend. Designed to deliver a flawless user experience, it features dynamic AI recommendations, robust seller centers, and an expansive admin portal.

---

## 🚀 Key Features

### 🛍️ **For Shoppers**
- **Smart Discovery**: AI-powered search, dynamic filters, and personalized recommendations.
- **Customer Dashboard**: Track orders, manage wishlists, handle returns, and compare products.
- **Lightning Fast**: Optimized with lazy-loading, WebP images, and PWA capabilities for offline support.
- **Localization**: Full multi-language (LTR/RTL) and multi-currency support.

### 🏪 **For Sellers**
- **Seller Center**: A dedicated portal to manage inventory, fulfill orders, and track revenue.
- **Promotions Engine**: Create coupons, manage flash sales, and run marketing campaigns.
- **Analytics**: Real-time sales charts and performance insights.

### 🛡️ **For Admins**
- **Complete Control**: Comprehensive CMS, user management, and CRM dashboards.
- **System Health**: Monitor API limits, manage security protocols, and check environment status.

---

## 💻 Tech Stack

- **Framework**: React 19 + Vite for ultra-fast HMR and building.
- **Styling**: Tailwind CSS for utility-first, responsive design.
- **State Management**: React Context API & custom hooks.
- **Routing**: React Router DOM (v7).
- **Animations**: Framer Motion for buttery-smooth micro-interactions.
- **Icons**: React Icons (Feather/FontAwesome).

---

## 🛠️ Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+) and npm installed.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/fahadalimazari/vertex-market-frontend.git
   cd vertex-market-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file based on the provided `.env.example`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   VITE_ENABLE_AI=true
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

---

## 📁 Project Structure

```text
📦 src
 ┣ 📂 ai           # AI recommendation and search engines
 ┣ 📂 components   # Reusable UI components organized by domain
 ┣ 📂 context      # Global React Context providers
 ┣ 📂 data         # Mock data and static configurations
 ┣ 📂 pages        # Route-level pages (Admin, Seller, Customer)
 ┣ 📂 routes       # Application routing and Protected Routes
 ┣ 📂 security     # CSRF and XSS protection utilities
 ┣ 📂 services     # API wrappers and external service integrations
 ┣ 📂 styles       # Global CSS and Tailwind directives
 ┗ 📂 utils        # Helper functions (formatters, loggers, calculators)
```

---

## 🚀 Deployment

Vertex Market is optimized for zero-config deployments on modern edge networks. Configuration files are included for your convenience:

- **Vercel**: Deploy instantly using `vercel.json`.
- **Cloudflare Pages**: Optimized settings in `cloudflare-pages.toml`.
- **Netlify**: Pre-configured in `netlify.toml`.
- **Docker**: Containerize the app using the provided `Dockerfile`.

To build the app manually for production:
```bash
npm run build
npm run preview
```

---

<div align="center">
  <i>Built with ❤️ for scalable commerce.</i>
</div>
