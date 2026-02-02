"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Shield, AlertTriangle, FileText, 
  CheckCircle, Play, XOctagon, Loader2, 
  ChevronRight, Lock, Server, Menu, X 
} from 'lucide-react';
import clsx from 'clsx';

// Types for our simulated analysis
type Severity = 'Low' | 'Medium' | 'High' | 'Critical';

interface Finding {
  id: string;
  title: string;
  severity: Severity;
  description: string;
  remediation: string;
}

interface TerminalLine {
  id: string;
  text: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'command';
  timestamp: string;
}

export default function DashboardPage() {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [activeTab, setActiveTab] = useState<'terminal' | 'findings'>('terminal');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLines]);

  const addLine = (text: string, type: TerminalLine['type'] = 'info') => {
    setTerminalLines(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      text,
      type,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const runSimulation = async () => {
    if (!input.trim()) return;
    
    setIsAnalyzing(true);
    setTerminalLines([]);
    setFindings([]);
    setActiveTab('terminal');

    try {
      // Initial Command
      addLine(`ares analyze --input-type auto --defensive-only`, 'command');
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();
      
      // Simulate real-time processing by replaying the steps
      for (const step of data.steps) {
        // Random delay between 500ms and 1500ms
        await new Promise(r => setTimeout(r, Math.random() * 1000 + 500));
        addLine(step, 'info');
      }

      addLine("Analysis complete.", 'success');
      
      // Transform API findings to UI findings
      const uiFindings: Finding[] = data.findings.map((f: any) => ({
        id: f.id,
        title: f.title,
        severity: f.severity,
        description: f.description,
        remediation: f.remediation_explanation // Using explanation for the summary view
      }));

      setFindings(uiFindings);

    } catch (error) {
      addLine("Error executing analysis pipeline.", 'error');
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-200 flex flex-col md:flex-row font-sans overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0a0a0a] border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">ARES</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <NavItem icon={<Terminal />} label="Analysis Console" active />
          <NavItem icon={<FileText />} label="Reports" />
          <NavItem icon={<Server />} label="Infrastructure" />
          <NavItem icon={<Lock />} label="Secrets" />
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="text-xs text-gray-500 mb-2">SESSION ID</div>
          <div className="font-mono text-xs text-blue-400">UUID-8842-ALPHA</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Background Grid */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 0)', backgroundSize: '24px 24px' }} />

        {/* Header */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#050505]/80 backdrop-blur z-10">
          <h1 className="text-lg font-medium text-white">New Security Analysis</h1>
          <div className="flex items-center gap-4">
             <span className="flex items-center gap-2 text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               System Operational
             </span>
          </div>
        </header>

        {/* Workspace Split */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden z-10">
          
          {/* Input Area (Left) */}
          <div className="flex-1 p-6 flex flex-col border-r border-white/10 min-w-[300px]">
            <div className="mb-4 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">Input Source</label>
              <div className="text-xs text-gray-500">Supported: Yaml, JSON, Log, Plain Text</div>
            </div>
            
            <div className="flex-1 relative group">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste security log, IaC config, or vulnerability report here..."
                className="w-full h-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 font-mono text-sm text-gray-300 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 resize-none transition-all placeholder:text-gray-700"
                spellCheck={false}
              />
              <div className="absolute bottom-4 right-4">
                 <button
                  onClick={runSimulation}
                  disabled={isAnalyzing || !input.trim()}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium shadow-lg shadow-blue-900/20 flex items-center gap-2 transition-all"
                >
                  {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                  {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
                </button>
              </div>
            </div>
          </div>

          {/* Output Area (Right) */}
          <div className="flex-1 flex flex-col bg-[#020202] min-w-[300px]">
            
            {/* Tabs */}
            <div className="flex border-b border-white/10">
              <button 
                onClick={() => setActiveTab('terminal')}
                className={clsx(
                  "px-6 py-3 text-sm font-medium flex items-center gap-2 transition-colors border-b-2",
                  activeTab === 'terminal' 
                    ? "border-blue-500 text-blue-400 bg-blue-500/5" 
                    : "border-transparent text-gray-500 hover:text-gray-300"
                )}
              >
                <Terminal className="w-4 h-4" />
                Console Output
              </button>
              <button 
                onClick={() => setActiveTab('findings')}
                disabled={findings.length === 0}
                className={clsx(
                  "px-6 py-3 text-sm font-medium flex items-center gap-2 transition-colors border-b-2",
                  activeTab === 'findings' 
                    ? "border-emerald-500 text-emerald-400 bg-emerald-500/5" 
                    : "border-transparent text-gray-500 hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
                )}
              >
                <Shield className="w-4 h-4" />
                Findings ({findings.length})
              </button>
            </div>

            {/* Terminal View */}
            {activeTab === 'terminal' && (
              <div className="flex-1 p-6 font-mono text-sm overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                {terminalLines.length === 0 && !isAnalyzing && (
                  <div className="h-full flex flex-col items-center justify-center text-gray-600 space-y-4">
                    <Terminal className="w-12 h-12 opacity-20" />
                    <p>Awaiting input for analysis...</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  {terminalLines.map((line) => (
                    <motion.div 
                      key={line.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-3"
                    >
                      <span className="text-gray-600 select-none">[{line.timestamp}]</span>
                      <span className={clsx(
                        line.type === 'command' && "text-blue-400 font-bold",
                        line.type === 'info' && "text-gray-300",
                        line.type === 'success' && "text-green-400",
                        line.type === 'warning' && "text-yellow-400",
                        line.type === 'error' && "text-red-400",
                      )}>
                        {line.type === 'command' && <span className="text-blue-500 mr-2">➜</span>}
                        {line.text}
                      </span>
                    </motion.div>
                  ))}
                  {isAnalyzing && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-2 h-4 bg-blue-500 ml-2"
                    />
                  )}
                  <div ref={terminalEndRef} />
                </div>
              </div>
            )}

            {/* Findings View */}
            {activeTab === 'findings' && (
              <div className="flex-1 p-6 overflow-y-auto bg-gray-900/30">
                <div className="space-y-4">
                  {findings.map(finding => (
                    <motion.div 
                      key={finding.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#0a0a0a] border border-white/10 rounded-lg p-5 hover:border-white/20 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <SeverityBadge severity={finding.severity} />
                          <h3 className="font-semibold text-white">{finding.title}</h3>
                        </div>
                        <button className="text-gray-500 hover:text-white transition-colors">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-4 leading-relaxed">{finding.description}</p>
                      
                      <div className="bg-blue-950/20 border border-blue-900/30 rounded p-3">
                        <div className="text-xs text-blue-400 font-medium mb-1 uppercase tracking-wider flex items-center gap-2">
                           <CheckCircle className="w-3 h-3" /> Recommended Remediation
                        </div>
                        <div className="text-sm text-gray-300 font-mono">
                          {finding.remediation}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={clsx(
      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
      active ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
    )}>
      {React.cloneElement(icon as React.ReactElement<any>, { size: 18 })}
      {label}
    </button>
  );
}

function SeverityBadge({ severity }: { severity: Severity }) {
  const colors = {
    Low: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    High: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    Critical: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  
  return (
    <span className={clsx("px-2 py-0.5 rounded text-xs font-medium border", colors[severity])}>
      {severity}
    </span>
  );
}
