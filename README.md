# NAGPUR SCHOOL VISIT — Official Web Platform

Production-ready, responsive SaaS web platform for school discovery, spatial mapping, and field inspection management across all **3,915** educational institutions in Nagpur District, Maharashtra.

---

## 🌟 Key Capabilities
- **Core KPIs & Metrics**: Live statistics calculated directly from the authoritative dataset (3,915 Schools, 18 Blocks, 184 Clusters, Visited & Pending).
- **Proximity Summary Cards**: Instant filtering by radius (Within 5 KM, 10 KM, 25 KM, 50 KM) via Haversine great-circle formula.
- **Schools Around Your Location**: Real-time GPS distance calculation and nearest-to-farthest proximity sorting.
- **18 Block Presets**: One-click centering on Zero Mile Central, URCs 1-5, Ramtek, Saoner, Katol, Kamptee, Hingna, Umred, Mouda, Bhiwapur, Narkhed, Parseoni, Kalmeshwar, and Kuhi.
- **Comprehensive School Details**: Full administrative, geographical, contact, and facility mapping profile for every school with direct **CALL**, **WHATSAPP**, **OPEN IN GOOGLE MAPS**, **ADD TO ROUTE**, and **MARK VISITED** actions.
- **Multi-Stop Route Planner**: Sequential itinerary builder with leg distance calculations and one-click turn-by-turn navigation via external Google Maps.
- **Visit Tracking & History**: Field inspection logging with timestamps, GPS verification, observation remarks, and official CSV export.
- **Data Validation Suite**: Executive audit dashboard verifying zero data loss and 100% data integrity against source records.

---

## 📁 Repository Structure
```
NAGPUR_SCHOOL_VISIT/
├── index.html                  # Main web application entry point
├── build.js                    # Production builder & Cloudflare/Pages asset verifier
├── package.json                # Project dependencies and deployment scripts
├── wrangler.toml               # Cloudflare configuration
├── wrangler.jsonc              # Cloudflare Pages schema configuration
├── .assetsignore               # Files ignored by Cloudflare static asset handler
├── .cfignore                   # Cloudflare build ignores
├── .gitignore                  # Git repository ignore rules
│
├── static/                     # Production UI Assets
│   ├── app.js                  # Core application engine
│   ├── schools_data.js         # Direct global window dataset
│   └── styles.css              # Design system stylesheet
│
├── data/                       # Authoritative Data Storage
│   ├── schools.json            # Authoritative 3,915 schools JSON
│   ├── NAGPUR_all_schools.csv  # Complete master CSV
│   └── [BLOCK_NAME].csv        # 18 Individual block CSV files
│
├── dist/                       # Output directory for Cloudflare Pages deployment
│   ├── index.html
│   ├── _headers
│   ├── .assetsignore
│   ├── static/
│   └── data/
│
├── README.md                   # Project overview & documentation
├── DEPLOYMENT_GUIDE.md         # Step-by-step deployment instructions
├── run.sh                      # One-click startup script for Linux / macOS
└── run.bat                     # One-click startup script for Windows
```

---

## 🚀 Quick Local Setup & Running
1. Clone or unpack the project.
2. Build production assets:
   ```bash
   node build.js
   ```
3. Run local server:
   ```bash
   npm start
   # Or using run.sh on Linux/Mac:
   ./run.sh
   # Or run.bat on Windows:
   run.bat
   ```
4. Open `http://localhost:8000` in your web browser.

---

## ☁️ Cloudflare Pages Deployment
- **Build Command**: `node build.js`
- **Build Output Directory**: `dist`
- **Framework Preset**: None (Static HTML/JS)
