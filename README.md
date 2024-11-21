# Stratify Website

Stratify is an intelligent web application that generates text-based insights and analytics about any company entered by the user. The application utilizes advanced Hugging Face models for answering user queries, recommending use cases, providing AI-based relations, and displaying related articles about the company.

## Key Features
- **Text Generation**: Generate detailed insights and statistics for any user-inputted company.
- **Dynamic Question Answering**: Ask any question about the entered company and receive intelligent answers.
- **Recommended Use Cases**: Explore AI-powered recommended use cases for the company.
- **AI Relations**: Understand how AI relates to the company and its industry.
- **Related Articles**: Fetch and display relevant articles from the internet about the company.
- **Model Switching**: Switch between Hugging Face models seamlessly by entering a custom API and endpoint.

---

## Installation and Setup

### Prerequisites
1. Ensure you have **Node.js** and **npm** installed.
2. Install **TypeScript** globally:  
   ```bash
   npm install -g typescript
3. Create an account on [https://huggingface.co/](Hugging Face) and generate your API key (details below).

## Steps to Run the Project

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/stratify.git
   cd stratify
2. Install dependencies:
   ```bash
   npm install
3. Create an .env file in the root directory and add the following:
   ```bash
   REACT_APP_API_URL=https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta
   REACT_APP_API_KEY=your_hugging_face_api_key
4. Build the TypeScript project:
   ```bash
   npm run build
5. Start the development server:
   ```bash
   npm run dev
## Steps to Generate a Hugging Face API Key
1.Go to Hugging Face.
2.Sign in or create an account.
3.Navigate to your account settings and select API Tokens.
4.Click on New Token, provide a name, and generate the token.
5.Copy the generated token and add it to your .env file as REACT_APP_API_KEY.
   
## Customizing the Hugging Face Model
To switch models, update the following code in src/config.ts:
  ```bash
  export const API_URL = 'https://api-inference.huggingface.co/models/{model_name}';
  export const API_KEY = 'your_hugging_face_api_key';


