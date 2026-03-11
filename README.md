# Trimrr Backend 🚀

The robust Node.js backend powering Trimrr, providing secure URL shortening, QR code generation, and real-time analytics.

## 🛠️ Tech Stack

- **Node.js & Express**: High-performance web framework.
- **MongoDB & Mongoose**: Flexible NoSQL database with schema modeling.
- **JWT (JSON Web Tokens)**: Secure user authentication and session management.
- **Bcrypt.js**: High-security password hashing.
- **Cheerio**: Lightweight server-side HTML parsing for URL title extraction.
- **CORS**: Cross-Origin Resource Sharing for secure frontend communication.

## 📂 Project Structure

```text
backend/
├── models/         # Database schemas (User, Url, Click)
├── routes/         # Express API endpoints
├── middleware/     # Auth and error handling filters
├── services/       # Helper services logic
├── index.js        # Entry point & Server setup
└── .env            # Environment configurations
```

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Create a `.env` file with the following keys:
   - `PORT`: Port number (default 5000)
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure string for token signing

3. **Run Server**:
   ```bash
   # Development mode (auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

## 🔗 Key API Endpoints

- `POST /api/auth/register` - New user signup
- `POST /api/auth/login` - User authentication
- `POST /api/urls/create` - Generate short URL & QR
- `GET /api/urls/:id` - Fetch link details
- `GET /api/clicks/:urlId` - Get total/device analytics

---
Built with ❤️ for speed and security.
