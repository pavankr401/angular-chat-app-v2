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

* **Visual Studio 2026:** (Ensure "ASP.NET and web development" workload is installed)
* **Node.js** (Recommended: Use `nvm` to manage versions)
* **Angular CLI:** `npm install -g @angular/cli`

---

## 🏃‍♂️ How to Run

### 1. Backend Setup (Visual Studio 2026)
1.  Open the `ChatApp.sln` file in **Visual Studio 2026**.
2.  Press **F5** (or click the green Play button) to build and run the backend.
    > The API will start on `https://localhost:7042` (or similar).

### 2. Frontend Setup (Angular)
1.  Open a terminal (or VS Code) in the frontend folder:
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

* **CORS:** The backend is configured to allow requests from `http://localhost:4200`.
* **File Storage:** Uploaded images are stored in the `wwwroot/Uploads` folder in the backend directory.

---
**Happy Coding!** 🚀
