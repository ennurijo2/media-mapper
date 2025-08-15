# Media Mapper

An open-source framework for exploring media objects based on their geographical location data. Media Mapper provides a spatially driven way of exploring how topics (i.e. water, the environment, landmarks) are portrayed in media across space and time.

![Made possible through funding provided by the University of Pennsylvania](./public/upenn_logo.png)

## 🌍 Overview

Media Mapper is designed to be a flexible, open-source web application framework that allows anyone to build their own media exploration tool with geospatial data. The application connects to Airtable as a data source and provides an interactive map interface for browsing and exploring media content.

### Key Features

- **Interactive Map**: Browse media locations by zooming, panning, and selecting data points
- **Detailed Media Views**: View additional information about selected points including images and text
- **Shareable URLs**: Each map data point has a unique URL for easy sharing
- **Tabular View**: Browse the entire dataset in a structured table format
- **Accessibility**: Built to conform with WCAG 2.2 Level AA standards
- **Customizable**: Fork and customize for your own datasets

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, pnpm, or yarn
- Airtable account with properly structured data
- Mapbox account for map functionality

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/media-mapper.git
   cd media-mapper
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Copy the example environment file and configure your API keys:
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your actual values:
   ```env
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
   AIRTABLE_API_KEY=your_airtable_api_key
   AIRTABLE_BASE_ID=your_airtable_base_id
   AIRTABLE_VIEW_NAME=your_airtable_view_name
   ENABLE_ANALYTICS=false
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see your Media Mapper instance.

## 📋 Available Scripts

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint

# Run TypeScript type checking
npm run type-check
```

## 🗂️ Project Structure

```
media-mapper/
├── app/                    # Next.js App Router pages and layouts
│   ├── data.ts            # Airtable data fetching logic
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Homepage with map interface
│   └── table/             # Table view page
├── components/            # React components
│   ├── map.tsx           # Interactive map component
│   ├── location-details.tsx
│   ├── media-locations-table/
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions
│   ├── airtable/         # Airtable integration
│   │   ├── index.ts      # Airtable client configuration
│   │   └── types.ts      # TypeScript interfaces
│   └── utils.ts          # Tailwind utility functions
├── public/               # Static assets
└── CLAUDE.md            # Development instructions for Claude Code
```

## 🗄️ Data Source Configuration

Media Mapper uses Airtable as its primary data source. Your Airtable base must follow a specific schema for the application to work correctly.

### Required Airtable Setup

#### 1. API Access
- Create an Airtable account at [airtable.com](https://airtable.com)
- Generate a personal access token from your [Airtable account settings](https://airtable.com/account)
- Note your Base ID from your Airtable base URL

#### 2. Base Structure

Your Airtable base should contain a table named **"Media Locations"** with the following fields:

##### Required Fields:
- **Name** (Single line text) - Primary field, name of the location/media
- **Latitude** (Number) - Geographic latitude coordinate
- **Longitude** (Number) - Geographic longitude coordinate

##### Optional Location Fields:
- **Location Name** (Single line text) - Descriptive name of the location
- **Natural Feature Name** (Single line text) - Name of natural features (rivers, mountains, etc.)
- **City** (Single line text) - City name
- **Region** (Single line text) - State/Province/Region
- **Country** (Single line text) - Country name

##### Linked Media Fields (from related Media table):
- **Name (from Media)** - Linked record field to Media table
- **Original Title (from Media)** - Lookup field
- **Director (from Media)** - Lookup field  
- **Release Year (from Media)** - Lookup field
- **Description (from Media)** - Lookup field
- **Image (from Media)** - Lookup field (Attachment)
- **Video (from Media)** - Lookup field (Attachment)
- **Video Link (from Media)** - Lookup field (URL)
- **Subjects (from Media)** - Lookup field (Multiple select)
- **Language (from Media)** - Lookup field (Multiple select)
- **References (from Media)** - Lookup field (Long text)
- **Rights (from Media)** - Lookup field (Single line text)
- **Rights Statement Link (from Media)** - Lookup field (URL)
- **Media Type (from Media)** - Lookup field (Single select)

#### 3. Views and Permissions
- Create a view in your "Media Locations" table that includes all records you want to display
- Ensure your Airtable base is shared with appropriate permissions for your API key
- Set the view name in your `AIRTABLE_VIEW_NAME` environment variable

### Data Schema Types

The application expects the following TypeScript interfaces (defined in `lib/airtable/types.ts`):

```typescript
interface MediaLocation {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
  location_name?: string;
  natural_feature_name?: string;
  city?: string;
  region?: string;
  country?: string;
  media?: Media;
}

interface Media {
  name: string;
  original_title?: string;
  media_type?: string;
  director?: string;
  release_year?: number;
  description?: string;
  image?: MediaImage;
  video?: string;
  video_link?: string;
  subjects?: string[];
  language?: string[];
  references?: string;
  rights?: string;
  rights_statement_link?: string;
}
```

## 🎨 Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) with Radix UI primitives
- **Maps**: [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)
- **Data Source**: [Airtable](https://airtable.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics) (optional)

## 🔧 Configuration Options

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Yes | Mapbox public access token for map functionality |
| `AIRTABLE_API_KEY` | Yes | Airtable personal access token |
| `AIRTABLE_BASE_ID` | Yes | Your Airtable base identifier |
| `AIRTABLE_VIEW_NAME` | Yes | The view name in your Media Locations table |
| `ENABLE_ANALYTICS` | No | Set to `true` to enable Vercel Analytics |

### Customization

The application is designed to be easily customizable:

1. **Styling**: Modify `app/globals.css` and Tailwind configuration
2. **Components**: Customize components in the `components/` directory
3. **Data Structure**: Adapt `lib/airtable/types.ts` for your data schema
4. **Map Settings**: Configure map style and behavior in `components/map.tsx`

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to a GitHub repository
2. Connect your repository to [Vercel](https://vercel.com)
3. Configure environment variables in your Vercel dashboard
4. Deploy automatically on every push to main

### Other Platforms

Media Mapper can be deployed to any platform that supports Next.js:

- **Netlify**: Use the `@netlify/plugin-nextjs` plugin
- **Railway**: Direct deployment with environment variables
- **DigitalOcean App Platform**: Node.js app with build command `npm run build`
- **AWS Amplify**: Connect your GitHub repository

## 🤝 Contributing

We welcome contributions! This project is open source and designed to be a community resource.

### Getting Started
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm run lint`, `npm run type-check`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines
- Follow the existing code style and patterns
- Ensure accessibility standards are maintained
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

- **Documentation**: Check this README and `CLAUDE.md` for development guidance
- **Issues**: Report bugs and request features via [GitHub Issues](https://github.com/your-org/media-mapper/issues)
- **Community**: Join our discussions for questions and ideas

## 🙏 Acknowledgments

Made possible through funding provided by the University of Pennsylvania.

---

**Ready to explore media through space and time?** 🗺️✨
