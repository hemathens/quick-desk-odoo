# 🚀 QuickDesk - AI-Enhanced Help Desk for Odoo

[![MIT License](https://img.shields.io/badge/License-MIT-green)](LICENSE) [![CI](https://github.com/Mihir-Rabari/quick-desk-odoo/actions/workflows/ci.yml/badge.svg)](https://github.com/Mihir-Rabari/quick-desk-odoo/actions) [![Docker Pulls](https://img.shields.io/docker/pulls/quickdesk/odoo)](https://hub.docker.com/r/quickdesk/odoo)

**Website:** [quickdesk.yourdomain.com](https://quickdesk.yourdomain.com)
**Tagline:** *"Support at the Speed of Business"*
**Team Name:** *Drakshushi*

---

## 📑 Table of Contents

1. [Description](#📄-description)
2. [Live Demo](#🚀-live-demo)
3. [Tech Stack](#🛠️-tech-stack)
4. [Architecture](#🏗️-architecture)
5. [Folder Structure](#🧱-folder-structure)
6. [Features](#✨-features)
7. [Use Cases](#🎯-use-cases)
8. [Screenshots](#📸-screenshots)
9. [Getting Started](#⚙️-getting-started)
10. [Configuration](#🔧-configuration)
11. [Testing](#🧪-testing)
12. [Monitoring & Security](#🔒-monitoring--security)
13. [Contributing](#🤝-contributing)
14. [Roadmap](#🐛-roadmap)
15. [Contact & Support](#📬-contact--support)
16. [License](#⚖️-license)

---

## 📄 Description

QuickDesk is a next-generation, AI-enhanced help desk module for Odoo, delivering seamless ticketing, SLA automation, and analytics within your ERP.

**Who it's for:**

* SMBs using Odoo for end-to-end operations
* IT/support teams craving integrated workflows
* Customer service departments requiring instant insights

**Why QuickDesk vs. SaaS Desks?**

| Aspect         | SaaS Desk                    | QuickDesk                              |
| -------------- | ---------------------------- | -------------------------------------- |
| Integration    | Separate system, sync issues | Native Odoo module, real-time data     |
| Cost           | Recurring fees               | Open-source (MIT), self-hosted         |
| Customization  | UI-limited                   | Full code & Studio-based tweaks        |
| Data Ownership | Vendor-controlled            | Your servers, your policies            |
| Upgrades       | Provider-driven, breaking    | Zero-downtime via Odoo modular updates |

---

## 🚀 Live Demo

* **URL:** [demo.quickdesk.yourdomain.com](https://demo.quickdesk.yourdomain.com)
* **Test Account:** `demo@quickdesk.com` / `Demo1234`

---

## 🛠️ Tech Stack

* **Core:** Odoo 16+, Python 3.10+, PostgreSQL 14+
* **Containerization:** Docker, Docker Compose, Kubernetes Helm
* **Messaging & Jobs:** Redis, Celery
* **Optional Frontend:** React 18+, Vite, Tailwind CSS, shadcn/ui, Framer Motion
* **API Layer:** Apollo GraphQL Server, Flask Blueprint REST
* **CI/CD:** GitHub Actions
* **Monitoring:** Prometheus, Grafana, ELK Stack

---

## 🏗️ Architecture

```plaintext
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  End Users   │      │  Support     │      │  Admins      │
│  (Web/Email) │      │  Agents      │      │  Odoo UI     │
└──────┬───────┘      └──────┬───────┘      └──────┬───────┘
       │                      │                      │
       ▼                      ▼                      ▼
┌─────────────────────────────────────────────────────────┐
│                    QuickDesk Module                    │
│ ┌───────────┐  ┌────────┐  ┌────────┐  ┌───────────┐  │
│ │ Ticket    │  │ SLA    │  │ Alerts │  │ Analytics │  │
│ │ Manager   │  │ Engine │  │ System │  │ Dashboard │  │
│ └───────────┘  └────────┘  └────────┘  └───────────┘  │
└─────────────────────────┬─────────────────────────────┘
                          │
         ┌────────────────┴───────────────────┐
         │         Odoo Core ERP & Data       │
         └────────────────┬───────────────────┘
                          │
     ┌────────────────────┴───────────────────────┐
     │ PostgreSQL 14+       │ Redis & Celery       │
     │ Metrics & Logs       │ API Services         │
     └────────────────────────────────────────────┘
```

[View detailed design](docs/system-design.md)

---

## 🧱 Folder Structure

```plaintext
quick-desk-odoo/
├── backend/quick_desk/    # Core Odoo module
│   ├── controllers/      # HTTP & JSON endpoints
│   ├── models/           # ORM definitions
│   ├── security/         # Access controls
│   ├── views/            # QWeb/XML templates
│   ├── data/             # Initial & demo data
│   ├── static/           # JS, CSS, images
│   ├── tests/            # PyTest suite
│   ├── __manifest__.py   # Module metadata
│   └── __init__.py
├── frontend/portal/      # (Optional) React-based portal
│   ├── public/
│   └── src/
├── docker/               # Docker & Compose files
├── docs/                 # OpenAPI/GraphQL specs, designs
├── scripts/              # Migration & helper scripts
├── .env.example          # Template env vars
└── README.md             # This file
```

---

## ✨ Features

* **AI Ticket Routing:** ML-driven assignment recommendations
* **Ticket Lifecycle:** Open → In Progress → Resolved → Closed
* **SLA Management:** Real-time timers, automated escalations
* **Notifications:** Email, SMS (Twilio), in-app
* **Analytics:** Custom dashboards, CSV/PDF exports
* **Integrations:** Slack, MS Teams, Zapier webhooks
* **Customization:** Odoo Studio & code overrides

---

## 🎯 Use Cases

* **SMB IT Support:** Centralize employee tickets, measure SLAs
* **Customer Service:** Integrated CRM & support workflows
* **DevOps:** Automated incident tickets from monitoring alerts

---

## 🔍 Roles & Navigation

QuickDesk tailors its experience to three main roles, each with focused UI and navigation:

### 🧑‍💼 End Users

* **My Tickets**: `/my-tickets` – Create, view, and comment on own tickets
* **New Ticket**: `/create-ticket` – Form with category, priority, description, attachments
* **Notifications**: In-app bell icon and email alerts on updates

### 🛠️ Support Agents

* **Ticket Queue**: `/agent/queue` – Filter by status, priority, SLA breach
* **Ticket Detail**: `/agent/ticket/:id` – Assign, comment, change status, add internal notes
* **Analytics**: `/agent/analytics` – Personal performance metrics and response times

### ⚙️ Administrators

* **Admin Dashboard**: `/admin` – System overview, user management, category & SLA settings
* **Reports**: `/admin/reports` – Exportable CSV/PDF reports, SLA compliance charts
* **Configuration**: `/admin/config` – Email/SMS templates, workflow rules, integrations

---

## 📸 Screenshots

![Dashboard](./frontend/portal/public/images/screenshot-dashboard.png)
![Ticket View](./frontend/portal/public/images/screenshot-ticket.png)

---

## ⚙️ Getting Started

### Option 1: Docker (Recommended)

```bash
git clone https://github.com/Mihir-Rabari/quick-desk-odoo.git
cd quick-desk-odoo
cp .env.example .env
docker-compose up -d --build
# Access Odoo at http://localhost:8069, install "QuickDesk"
```

### Option 2: Manual

```bash
# Install Python deps
pip install -r backend/quick_desk/requirements.txt
# Start PostgreSQL & Redis
# Run Odoo with addons path including quick_desk
odoo -c odoo.conf
```

---

## 🔧 Configuration

See `.env.example`:

```env
POSTGRES_DB=quickdesk
POSTGRES_USER=odoo
POSTGRES_PASSWORD=odoo
ODOO_ADDONS=backend/quick_desk
SMTP_SERVER=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASSWORD=pass
REDIS_URL=redis://redis:6379/0
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
```

---

## 🧪 Testing

```bash
# Backend
docker-compose exec odoo pytest -q
# Frontend
docker-compose exec portal npm test
```

---

## 🔒 Monitoring & Security

* **Metrics:** Exposed via Prometheus, dashboards in Grafana
* **Logs:** Centralized in ELK Stack
* **Security:** JWT auth for APIs, role-based access, TLS recommended

---

## 🤝 Contributing

Contributions welcome! Please follow \[CONTRIBUTING.md] and the repository guidelines.

---

## 🐛 Roadmap

* Multi-tenant support
* Mobile app (React Native)
* AI-powered agent chat assistant

---

## 👥 Team & Credits

**Team Name:** Drakshushi
• **Hem Patel**
[![Kaggle Profile](https://img.shields.io/badge/Kaggle-hem%20ajit%20patel-20BEFF?logo=kaggle)](https://www.kaggle.com/hemajitpatel)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Hem%20Ajit%20Patel-0A66C2?logo=linkedin)](https://www.linkedin.com/in/hem-patel19)
[![GitHub](https://img.shields.io/badge/GitHub-hemathens-181717?logo=github)](https://github.com/hemathens)

• **Laukik Rajput**
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Hem%20Ajit%20Patel-0A66C2?logo=linkedin)](https://www.linkedin.com/in/laukik-rajput-95bb48300)
[![GitHub](https://img.shields.io/badge/GitHub-hemathens-181717?logo=github)](https://github.com/lokixshr)

• **Mihir Rabari** – [https://github.com/Mihir-Rabari](https://github.com/Mihir-Rabari)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Hem%20Ajit%20Patel-0A66C2?logo=linkedin)](https://www.linkedin.com/in/mihir-rabari)
[![GitHub](https://img.shields.io/badge/GitHub-hemathens-181717?logo=github)](https://github.com/Mihir-Rabari)

---

## 📬 Contact & Support

* **Email:** [support@quickdesk.yourdomain.com](mailto:support@quickdesk.yourdomain.com)
* **GitHub Issues:** [https://github.com/Mihir-Rabari/quick-desk-odoo/issues](https://github.com/Mihir-Rabari/quick-desk-odoo/issues)
* **Discord:** [https://discord.gg/quickdesk](https://discord.gg/quickdesk)

---

## ⚖️ License

MIT License © 2025 [drakshushi](https://creativecommons.org/licenses/by/4.0/)
