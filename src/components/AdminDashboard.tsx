import React, { useState, useEffect } from "react";
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Search, 
  Filter, 
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { motion } from "motion/react";
import { toast } from "sonner";

interface Lead {
  id: string;
  created_at: string;
  name: string;
  email: string;
  problem: string;
  budget: string;
  timeline: string;
  status: "New" | "In Progress" | "Closed";
}

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [chartPeriod, setChartPeriod] = useState<"weekly" | "monthly">("weekly");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/leads");
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      console.error("Failed to fetch leads", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data for chart
  const weeklyData = [
    { day: "Mon", leads: 12 },
    { day: "Tue", leads: 19 },
    { day: "Wed", leads: 15 },
    { day: "Thu", leads: 22 },
    { day: "Fri", leads: 30 },
    { day: "Sat", leads: 10 },
    { day: "Sun", leads: 8 },
  ];

  const monthlyData = [
    { day: "Week 1", leads: 45 },
    { day: "Week 2", leads: 52 },
    { day: "Week 3", leads: 38 },
    { day: "Week 4", leads: 65 },
  ];

  const chartData = chartPeriod === "weekly" ? weeklyData : monthlyData;

  const stats = [
    {
      label: "Total Leads",
      value: leads.length.toString(),
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "blue",
    },
    {
      label: "Conversion Rate",
      value: "24.8%",
      change: "+2.1%",
      trend: "up",
      icon: TrendingUp,
      color: "green",
    },
    {
      label: "Pipeline Value",
      value: `$${(leads.length * 2500).toLocaleString()}`,
      change: "-3.4%",
      trend: "down",
      icon: DollarSign,
      color: "indigo",
    },
  ];

  const filteredLeads = leads.filter(
    (lead) => {
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.problem.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    }
  );

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 transition-colors duration-300">
      <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Business Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Track your AI-generated leads and sales performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              const csvContent = "data:text/csv;charset=utf-8," 
                + "Name,Email,Problem,Status,Date\n"
                + leads.map(l => `${l.name},${l.email},${l.problem},${l.status},${l.created_at}`).join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", "luminalead_leads.csv");
              document.body.appendChild(link);
              link.click();
              toast.success("Leads exported successfully");
            }}
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-700"
          >
            Export CSV
          </button>
          <button 
            onClick={async () => {
              await fetchLeads();
              toast.success("Data refreshed from database");
            }}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 dark:shadow-blue-900/20"
          >
            Refresh Data
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-colors duration-300 dark:bg-slate-900 dark:ring-slate-800"
          >
            <div className="flex items-center justify-between">
              <div className={`rounded-xl p-3 ${
                stat.color === 'blue' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                stat.color === 'green' ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
                'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
              }`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${stat.trend === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                {stat.change}
                {stat.trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
              <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Chart Section */}
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-colors duration-300 dark:bg-slate-900 dark:ring-slate-800">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Lead Volume ({chartPeriod === "weekly" ? "Last 7 Days" : "Last 30 Days"})</h3>
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-1 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
              <button 
                onClick={() => setChartPeriod("weekly")}
                className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                  chartPeriod === "weekly" 
                    ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white" 
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                Weekly
              </button>
              <button 
                onClick={() => setChartPeriod("monthly")}
                className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                  chartPeriod === "monthly" 
                    ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white" 
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#64748b", fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#64748b", fontSize: 12 }} 
                />
                <Tooltip 
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{ 
                    borderRadius: "12px", 
                    border: "none", 
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    backgroundColor: "var(--tooltip-bg, #fff)",
                    color: "var(--tooltip-text, #000)"
                  }}
                  itemStyle={{ color: "inherit" }}
                />
                <Bar dataKey="leads" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 4 ? "#2563eb" : "#94a3b8"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions / Summary */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-colors duration-300 dark:bg-slate-900 dark:ring-slate-800">
          <h3 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">System Health</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">AI Engine</span>
              </div>
              <span className="text-xs font-bold text-green-600 dark:text-green-400">ONLINE</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Database</span>
              </div>
              <span className="text-xs font-bold text-green-600 dark:text-green-400">ONLINE</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Automation</span>
              </div>
              <span className="text-xs font-bold text-green-600 dark:text-green-400">ONLINE</span>
            </div>
          </div>
          <div className="mt-8">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Quick Tips</h4>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Your conversion rate is 5% higher than the industry average. Consider increasing your ad spend to capitalize on this efficiency.
            </p>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden transition-colors duration-300 dark:bg-slate-900 dark:ring-slate-800">
        <div className="border-b border-slate-100 p-6 dark:border-slate-800">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Leads</h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded-xl border-none bg-slate-100 pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-500/40"
                />
              </div>
              <div className="relative group">
                <button 
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                    statusFilter !== "All" 
                      ? "bg-blue-600 text-white" 
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  <Filter size={16} />
                  {statusFilter === "All" ? "Filter" : statusFilter}
                </button>
                <div className="absolute right-0 mt-2 w-40 origin-top-right rounded-xl bg-white p-2 shadow-xl ring-1 ring-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 dark:bg-slate-900 dark:ring-slate-800">
                  {["All", "New", "In Progress", "Closed"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`w-full rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${
                        statusFilter === status 
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" 
                          : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4">Lead Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Problem / Service</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{lead.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{lead.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                      lead.status === "New" ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" :
                      lead.status === "In Progress" ? "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" :
                      "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                    }`}>
                      <div className={`h-1.5 w-1.5 rounded-full ${
                        lead.status === "New" ? "bg-blue-600 dark:bg-blue-400" :
                        lead.status === "In Progress" ? "bg-amber-600 dark:bg-amber-400" :
                        "bg-green-600 dark:bg-green-400"
                      }`} />
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="max-w-[200px] truncate text-slate-600 dark:text-slate-400">{lead.problem}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      {new Date(lead.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                    No leads found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
