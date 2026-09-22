# 🚀 Identa – AI-Driven Smart Campus Engagement Platform

An IoT-enabled, SaaS-based Smart Campus Platform designed to intelligently manage attendance, canteen payments, library automation, and learning engagement analytics using BLE-based proximity validation and real-time backend processing. 


---

## 🧠 Project Vision

Traditional campus systems treat attendance, library, and payments as isolated services. Furthermore, attendance only tracks physical presence, not actual student engagement.

**Identa transforms attendance into intelligent engagement monitoring.** We integrate IoT-based proximity validation with real-time analytics to classify student engagement, preventing proxy attendance and providing actionable insights to faculty and parents.

---

## 🎯 Core Objectives

- **Prevent Proxy Attendance:** Utilize BLE-based proximity validation to ensure students are actually in the classroom.
- **Track True Engagement:** Combine attendance data with quiz performance for intelligent engagement classification.
- **Unified SaaS Platform:** Integrate canteen, library, and academic tracking into one seamless ecosystem.
- **Actionable Insights:** Enable real-time analytics dashboards for faculty and parents.
- **Future-Proof:** Build a 5G-ready, highly scalable architecture.

---

## 🏗️ System Architecture 

The platform follows a robust 5-layer architecture:

1. **User Layer:** Student Mobile App, Faculty Dashboard, Parent Dashboard.
2. **IoT Layer:** ESP32 BLE Classroom Beacons, Smart Gate Nodes (WiFi-enabled).
3. **Validation Layer:** Time-window verification, RSSI-based proximity validation, Enrollment authentication.
4. **Backend Layer:** REST APIs, functional modules (Attendance, Quiz, Library, Wallet), PostgreSQL Database.
5. **Analytics Layer:** Engagement classification engine, Risk detection, Faculty insights.

---

## 🧰 Tech Stack

**Backend**
- Python 🐍
- FastAPI ⚡
- PostgreSQL 🐘

**IoT**
- ESP32 (BLE + WiFi) 📡
- BLE Beacon Mode & RSSI Proximity Detection

**Frontend (Planned)**
- React ⚛️
- Web Dashboards

**Deployment (Planned)**
- Docker 🐳
- Cloud Hosting (AWS / Render)

---

## 📚 Functional Modules

### 📍 Attendance Module
- BLE-based classroom proximity detection.
- Time-window validation.
- Proxy-resistant architecture.

### 📊 Engagement Analytics Module
- Attendance + Quiz-based classification.
- Student performance insights.
- Early risk detection for struggling students.

### 🏫 Library Module
- Digital student verification.
- Book issue/return logging.
- Due-date management.

### 💳 Canteen Module
- Wallet-based transactions.
- Digital transaction logs.
- Centralized monitoring.

### 👨‍👩‍👧 Parent Dashboard
- Automated attendance reports.
- Academic engagement score tracking.
- Expense and wallet monitoring.

---

## 🔐 Security & Privacy
- **No Sensitive Data on Edge Devices:** Devices only broadcast/scan UUIDs.
- **Backend-based Validation:** All logic and verification happen securely on the server.
- **RBAC:** Strict Role-Based Access Control for students, faculty, and admins.
- **Secure Communication:** Encrypted API payloads.

---

## 🔮 Future Scope
- AI-based predictive engagement modeling.
- Real-time anomaly detection.
- 5G campus-scale deployment.
- Edge computing integration.

---

## 👥 Team
- **Harman** – Backend Engineer
- **Jalaj** – Product Engineer
  
---

## 📜 License
This is an Academic Project distributed under the [MIT License](LICENSE).
