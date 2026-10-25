import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import type { AdminAnalytics } from "./types";
import { AdminChartPanel } from "./AdminUI";

const colors = ["#31d8c3", "#60a5fa", "#a78bfa", "#fbbf24", "#fb7185", "#34d399", "#f472b6", "#818cf8"];
const tooltipStyle = { background: "#111a2b", border: "1px solid #263449", borderRadius: 12, color: "#eaf2ff" };

export function RevenueLineChart({ data }: { data: AdminAnalytics["monthly"] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#263449" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value: number) => `$${value}`} width={58} />
        <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`$${Number(value).toFixed(2)}`, "Revenue"]} />
        <Line type="monotone" dataKey="revenue" stroke="#31d8c3" strokeWidth={3} dot={{ fill: "#31d8c3", r: 3 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function DemandBarChart({ data }: { data: AdminAnalytics["topCourses"] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
        <CartesianGrid stroke="#263449" strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
        <YAxis type="category" dataKey="name" width={100} tick={{ fill: "#cbd5e1", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="enrollments" name="Enrollments" radius={[0, 6, 6, 0]}>{data.map((_entry, index) => <Cell key={index} fill={colors[index % colors.length]} />)}</Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function RolePieChart({ analytics }: { analytics: AdminAnalytics }) {
  const data = [
    { name: "Students", value: analytics.users.student },
    { name: "Instructors", value: analytics.users.instructor },
    { name: "Admins", value: analytics.users.admin },
  ];
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={62} outerRadius={100} paddingAngle={4}>
          {data.map((_item, index) => <Cell key={index} fill={colors[index]} />)}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function PaymentVolumeChart({ data }: { data: AdminAnalytics["monthly"] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#263449" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis allowDecimals={false} tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="payments" name="Paid orders" fill="#60a5fa" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function RevenuePanel({ analytics }: { analytics: AdminAnalytics }) {
  return <AdminChartPanel title="Monthly revenue" description="Successful Stripe payments over the last 12 months"><RevenueLineChart data={analytics.monthly} /></AdminChartPanel>;
}

export function DemandPanel({ analytics }: { analytics: AdminAnalytics }) {
  return <AdminChartPanel title="Most-enrolled courses" description="Course demand ranked by student enrollments"><DemandBarChart data={analytics.topCourses} /></AdminChartPanel>;
}
