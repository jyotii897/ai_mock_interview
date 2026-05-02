# 🎓 PrepWise - AI Mock Interview Platform

PrepWise is an intelligent, AI-powered mock interview application designed to help job seekers practice and perfect their interview skills. Built with modern web technologies, it generates tailored technical questions based on your specific job role, tech stack, and experience level using the Google Gemini API.

## 🚀 Features

- **Customizable Mock Interviews**: Tailor your interview by specifying the Target Job Role, Tech Stack, and Years of Experience.
- **AI-Powered Questions**: Uses Google's **Gemini 1.5 Flash** model to dynamically generate relevant, challenging interview questions.
- **Modern Tech Stack**: Built on the bleeding edge with **Next.js 15** and **React 19**.
- **Beautiful UI**: Styled with **TailwindCSS** and accessible **Shadcn UI** components.
- **Robust Forms**: Seamless form handling and validation using **React Hook Form** and **Zod**.
- **Database & Auth**: Integrated with **Firebase** for backend services.
- **Webcam Support**: Ready for simulated face-to-face interview experiences using `react-webcam`.

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Library**: React 19
- **AI Engine**: Google Generative AI (Gemini)
- **Styling**: Tailwind CSS
- **Components**: Radix UI / Shadcn
- **Backend/DB**: Firebase
- **Deployment**: Vercel

## 🏃‍♂️ Getting Started

Follow these steps to run the project locally on your machine.

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 2. Install Dependencies
Navigate into the project directory and install the required NPM packages:
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root of your project and add your API keys. You will need a Google Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
# Add your Firebase configuration keys here as well
```

### 4. Run the Development Server
Start the local server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Deployment
This project is optimized for deployment on [Vercel](https://vercel.com). 
1. Push your code to a GitHub repository.
2. Import the repository into Vercel.
3. Add your `GEMINI_API_KEY` to the Vercel Environment Variables.
4. Deploy!

---
*Built to help you ace your next interview.* 💼
