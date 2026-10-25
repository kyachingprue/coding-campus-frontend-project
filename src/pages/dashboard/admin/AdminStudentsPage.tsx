import { useMemo, useState } from "react";
import { FiBookOpen, FiDollarSign, FiUsers } from "react-icons/fi";
import { AdminFeedback, AdminLoading, AdminMetric, AdminPageHeader, AdminSearch, ExportButton, tableCellClass } from "./AdminUI";
import type { AdminStudent } from "./types";
import { useAdminQuery } from "./useAdminQuery";

export default function AdminStudentsPage() {
  const { data, loading, error, refresh } = useAdminQuery<{ students: AdminStudent[] }>("/admin/students");
  const [search, setSearch] = useState("");
  const students = data?.students || [];
  const filtered = useMemo(() => students.filter((student) =>
    `${student.name} ${student.email} ${student.id}`.toLowerCase().includes(search.toLowerCase())), [students, search]);
  const paidLearners = students.filter((student) => student.paidCount > 0).length;
  const totalSpend = students.reduce((sum, student) => sum + student.spent, 0);
  const rows = filtered.map((student) => ({
    studentId: student.id,
    name: student.name,
    email: student.email,
    enrolledPackages: student.enrollments.map((item) => item.courseName || item.courseId || "Course").join("; "),
    paidOrders: student.paidCount,
    totalSpent: student.spent.toFixed(2),
    joined: new Date(student.createdAt).toLocaleDateString(),
  }));

  return (
    <div className="space-y-6">
      <AdminPageHeader eyebrow="People · learners" title="Student directory" description="Review student accounts, course enrollments, and verified payment activity." onRefresh={refresh} refreshing={loading} />
      <AdminFeedback error={error} />
      {loading && !data ? <AdminLoading label="Loading student records..." /> : (
        <>
          <section className="grid gap-4 sm:grid-cols-3">
            <AdminMetric label="Student accounts" value={students.length} icon={FiUsers} tone="blue" />
            <AdminMetric label="Students with purchases" value={paidLearners} icon={FiBookOpen} tone="violet" />
            <AdminMetric label="Student spend" value={`$${totalSpend.toFixed(2)}`} icon={FiDollarSign} tone="green" />
          </section>
          <section className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <AdminSearch value={search} onChange={setSearch} placeholder="Search name, email, or student ID..." />
              <ExportButton filename="admin-students.csv" rows={rows} />
            </div>
            <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
              <table className="w-full min-w-[950px]">
                <thead className="border-b border-line bg-surface-2/60 text-xs uppercase tracking-wide text-mist"><tr>
                  <th className={tableCellClass}>Student</th><th className={tableCellClass}>Student ID</th><th className={tableCellClass}>Enrolled packages</th><th className={tableCellClass}>Paid</th><th className={tableCellClass}>Total spent</th><th className={tableCellClass}>Joined</th>
                </tr></thead>
                <tbody className="divide-y divide-line">{filtered.map((student) => (
                  <tr key={student.id}>
                    <td className={tableCellClass}><p className="font-medium text-fog">{student.name}</p><p className="text-xs text-mist">{student.email}</p></td>
                    <td className={`${tableCellClass} font-mono text-xs text-mist`}>{student.id}</td>
                    <td className={`${tableCellClass} max-w-xs text-fog`}><div className="flex flex-wrap gap-1.5">{student.enrollments.length ? student.enrollments.map((item) => <span key={`${student.id}-${item.courseId}`} className="rounded-md bg-cyan/10 px-2 py-1 text-xs text-cyan">{item.courseName || item.courseId || "Course"}</span>) : <span className="text-mist">No courses yet</span>}</div></td>
                    <td className={`${tableCellClass} text-fog`}>{student.paidCount}</td>
                    <td className={`${tableCellClass} font-semibold text-emerald-300`}>${student.spent.toFixed(2)}</td>
                    <td className={`${tableCellClass} text-mist`}>{new Date(student.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}</tbody>
              </table>
              {!filtered.length && <p className="p-6 text-sm text-mist">{search ? "No students match your search." : "No students registered yet."}</p>}
            </div>
            <p className="text-xs text-mist">Showing {filtered.length} of {students.length} students.</p>
          </section>
        </>
      )}
    </div>
  );
}
