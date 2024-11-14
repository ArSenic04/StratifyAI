import React from 'react';
import { FileText, Link as LinkIcon, BookOpen, Database, Github, MessageCircle } from 'lucide-react';
import { CompanyData } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ResultsPanelProps {
  data: CompanyData;
}

export default function ResultsPanel({ data }: ResultsPanelProps) {
  const chartData = data.financials?.years.map((year, index) => ({
    year,
    revenue: data.financials!.revenue[index],
    profit: data.financials!.profit[index],
  }));

  return (
    <div className="space-y-8">
      {/* Q&A Response */}
      {data.qaResponse && (
        <section className="card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            Question & Answer
          </h3>
          <p className="text-gray-300 text-[15px]">{data.qaResponse}</p>
        </section>
      )}

      {/* Industry Overview */}
      <section className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-500" />
          Industry Analysis
        </h3>
        <div className="prose prose-invert max-w-none">
          {data.industry.split('\n').map((paragraph, idx) => (
            <p key={idx} className="text-gray-300 text-[15px] mb-4">{paragraph}</p>
          ))}
        </div>
      </section>

      {/* Financial Overview */}
      {data.financials && (
        <section className="card">
          <h3 className="text-lg font-semibold mb-4">Financial Performance</h3>
          <div className="h-[400px] mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                <XAxis dataKey="year" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A1A',
                    border: '1px solid #2A2A2A',
                    borderRadius: '0.5rem',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3B82F6" name="Revenue (M$)" />
                <Line type="monotone" dataKey="profit" stroke="#10B981" name="Profit (M$)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#2A2A2A] p-4 rounded-lg">
              <p className="text-sm text-gray-400">Market Share</p>
              <p className="text-2xl font-bold text-blue-500">{data.financials.marketShare.toFixed(1)}%</p>
            </div>
            <div className="bg-[#2A2A2A] p-4 rounded-lg">
              <p className="text-sm text-gray-400">Growth Rate</p>
              <p className="text-2xl font-bold text-green-500">{data.financials.growthRate.toFixed(1)}%</p>
            </div>
          </div>
        </section>
      )}

      {/* Use Cases */}
      <section className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-500" />
          Recommended Use Cases
        </h3>
        <div className="space-y-4">
          {/* Dataset Resources */}
          <div className="bg-[#2A2A2A] rounded-lg p-4 mb-6">
            <h5 className="text-sm font-semibold text-blue-400 mb-3">Related Resources:</h5>
            <div className="grid md:grid-cols-3 gap-4">
              <a
                href={data.useCases[0]?.resources[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-blue-400"
              >
                <Database className="w-4 h-4" />
                Kaggle Datasets
              </a>
              <a
                href={data.useCases[0]?.resources[1]}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-blue-400"
              >
                <Database className="w-4 h-4" />
                Hugging Face Datasets
              </a>
              <a
                href={data.useCases[0]?.resources[2]}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-blue-400"
              >
                <Github className="w-4 h-4" />
                GitHub Repositories
              </a>
            </div>
          </div>

          {/* Use Cases Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {data.useCases.map((useCase, index) => (
              <div key={index} className="bg-[#2A2A2A] rounded-lg p-6">
                <h4 className="text-[15px] font-semibold mb-2">{useCase.title}</h4>
                <p className="text-gray-400 text-sm mb-4">{useCase.description}</p>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-blue-400 font-semibold">Impact:</span>
                    <p className="text-gray-300 mt-1">{useCase.impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <LinkIcon className="w-5 h-5 text-blue-500" />
          Industry Resources
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {data.resources.map((resource, index) => (
            <a
              key={index}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#2A2A2A] p-4 rounded-lg hover:bg-[#3A3A3A] transition-colors flex items-start gap-3 group"
            >
              <LinkIcon className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
              <span className="text-gray-300 group-hover:text-blue-400 transition-colors text-[15px]">
                {resource.title}
              </span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}