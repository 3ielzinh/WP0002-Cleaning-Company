"use client";

/* eslint-disable @next/next/no-img-element -- the existing logo crop is intentionally preserved. */

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./admin.module.css";

const statuses = ["new", "contacted", "qualified", "scheduled", "won", "lost"] as const;
type LeadStatus = typeof statuses[number];
type Lead = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  propertySize: number;
  status: LeadStatus;
  firstSource: string;
  latestSource: string;
  createdAt: number;
  updatedAt: number;
  services: string[];
};
type DashboardData = {
  leads: Lead[];
  counts: Record<LeadStatus, number>;
  notifications: { delivered: number; pending: number };
};

const sourceLabels: Record<string, string> = {
  website_form: "Estimate form",
  website_chat: "Concierge chat",
  phone_call: "Phone concierge",
};

function leadReference(id: string) {
  return `SC-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

function relativeTime(timestamp: number) {
  const minutes = Math.max(0, Math.round((Date.now() - timestamp) / 60_000));
  if (minutes < 60) return `${minutes || 1}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export default function AdminLeadDashboard({ userName, signOutPath }: { userName: string; signOutPath: string }) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [status, setStatus] = useState<LeadStatus | "">("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadLeads = useCallback(async () => {
    setLoading(true);
    const query = new URLSearchParams();
    if (status) query.set("status", status);
    if (search.trim()) query.set("search", search.trim());
    const response = await fetch(`/api/admin/leads?${query}`, { cache: "no-store" });
    const result = await response.json() as DashboardData & { error?: string };
    if (!response.ok) {
      setMessage(result.error ?? "The lead ledger could not be loaded.");
      setLoading(false);
      return;
    }
    setData(result);
    setMessage("");
    setLoading(false);
  }, [search, status]);

  useEffect(() => {
    const timer = window.setTimeout(loadLeads, 180);
    return () => window.clearTimeout(timer);
  }, [loadLeads]);

  const openLeads = useMemo(() => {
    if (!data) return 0;
    return data.counts.new + data.counts.contacted + data.counts.qualified;
  }, [data]);

  async function updateStatus(leadId: string, nextStatus: LeadStatus) {
    setData(current => current ? {
      ...current,
      leads: current.leads.map(lead => lead.id === leadId ? { ...lead, status: nextStatus } : lead),
    } : current);
    const response = await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ leadId, status: nextStatus }),
    });
    if (!response.ok) {
      setMessage("The status was not saved. The ledger has been refreshed.");
      await loadLeads();
    }
  }

  async function retryNotifications() {
    setMessage("Checking pending notifications…");
    const response = await fetch("/api/admin/notifications/retry", { method: "POST" });
    const result = await response.json() as { delivered?: number; error?: string };
    setMessage(response.ok
      ? `${result.delivered ?? 0} pending notification${result.delivered === 1 ? "" : "s"} delivered.`
      : result.error ?? "Notifications could not be retried.");
    await loadLeads();
  }

  return (
    <main className={styles.ledger}>
      <header className={styles.header}>
        <Link href="/" aria-label="Return to SparClean"><img src="/sparclean-logo-220.webp" width="220" height="42" alt="SparClean"/></Link>
        <div>
          <span>{userName}</span>
          <a href={signOutPath}>Sign out</a>
        </div>
      </header>

      <section className={styles.intro}>
        <div>
          <span className={styles.eyebrow}>Private client ledger</span>
          <h1>Every inquiry,<br/><em>beautifully accounted for.</em></h1>
          <p>Review new requests, keep follow-up moving, and see which channel started each conversation.</p>
        </div>
        <aside aria-label="Lead overview">
          <div><strong>{openLeads}</strong><span>Open conversations</span></div>
          <div><strong>{data?.counts.scheduled ?? "—"}</strong><span>Scheduled</span></div>
          <div><strong>{data?.notifications.pending ?? "—"}</strong><span>Notices pending</span></div>
        </aside>
      </section>

      <section className={styles.workspace}>
        <div className={styles.controls}>
          <div className={styles.filters} aria-label="Filter leads by status">
            <button className={!status ? styles.active : ""} onClick={() => setStatus("")}>All</button>
            {statuses.map(item => (
              <button className={status === item ? styles.active : ""} onClick={() => setStatus(item)} key={item}>
                {item}<span>{data?.counts[item] ?? 0}</span>
              </button>
            ))}
          </div>
          <div className={styles.tools}>
            <label>
              <span className="sr-only">Search leads</span>
              <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search name, phone, address…"/>
            </label>
            <button onClick={retryNotifications}>Retry notices</button>
          </div>
        </div>

        {message && <p className={styles.message} role="status">{message}</p>}
        {loading && <div className={styles.loading}>Opening the client ledger…</div>}
        {!loading && data?.leads.length === 0 && (
          <div className={styles.empty}><strong>No inquiries in this view.</strong><span>Try another status or clear the search.</span></div>
        )}

        <div className={styles.leadList}>
          {data?.leads.map(lead => (
            <article className={styles.leadCard} key={lead.id}>
              <div className={styles.leadIdentity}>
                <span className={styles.reference}>{leadReference(lead.id)}</span>
                <h2>{lead.fullName}</h2>
                <p>{lead.address}</p>
                <small>{lead.propertySize.toLocaleString()} sq ft · {relativeTime(lead.createdAt)}</small>
              </div>
              <div className={styles.leadRequest}>
                <span>{sourceLabels[lead.latestSource] ?? lead.latestSource}</span>
                <strong>{lead.services.join(" · ")}</strong>
                {lead.firstSource !== lead.latestSource && <small>First arrived through {sourceLabels[lead.firstSource] ?? lead.firstSource}</small>}
              </div>
              <div className={styles.contact}>
                <a href={`tel:${lead.phone}`}>{lead.phone}</a>
                <a href={`mailto:${lead.email}`}>{lead.email}</a>
              </div>
              <label className={styles.status}>
                <span>Current stage</span>
                <select value={lead.status} onChange={event => updateStatus(lead.id, event.target.value as LeadStatus)}>
                  {statuses.map(item => <option value={item} key={item}>{item}</option>)}
                </select>
              </label>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
