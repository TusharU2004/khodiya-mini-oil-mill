# Khodiya Mini Oil Mill

This is a Next.js project for the Khodiya Mini Oil Mill. It includes a customer-facing website, an admin panel, and an API.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have Node.js and npm (or yarn) installed on your machine.

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/get-npm) or [yarn](https://classic.yarnpkg.com/en/docs/install/)

You will also need a MySQL database.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/TusharU2004/khodiyar-mini-oil-mill
    cd khodiya-mini-oil-mill
    ```

2.  **Install dependencies:**

    Using npm:
    ```bash
    npm install
    ```

    Or using yarn:
    ```bash
    yarn install
    ```

3.  **Set up environment variables:**

    Create a `.env.local` file in the root of your project and add the following environment variables:

    ```
    DB_HOST=your_database_host
    DB_USER=your_database_user
    DB_PASSWORD=your_database_password
    DB_NAME=your_database_name
    ```

## Available Scripts

In the project directory, you can run:

-   `npm run dev`: Runs the app in development mode with Turbopack. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

-   `npm run build`: Builds the app for production to the `.next` folder.

-   `npm run start`: Starts a Next.js production server.

## Project Structure

-   `app/`: Contains all the routes, components, and logic for the application.
    -   `api/`: API routes.
    -   `admin/`: Admin panel pages.
    -   `components/`: Reusable components.
    -   `home/`: Components for the homepage.
    -   `lib/`: Database connection logic.
    -   `public/`: Static assets like images.

## API Endpoints

-   `/api/admin/login`: Admin login.
-   `/api/contact`: Handle contact form submissions.
-   `/api/messages`: GET, POST messages.
-   `/api/messages/[id]`: GET, DELETE a specific message.
-   `/api/products`: GET products.
-   `/api/purchases`: GET, POST purchases.
-   `/api/purchases/next-bill-number`: Get the next bill number for purchases.
-   `/api/purchases/[id]`: GET, DELETE a specific purchase.
-   `/api/reviews`: GET, POST reviews.
-   `/api/reviews/[id]`: GET, DELETE a specific review.
-   `/api/sales`: GET, POST sales.
-   `/api/sales/next-bill-number`: Get the next bill number for sales.
-   `/api/sales/[id]`: GET, DELETE a specific sale.

## Admin Panel

The admin panel is located at `/admin`. You will need to log in to access the dashboard and other admin pages.

-   `/admin/dashboard`: Main dashboard.
-   `/admin/messages`: View customer messages.
-   `/admin/product`: Manage products.
-   `/admin/purchases`: Manage purchases.
-   `/admin/review`: Manage reviews.
-   `/admin/sales`: Manage sales.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
