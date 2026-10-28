"use client";

import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

type ServiceOption = { id: string; name: string; category: string; active?: boolean };
type RateRecord = { serviceId: string; weekdayRate: number | null; weekendRate: number | null; currency: "BWP"; updatedAt?: string };
type RateDraft = { weekdayRate: string; weekendRate: string };

export default function PrivateRatesManager({ services }: { services: ServiceOption[] }) {
  const [records, setRecords] = useState<Record<string, RateRecord>>({});
  const [drafts, setDrafts] = useState<Record<string, RateDraft>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => onSnapshot(collection(db, "privateRates"), snapshot => {
    const next: Record<string, RateRecord> = {};
    snapshot.docs.forEach(item => { next[item.id] = { serviceId: item.id, ...(item.data() as Omit<RateRecord, "serviceId">) }; });
    setRecords(next);
    setDrafts(current => {
      const updated = { ...current };
      for (const item of snapshot.docs) {
        const value = item.data() as RateRecord;
        if (!updated[item.id]) updated[item.id] = { weekdayRate: value.weekdayRate == null ? "" : String(value.weekdayRate), weekendRate: value.weekendRate == null ? "" : String(value.weekendRate) };
      }
      return updated;
    });
    setLoading(false);
  }, () => { setLoading(false); setMessage("Private rates could not be loaded. Check admin access and Firestore rules."); }), []);

  function draft(serviceId: string, field: keyof RateDraft, value: string) {
    setDrafts(current => ({ ...current, [serviceId]: { ...(current[serviceId] || { weekdayRate: "", weekendRate: "" }), [field]: value } }));
  }

  async function save(service: ServiceOption) {
    const value = drafts[service.id] || { weekdayRate: "", weekendRate: "" };
    const parse = (raw: string) => raw.trim() === "" ? null : Number(raw);
    const weekdayRate = parse(value.weekdayRate);
    const weekendRate = parse(value.weekendRate);
    if ([weekdayRate, weekendRate].some(rate => rate !== null && (!Number.isFinite(rate) || rate < 0 || rate > 10000000))) {
      setMessage("Rates must be valid non-negative BWP amounts.");
      return;
    }
    setBusy(service.id); setMessage("");
    try {
      await setDoc(doc(db, "privateRates", service.id), { serviceId: service.id, serviceName: service.name, category: service.category, weekdayRate, weekendRate, currency: "BWP", updatedAt: new Date().toISOString() }, { merge: true });
      setMessage("Private rates saved for " + service.name + ". They are not published to customers.");
    } catch {
      setMessage("Could not save private rates. Check Firestore rules and retry.");
    } finally { setBusy(null); }
  }

  async function seedRates() {
    setBusy("__seed"); setMessage("");
    try {
      for (const service of services) {
        if (records[service.id]) continue;
        const isVip = service.category === "VIP trailer toilets" || service.category === "Handwashing & hygiene";
        await setDoc(doc(db, "privateRates", service.id), {
          serviceId: service.id, serviceName: service.name, category: service.category,
          weekdayRate: isVip ? 1000 : null, weekendRate: isVip ? 1500 : null,
          currency: "BWP", updatedAt: new Date().toISOString(), seeded: true
        });
      }
      setMessage("Missing internal rate records seeded. Review and adjust them before using them for quotations.");
    } catch {
      setMessage("Could not seed private rates. Check admin permissions and retry.");
    } finally { setBusy(null); }
  }

  return <section className="af-admin-panel" id="admin-private-rates">
    <p className="af-eyebrow">STAFF ONLY · NEVER PUBLIC</p>
    <h2>Private quotation rates</h2>
    <p>These records are stored separately from the public catalogue and customer enquiries. Customers cannot read this collection.</p>
    <div className="af-inline-actions"><button type="button" className="af-button af-button-outline" disabled={busy !== null || loading} onClick={() => void seedRates()}>{busy === "__seed" ? "Seeding…" : "Seed missing internal rates"}</button></div>
    {message && <p className="af-form-message" role="status" aria-live="polite">{message}</p>}
    {loading ? <p>Loading private rates…</p> : <div className="af-private-rates-grid">{services.map(service => {
      const value = drafts[service.id] || { weekdayRate: "", weekendRate: "" };
      const saved = records[service.id];
      return <article className="af-private-rate-card" key={service.id}>
        <div><strong>{service.name}</strong><small>{service.category} · {saved ? "Rate record saved" : "No internal rates saved yet"}</small></div>
        <label>Weekday rate (BWP)<input type="number" min="0" step="1" inputMode="decimal" value={value.weekdayRate} onChange={event => draft(service.id, "weekdayRate", event.target.value)} placeholder="Not set" /></label>
        <label>Weekend rate (BWP)<input type="number" min="0" step="1" inputMode="decimal" value={value.weekendRate} onChange={event => draft(service.id, "weekendRate", event.target.value)} placeholder="Not set" /></label>
        <button type="button" className="af-button" disabled={busy !== null} onClick={() => void save(service)}>{busy === service.id ? "Saving…" : "Save private rates"}</button>
      </article>;
    })}</div>}
  </section>;
}
