import React from 'react';
import { LucideIcon, Loader2 } from 'lucide-react';
import { AgentStatus } from '../types';

interface AgentCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  status: AgentStatus;
}

export default function AgentCard({ icon: Icon, title, description, status }: AgentCardProps) {
  return (
    <div className="card relative overflow-hidden group">
      {/* Status indicator */}
      <div className="absolute top-4 right-4">
        {status === AgentStatus.Active && (
          <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
        )}
        {status === AgentStatus.Complete && (
          <div className="w-5 h-5 bg-green-500 rounded-full" />
        )}
      </div>

      <div className="mb-4">
        <Icon className="w-8 h-8 text-blue-500" />
      </div>
      
      <h3 className="text-[15px] font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2A2A2A]">
        <div
          className={`h-full transition-all duration-300 ${
            status === AgentStatus.Complete
              ? 'bg-green-500 w-full'
              : status === AgentStatus.Active
              ? 'bg-blue-500 w-1/2'
              : 'w-0'
          }`}
        />
      </div>
    </div>
  );
}