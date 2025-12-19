# 🚀 Build a Real-Time Chat App with React, Node.js, Socket.IO & Prisma

A **full-stack real-time chat application** built using **React, Node.js, Express, Prisma, MySQL, and Socket.IO**.
This project demonstrates how to implement **session-based one-to-one chat**, **real-time messaging**, and **persistent chat history** using a modern tech stack.

---

## 🧠 Features

✅ User Authentication (Register / Login)
✅ JWT-based Secure Authorization
✅ **Session-based One-to-One Chat**
✅ **Chat Session Reuse Between Users**
✅ Real-Time Messaging using Socket.IO
✅ Online Users Tracking
✅ **Message History Persistence (Reload Safe)**
✅ Responsive Modern UI with Tailwind CSS
✅ Logout & Session Handling
✅ Smooth Scroll & Auto Update for New Messages

---

## 🏗️ Tech Stack

| Layer                | Technology                    |
| -------------------- | ----------------------------- |
| **Frontend**         | React.js (Vite), Tailwind CSS |
| **Backend**          | Node.js, Express.js           |
| **Database**         | MySQL with Prisma ORM         |
| **Real-Time Engine** | Socket.IO                     |
| **Authentication**   | JWT (JSON Web Token)          |

---

## 💬 Chat Session Flow (Important Concept)

* A **chat session is created once** between two users
* The **same session is reused** every time they chat again
* All messages are linked to the session
* When users log out and log back in, **previous messages are restored**
* No duplicate sessions are created for the same user pair

This mimics how real apps like **WhatsApp / Messenger** manage chats.

---

## 🔄 Real-Time Communication Flow

1️⃣ User logs in → authenticated using JWT
2️⃣ User connects to Socket.IO → added to online users map
3️⃣ Chat session is fetched or created (once per user pair)
4️⃣ Messages are emitted in real time using Socket.IO
5️⃣ Messages are saved in MySQL via Prisma
6️⃣ Chat history loads automatically on session open

---

## 📌 Project Status

✅ **Part 1**: Authentication & basic real-time chat
✅ **Part 2**: Chat sessions & message persistence
🚧 **Part 3 (Coming Soon)**: Message delivery/read status, typing indicator, UI polish

---

## 🧑‍💻 Author

**Jitesh Raghunath Gopale**
📬 *Full Stack Developer | React & Node.js Enthusiast*

---

## ⭐ Support

If you found this helpful:

* ⭐ Star this repository
* 👍 Like the YouTube video
* 💬 Comment your doubts or feedback

It really motivates me to build more **real-world full-stack projects** 🚀
