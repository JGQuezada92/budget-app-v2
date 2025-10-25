# AI-Powered Budget Planning Application

A comprehensive budget planning and analysis application built with Next.js, TypeScript, and AI-powered insights using Anthropic Claude.

## ⚡ Quick Start

**The fastest way to start the development server:**

### Windows PowerShell
```powershell
.\start-dev.ps1
```

### Windows Command Prompt
```cmd
start-dev.bat
```

### Manual Start
```bash
npm install  # Only needed if dependencies aren't installed
npm run dev
```

These scripts automatically check for and install dependencies before starting the server, ensuring a smooth startup every time.

The server will be available at **http://localhost:3000**

### ⚠️ Required: Configure AI Analysis

**The AI analysis feature requires an Anthropic API key to work.**

1. Get your API key from [Anthropic Console](https://console.anthropic.com/)
2. Open `.env.local` in the project root
3. Replace `your-actual-api-key-here` with your real API key
4. Restart the server

**See [API_SETUP_GUIDE.md](./API_SETUP_GUIDE.md) for detailed instructions.**

Without this configuration, the app will run but AI analysis will fail when you submit forms.

## 🚀 Features

### Core Functionality
- **Complete AOP Submission Form** - 6-section form mirroring your exact template structure
- **AI-Powered Analysis** - Anthropic Claude provides intelligent FP&A insights
- **File Upload Support** - CSV/Excel parsing for historical and budget data
- **Real-time Dashboard** - User and admin views with analytics
- **Submission Management** - Create, edit, delete, and track submissions

### Technical Stack
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui with beautiful, accessible components
- **AI Integration**: Anthropic Claude API for intelligent analysis
- **Database**: Supabase (PostgreSQL) with full schema
- **File Processing**: Papa Parse for CSV/Excel parsing
- **Charts**: Recharts for data visualization

## 📋 Application Sections

### 1. Introduction Section
- Department selection and fiscal year
- Team description and responsibilities
- Department head information
- Team tenets and operating principles

### 2. Key Metrics Section
- Pre-populated KPIs (Net Revenue, Product Lines, Customers, etc.)
- Historical data (FY2023 actuals)
- Current year expectations (FY2024)
- Future planning (FY2025-2026)
- Year-over-year percentage tracking

### 3. Prior Year Review
- Key outcomes and initiatives completed
- Wins, mistakes, misses, and learnings
- Industry trends and changes

### 4. Key Initiatives
- Dynamic initiative management
- Priority levels and ownership
- Timeline tracking
- Baseline initiative identification

### 5. Resource Planning
- Current vs. planned headcount
- Hiring plans and justification
- Technology and tools requirements
- Training and development needs

### 6. File Uploads
- Historical financial data (CSV/Excel)
- Budget and forecast data
- Supporting documents
- Automatic CSV parsing and validation

## 🤖 AI Analysis Features

The application provides intelligent analysis through Anthropic Claude:

- **Key Insights** - Important findings from data comparison
- **Recommendations** - Specific, actionable budget optimization advice
- **Risk Assessment** - Potential concerns and red flags
- **Opportunities** - Areas for efficiency improvements
- **Confidence Scoring** - Analysis reliability metrics

## 🛠 Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Anthropic API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd budget-app-v2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create `.env.local` with:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Anthropic Claude API
   ANTHROPIC_API_KEY=your_anthropic_api_key
   ```

4. **Set up database**
   - Create a new Supabase project
   - Run the SQL schema from `schema.sql` in your Supabase SQL editor
   - This creates all necessary tables for the application

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   Open [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

The application uses a comprehensive PostgreSQL schema with the following tables:

- **departments** - Department lookup table
- **aop_submissions** - Main form submissions
- **aop_metrics** - Key performance indicators
- **initiatives** - Strategic initiatives
- **financial_uploads** - Historical and budget data
- **supporting_documents** - Additional context files
- **ai_analysis** - AI-generated insights and recommendations

## 🧪 Testing the Application

### Sample Data
The repository includes sample CSV files for testing:
- `sample-data/historical-financial-data.csv` - 12 months of 2024 data
- `sample-data/budget-forecast-2025.csv` - 2025 budget projections
- `sample-data/supporting-document.txt` - Budget justification document

### Test Flow
1. **Create a submission** - Fill out the form with realistic data
2. **Upload sample files** - Use the provided CSV files
3. **Submit for analysis** - Trigger AI analysis
4. **View dashboard** - See insights, recommendations, risks, and opportunities
5. **Edit submissions** - Test the edit/delete functionality

## 🎯 Key Benefits

- **Template Compliance** - Form structure matches your exact AOP requirements
- **AI-Powered Insights** - Get intelligent analysis of budget proposals
- **User-Friendly** - Intuitive interface with guided workflows
- **Scalable** - Built for enterprise use with proper data management
- **Secure** - Environment variables and proper data handling

## 🔧 Development

### Project Structure
```
src/
├── app/                    # Next.js app router pages
│   ├── api/analyze/       # AI analysis API endpoint
│   ├── admin/             # Admin dashboard
│   ├── dashboard/         # User dashboard
│   └── submission/        # Submission form
├── components/
│   ├── submission/        # Form section components
│   └── ui/               # shadcn/ui components
└── lib/
    ├── ai-analysis.ts    # AI integration
    └── supabase.ts       # Database client
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📈 Future Enhancements

- **Database Integration** - Full Supabase integration for data persistence
- **User Authentication** - Multi-user support with role-based access
- **Advanced Analytics** - More sophisticated reporting and dashboards
- **Workflow Management** - Approval workflows and status tracking
- **Export Functionality** - PDF reports and data export

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using Next.js, TypeScript, and AI-powered insights.