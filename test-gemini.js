const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

const apiKey = process.env.GEMINI_API_KEY; // || "AIzaSy..."; 

if (!apiKey) {
    console.error("❌ No API Key found in env!");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testModel(modelName) {
    console.log(`Testing model: ${modelName}...`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        console.log(`✅ SUCCESS: ${modelName} is working!`);
        console.log("Response:", response.text());
        return true;
    } catch (error) {
        console.error(`❌ FAILED: ${modelName}`);
        console.error(error.message);
        return false;
    }
}

async function run() {
    // Try newer models first
    const models = ["gemini-1.5-flash", "gemini-2.0-flash-exp", "gemini-1.5-pro", "gemini-1.0-pro", "gemini-pro"];

    for (const m of models) {
        const success = await testModel(m);
        if (success) break;
    }
}

run();
