# 💬 Real-Time Chat Application

A full-stack real-time messaging application built with **Angular** and **ASP.NET Core**. This app supports instant messaging and secure media sharing.

## 🚀 Features

* **Real-Time Messaging:** Instant message delivery using **SignalR**.
* **Simple Login:** User login system to identify participants.
* **Media Sharing:** Upload and download images directly in the chat.
* **Smart Download:** Forces file downloads for images instead of opening them in the browser.

## 🛠️ Tech Stack

**Frontend:**
* Angular (v17+)
* Bootstrap (for styling)
* RxJS (State management)

**Backend:**
* ASP.NET Core Web API
* SignalR (WebSocket communication)
* C#

---

## ⚙️ Prerequisites

Before running the project, make sure you have the following installed:

* **Node.js** (Recommended: Use `nvm` to manage versions)
* **Angular CLI:** `npm install -g @angular/cli`
* **.NET SDK:** (Download from Microsoft)

---

## 🏃‍♂️ How to Run

### 1. Backend Setup (ASP.NET Core)
1.  Navigate to the backend folder:
    ```bash
    cd ChatApp.API
    ```
2.  Restore dependencies:
    ```bash
    dotnet restore
    ```
3.  Run the application:
    ```bash
    dotnet run
    ```
    > The API will start on `https://localhost:7042` (or similar).

### 2. Frontend Setup (Angular)
1.  Navigate to the frontend folder:
    ```bash
    cd ChatApp.Client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    ng serve
    ```
4.  Open your browser and go to `http://localhost:4200`.

---

## 📂 Configuration Notes

* **CORS:** The backend is configured to allow requests from `http://localhost:4200`. If you change the frontend port, update `Program.cs` in the backend.
* **File Storage:** Uploaded images are stored in the `wwwroot/Uploads` folder in the backend directory. Ensure this folder exists.

---
**Happy Coding!** 🚀
