import React from "react";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, BarChart3, Users, Globe } from "lucide-react";
import { motion } from "motion/react";

export default function LandingPage() {
  const features = [
    {
      title: "24/7 Lead Qualification",
      description: "Our AI never sleeps. It qualifies every lead instantly, ensuring no opportunity is missed.",
      icon: Zap,
    },
    {
      title: "Enterprise-Grade Security",
      description: "Your data is encrypted and stored securely in our private cloud infrastructure.",
      icon: ShieldCheck,
    },
    {
      title: "Real-time Analytics",
      description: "Track conversion rates and pipeline value with our intuitive business dashboard.",
      icon: BarChart3,
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Connect Your Site",
      description: "Embed our smart AI assistant with a single line of code.",
    },
    {
      number: "02",
      title: "AI Qualifies Leads",
      description: "The AI engages visitors, asks the right questions, and filters high-value prospects.",
    },
    {
      number: "03",
      title: "Close More Deals",
      description: "Get qualified leads delivered directly to your dashboard and inbox.",
    },
  ];

  return (
    <div className="relative overflow-hidden transition-colors duration-300 dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative bg-white py-24 transition-colors duration-300 dark:bg-slate-950 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-600 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-900/20 dark:text-blue-400 dark:ring-blue-400/20">
                <Sparkles size={16} />
                <span>New: AI-Powered Sales Funnels</span>
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
                Stop Losing Leads. <br />
                <span className="text-blue-600 dark:text-blue-500">Let AI Qualify</span> Your Customers 24/7.
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
                LuminaLead automates your sales funnel using advanced AI. Qualify leads, book appointments, and grow your business while you sleep.
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('open-chat'))}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-blue-300 active:scale-95 dark:shadow-blue-900/20"
                >
                  Get Started Free
                  <ArrowRight size={18} />
                </button>
                <button 
                  onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                  className="text-sm font-semibold leading-6 text-slate-900 transition-colors hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
                >
                  View Demo <span aria-hidden="true">→</span>
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative rounded-3xl bg-slate-100 p-8 shadow-2xl shadow-slate-200 ring-1 ring-slate-200 transition-colors duration-300 dark:bg-slate-900 dark:shadow-none dark:ring-slate-800"
            >
              <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-blue-600/10 blur-3xl" />
              <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-blue-600/10 blur-3xl" />
              
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-red-400" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400" />
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs font-medium text-slate-400 dark:text-slate-500">LuminaLead Dashboard</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition-colors duration-300 dark:bg-slate-800 dark:ring-slate-700">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Total Leads</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">1,284</p>
                    <p className="text-[10px] text-green-600 dark:text-green-400">+12% this week</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition-colors duration-300 dark:bg-slate-800 dark:ring-slate-700">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Conversion</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">24.8%</p>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400">Top 5% in industry</p>
                  </div>
                </div>
                
                <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 transition-colors duration-300 dark:bg-slate-800 dark:ring-slate-700">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">Recent Activity</p>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400">View all</p>
                  </div>
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex items-center gap-3 border-t border-slate-50 pt-3 dark:border-slate-700 first:border-0 first:pt-0">
                        <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-700" />
                        <div className="flex-1">
                          <div className="h-2 w-24 rounded-full bg-slate-200 dark:bg-slate-600" />
                          <div className="mt-1 h-1.5 w-16 rounded-full bg-slate-100 dark:bg-slate-700" />
                        </div>
                        <div className="h-4 w-12 rounded-full bg-blue-50 text-[8px] font-bold text-blue-600 flex items-center justify-center uppercase tracking-wider dark:bg-blue-900/30 dark:text-blue-400">New</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-slate-50 py-16 transition-colors duration-300 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Trusted by industry leaders worldwide
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-8 opacity-50 grayscale transition-all hover:grayscale-0 dark:opacity-30 dark:hover:opacity-100">
            <div className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white"><Globe size={24} /> GlobalTech</div>
            <div className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white"><Users size={24} /> PeopleFirst</div>
            <div className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white"><Zap size={24} /> FastFlow</div>
            <div className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white"><ShieldCheck size={24} /> SecureNet</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-24 transition-colors duration-300 dark:bg-slate-950 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600 uppercase tracking-widest dark:text-blue-400">Features</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Everything you need to scale your sales.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900 dark:text-white">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                      <feature.icon size={20} />
                    </div>
                    {feature.title}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600 dark:text-slate-400">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-slate-900 py-24 text-white transition-colors duration-300 dark:bg-slate-900 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-400 uppercase tracking-widest">Process</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              From Visitor to Customer in 3 Steps.
            </p>
          </div>
          <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="relative pl-16">
                <div className="absolute left-0 top-0 text-5xl font-black text-blue-600/20">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-white">{step.title}</h3>
                <p className="mt-4 text-slate-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Sparkles({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
