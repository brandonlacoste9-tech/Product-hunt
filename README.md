# 🚀 Discover North America - Product Discovery Hub

A modern, full-featured product discovery platform for North America, inspired by Product Hunt but with unique twists designed specifically for the USA 🇺🇸, Canada 🇨🇦, and Mexico 🇲🇽 markets.

## 🌟 Features

### Core Features
- **Product Discovery**: Browse and upvote innovative products
- **User Authentication**: Sign up, log in, and manage profiles
- **Categories**: Filter products by type (SaaS, Mobile, AI, Productivity, etc.)
- **Voting System**: Interactive upvoting with real-time updates
- **Product Submission**: Easy form for makers to submit their products
- **Responsive Design**: Beautiful UI that works on all devices

### Five Unique "Twists"

#### 1. 🌎 Multi-Language Support
- **English**, **Spanish**, and **French** support
- Reach 580M+ people across North America
- Automatic language detection
- Easy language switcher

#### 2. 🤖 AI-Powered Features
- Smart product recommendations
- AI-assisted product descriptions
- Trending product detection
- Automated tagging and categorization

#### 3. 📅 Events & Launch Calendar
- Virtual demo days
- In-person meetups
- Product launch countdowns
- RSVP and notification system
- iCal/Google Calendar integration

#### 4. 📊 Public Data API
- RESTful API for developers
- Access product data programmatically
- Rate-limited tiers (Free, Basic, Pro)
- Comprehensive documentation
- Webhook notifications (Pro tier)

#### 5. 🏙️ Local/Regional Sections
- City-specific product discovery
- 20+ major North American cities
- Local maker spotlights
- Regional leaderboards
- Connect online with offline communities

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/brandonlacoste9-tech/Product-hunt.git
cd Product-hunt
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📚 Documentation

### Complete Playbook
See [PLAYBOOK.md](./PLAYBOOK.md) for the comprehensive guide including:
- Market analysis and opportunity
- Technical architecture details
- Step-by-step launch checklist
- Revenue projections ($0 → $10K/month)
- Monetization strategies

### API Documentation
Visit `/api-docs` in the application or see the API section below.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14+ (React 18+)
- **Styling**: Tailwind CSS
- **Language**: TypeScript

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: PostgreSQL (via Supabase - configured but not required for demo)

### Deployment
- **Frontend**: Vercel (recommended)
- **Backend**: Vercel serverless functions
- **Database**: Supabase / Railway / Render

### Key Dependencies
```json
{
  "next": "^15.x",
  "react": "^19.x",
  "react-dom": "^19.x",
  "tailwindcss": "^3.x",
  "next-i18next": "^15.x"
}
```

## 📁 Project Structure

```
Product-hunt/
├── components/          # React components
│   ├── layout/         # Layout components (Header, Footer)
│   ├── product/        # Product-related components
│   └── ui/             # Reusable UI components
├── pages/              # Next.js pages and routes
│   ├── api/            # API endpoints
│   │   └── v1/         # API v1 endpoints
│   ├── local/          # Local city pages
│   ├── index.tsx       # Homepage
│   ├── submit.tsx      # Product submission
│   ├── events.tsx      # Events calendar
│   ├── api-docs.tsx    # API documentation
│   └── local.tsx       # Local sections hub
├── public/             # Static assets
│   └── locales/        # Translation files
├── styles/             # Global styles
├── lib/                # Utility functions
├── data/               # Sample data
├── PLAYBOOK.md         # Complete business playbook
└── README.md           # This file
```

## 🔌 API Usage

### Authentication
All API requests require an API key:

```bash
curl https://api.discoverna.com/v1/products \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Endpoints

#### Get Products
```
GET /api/v1/products
```

Query Parameters:
- `category` - Filter by category
- `city` - Filter by city slug
- `limit` - Results per page (max 100)
- `offset` - Pagination offset

Example Response:
```json
{
  "products": [
    {
      "id": 1,
      "name": "TaskFlow AI",
      "tagline": "AI-powered task management",
      "upvotes": 342,
      "category": "productivity",
      "maker": "Sarah Chen",
      "city": "san-francisco",
      "url": "https://example.com",
      "created_at": "2024-02-28T00:00:00Z"
    }
  ],
  "total": 150,
  "limit": 20,
  "offset": 0
}
```

### Rate Limits
- **Free**: 100 requests/day
- **Basic** ($29/mo): 10,000 requests/day
- **Pro** ($99/mo): 100,000 requests/day

## 💰 Monetization

The platform includes multiple revenue streams:

1. **Featured Products**: $99-$299/product
2. **Premium Maker Accounts**: $19.99/month
3. **API Subscriptions**: $29-$99/month
4. **Local Sponsorships**: $200-$1,000/month per city
5. **Event Sponsorships**: $500-$2,000/event
6. **Display Advertising**: Ethical, non-intrusive ads

**Target**: $10K+ MRR within 12 months

## 🌐 Supported Cities

### United States
San Francisco, New York, Austin, Seattle, Los Angeles, Boston, Chicago, Miami, Denver, Atlanta

### Canada
Toronto, Vancouver, Montreal

### Mexico
Mexico City, Guadalajara

More cities coming soon!

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Product Hunt's product discovery model
- Built with love for the North American tech community
- Special thanks to all the makers and early adopters

## 📞 Contact

- **Website**: [Discover North America](#)
- **Twitter**: [@DiscoverNA](#)
- **Email**: hello@discoverna.com

---

**Built with ❤️ for North American makers and innovators**

🇺🇸 🇨🇦 🇲🇽