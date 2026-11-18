import { useEffect, useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiShield, FiTrash2, FiUsers } from "react-icons/fi";
import toast from "react-hot-toast";
import { Button } from "../../../components/ui/button";
import { useAppSelector } from "../../../app/hooks";
import { apiRequest } from "../../../lib/api";
import { AdminFeedback, AdminLoading, AdminMetric, AdminPageHeader, AdminSearch, tableCellClass } from "./AdminUI";
import { useAdminQuery } from "./useAdminQuery";

type ManagedRole = "student" | "instructor" | "admin";

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: ManagedRole;
  isActive: boolean;
  createdAt: string;
}

interface UserPage {
  users: ManagedUser[];
  total: number;
  page: number;
  pages: number;
}

const pageSize = 50;

export default function AdminUsersPage() {
  const currentUserId = useAppSelector((state) => state.auth.user?.id);
  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setActiveSearch(search.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [search]);

  const path = useMemo(() => {
    const query = new URLSearchParams({ page: String(page), limit: String(pageSize) });
    if (activeSearch) query.set("search", activeSearch);
    if (roleFilter) query.set("role", roleFilter);
    return `/admin/users?${query.toString()}`;
  }, [page, activeSearch, roleFilter]);
  const { data, loading, error, refresh } = useAdminQuery<UserPage>(path);
  const users = data?.users || [];

  useEffect(() => {
    if (data && page > data.pages) setPage(data.pages);
  }, [data, page]);

  async function changeRole(user: ManagedUser, role: ManagedRole) {
    if (user.role === role) return;
    setBusyId(user.id);
    setNotice("");
    try {
      await apiRequest(`/admin/users/${encodeURIComponent(user.id)}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      });
      setNotice(`${user.name}'s role was changed to ${role}.`);
      toast.success(`Role updated to ${role}.`);
      refresh();
    } catch (requestError: unknown) {
      const message = requestError instanceof Error ? requestError.message : "Unable to update this role.";
      setNotice(message);
      toast.error(message);
    } finally {
      setBusyId("");
    }
  }

  async function deleteUser(user: ManagedUser) {
    if (!window.confirm(`Permanently delete ${user.name} (${user.email})? Courses with learner or payment history will be archived, and payment records will be retained.`)) return;
    setBusyId(user.id);
    setNotice("");
    try {
      const result = await apiRequest<{ message: string }>(`/admin/users/${encodeURIComponent(user.id)}`, { method: "DELETE" });
      setNotice(result.message);
      toast.success("User deleted.");
      if (users.length === 1 && page > 1) setPage((current) => current - 1);
      else refresh();
    } catch (requestError: unknown) {
      const message = requestError instanceof Error ? requestError.message : "Unable to delete this user.";
      setNotice(message);
      toast.error(message);
    } finally {
      setBusyId("");
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="People · access control"
        title="User & role management"
        description="Find accounts, promote students to instructors, manage administrator roles, or remove accounts by their user ID."
        onRefresh={refresh}
        refreshing={loading}
      />
      <AdminFeedback error={error} notice={notice} />
      <AdminMetric label="Matching accounts" value={data?.total ?? 0} icon={FiUsers} tone="blue" detail="Search by name, email, or user ID" />
      <section className="space-y-4 rounded-2xl border border-line bg-surface p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <AdminSearch value={search} onChange={(value) => { setSearch(value); setPage(1); }} placeholder="Search name, email, or user ID..." />
          <select
            value={roleFilter}
            onChange={(event) => { setRoleFilter(event.target.value); setPage(1); }}
            aria-label="Filter users by role"
            className="h-10 rounded-lg border border-line bg-surface-2 px-3 text-sm text-fog"
          >
            <option value="">All roles</option>
            <option value="student">Students</option>
            <option value="instructor">Instructors</option>
            <option value="admin">Administrators</option>
          </select>
        </div>
        {loading && !data ? <AdminLoading label="Loading user accounts..." /> : (
          <>
            <div className="overflow-x-auto rounded-xl border border-line">
              <table className="w-full min-w-[780px]">
                <thead className="border-b border-line bg-surface-2/60 text-xs uppercase tracking-wide text-mist">
                  <tr><th className={tableCellClass}>User</th><th className={tableCellClass}>User ID</th><th className={tableCellClass}>Joined</th><th className={tableCellClass}>Role</th><th className={tableCellClass}>Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {users.map((user) => {
                    const isSelf = user.id === currentUserId;
                    return (
                      <tr key={user.id}>
                        <td className={tableCellClass}>
                          <p className="font-medium text-fog">{user.name}{isSelf && <span className="ml-2 text-xs text-cyan">You</span>}</p>
                          <p className="text-xs text-mist">{user.email} · {user.isActive ? "Active" : "Inactive"}</p>
                        </td>
                        <td className={`${tableCellClass} font-mono text-xs text-mist`}>{user.id}</td>
                        <td className={`${tableCellClass} text-mist`}>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td className={tableCellClass}>
                          <label className="sr-only" htmlFor={`role-${user.id}`}>Role for {user.name}</label>
                          <select
                            id={`role-${user.id}`}
                            value={user.role}
                            disabled={isSelf || busyId === user.id}
                            onChange={(event) => void changeRole(user, event.target.value as ManagedRole)}
                            className="h-9 rounded-lg border border-line bg-surface-2 px-2.5 text-sm capitalize text-fog disabled:opacity-60"
                          >
                            <option value="student">Student</option>
                            <option value="instructor">Instructor</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className={tableCellClass}>
                          <Button
                            size="sm"
                            variant="danger"
                            disabled={isSelf || busyId === user.id}
                            onClick={() => void deleteUser(user)}
                          >
                            <FiTrash2 /> Delete
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {!users.length && <p className="p-8 text-center text-sm text-mist">{activeSearch || roleFilter ? "No accounts match your filters." : "No user accounts found."}</p>}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="inline-flex items-center gap-2 text-xs text-mist"><FiShield className="text-cyan" /> Your own account cannot be changed or deleted here.</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-mist">Page {data?.page ?? page} of {data?.pages ?? 1}</span>
                <Button size="sm" variant="subtle" disabled={page <= 1 || loading} onClick={() => setPage((current) => current - 1)} aria-label="Previous page"><FiChevronLeft /></Button>
                <Button size="sm" variant="subtle" disabled={!data || page >= data.pages || loading} onClick={() => setPage((current) => current + 1)} aria-label="Next page"><FiChevronRight /></Button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
