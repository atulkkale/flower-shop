# Flower Shop

Flower Shop is a full-fledged web application built with **Node.js**, **Express.js**, and **EJS**. This project represents a functional flower shop platform with user and admin roles, login and sign-up functionality, password encryption, and email notifications. The frontend design is based on a free online template. This project was my first hands-on experience with Node.js, focusing on core functionalities like authentication, CRUD operations, and form validation.

## Project Overview

This project provides a full-featured flower shop application, including an admin panel for managing inventory and user functionalities for shopping. Users can create accounts, log in, add items to their cart (upon login), and retrieve their passwords if forgotten. Admins can access a special panel to manage flowers, performing add, update, and delete actions. The project includes password encryption for security and email notifications for successful sign-ups.

## Features

- **User Authentication**: Allows users to sign up, log in, and access their accounts with encrypted passwords stored in the database.
- **Admin Panel**: Admins can log in with a special admin email, access a dedicated panel, and manage flower inventory (add, update, delete flowers).
- **Email Notifications**: New users receive a confirmation email upon successful sign-up.
- **Password Recovery**: Users can reset their password if forgotten.
- **Form Validation**: All forms are validated to ensure proper data entry.
- **Cart Functionality**: Only logged-in users can add items to their cart.
- **Hosting**: The app is hosted on [Render](https://render.com/). Due to Render’s free hosting plan, the site may take up to 60 seconds to load after periods of inactivity.

## Technologies Used

- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Web application framework for routing and middleware.
- **EJS**: Embedded JavaScript templating for dynamic HTML generation.
- **MongoDB**: For storing user, product, and cart information.
- **Nodemailer**: For sending confirmation emails to new users.
- **BCrypt.js**: For encrypting passwords before storing them in the database.

## Getting Started

To set up and run this project locally:

1. Clone this repository:

```bash
git clone https://github.com/atulkkale/flower-shop.git
cd flower-shop
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables in a .env file, including MONGO_DB_URI, PORT=3000, SENDGRID_API_KEY, FROM_EMAIL, and ADMIN_EMAIL.

4. Run the app:

```bash
npm start
```

5. Open http://localhost:3000 in your browser to view the application.

## Project Link

You can access the deployed app on Render [here](https://flower-shop-dphr.onrender.com).

*`Note: Due to Render’s free hosting plan, it may take up to 60 seconds to load the site after periods of inactivity.`*


## Future Improvements

- Complete the frontend functionalities that are currently placeholders.
- Add more comprehensive admin panel features, such as order management and user analytics.

## Screenshots

<img width="1680" alt="Screenshot 2024-11-11 at 10 00 59 PM" src="https://github.com/user-attachments/assets/884ae2ec-d360-4049-825b-453c328ece27">

<img width="1680" alt="Screenshot 2024-11-11 at 10 01 19 PM" src="https://github.com/user-attachments/assets/13449597-907d-4a60-929b-a047b0deffd5">

<img width="1679" alt="Screenshot 2024-11-11 at 10 11 15 PM" src="https://github.com/user-attachments/assets/bc0ff9dd-0c88-4d76-bfd9-c53bba4e50bc">

<img width="1680" alt="Screenshot 2024-11-11 at 10 03 59 PM" src="https://github.com/user-attachments/assets/9de5c8df-80c6-4941-86d2-47a2ec363ce3">

<img width="1680" alt="Screenshot 2024-11-11 at 10 04 15 PM" src="https://github.com/user-attachments/assets/dec8555f-fdce-463a-abdc-e2b54537e27a">

<img width="1680" alt="Screenshot 2024-11-11 at 10 05 39 PM" src="https://github.com/user-attachments/assets/df0f150b-e5ca-486b-a23d-2eb772bb0a56">

<img width="1680" alt="Screenshot 2024-11-11 at 10 13 24 PM" src="https://github.com/user-attachments/assets/a02db8fe-ec75-4950-a90e-d9c5820d9158">
