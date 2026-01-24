# PrepWise - AI Technical Interviewer

![PrepWise Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Tech Stack](https://img.shields.io/badge/stack-Next.js_14_|_Firebase_|_Vapi_|_Gemini-blue)

**PrepWise** is an advanced AI-powered mock interview platform designed to simulate real-world technical interviews. It uses **Vapi.ai** for realistic voice conversations, **Google Gemini** for intelligent question generation and feedback, and **Firebase** for secure user authentication.

---

## 🎥 Demo Preview

> **Project Goal**: A seamless end-to-end interview simulation.
>
> *Note: The video below demonstrates the full flow: **Sign In** → **Microphone/Camera Setup** → **AI Interview Session** → **Feedback Generation**.*

![App Demo](public/demo.gif)



---

## ✨ Key Features

- **🗣️ Realistic AI Voice**: Powered by **Vapi** and **11Labs**, the interviewer speaks naturally with low latency.
- **🧠 Intelligent Context**: Uses **Google Gemini** to generate relevant technical questions and analyze your answers.
- **🔒 Secure Authentication**: Robust implementation with **Firebase Auth** (Sign Up, Login, Protected Routes).
- **📹 Device Management**: Smart handling of Webcam and Microphone permissions with visual feedback.
- **🛡️ Self-Healing Connections**: customized logic to handle API key rotations and connection drops automatically.
- **📊 Post-Interview Feedback**: Detailed scorecard giving insights on technical accuracy and communication skills.

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js 14](https://nextjs.org/) (App Router), TypeScript, Tailwind CSS
- **Voice AI**: [Vapi.ai](https://vapi.ai/) (Web SDK)
- **LLM / Intelligence**: [Google Gemini Pro](https://deepmind.google/technologies/gemini/)
- **Backend / Auth**: [Firebase](https://firebase.google.com/)
- **Icons**: Lucide React
- **Validation**: Zod (for form validation)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Firebase Project
- A Vapi.ai Account (Public Key)
- A Google Gemini API Key

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/jyotii897/ai_mock_interview.git
    cd interview-ai
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root directory and add your keys:

    ```env
    # Firebase Configuration
    NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

    # AI & Voice Services
    GEMINI_API_KEY=your_gemini_api_key
    NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key
    ```

4.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

5.  **Open the App:**
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 Usage Guide

1.  **Sign Up/Login**: Create an account to start tracking your interviews.
2.  **Dashboard**: View your past interview history or start a new one.
3.  **Interview Room**:
    - Allow Microphone and Camera permissions.
    - Click **"Start Interview"**.
    - The AI (Sarah) will introduce herself and ask technical questions.
    - Speak naturally; the AI listens and responds in real-time.
4.  **End & Feedback**: Click "End Call" to finish. You will be redirected to a feedback page with an analysis of your performance.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.
