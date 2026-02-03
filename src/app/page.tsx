"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowRight, Shield, Lock, Zap, Activity, Terminal as TerminalIcon, CheckCircle2, Mail } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  const [formData, setFormData] = useState({ name: "", company: "", email: "" });
  const [status, setStatus] = useState<"IDLE" | "PROCESSING" | "GRANTED" | "ERROR">("IDLE");
  const [errorMessage, setErrorMessage] = useState("");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.name || !formData.company) {
      setErrorMessage("Please fill all fields");
      setStatus("ERROR");
      setTimeout(() => setStatus("IDLE"), 3000);
      return;
    }
    
    if (!formData.email.includes('@')) {
      setErrorMessage("Please enter a valid email address");
      setStatus("ERROR");
      setTimeout(() => setStatus("IDLE"), 3000);
      return;
    }
    
    setStatus("PROCESSING");
    setErrorMessage("");
    console.log('🔄 Submitting form data:', formData);
    
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          email: formData.email
        }),
      });
      
      console.log('📨 API Response status:', res.status);
      
      const data = await res.json();
      console.log('📨 API Response data:', data);
      
      if (res.ok && data.success) {
        console.log('✅ Success! Data saved to Google Sheets');
        
        // Show success state
        setTimeout(() => {
          setStatus("GRANTED");
        }, 1000);
        
        // Clear form after success
        setTimeout(() => {
          setFormData({ name: "", company: "", email: "" });
        }, 3000);
        
      } else {
        console.error('❌ API Error:', data.error);
        
        // Show error based on response
        let errorMsg = 'Submission failed. Please try again.';
        if (data.error === 'INVALID_CREDENTIALS') {
          errorMsg = 'Please enter a valid email address.';
        } else if (data.error === 'INCOMPLETE_PROFILE') {
          errorMsg = 'Please fill in all fields.';
        } else if (data.error === 'SYSTEM_FAILURE') {
          errorMsg = 'Server error. Please try again later.';
        }
        
        setErrorMessage(errorMsg);
        setStatus("ERROR");
        setTimeout(() => setStatus("IDLE"), 5000);
      }
      
    } catch (error) {
      console.error('💥 Network error:', error);
      setErrorMessage('Network error. Please check your connection and try again.');
      setStatus("ERROR");
      setTimeout(() => setStatus("IDLE"), 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (status === "ERROR") {
      setStatus("IDLE");
      setErrorMessage("");
    }
  };

  // Debug function - add this if needed
  const testAPIConnection = async () => {
    console.log('🔧 Testing API Connection...');
    try {
      const res = await fetch('/api/waitlist');
      const data = await res.json();
      console.log('📊 API Test Result:', data);
      alert(`API connected! ${data.count || 0} entries found.`);
    } catch (err) {
      console.error('🔴 API Test Failed:', err);
      alert('API connection failed. Check console for details.');
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-white selection:text-black overflow-hidden relative">
      
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-white origin-left z-50 mix-blend-difference"
        style={{ scaleX }}
      />

      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 transform-gpu">
        <div className="cyber-grid" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />
        
        {/* Floating Particles */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] transform-gpu" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] transform-gpu" />
      </div>

      <main className="relative z-10">
        
        {/* Navigation */}
        <nav className="fixed top-0 w-full flex justify-between items-center px-4 py-4 md:px-8 md:py-6 z-40 bg-black/50 backdrop-blur-md border-b border-white/5 transition-all">
          <div className="flex items-center gap-3 md:gap-4 group cursor-pointer">
             <div className="relative w-12 h-12 md:w-20 md:h-20 transition-transform group-hover:scale-110 duration-500">
               <Image 
                 src="/ares-logo-final.png" 
                 alt="ARES Brutalist Logo" 
                 fill
                 className="object-contain"
               />
             </div>
             <div className="flex flex-col">
               <div className="text-xl md:text-3xl font-serif tracking-[0.2em] md:tracking-[0.3em] font-bold text-white leading-none">ARES</div>
               <div className="text-[0.5rem] md:text-[0.6rem] uppercase tracking-[0.3em] md:tracking-[0.4em] text-gray-500 text-center font-mono">Sanctum</div>
             </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
            <div className="text-[10px] md:text-xs font-mono text-gray-400 tracking-widest">SYS.VER.2.0.4</div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 relative">
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center max-w-5xl z-20"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono mb-8 text-gray-300">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              OPERATIONAL STATUS: NOMINAL
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-9xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-600 min-h-[120px] sm:min-h-[180px] md:min-h-[280px]">
              <Typewriter text="DEFENSIVE" delay={500} /><br/>
              <Typewriter text="INTELLIGENCE" delay={1600} />
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-light mb-12">
              The first AI architected purely for <span className="text-white font-medium">protection</span>.
              <br/>We don't hack. We harden.
            </p>
          </motion.div>

          {/* Terminal Simulation Overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="w-full max-w-4xl mt-8 mb-20 z-10"
          >
             <TerminalPreview />
          </motion.div>
        </section>

        {/* Scroll Reveal Section */}
        <section className="min-h-screen flex items-center justify-center px-6 py-20 relative bg-black/50">
          <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            
            {/* Left Column: Text */}
            <div className="space-y-12">
              <ScrollReveal>
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                  <Shield className="w-6 h-6" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                  Zero Trust.<br/>Zero Latency.
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Traditional security tools scan. ARES understands. By analyzing your infrastructure as code, logs, and configurations in real-time, ARES identifies vulnerabilities before they can be exploited.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                  <Activity className="w-6 h-6" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                  Autonomous<br/>Remediation
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Don't just find bugs. Fix them. ARES generates review-ready scripts to patch vulnerabilities instantly.
                </p>
              </ScrollReveal>
            </div>

            {/* Right Column: Access Form */}
            <ScrollReveal delay={0.4}>
              <div className="glass-panel p-6 md:p-12 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-20">
                  <Lock className="w-16 h-16 md:w-24 md:h-24" />
                </div>
                
                <h3 className="text-2xl font-bold mb-2">Request Access</h3>
                <p className="text-gray-500 mb-8 text-sm">Join the defensive alliance.</p>

                {status === "GRANTED" ? (
                  <div className="h-[300px] flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center text-green-500 relative">
                      <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold mb-2">You're on the list.</div>
                      <p className="text-gray-400 text-sm max-w-[250px] mx-auto leading-relaxed">
                        ARES is currently in closed alpha. We will contact <span className="text-white font-mono">{formData.email}</span> when your organization is eligible for deployment.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                      <Mail className="w-3 h-3" />
                      <span>Priority Ticket: #{Math.floor(Math.random() * 8000) + 1000}</span>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">Full Name</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:bg-white/10 focus:border-white/30 transition-all placeholder:text-gray-700"
                        placeholder="John Doe"
                        required
                        disabled={status === "PROCESSING"}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">Organization</label>
                      <input 
                        type="text" 
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:bg-white/10 focus:border-white/30 transition-all placeholder:text-gray-700"
                        placeholder="Acme Corp"
                        required
                        disabled={status === "PROCESSING"}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-mono text-gray-500 uppercase tracking-widest">Work Email</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:bg-white/10 focus:border-white/30 transition-all placeholder:text-gray-700"
                        placeholder="john@acme.com"
                        required
                        disabled={status === "PROCESSING"}
                      />
                    </div>

                    {status === "ERROR" && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm">
                        ⚠️ {errorMessage}
                      </div>
                    )}

                    <button 
                      type="submit"
                      disabled={status === "PROCESSING"}
                      className={`w-full font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:cursor-not-allowed ${
                        status === "ERROR" 
                          ? "bg-red-500/20 text-red-400 border border-red-500/30" 
                          : "bg-white text-black hover:bg-gray-100"
                      }`}
                    >
                      {status === "PROCESSING" ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          Verifying...
                        </>
                      ) : status === "ERROR" ? (
                        "Try Again"
                      ) : (
                        <>
                          Initialize Session
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>

                    {/* Debug button - optional */}
                    <button 
                      type="button"
                      onClick={testAPIConnection}
                      className="text-xs text-gray-500 hover:text-white transition mt-2 text-center w-full"
                    >
                      Test API Connection
                    </button>
                  </form>
                )}
              </div>
            </ScrollReveal>

          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center text-xs text-gray-600 border-t border-white/5">
          <p>© 2026 ARES SECURITY. ALL RIGHTS RESERVED.</p>
          {/* Debug info - remove in production */}
          <p className="mt-2 text-gray-700">API: https://api.sheetbest.com/sheets/19402277-d48e-4cb3-b884-2689be966458</p>
        </footer>

      </main>
    </div>
  );
}

// Rest of your components remain the same...
function TerminalPreview() {
  const [lines, setLines] = useState<string[]>([]);
  
  useEffect(() => {
    const sequence = [
      { command: "ares-engine --init --mode=defensive", delay: 800 },
      { output: "[*] Initializing ARES Defense Engine v2.0.4...", delay: 1500 },
      { output: "[+] Connection established to neural_net_core", delay: 2000 },
      { output: "[*] Loading module: infrastructure_scanner", delay: 2500 },
      { command: "./scan_target.py --target=local_cluster", delay: 3500 },
      { output: "[*] Target identified: Kubernetes (v1.28.2)", delay: 4200 },
      { output: "[-] WARNING: Privileged container detected (pod/auth-service)", delay: 4800, type: "error" },
      { output: "[-] CRITICAL: Exposed secret in ConfigMap", delay: 5200, type: "error" },
      { command: "ares-fix --apply --dry-run", delay: 6500 },
      { output: "[+] Generating defensive patch...", delay: 7200 },
      { output: "[+] Remediation script 'fix_auth.sh' created successfully", delay: 8000, type: "success" },
    ];

    let timeouts: NodeJS.Timeout[] = [];
    let cumulativeDelay = 0;

    sequence.forEach((step) => {
      if ('command' in step) {
        const timeout = setTimeout(() => {
          setLines(prev => [...prev, `CMD:${step.command}`]);
        }, step.delay);
        timeouts.push(timeout);
      } else {
        const timeout = setTimeout(() => {
          setLines(prev => [...prev, step.type ? `TYPE_${step.type}:${step.output}` : `OUT:${step.output}`]);
        }, step.delay);
        timeouts.push(timeout);
      }
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full rounded-lg overflow-hidden bg-[#1a1b26] border border-[#2f334d] shadow-2xl font-mono text-xs sm:text-sm md:text-base">
      <div className="bg-[#1f2335] px-3 py-2 flex items-center justify-between border-b border-[#1a1b26]">
        <div className="flex items-center gap-2">
           <TerminalIcon className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
           <span className="text-gray-300 font-bold text-[10px] md:text-xs">root@ares: ~</span>
        </div>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#1a1b26] border border-white/10" />
          <div className="w-3 h-3 rounded-full bg-[#1a1b26] border border-white/10" />
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
        </div>
      </div>

      <div className="p-6 h-[320px] text-left overflow-y-auto space-y-1 bg-[#0f0f14] scrollbar-hide">
        <div className="text-blue-500 font-bold mb-4 opacity-80 text-[10px] leading-3 md:text-xs">
          <pre>{`
    _    ____  _____ ____  
   / \\  |  _ \\| ____/ ___| 
  / _ \\ | |_) |  _| \\___ \\ 
 / ___ \\|  _ <| |___ ___) |
/_/   \\_\\_| \\_\\_____|____/ 
          `}</pre>
          <div className="mt-2 text-gray-500">ARES Defense Framework [v2.0.4]</div>
        </div>

        {lines.map((line, i) => {
          const isCmd = line.startsWith("CMD:");
          const isError = line.startsWith("TYPE_error:");
          const isSuccess = line.startsWith("TYPE_success:");
          const content = line.replace(/^(CMD:|TYPE_\w+:|OUT:)/, "");

          if (isCmd) {
            return (
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <span className="text-blue-400 font-bold">┌──(</span>
                <span className="text-red-500 font-bold">root💀ares</span>
                <span className="text-blue-400 font-bold">)-[</span>
                <span className="text-white">~</span>
                <span className="text-blue-400 font-bold">]</span>
                <br />
                <span className="text-blue-400 font-bold">└─# </span>
                <span className="text-white">{content}</span>
              </motion.div>
            );
          }
          
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`${isError ? "text-red-400" : isSuccess ? "text-green-400" : "text-gray-400"} pl-4`}
            >
              {content}
            </motion.div>
          );
        })}
        
        <div className="mt-2">
          <span className="text-blue-400 font-bold">┌──(</span>
          <span className="text-red-500 font-bold">root💀ares</span>
          <span className="text-blue-400 font-bold">)-[</span>
          <span className="text-white">~</span>
          <span className="text-blue-400 font-bold">]</span>
          <br />
          <span className="text-blue-400 font-bold">└─# </span>
          <motion.span 
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="w-2 h-4 bg-white inline-block align-middle"
          />
        </div>
      </div>
    </div>
  );
}

function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
}

function Typewriter({ text, delay, speed = 100 }: { text: string, delay: number, speed?: number }) {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let interval: NodeJS.Timeout;

    timeout = setTimeout(() => {
      setShowCursor(true);
      let i = 0;
      
      interval = setInterval(() => {
        if (i <= text.length) {
          setDisplayText(text.slice(0, i));
          i++;
        } else {
          clearInterval(interval);
          setShowCursor(false);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, delay, speed]);

  return (
    <span className="inline-flex items-center min-h-[1em]">
      {displayText}
      <span className={`w-1.5 md:w-4 h-6 sm:h-8 md:h-16 bg-white ml-1 md:ml-2 ${showCursor ? 'opacity-100 animate-pulse' : 'opacity-0'}`} />
    </span>
  );
}
