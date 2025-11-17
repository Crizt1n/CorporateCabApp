# **Corporate Cab Management App – React Native (Expo)**

A cross-platform mobile application built with **React Native + Expo** using **TypeScript**, **Expo Router**, and modern development tools.
This project is part of the **React Native Developer Technical Assignment**.

---

## **📌 Project Overview**

This application is a mini-MVP for managing corporate cab operations.
It includes:

* Secure authentication
* Role-based access (Employee / Admin)
* Weekly cab schedule workflow
* Basic admin dashboard
* Map integration (Google Maps)
* Push notification mocks
* Trip flow placeholders

**Note:**
Due to time constraints and work commitments, only the core foundations and partial feature implementations are completed.
The architecture, navigation structure, screens, and initial flows are set up — so you can clearly review the coding approach and implementation style.

---

## **🛠️ Tech Stack**

### **Frontend**

* **React Native**
* **Expo (Development Build)**
* **TypeScript**
* **Expo Router v3**
* **React Query**
* **Zustand / Redux Toolkit** (depending on your implementation)
* **NativeWind (Tailwind CSS for RN)**
* **React Native Reanimated & Gesture Handler**
* **React Native Maps / Google Maps**
* **Lucide Icons**

### **Backend / Services**

* **Firebase / Supabase** (Auth + optional DB)
* **Custom REST Mock APIs**
* **Google Maps API (Geocoding + Places)**
* **OpenAI API (optional AI assistant)**

---

## **📂 Project Structure**

```
├── app/
│   ├── (auth)/           # Login, onboarding, role setup
│   ├── (employee)/       # Employee home, schedule, change requests
│   ├── (admin)/          # Admin dashboard & approvals
│   ├── api/              # Server functions / API handlers
│   ├── _layout.tsx       # Root navigation layout (Expo Router)
│   └── +not-found.tsx    # 404 Fallback
│
├── components/           # Reusable UI components
├── hooks/                # Custom hooks (auth, map, queries)
├── store/                # Zustand / Redux global state
├── services/             # API clients (Firebase, Supabase, Maps, OpenAI)
├── utils/                # Helpers, formatters, validators
├── assets/               # Fonts, images, icons
│
├── app.json              # Expo configuration
├── package.json          # Dependencies & scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```

---

## **🚀 Running the Project Locally**

### **📌 Requirements**

* Node.js (LTS recommended)
* Bun or npm/yarn/pnpm
* Expo CLI
* (Optional) Xcode / Android Studio for simulators

---

### **▶️ Installation**

```bash
# Clone the repo
git clone <REPO_URL>

cd <PROJECT_FOLDER>

# Install dependencies
bun install
# or
npm install

# Start development
bun run start
# or
npm start
```

---

## **📱 Testing the App**

### **1. On a real device (Recommended)**

* Install **Expo Go** (Android)
* Use QR code from terminal after running `bun run start`

### **2. iOS / Android Simulator**

```bash
# iOS
bun run start -- --ios

# Android
bun run start -- --android
```

---

## **🔑 Authentication**

The project uses:

* Firebase / Supabase Auth
* Role assignment (Employee / Admin)
* First-time onboarding to collect:

  * Name
  * Email
  * Phone
  * Home Address (with geolocation via Google Maps API)

---

## **📅 Weekly Schedule (Implemented partially)**

Employees can:

* Select Pickup / Drop times
* Choose Home / Office
* Submit weekly plan
* Client-side validations completed
* Backend hooks created (mock integration)

Admins can:

* View submitted schedules
* Approve / Reject (UI ready, API mock available)

---

## **🚕 Trip Flow (Base Implemented)**

* QR Code generation / scan placeholder UI
* Push notification flow (mocked)
* Trip start/end logs prepared in store
* Simulated tracking available (static route)

---

## **📊 Admin Dashboard (Basic Version)**

Includes:

* Total trips count
* Approved vs Pending
* Dummy stats
* Prepared to integrate real backend

---

## **🤖 Optional AI Assistant (Initial Setup Added)**

Ready-to-integrate endpoints for:

* *“What time is my cab tomorrow?”*
* *“How many trips this week?”*

OpenAI service file + base hook implemented.

---

## **📄 Deliverables Included**

* Clean and modular architecture
* Consistent TypeScript usage
* Structured folder layout
* Core flows scaffolded
* README with setup instructions

---

## **⚠️ Note from Developer**

Due to limited time (current job workload), only the foundation and partial functionality have been implemented — but the overall structure is production-ready and easy to extend.

The goal was to demonstrate:

* Architecture planning
* State management
* Navigation design
* API layer setup
* Map integration
* Clean coding standards
