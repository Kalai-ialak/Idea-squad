# Idea Squad Agency — Website

A premium full-service marketing agency website built with Next.js 15, TypeScript, Tailwind CSS, Three.js and Motion.

## 🚀 Quick Start

### Development

```bash
cd idea-squad-agency
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Docker (Production)

```bash
cd idea-squad-agency

# Build and run with Docker Compose
docker-compose up --build

# Or manually with Docker
docker build -t idea-squad-agency .
docker run -p 3000:3000 idea-squad-agency
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout with metadata & fonts
│   ├── page.tsx          # Homepage assembly
│   ├── globals.css       # Design tokens & global styles
│   └── not-found.tsx     # Custom 404 page
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx    # Fixed navbar with mobile drawer
│   │   └── Footer.tsx    # Full footer
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── BrandStatement.tsx
│   │   ├── AboutSection.tsx
│   │   ├── ServicesSection.tsx
│   │   ├── ProcessSection.tsx
│   │   ├── PortfolioSection.tsx
│   │   ├── IndustriesSection.tsx
│   │   ├── CtaSection.tsx
│   │   └── ContactSection.tsx
│   └── three/
│       └── LightbulbScene.tsx  # 3D interactive lightbulb (client-only)
├── data/
│   ├── services.ts       # All 12 service definitions
│   └── portfolio.ts      # Portfolio items (concept projects)
└── lib/
    └── config.ts         # Central site configuration
```

---

## ⚙️ Configuration

Before launching, update **`src/lib/config.ts`** with real values:

| Field | Description |
|-------|-------------|
| `contact.email` | Real business email |
| `contact.phone` | Real phone number |
| `contact.whatsapp` | WhatsApp number for chat link |
| `contact.address` | Business address |
| `social.*` | Real social media profile URLs |
| `url` | Live website URL for OG metadata |

---

## 🖼️ Logo

Place your logo at:

```
public/images/idea-squad-logo.png
```

A temporary SVG placeholder is at `public/images/idea-squad-logo.svg`.
Update `Navbar.tsx` and `Footer.tsx` if you use a different filename or format.

---

## 📬 Contact Form

The form is currently in **demo mode** — it validates inputs but does not submit data to a server.

To activate it, replace the mock timeout in `ContactSection.tsx` with a real API call:

**Option A — Formspree:**
```ts
const res = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
  method: "POST",
  body: JSON.stringify(form),
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});
```

**Option B — Next.js API Route:**
Create `src/app/api/contact/route.ts` and use Resend or Nodemailer.

---

## 🎨 Portfolio

Add real projects to `src/data/portfolio.ts`. Set `isConceptProject: false` for real client work. Add actual project images to `public/images/portfolio/`.

---

## 🐳 Docker Notes

- Uses multi-stage build for minimal image size (~200MB)
- Requires `output: "standalone"` in `next.config.ts` ✅ (already set)
- Runs on port 3000 — change in `docker-compose.yml` if needed

---

## Tech Stack

- **Next.js 15** (App Router, Turbopack)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Three.js** + **@react-three/fiber** + **@react-three/drei**
- **Motion for React**
- **Lucide React**
- **Docker** (multi-stage Alpine build)
