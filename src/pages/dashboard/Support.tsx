import { useCallback, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import {
  FiArrowLeft, FiBookOpen, FiClock, FiLifeBuoy, FiPhoneCall, FiSearch, FiShield,
  FiUser, FiUsers, FiVideo, FiX,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import JitsiMeeting from "../../components/JitsiMeeting";
import { useAppSelector } from "../../app/hooks";
import { apiRequest, SOCKET_URL } from "../../lib/api";

type CampusRole = "student" | "instructor" | "admin";
type CallStatus = "ringing" | "accepted" | "declined" | "ended";

interface SupportContact {
  id: string;
  name: string;
  role: CampusRole;
  avatarUrl: string;
}

interface CallParticipant {
  id: string;
  name: string;
  role: CampusRole;
}

interface SupportCall {
  id: string;
  roomName: string;
  topic: string;
  status: CallStatus;
  createdAt: string;
  expiresAt: string;
  isIncoming: boolean;
  initiator: CallParticipant;
  recipient: CallParticipant;
}

const roleLabel: Record<CampusRole, string> = {
  student: "Student",
  instructor: "Instructor",
  admin: "Admin",
};

function roleDescription(role: CampusRole) {
  if (role === "student") return "Get course guidance from an instructor or platform admin.";
  if (role === "instructor") return "Support learners directly or connect with an admin.";
  return "Offer platform support to students and instructors.";
}

function roleStyle(role: CampusRole) {
  if (role === "admin") return "border-violet-300/20 bg-violet-400/10 text-violet-200";
  if (role === "instructor") return "border-cyan/20 bg-cyan/10 text-cyan";
  return "border-sky-300/20 bg-sky-400/10 text-sky-200";
}

function SupportMetric({ icon: Icon, label, value }: { icon: typeof FiUsers; label: string; value: string | number }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 sm:p-5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan/10 text-cyan"><Icon size={20} /></span>
      <div><p className="font-display text-xl font-semibold text-fog">{value}</p><p className="text-xs text-mist">{label}</p></div>
    </div>
  );
}

export default function Support() {
  const user = useAppSelector((state) => state.auth.user);
  const role = user?.role as CampusRole | undefined;
  const dashboardPath = role === "admin" ? "/admin" : role === "instructor" ? "/instructor" : "/dashboard";
  const [contacts, setContacts] = useState<SupportContact[]>([]);
  const [calls, setCalls] = useState<SupportCall[]>([]);
  const [activeCall, setActiveCall] = useState<SupportCall | null>(null);
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("");
  const [contactsLoading, setContactsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [busyCallId, setBusyCallId] = useState("");

  const loadCalls = useCallback(async () => {
    try {
      const result = await apiRequest<{ calls: SupportCall[] }>("/support/calls");
      setCalls(result.calls);
      setActiveCall((current) => {
        if (!current) return null;
        return result.calls.find((call) => call.id === current.id) || null;
      });
      setActionError("");
    } catch (requestError: unknown) {
      setActionError(requestError instanceof Error ? requestError.message : "Unable to refresh your support calls.");
    }
  }, []);

  useEffect(() => {
    let active = true;
    apiRequest<{ contacts: SupportContact[] }>("/support/contacts")
      .then((result) => { if (active) { setContacts(result.contacts); setError(""); } })
      .catch((requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : "Unable to load support contacts.");
      })
      .finally(() => { if (active) setContactsLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    void loadCalls();
    const interval = window.setInterval(() => { void loadCalls(); }, 12_000);
    const socket = SOCKET_URL ? io(SOCKET_URL, { withCredentials: true }) : undefined;
    socket?.on("support:call", (invitation: { initiatorName: string; topic?: string }) => {
      toast(`Incoming call from ${invitation.initiatorName}${invitation.topic ? ` · ${invitation.topic}` : ""}`, { icon: <FiVideo className="text-cyan" /> });
      void loadCalls();
    });
    socket?.on("support:call-updated", () => { void loadCalls(); });
    return () => {
      window.clearInterval(interval);
      socket?.disconnect();
    };
  }, [loadCalls]);

  const filteredContacts = useMemo(() => contacts.filter((contact) =>
    `${contact.name} ${contact.role}`.toLowerCase().includes(search.trim().toLowerCase())), [contacts, search]);
  const incomingCalls = calls.filter((call) => call.isIncoming && call.status === "ringing");
  const outgoingCalls = calls.filter((call) => !call.isIncoming && call.status === "ringing");
  const acceptedCalls = calls.filter((call) => call.status === "accepted");

  async function startCall(contact: SupportContact) {
    setActionError("");
    setBusyCallId(contact.id);
    try {
      const result = await apiRequest<{ call: SupportCall }>("/support/calls", {
        method: "POST",
        body: JSON.stringify({ recipientId: contact.id, topic: topic.trim() }),
      });
      setActiveCall(result.call);
      setCalls((current) => [result.call, ...current.filter((call) => call.id !== result.call.id)]);
      toast.success(`Calling ${contact.name}…`);
    } catch (requestError: unknown) {
      const message = requestError instanceof Error ? requestError.message : "Unable to start this support call.";
      setActionError(message);
      toast.error(message);
    } finally {
      setBusyCallId("");
    }
  }

  async function updateCall(call: SupportCall, action: "accept" | "decline" | "end") {
    setActionError("");
    setBusyCallId(call.id);
    try {
      const result = await apiRequest<{ call: SupportCall }>(`/support/calls/${encodeURIComponent(call.id)}`, {
        method: "PATCH",
        body: JSON.stringify({ action }),
      });
      if (action === "accept") setActiveCall(result.call);
      if (action === "end" || action === "decline") setActiveCall((current) => current?.id === call.id ? null : current);
      await loadCalls();
      if (action === "accept") toast.success("You joined the support call.");
      if (action === "decline") toast.success("Call declined.");
      if (action === "end") toast.success("You left the support call.");
    } catch (requestError: unknown) {
      const message = requestError instanceof Error ? requestError.message : "Unable to update this support call.";
      setActionError(message);
      toast.error(message);
    } finally {
      setBusyCallId("");
    }
  }

  const activeCounterpart = activeCall
    ? activeCall.isIncoming ? activeCall.initiator : activeCall.recipient
    : null;

  return (
    <div className="space-y-7">
      <header className="relative isolate overflow-hidden rounded-3xl border border-cyan/20 bg-surface p-6 shadow-xl shadow-black/5 sm:p-8">
        <div className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-2/3 bg-gradient-to-l from-cyan/10 via-violet/5 to-transparent" />
        <Link to={dashboardPath} className="inline-flex items-center gap-2 text-xs font-medium text-mist transition hover:text-cyan"><FiArrowLeft /> Back to dashboard</Link>
        <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-cyan"><FiLifeBuoy /> Campus support · live video</p>
            <h1 className="mt-3 font-display text-2xl font-semibold tracking-tight text-fog sm:text-3xl">Talk it through, face to face.</h1>
            <p className="mt-2 text-sm leading-relaxed text-mist">{role ? roleDescription(role) : "Connect with the Coding Campus community."} Start a free Jitsi Meet call, or respond to an invitation waiting for you.</p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-line bg-ink/40 px-4 py-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan/10 text-cyan"><FiShield /></span>
            <div><p className="text-sm font-semibold text-fog">Private campus invites</p><p className="text-xs text-mist">Only the invited account sees the call here</p></div>
          </div>
        </div>
      </header>

      {error && <p role="alert" className="rounded-xl border border-coral/30 bg-coral/10 p-4 text-sm text-coral">{error}</p>}
      {actionError && <p role="alert" className="rounded-xl border border-coral/30 bg-coral/10 p-4 text-sm text-coral">{actionError}</p>}

      <section className="grid gap-3 sm:grid-cols-3">
        <SupportMetric icon={FiUsers} label="Available support contacts" value={contacts.length} />
        <SupportMetric icon={FiPhoneCall} label="Incoming invitations" value={incomingCalls.length} />
        <SupportMetric icon={FiVideo} label="Active campus calls" value={acceptedCalls.length} />
      </section>

      {activeCall && activeCounterpart && (
        <section className="space-y-4 rounded-3xl border border-cyan/20 bg-surface p-4 shadow-xl shadow-black/10 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-mono text-xs uppercase tracking-widest text-cyan">{activeCall.status === "accepted" ? "Connected" : "Calling · waiting for them to join"}</p>
              <h2 className="mt-1 truncate font-display text-lg font-semibold text-fog">{activeCounterpart.name} <span className="text-sm font-normal text-mist">· {roleLabel[activeCounterpart.role]}</span></h2>
              {activeCall.topic && <p className="mt-1 truncate text-sm text-mist">{activeCall.topic}</p>}
            </div>
            <Button variant="danger" onClick={() => void updateCall(activeCall, "end")} disabled={busyCallId === activeCall.id}><FiX /> Leave call</Button>
          </div>
          <JitsiMeeting
            roomName={activeCall.roomName}
            title={`Jitsi support call with ${activeCounterpart.name}`}
            onClose={() => void updateCall(activeCall, "end")}
          />
          <p className="flex items-start gap-2 text-xs leading-relaxed text-mist"><FiShield className="mt-0.5 shrink-0 text-cyan" /> Video and audio are provided by meet.jit.si. The room name is shared with the invited user; anyone who obtains the room link may be able to join.</p>
        </section>
      )}

      {incomingCalls.length > 0 && (
        <section className="space-y-3">
          <div><p className="font-mono text-xs uppercase tracking-widest text-cyan">Needs your attention</p><h2 className="mt-1 font-display text-xl font-semibold text-fog">Incoming calls</h2></div>
          <div className="grid gap-3 lg:grid-cols-2">
            {incomingCalls.map((call) => (
              <article key={call.id} className="flex flex-col gap-4 rounded-2xl border border-cyan/25 bg-cyan/5 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0"><p className="font-semibold text-fog">{call.initiator.name} <span className="text-sm font-normal text-mist">· {roleLabel[call.initiator.role]}</span></p><p className="mt-1 text-sm text-mist">{call.topic || "Coding Campus support call"}</p><p className="mt-2 inline-flex items-center gap-1.5 text-xs text-mist"><FiClock /> Expires {new Date(call.expiresAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</p></div>
                <div className="flex shrink-0 gap-2"><Button onClick={() => void updateCall(call, "accept")} disabled={busyCallId === call.id || Boolean(activeCall)}><FiVideo /> Accept</Button><Button variant="subtle" onClick={() => void updateCall(call, "decline")} disabled={busyCallId === call.id}>Decline</Button></div>
              </article>
            ))}
          </div>
        </section>
      )}

      {outgoingCalls.length > 0 && (
        <section className="space-y-3">
          <div><p className="font-mono text-xs uppercase tracking-widest text-violet-300">Invitations sent</p><h2 className="mt-1 font-display text-xl font-semibold text-fog">Waiting for a response</h2></div>
          <div className="grid gap-3 sm:grid-cols-2">
            {outgoingCalls.map((call) => (
              <article key={call.id} className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4">
                <div className="min-w-0"><p className="truncate font-medium text-fog">{call.recipient.name}</p><p className="text-xs text-mist">{roleLabel[call.recipient.role]} · {call.topic || "Support call"}</p></div>
                <div className="flex shrink-0 gap-2"><Button size="sm" variant="subtle" onClick={() => setActiveCall(call)}><FiVideo /> Rejoin</Button><Button size="sm" variant="danger" aria-label={`Cancel call to ${call.recipient.name}`} onClick={() => void updateCall(call, "end")} disabled={busyCallId === call.id}><FiX /></Button></div>
              </article>
            ))}
          </div>
        </section>
      )}

      {acceptedCalls.filter((call) => call.id !== activeCall?.id).length > 0 && (
        <section className="space-y-3">
          <div><p className="font-mono text-xs uppercase tracking-widest text-emerald-300">In progress</p><h2 className="mt-1 font-display text-xl font-semibold text-fog">Active support calls</h2></div>
          <div className="grid gap-3 sm:grid-cols-2">
            {acceptedCalls.filter((call) => call.id !== activeCall?.id).map((call) => {
              const counterpart = call.isIncoming ? call.initiator : call.recipient;
              return (
                <article key={call.id} className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4">
                  <div className="min-w-0"><p className="truncate font-medium text-fog">{counterpart.name}</p><p className="text-xs text-mist">{roleLabel[counterpart.role]} · {call.topic || "Support call"}</p></div>
                  <Button size="sm" onClick={() => setActiveCall(call)}><FiVideo /> Rejoin</Button>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <section className="space-y-4 rounded-3xl border border-line bg-surface p-4 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div><p className="font-mono text-xs uppercase tracking-widest text-cyan">Your campus network</p><h2 className="mt-1 font-display text-xl font-semibold text-fog">Start a support call</h2><p className="mt-1 text-sm text-mist">Choose a {role === "admin" ? "student or instructor" : role === "instructor" ? "student or admin" : "instructor or admin"} and we’ll send them a private invitation.</p></div>
          <label className="relative block w-full lg:max-w-sm"><FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-mist" /><span className="sr-only">Search support contacts</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search people by name or role..." className="h-11 w-full rounded-xl border border-line bg-surface-2 pl-9 pr-3 text-sm text-fog outline-none transition focus:border-cyan/50" /></label>
        </div>
        <label className="block max-w-2xl text-xs font-medium uppercase tracking-wide text-mist">What would you like to discuss? <span className="normal-case tracking-normal">(optional)</span><input value={topic} onChange={(event) => setTopic(event.target.value)} maxLength={120} placeholder="Course setup, a lesson question, or platform support" className="mt-1.5 h-11 w-full rounded-xl border border-line bg-surface-2 px-3.5 text-sm normal-case tracking-normal text-fog outline-none placeholder:text-mist/70 focus:border-cyan/50" /></label>

        {contactsLoading ? <div role="status" className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-mist">Finding campus contacts…</div> : filteredContacts.length ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredContacts.map((contact) => (
              <article key={contact.id} className="group flex min-w-0 flex-col rounded-2xl border border-line bg-ink/30 p-4 transition hover:border-cyan/25 hover:bg-surface-2/40 sm:p-5">
                <div className="flex items-center gap-3">
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border ${roleStyle(contact.role)}`}>
                    {contact.avatarUrl ? <img src={contact.avatarUrl} alt="" className="h-full w-full object-cover" /> : contact.role === "admin" ? <FiShield size={20} /> : contact.role === "instructor" ? <FiBookOpen size={20} /> : <FiUser size={20} />}
                  </span>
                  <div className="min-w-0 flex-1"><h3 className="truncate font-semibold text-fog">{contact.name}</h3><span className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[11px] ${roleStyle(contact.role)}`}>{roleLabel[contact.role]}</span></div>
                </div>
                <Button className="mt-4 w-full" variant="outline" disabled={Boolean(busyCallId) || Boolean(activeCall)} onClick={() => void startCall(contact)}><FiPhoneCall /> {busyCallId === contact.id ? "Calling…" : "Start free video call"}</Button>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-line px-5 py-12 text-center">
            <FiUsers className="mx-auto text-cyan" size={25} />
            <h3 className="mt-3 font-display font-semibold text-fog">{search ? "No contacts match your search" : "No support contacts available yet"}</h3>
            <p className="mx-auto mt-1 max-w-md text-sm text-mist">{search ? "Try another name or role." : "New students, instructors, and admins will appear here as they join Coding Campus."}</p>
          </div>
        )}
      </section>
    </div>
  );
}
