# Contract Management System - Quick Start Guide

## ✅ Migration Complete!

Your banking portal has been successfully transformed into a **Contract Management System (CMS)** backend.

## 📁 What's Included

### Core Features (Preserved)
- ✅ **Authentication** - JWT-based auth with Passport
- ✅ **Identity & Access Management** - User, roles, permissions
- ✅ **Database** - TypeORM with PostgreSQL
- ✅ **Caching** - Redis integration
- ✅ **Notifications** - Email/SMS with templates
- ✅ **Logging** - Winston logger
- ✅ **Security** - Helmet, CORS, validation
- ✅ **API Docs** - Swagger/OpenAPI

### New Contract Management Module
- 📄 Full CRUD operations for contracts
- 📊 Contract lifecycle management (Draft → Active → Expired)
- 🏢 Support for multiple contract types (Service, Vendor, NDA, etc.)
- 💰 Contract value and currency tracking
- 📅 Start/End date management
- 🔍 Custom queries (active contracts, expiring soon)
- 📝 Metadata support for extensibility

## 🚀 Quick Commands

```bash
# Install dependencies
npm install

# Setup database (Docker)
npm run db:setup:dev

# Start development server
npm run start:dev

# Build for production
npm run build

# Run tests
npm test

# Check code quality
npm run lint
npm run format
```

## 📚 API Endpoints

### Contracts API (`/v1/contracts`)
- `POST /v1/contracts` - Create new contract
- `GET /v1/contracts` - List all contracts (with pagination)
- `GET /v1/contracts/:id` - Get contract by ID
- `PATCH /v1/contracts/:id` - Update contract
- `DELETE /v1/contracts/:id` - Delete contract

### Authentication API (`/v1/auth`)
- `POST /v1/auth/login` - User login
- `POST /v1/auth/logout` - User logout
- `POST /v1/auth/refresh` - Refresh token

### Identity & Access API (`/v1/identity-access`)
- User management endpoints
- Role and permission management
- Bank branch management

## 📖 Documentation

Once the server is running, access:
- **Swagger UI**: `http://localhost:<PORT>/api`
- **API Docs**: `http://localhost:<PORT>/api-json`

## 🔧 Configuration

Update these environment variables in `config/env/.env`:
```
# Application
APP_PORT=3000
APP_ENV=dev

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=cms_db

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d

# Redis (optional for caching)
REDIS_HOST=localhost
REDIS_PORT=6379
```

## 📊 Database Setup

The Contract entity will create this table:
```sql
CREATE TABLE contracts (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  contract_number VARCHAR(100) UNIQUE NOT NULL,
  contract_type VARCHAR(50),
  status VARCHAR(50),
  party_a VARCHAR(255),
  party_b VARCHAR(255),
  start_date DATE,
  end_date DATE,
  value DECIMAL(15,2),
  currency VARCHAR(10),
  terms TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🎯 Next Steps

1. **Database Migration**: Run migrations to create tables
2. **Environment Setup**: Configure your `.env` files
3. **Test API**: Use Swagger UI to test endpoints
4. **Add Features**: Implement additional CMS features

## 📦 What Was Removed

All banking-specific features removed:
- ❌ Customers, Merchants, Transactions
- ❌ Disputes, Risk Management, Reports
- ❌ Service Fees, Network Processor
- ❌ Dashboard, Workflow, Audit Log

## 🔗 Resources

- **GitHub**: https://github.com/Basanta-Khadka-Citytech/contract-management-system-backend
- **NestJS Docs**: https://docs.nestjs.com
- **TypeORM Docs**: https://typeorm.io

## 💡 Tips

1. Start with setting up your database first
2. Update JWT secrets for production
3. Configure Redis for better performance
4. Add contract document upload/download later
5. Implement contract templates as needed
6. Add automated notifications for expiring contracts

---
**Version**: 1.0.0  
**Last Updated**: January 16, 2026  
**Status**: ✅ Ready for Development
