# 🎓 FPN Campus Navigation & Admin System


Welcome! This project is a dual-purpose application designed to help students navigate the **Federal Polytechnic Nasarawa (FPN)** campus and provide administrators with a way to manage campus locations easily.

---

## 🚀 How to Set This Up

To run this project on your computer, follow these simple steps:

### 1. Install the "Tools of the Trade"
You need a few basic programs installed:
- **Node.js**: The "engine" that runs the code. [Download it here](https://nodejs.org/).
- **VS Code**: A text editor for viewing and editing code. [Download it here](https://code.visualstudio.com/).
- **Git**: (Optional but recommended) For managing your code versions.

### 2. Download and Extract
- Unzip the project folder onto your desktop or documents folder.

### 3. Install Project Requirements
- Open your terminal (or Command Prompt) in the project folder.
- Type this command and press Enter:
  ```bash
  npm install
  ```
  *This downloads all the "ingredients" (libraries) the app needs to work. It might take a few minutes.*

### 4. Set Up the Database
- This app uses **Supabase** for its database.
- Create a file named `.env` in the root folder.
- Copy the content from `.env.example` into your new `.env` file and put in your actual Supabase URL and Key.

### 5. Start the App!
- In the same terminal, type:
  ```bash
  npx expo start
  ```
- **To view on Web:** Press `w` on your keyboard.
- **To view on Android/iPhone:** Download the **"Expo Go"** app from the Play Store/App Store, then scan the QR code that appears in your terminal.

---

## 🛠️ Tech Stack (The "Magic" Behind the App)

1.  **React Native & Expo:** This allows us to write code once and have it work on both Android, iOS, and Web.
2.  **TypeScript:** A more organized and safer way of writing JavaScript (the language of the web).
3.  **Supabase:** Our "brain" in the clouds. It stores all the campus locations and details.
4.  **Google Maps API:** Provides the actual maps, satellite views, and the road-based navigation routes.
5.  **Vercel:** A hosting service that makes the Admin page accessible to anyone with a link.

---

## 📁 What Does Each File Do? (Project Anatomy)

Here is a simple breakdown of the important folders and files:

### Folders:
- **`app/`**: This is the heart of the app.
  - **`(tabs)/index.tsx`**: The main screen students see (The Map and Location List).
  - **`admin.tsx`**: The dashboard for managers to add or delete buildings.
  - **`_layout.tsx`**: The "skeleton" that holds all pages together.
- **`assets/`**: Contains the "makeup" of the app—images, icons, and the loading screen logo.
- **`components/`**: Small, reusable building blocks.
  - **`CampusMap.tsx`**: The specialized code that handles showing the map and drawing paths.
  - **`ui/IconSymbol.tsx`**: A tool that helps us show icons like "Home", "Trash", or "Maps".
- **`lib/`**: Contains "connections".
  - **`supabase.ts`**: The bridge that connects our app to our database.
- **`hooks/`**: Specialized tools for handling themes (Dark/Light mode) and colors.

### Key Files:
- **`app.json`**: The "ID Card" of the app. It contains the name, version, and special settings like the Google Maps Key.
- **`package.json`**: A shopping list of all the libraries used in the project.
- **`eas.json`**: Instructions for how to turn the code into an Android APK file.
- **`.env`**: (Private) Stores your secret keys for the database. **Never share this file!**
- **`vercel.json`**: Instructions for the web host so the Admin page works properly online.

---

## 🗺️ Key Features
- **Smart Search:** Find any hall or building by name or category (e.g., "Lecture Theatre").
- **Road Navigation:** Instead of just a straight line, it shows you the actual path to walk or drive.
- **Satellite View:** Switch between a standard map and real aerial photos.
- **Mobile-Friendly Admin:** Admins can add new spots even while walking around campus using their phones.

---

**Developed for Federal Polytechnic Nasarawa (FPN)**
