# ParkPal - Parking Lot System
### Abraham Acquah Baffoe
#### 21/11/2024 | Mesa Verde

## Document Objectives 
The purpose of this document is to provide detailed documentation about the application you will be building for your Prime Solo Project. It should include such details as:

All Functional Requirements/Features described (how the app works)
Technology stack used (Frameworks, Libraries), including any 3rd party APIs/web services
Milestones and rough schedule

# Application Overview
(Provide a high-level description of what the application is/does. Consider this the summary or elevator pitch you would use to get someone interested in your project.)


ParkPal is an innovative parking lot finder app designed to simplify the lives of city dwellers. In bustling urban environments where finding parking can be a significant challenge, ParkPal provides real-time information about available parking spots nearby.

With a user-friendly interface, the app allows users to quickly search for, reserve, and navigate to parking spaces, saving them time and reducing the stress of driving in crowded areas. Key features include:

1. Real-time Availability: Get instant updates on open parking spots and discover nearby options at a glance.
2. One-Tap Reservations: Reserve your parking spot ahead of time, eliminating the last-minute scramble.
3. Smart Navigation: Seamlessly integrated GPS guides you directly to your chosen space, ensuring you never lose your way.
4. Community Feedback: Access insights from fellow users through ratings and reviews to find the best parking options.
5. Traffic Insights: Receive tips on popular parking areas and peak times to avoid for optimal convenience.

Whether you're a commuter, a visitor, or a resident, ParkPal makes parking hassle-free, allowing you to focus on what truly matters—enjoying your time in the city.

# Functional Requirements
(ALL of the features of this application will be listed below with a wireframe and written details as to how the UI elements will work. Write it from the user perspective but also note any business logic that dictates behavior.)
### 1.1 User-Authentication (Mobile)
#### Requirements:
1. User Registration: Clean, modern interface with brand colors
2. Social media login options (Google, Facebook)
3. Email/password authentication
4. Password recovery functionality
5. Registration form with essential fields:
6. Full name
7. Email
8. Password
9. Phone number (optional)
10. Vehicle information (optional)


Registered users can log in via a straightforward login page, which includes a link to the Registration page for new users. The User Signup page features fields for entering a username and password, along with two buttons: one to return to the login screen and another to submit the registration form. After successful submission, users are automatically logged in with their new account, ensuring a seamless experience.
Forgot password will not be included in this project.

### 1.1 Log-in (Web)

Registered users will be able to log in to the application. The Log-in page will contain a link to the Registration page (no wireframe included). Registration will contain text inputs for username and password. The Registration page will also contain a button that navigates the user back to the Log-in screen and a button that will submit the form. After successful form submission, ( the user will automatically be logged in with the new account ).

* Forgot password will not be included in this project.



### Requirements:
1. Responsive design for desktop and tablet
2. Consistent branding with mobile version
3. Enhanced security features
4. Admin login capabilities
5. Session management

### User Flow For Mobile and Desktop Version
1. User opens app
2. Selects login or register
3. Completes required fields
4. Receives confirmation
5. Proceeds to main dashboard

## 1.2  Parking Spot Search & Reservation
#### Main Dashboard
##### Features:
1. Map view with available spots
2. List view option
3. Quick filters:
4. Price range
5. Distance
6. Availability
7. Parking type
8. Real-time updates
9. Favorite locations


## 1.3  Spot Details View
### Information Displayed:
Pricing details
Operating hours
Available spaces
Facilities (covered, security, etc.)
User ratings and reviews
Photos
Directions

### Reservation Flow
#### Steps:
1. Select parking duration
2. Choose vehicle type
3. Review pricing
4. Confirm booking
5. Receive QR code/confirmation

### Payment Methods Screen
Brief description of the screen goes here
Supported Methods:
Credit/Debit cards
Digital wallets
Mobile payments
In-app credits

1.5 Transaction History Page
Brief description of the page goes in there
	Features:
Detailed receipt view
Export options
Filter by date/location
Refund requests


