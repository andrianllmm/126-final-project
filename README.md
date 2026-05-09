<!-- PROJECT SHIELDS -->

[![Contributors][contributors-shield]][contributors-url]
[![Stargazers][stars-shield]][stars-url]
[![License][license-shield]][license-url]

# Iskommerce

UP Visayas C2C Marketplace

---

## About The Project

Iskommerce is a closed-campus student-to-student e-commerce marketplace for UP Visayas that enables buying and selling of items within a verified university community.

It replaces fragmented Facebook-based buy-and-sell workflows with a structured platform featuring listings, search, messaging, transactions, and reputation tracking.

### Key Features

- UPV email-verified authentication
- Product listings (create, update, delete)
- Search and discovery with filtering and ranking
- In-app messaging per listing
- Transaction workflow (request, accept, reject)
- Ratings and reviews system
- Notifications for messages and transaction updates

---

## Built With

- Next.js (Frontend)
- NestJS (Backend)
- PostgreSQL + Prisma (Database)
- Better Auth (Auth)
- Tailwind CSS + shadcn/ui (UI)
- TypeScript
- Turborepo (Monorepo)

---

## Getting Started

### Prerequisites

- Node.js
- pnpm

### Installation

```sh
git clone https://github.com/github_username/iskommerce.git
cd iskommerce
pnpm install
```

### Environment Setup

Create `.env` files for frontend and backend using provided templates.

```sh
cp .env.example .env
```

### Database Setup

This project requires a local PostgreSQL database.

#### Install PostgreSQL

**Linux / WSL**:

```sh
sudo apt install postgresql postgresql-contrib
sudo service postgresql start
```

Create database:

```sh
sudo -u postgres createdb iskommerce
```

**Windows**:

- Install PostgreSQL from [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
- During setup, ensure `psql` and tools are added to PATH

Create database:

```sh
createdb -U postgres iskommerce
```

#### Run migrations

```sh
pnpm db:migrate
```

### Run Development Server

```sh
pnpm dev
```

---

## Project Structure

```
apps/
  web/        # Next.js frontend
  api/        # NestJS backend

packages/     # shared utilities and configs
```

---

## Contributing

Contributions are welcome!

See [CONTRIBUTING.md](CONTRIBUTING.md) for more information.

---

<!-- MARKDOWN LINKS -->

[contributors-shield]: https://img.shields.io/github/contributors/andrianllmm/126-final-project.svg?style=flat-square&color=f43f5e
[contributors-url]: https://github.com/andrianllmm/126-final-project/graphs/contributors
[stars-shield]: https://img.shields.io/github/stars/andrianllmm/126-final-project.svg?style=flat-square&color=f43f5e
[stars-url]: https://github.com/andrianllmm/126-final-project/stargazers
[license-shield]: https://img.shields.io/github/license/andrianllmm/126-final-project.svg?style=flat-square&color=f43f5e
[license-url]: https://github.com/andrianllmm/126-final-project/blob/master/LICENSE.txt
