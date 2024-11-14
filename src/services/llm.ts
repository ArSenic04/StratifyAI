import { UseCase, Resource, CompanyFinancials } from '../types';

const API_URL = 'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta';
const API_KEY = '';

async function queryLLM(prompt: string): Promise<string> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 1000,
        temperature: 0.7,
        top_p: 0.95,
        return_full_text: false,
      },
    }),
  });

  const result = await response.json();
  return result[0].generated_text;
}

export async function generateIndustryAnalysis(company: string): Promise<string> {
  const prompt = `Analyze the following company/industry: "${company}"

Please provide a detailed analysis covering:
1. Industry segment (e.g., Automotive, Manufacturing, Finance, Retail, Healthcare)
2. Key business areas and offerings
3. Main strategic focus areas (operations, supply chain, customer experience)
4. Current market position and trends

Format the response in clear paragraphs without headers.`;
  
  return queryLLM(prompt);
}

export async function generateAnswer(company: string, question: string): Promise<string> {
  const prompt = `Answer the following question about ${company}:
  
Question: ${question}

Provide a detailed, factual answer based on publicly available information.`;
  
  return queryLLM(prompt);
}

export async function generateFinancials(company: string): Promise<CompanyFinancials> {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - 4 + i).toString());
  
  const revenue = years.map(() => Math.floor(Math.random() * 1000) + 500);
  const profit = revenue.map(r => Math.floor(r * (Math.random() * 0.3 + 0.1)));
  
  return {
    revenue,
    profit,
    years,
    marketShare: Math.random() * 30 + 10,
    growthRate: Math.random() * 20 + 5
  };
}

export async function generateUseCases(company: string, industry: string): Promise<UseCase[]> {
  const prompt = `Generate 3 specific AI/ML use cases for ${company} in the ${industry} industry.

For each use case, provide:
USE CASE 1:
- Title: [specific name of the solution]
- Description: [detailed explanation of the AI/ML solution]
- Impact: [quantifiable business benefits and ROI]
- Implementation: [technical approach and required resources]

USE CASE 2:
[same format]

USE CASE 3:
[same format]

Focus on practical solutions that enhance:
1. Operational efficiency
2. Customer experience
3. Revenue generation
4. Cost reduction

Include specific technologies like GenAI, LLMs, or ML where relevant.`;

  const response = await queryLLM(prompt);
  const useCases = parseUseCases(response);
  
  // Generate common resources for all use cases
  const kaggleUrl = `https://www.kaggle.com/search?q=${encodeURIComponent(company)}+datasets`;
  const huggingfaceUrl = `https://huggingface.co/datasets?search=${encodeURIComponent(company)}`;
  const githubUrl = `https://github.com/search?q=${encodeURIComponent(company)}`;
  
  // Add the same resources to all use cases
  return useCases.map(useCase => ({
    ...useCase,
    resources: [kaggleUrl, huggingfaceUrl, githubUrl]
  }));
}

export async function generateResources(industry: string): Promise<Resource[]> {
  const prompt = `Provide 4 specific resources for implementing AI/ML in the ${industry} industry.

Include:
1. Two relevant industry reports from McKinsey/Deloitte/Gartner
2. One technical implementation guide
3. One case study of successful AI implementation

Format each as:
RESOURCE 1:
Title: [specific title]
Type: [Report/Guide/Case Study]
Source: [Organization]

RESOURCE 2:
[same format]`;

  const response = await queryLLM(prompt);
  return parseResources(response);
}

function parseUseCases(text: string): UseCase[] {
  const useCases: UseCase[] = [];
  const useCaseBlocks = text.split(/USE CASE \d+:/g).filter(block => block.trim());

  for (const block of useCaseBlocks) {
    const titleMatch = block.match(/Title:\s*([^\n]+)/);
    const descMatch = block.match(/Description:\s*([^\n]+)/);
    const impactMatch = block.match(/Impact:\s*([^\n]+)/);
    const implMatch = block.match(/Implementation:\s*([^\n]+)/);

    if (titleMatch && descMatch && impactMatch) {
      useCases.push({
        title: titleMatch[1].trim(),
        description: descMatch[1].trim(),
        impact: impactMatch[1].trim(),
        implementation: implMatch ? implMatch[1].trim() : '',
        resources: [] // Will be populated later with company-specific resources
      });
    }
  }

  return useCases;
}

function parseResources(text: string): Resource[] {
  const resources: Resource[] = [];
  const resourceBlocks = text.split(/RESOURCE \d+:/g).filter(block => block.trim());

  for (const block of resourceBlocks) {
    const titleMatch = block.match(/Title:\s*([^\n]+)/);
    const typeMatch = block.match(/Type:\s*([^\n]+)/);
    const sourceMatch = block.match(/Source:\s*([^\n]+)/);

    if (titleMatch && typeMatch && sourceMatch) {
      const title = titleMatch[1].trim();
      const type = typeMatch[1].trim();
      const source = sourceMatch[1].trim();

      let url: string;
      if (type.toLowerCase().includes('report')) {
        url = `https://www.google.com/search?q=${encodeURIComponent(`${title} ${source} AI report pdf`)}`;
      } else if (type.toLowerCase().includes('guide')) {
        url = `https://www.google.com/search?q=${encodeURIComponent(`${title} ${source} implementation guide`)}`;
      } else {
        url = `https://www.google.com/search?q=${encodeURIComponent(`${title} ${source} case study`)}`;
      }

      resources.push({
        title: `${title} (${type} by ${source})`,
        url
      });
    }
  }

  return resources;
}
