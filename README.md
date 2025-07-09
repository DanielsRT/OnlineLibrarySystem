# OnlineLibrarySystem

A full-stack, secure online library management system built with Node.js and MySQL. This project allows users to browse and manage a library catalog, handle loans and reservations, and provides admin tools for system oversight.

## Features

- **User Authentication**: Secure registration and login with hashed passwords.
- **User Account Management**: Users can view and edit their account details.
- **Catalog Browsing & Search**: Browse a library catalog and search by title, author, publisher, or type.
- **Loan Management**: Users can check out and return books, and view their current loans.
- **Reservation System**: Reserve items that are currently checked out.
- **Transaction & Login History**: Admins can view logs of all transactions and login attempts.
- **Admin Catalog Controls**: Admin users can edit catalog entries.
- **Role-Based Access**: Certain features (like transaction logs and editing catalog) are restricted to admin users.
- **Secure HTTPS**: Runs over HTTPS with custom certificates for enhanced security.
- **Session Management**: Uses sessions and flash messages for reliable authentication and feedback.

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- MySQL database
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DanielsRT/OnlineLibrarySystem.git
   cd OnlineLibrarySystem
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory and configure the following:

   ```
   DB_HOST=your-db-host
   DB_PORT=your-db-port
   DB_USER=your-db-username
   DB_NAME=your-db-name
   SESSION_SECRET=your-session-secret
   NODE_ENV=development
   ```

   > **Note**: The database password is left blank in the code for local development. For production, update `database.js` to use your secure password.

4. **Set up HTTPS Certificates**

   Place your `key.pem` and `librarymanagement.crt` files inside a `cert/` folder in the project root.

5. **Initialize the Database**

   - Create the `users`, `catalog`, `loans`, `reservations`, `transactions`, and `logins` tables in your MySQL database.
   - Insert initial data as desired.

6. **Run the Application**
   ```bash
   npm start
   ```
   The server will run on `https://localhost:3000`.

## Usage

- Visit `/register` to create a new user account.
- Log in at `/login`.
- Access the catalog, manage your loans and reservations, or view your account.
- Admins will see additional options for managing catalog entries and viewing logs.

## Project Structure

```
OnlineLibrarySystem/
  ├── cert/                   # SSL certificates
  ├── public/                 # Static assets (CSS, images)
  ├── views/                  # EJS templates for frontend
  ├── database.js             # Database connection & queries
  ├── server.js               # Main Express.js app
  ├── passport-config.js      # Passport.js configuration
  ├── .env                    # Environment variables (not committed)
  └── package.json
```

## Security

- Passwords are hashed using bcrypt.
- All sensitive routes require authentication.
- HTTPS is enforced for all traffic.
- Admin-only routes are protected with role checks.

## Customizing

- Update catalog structure in the database to add more item fields.
- Add new views in the `views/` directory.
- Customize styles in `public/css/styles.css`.

## License

MIT License

---

> **Maintainer:** [DanielsRT](https://github.com/DanielsRT)
>  
> Contributions welcome! Please open issues or submit pull requests for improvements.
