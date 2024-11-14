import React, { useState } from 'react';
import { Search, Brain, Database, FileText, ArrowRight, Loader2, Download } from 'lucide-react';
import Header from './components/Header';
import AgentCard from './components/AgentCard';
import ResultsPanel from './components/ResultsPanel';
import { CompanyData, AgentStatus } from './types';
import { generateIndustryAnalysis, generateUseCases, generateResources, generateAnswer, generateFinancials } from './services/llm';
import { generateReport } from './services/report';

export default function App() {
  const [companyName, setCompanyName] = useState('');
  const [question, setQuestion] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeAgent, setActiveAgent] = useState<number | null>(null);
  const [results, setResults] = useState<CompanyData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!companyName) return;
    
    setIsAnalyzing(true);
    setError(null);
    setResults(null);
    
    try {
      // Research Agent
      setActiveAgent(0);
      const industry = await generateIndustryAnalysis(companyName);
      
      // Use Case Generator
      setActiveAgent(1);
      const useCases = await generateUseCases(companyName, industry);
      
      // Generate financials
      const financials = await generateFinancials(companyName);

      // Generate answer if question exists
      const qaResponse = question ? await generateAnswer(companyName, question) : undefined;
      
      // Resource Collector
      setActiveAgent(2);
      const resources = await generateResources(industry);
      
      setResults({
        industry,
        useCases,
        resources,
        financials,
        qaResponse
      });
    } catch (err) {
      setError('An error occurred while analyzing. Please try again.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
      setActiveAgent(null);
    }
  };

  const handleDownloadReport = async () => {
    if (results && companyName) {
      await generateReport(companyName, results);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-[1200px]">
        {/* Input Section */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="space-y-4">
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company or industry name..."
              className="input-primary"
            />
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a specific question about the company (optional)..."
              className="input-primary"
            />
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !companyName}
              className="btn-primary w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing
                </>
              ) : (
                <>
                  <ArrowRight className="w-5 h-5" />
                  Analyze
                </>
              )}
            </button>
          </div>
          {error && (
            <div className="mt-4 text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Agents Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <AgentCard
            icon={Search}
            title="Research Agent"
            description="Analyzes industry trends and company information"
            status={activeAgent === 0 ? AgentStatus.Active : activeAgent === null ? AgentStatus.Idle : AgentStatus.Complete}
          />
          <AgentCard
            icon={Brain}
            title="Use Case Generator"
            description="Identifies AI/ML opportunities and generates use cases"
            status={activeAgent === 1 ? AgentStatus.Active : activeAgent === null ? AgentStatus.Idle : activeAgent > 1 ? AgentStatus.Complete : AgentStatus.Pending}
          />
          <AgentCard
            icon={Database}
            title="Resource Collector"
            description="Gathers relevant datasets and implementation resources"
            status={activeAgent === 2 ? AgentStatus.Active : activeAgent === null ? AgentStatus.Idle : activeAgent > 2 ? AgentStatus.Complete : AgentStatus.Pending}
          />
        </div>

        {/* Results */}
        {results && (
          <>
            <ResultsPanel data={results} />
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleDownloadReport}
                className="btn-secondary"
              >
                <Download className="w-5 h-5" />
                Download Company Report
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}