1.5 Navigation & Tracking
Brief description of the page goes in there
Features:
Turn-by-turn directions
ETA calculation
Alternative routes
Voice guidance
Offline map support

Design of the Navigation & Tracking


1.6 Parking Timer
Brief description goes here
	Features:
Time remaining display
Extension options
Expiration alerts
Early departure options
IMAGE SHOW OF PARKING TIMER



Third-Party APIs Needed for ParkPal
Google Maps API:
Geocoding
Places API
Directions API

Payment Gateways
Stripe
Authentication
Clerk
Passport


Endpoints (routes) need to be accessed.
 Core API Routes
   /api/auth
   /api/users
   /api/parking
   /api/bookings
   /api/payments

Payment Endpoints
POST /api/payments/create
POST /api/payments/confirm
POST /api/payments/refund

Authentication Endpoints

POST /api/auth/logout
POST /api/auth/register
POST /api/auth/sign-in

 User Management Endpoints
GET /api/users/profile
PUT /api/users/profile
POST /api/v/users/vehicle
Parking Management Endpoints
GET /api/parking/spots
GET /api/parking/spots/:id
POST /api/parking/spots/search

Booking Endpoints
POST /api/bookings/create
GET /api/bookings/:id
PUT /api/bookings/:id
DELETE /api/bookings/:id

Admin Endpoints
GET /api/admin/users
GET /api/admin/bookings
GET /api/admin/revenue



ParkPal - Detailed Milestone Breakdown
Project Milestones & Timeline

Milestone (Should match a Feature from Above)
Descriptions
Due Date
Base or Stretch
Project Foundation -

 Project Setup including 
Database Design, 
Basic authentication 
CI/CD pipelines

Configure React + Vite + TypeScript
Create initial PostgreSQL schema
Implement passport auth flow
Setup GitHub Actions workflow
12/01/2024
Base
User Management






Login Page
Registration Page
User Profile
Password aut-gen
Create login UI and integration.
Build registration flow
Basic profile management
12/
Base
Map Integration with other APIs






Map Component
Location Search
Spot Markers
Geolocation
Setup Google Maps integration
Add search functionality
Add parking spot markers
Add current location feature


Base
Parking Features






Spot Listing
Spot Details
Spot Search
Spot Availability 
Create spot listing view
Build detailed view
Implement search filters
Real-time availability check


Base





Stretch
Booking System






Booking Form
Time Selection
Booking Confirmation
Booking Management
Create booking interface
Add time slot picker
Add confirmation flow
View/cancel bookings


Base
Payment Integration






Payment Form
Stripe Integration
Payment Confirmation
Receipt Generation
Create payment UI
Setup Stripe payments
Add success/failure flows
Add receipt creation




Admin Features







Admin Dashboard

User Management

Spot Management

Revenue Reports
Create admin interface - UI and Backend

Add user management - UI and Backend

Add spot management - UI and Backend

Add basic reporting - UI and Backend






Stretch/ Base
STRETCH GOALS






Testing Suite
404 Pages
505 Pages
PWA setup
E2E Tests
Responsive Design




Stretch










Database Documentation
Include an image/screenshot of your ERD or Database diagrams. This needs to show all expected tables with lines for the Primary/Foreign Key relationships.

````https://dbdiagram.io/d/6744d088e9daa85acaab4238````

Browsers
(Consider which browsers your target audience(s) will be likely to use and list them here. If you're targeting mobile-only, your list should note the mobile version of the browsers.)
 
Application will fully support browsers listed below. All browsers or versions not listed below are considered out of scope.

Browser Name
Mobile or Desktop?
Version
Safari
Desktop and Mobile
96+
Firefox
Desktop and Mobile
15+
Edge
Desktop and Mobile
95+
Chrome
Desktop and Mobile
Version 96.x





## Technologies
### Frontend
1. React JS with Zustand
2. Tailwind CSS 
3. Material UI / Shadcn UI
4. React Native with Expo (Mobile)

### Backend 
1. Node JS
2. Express
3. Postgresql
4. Redis (caching)
5. Deployment
6. Heroku
7. Docker
8. Kubernetes

