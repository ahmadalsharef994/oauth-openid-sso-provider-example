# OAuth2 / OpenID Connect SSO Provider — Node.js

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20+-green?logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/OAuth2-RFC6749-blue" alt="OAuth2">
  <img src="https://img.shields.io/badge/OpenID_Connect-1.0-orange" alt="OIDC">
  <img src="https://img.shields.io/badge/SSO-Single--Sign--On-purple" alt="SSO">
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="License">
</p>

A reference implementation of an **OAuth 2.0 Authorization Server + OpenID Connect Provider** in Node.js. Demonstrates Authorization Code flow, token introspection, and SSO for multiple client applications.

---

## 🔐 Supported Flows

| Flow | Use Case |
|------|----------|
| Authorization Code | Web apps (server-side) |
| Authorization Code + PKCE | SPAs, Mobile apps |
| Client Credentials | Machine-to-machine |

---

## 🏗️ Architecture

```mermaid
sequenceDiagram
    participant User
    participant ClientApp as Client App
    participant AuthServer as Auth Server (this repo)
    participant ResourceAPI as Resource API

    User->>ClientApp: Login
    ClientApp->>AuthServer: GET /authorize?response_type=code&client_id=...
    AuthServer->>User: Login page
    User->>AuthServer: Credentials
    AuthServer->>ClientApp: Redirect with ?code=...
    ClientApp->>AuthServer: POST /token (code + client_secret)
    AuthServer->>ClientApp: access_token + id_token (JWT)
    ClientApp->>ResourceAPI: GET /api/data (Bearer token)
    ResourceAPI->>AuthServer: POST /introspect
    AuthServer->>ResourceAPI: { active: true, sub: "user123" }
    ResourceAPI->>ClientApp: Protected data
```

---

## 🚀 Quick Start

```bash
npm install
cp .env.example .env
npm start
```

### Key endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /authorize` | Start OAuth2 flow |
| `POST /token` | Exchange code for tokens |
| `GET /userinfo` | OIDC user profile (Bearer) |
| `POST /introspect` | Token validation |
| `GET /.well-known/openid-configuration` | Discovery document |

---

## ⚙️ Configuration

```env
PORT=3000
JWT_SECRET=your-signing-secret
JWT_EXPIRY=1h
CLIENT_ID=demo-client
CLIENT_SECRET=demo-secret
REDIRECT_URI=http://localhost:4000/callback
```

---

## 📄 License

MIT
