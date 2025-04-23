# Diet Planner App

A comprehensive web application for diet planning, meal tracking, and nutritional analysis. This application helps users create personalized diet plans based on their health goals, dietary preferences, and nutritional requirements.

![Diet Planner App Dashboard](/public/images/screenshots/main-banner.png)

## Table of Contents
- [Features](#features)
- [Screenshots](#screenshots)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Setup](#setup)
- [Usage](#usage)
- [Firebase Configuration](#firebase-configuration)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Personalized Diet Plans**: Generate diet plans based on user goals (weight loss, maintenance, muscle gain)
- **Multiple Diet Types**: Support for various diet types including Keto, Low-Carb, High-Protein, Paleo, Mediterranean, Vegetarian, and Vegan
- **BMI Calculator**: Calculate Body Mass Index and get health recommendations
- **Nutritional Analysis**: Track calories, macronutrients (protein, carbs, fats), and fiber
- **Meal Management**: Add, edit, delete, and reorder meals and food items
- **Print Diet Charts**: Generate printable diet charts for offline reference
- **User Authentication**: Secure login and registration with Firebase
- **Diet History**: Save and access previously created diet plans
- **Responsive Design**: Mobile-friendly interface for on-the-go access
- **Admin Panel**: Manage food database and user data (admin only)
- **Offline Support**: Basic functionality available without internet connection

## Screenshots

### Main Dashboard
![Dashboard View](/public/images/screenshots/dashboard.png)

### Diet Chart Generator
![Diet Chart Generator](/public/images/screenshots/diet-chart-generator.png)

### BMI Calculator
![BMI Calculator](/public/images/screenshots/bmi-calculator.png)

### Profile Settings
![Profile Settings](/public/images/screenshots/profile-settings.png)

> **Note:** To add your own screenshots:
> 1. Take screenshots of your app's key features (dashboard, diet chart generator, BMI calculator, profile settings)
> 2. Save them as PNG files named: `dashboard.png`, `diet-chart-generator.png`, `bmi-calculator.png`, and `profile-settings.png`
> 3. Place them in the `/public/images/screenshots/` directory
> 4. Push these changes to your repository

## Technologies Used

- **Frontend**: React.js, Material UI
- **Build Tool**: Vite
- **State Management**: Context API
- **Backend & Auth**: Firebase (Authentication, Firestore)
- **Routing**: React Router
- **Drag and Drop**: react-beautiful-dnd
- **UI Components**: MUI (Material UI)
- **Deployment**: Vercel

## Installation

To get started with the Diet Planner App locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/PraveenDubbaka/diet-planner-app.git
   cd diet-planner-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (see [Setup](#setup) section)

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## Setup

### Environment Variables

Create a `.env` file in the root directory with the following Firebase configuration:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Replace the placeholders with your actual Firebase project credentials.

## Usage

### User Registration and Login

1. Create a new account using the Registration form
2. Fill in your profile details including:
   - Weight, height, and age
   - Activity level
   - Dietary preferences
   - Health goals

### Creating a Diet Plan

1. Navigate to the Diet Chart Generator tab
2. Add or remove meals as needed
3. Add food items to each meal
4. Track nutritional information in real-time
5. Save your diet plan for future reference
6. Print your diet chart using the Print button

### BMI Calculator

1. Input your height and weight
2. Get instant BMI calculation
3. Receive health recommendations based on your BMI

### Viewing Diet History

1. Navigate to the Dashboard
2. View previously saved diet plans
3. Select any plan to view or edit

## Firebase Configuration

This app uses Firebase for authentication and database services. To configure Firebase:

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Set up Firestore Database
4. Copy your web app's Firebase configuration
5. Add the configuration to your environment variables as described in the [Setup](#setup) section

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Created by [Praveen Dubbaka](https://github.com/PraveenDubbaka)