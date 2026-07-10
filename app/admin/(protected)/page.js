"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "../../../lib/supabase/browser";
import styles from "../admin.module.css";

const resources = {
  profiles: {
    label: "Profile",
    singular: "profile",
    table: "profiles",
    hasSort: false,
    assetField: "photo_path",
    assetFolder: "profile",
    blank: { profile_key: "main", full_name: "", role_label: "", hero_kicker: "", hero_title: "", hero_emphasis: "", bio: "", about_text: "", email: "", location: "", photo_path: "", is_published: true },
    fields: [
      { name: "full_name", label: "Full name", type: "text", required: true },
      { name: "role_label", label: "Role label", type: "text" },
      { name: "hero_kicker", label: "Hero kicker", type: "text" },
      { name: "hero_title", label: "Hero title", type: "text" },
      { name: "hero_emphasis", label: "Hero emphasis", type: "text" },
      { name: "bio", label: "Hero bio", type: "textarea" },
      { name: "about_text", label: "About text", type: "textarea" },
      { name: "email", label: "Contact email", type: "email" },
      { name: "location", label: "Location", type: "text" },
    ],
    summary: (row) => `${row.role_label || "Portfolio owner"} · ${row.email || "No email"}`,
  },
  projects: {
    label: "Projects",
    singular: "project",
    table: "projects",
    arrayFields: ["tags"],
    assetField: "image_path",
    assetFolder: "projects",
    blank: { title: "", slug: "", category: "", summary: "", tags: "", accent: "amber", case_study_url: "", image_path: "", sort_order: 1, is_published: true },
    fields: [
      { name: "title", label: "Project title", type: "text", required: true },
      { name: "slug", label: "Slug URL", type: "text", hint: "Kosongkan untuk dibuat otomatis dari judul." },
      { name: "category", label: "Category", type: "text", required: true },
      { name: "summary", label: "Summary", type: "textarea", required: true },
      { name: "tags", label: "Tags", type: "textarea", hint: "Pisahkan dengan koma." },
      { name: "accent", label: "Card color", type: "select", options: ["amber", "mint", "violet"] },
      { name: "case_study_url", label: "Case study URL", type: "url" },
    ],
    summary: (row) => `${row.category} · ${row.tags?.join(", ") || "No tags"}`,
  },
  experiences: {
    label: "Experience",
    singular: "experience",
    table: "experiences",
    blank: { start_label: "", role: "", company: "", description: "", sort_order: 1, is_published: true },
    fields: [
      { name: "role", label: "Role", type: "text", required: true },
      { name: "company", label: "Company", type: "text", required: true },
      { name: "start_label", label: "Period", type: "text", required: true, hint: "Contoh: 2023 — now" },
      { name: "description", label: "Description", type: "textarea", required: true },
    ],
    summary: (row) => `${row.company} · ${row.start_label}`,
  },
  skill_groups: {
    label: "Skills",
    singular: "skill group",
    table: "skill_groups",
    arrayFields: ["items"],
    blank: { title: "", items: "", sort_order: 1, is_published: true },
    fields: [
      { name: "title", label: "Group title", type: "text", required: true },
      { name: "items", label: "Skills", type: "textarea", required: true, hint: "Pisahkan setiap skill dengan koma." },
    ],
    summary: (row) => row.items?.join(", ") || "No skills",
  },
  certificates: {
    label: "Certificates",
    singular: "certificate",
    table: "certificates",
    numberFields: ["issued_year"],
    assetField: "image_path",
    assetFolder: "certificates",
    blank: { code: "", title: "", issuer: "", issued_year: new Date().getFullYear(), accent: "gold", credential_url: "", image_path: "", sort_order: 1, is_published: true },
    fields: [
      { name: "code", label: "Short code", type: "text", required: true, hint: "Contoh: LSS-G" },
      { name: "title", label: "Certificate title", type: "text", required: true },
      { name: "issuer", label: "Issuer", type: "text", required: true },
      { name: "issued_year", label: "Issued year", type: "number", required: true },
      { name: "accent", label: "Card color", type: "select", options: ["gold", "blue", "red"] },
      { name: "credential_url", label: "Credential URL", type: "url" },
    ],
    summary: (row) => `${row.issuer} · ${row.issued_year}`,
  },
  education: {
    label: "Education",
    singular: "education record",
    table: "education",
    blank: { institution: "", degree: "", period_label: "", detail: "", sort_order: 1, is_published: true },
    fields: [
      { name: "institution", label: "Institution", type: "text", required: true },
      { name: "degree", label: "Degree", type: "text", required: true },
      { name: "period_label", label: "Period", type: "text", required: true },
      { name: "detail", label: "Detail", type: "textarea" },
    ],
    summary: (row) => `${row.institution} · ${row.period_label}`,
  },
  achievements: {
    label: "Achievements",
    singular: "achievement",
    table: "achievements",
    blank: { metric: "", description: "", context: "", sort_order: 1, is_published: true },
    fields: [
      { name: "metric", label: "Metric", type: "text", required: true, hint: "Contoh: 31% atau 1st" },
      { name: "description", label: "Description", type: "text", required: true },
      { name: "context", label: "Context", type: "text" },
    ],
    summary: (row) => row.context || "No context",
  },
};

function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function toForm(resource, row) {
  const next = { ...resource.blank, ...row };
  resource.arrayFields?.forEach((field) => { next[field] = (row[field] || []).join(", "); });
  return next;
}

export default function AdminPage() {
  const router = useRouter();
  const [activeKey, setActiveKey] = useState("projects");
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(resources.projects.blank);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const resource = useMemo(() => resources[activeKey], [activeKey]);

  async function loadRecords(nextResource = resource) {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    setIsLoading(true);
    let query = supabase.from(nextResource.table).select("*");
    if (nextResource.hasSort !== false) query = query.order("sort_order");
    const { data, error } = await query;
    setIsLoading(false);
    if (error) {
      setStatus(error.message);
      return;
    }
    setRecords(data || []);
  }

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabase?.auth.getUser().then(({ data }) => setUserEmail(data.user?.email || ""));
  }, []);

  useEffect(() => {
    setEditingId(null);
    setForm(resources[activeKey].blank);
    setStatus("");
    loadRecords(resources[activeKey]);
  }, [activeKey]);

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function startEdit(row) {
    setEditingId(row.id);
    setForm(toForm(resource, row));
    setStatus("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm({ ...resource.blank, ...(resource.hasSort !== false ? { sort_order: records.length + 1 } : {}) });
    setStatus("");
  }

  async function uploadAsset(event) {
    const file = event.target.files?.[0];
    if (!file || !resource.assetField) return;
    if (!file.type.startsWith("image/")) {
      setStatus("Pilih file gambar yang valid.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setStatus("Ukuran gambar maksimal 5 MB.");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    const extension = file.name.includes(".") ? file.name.split(".").pop().toLowerCase() : "jpg";
    const uniqueName = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const path = `${resource.assetFolder}/${uniqueName}.${extension}`;
    setUploadingField(resource.assetField);
    setStatus("");
    const { error } = await supabase.storage.from("portfolio-assets").upload(path, file, { cacheControl: "3600", contentType: file.type, upsert: false });
    setUploadingField("");
    if (error) {
      setStatus(error.message);
      return;
    }
    updateField(resource.assetField, path);
    setStatus("Gambar terunggah. Simpan formulir untuk menautkannya ke konten ini.");
  }

  async function saveRecord(event) {
    event.preventDefault();
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const payload = { ...form };
    if (resource.hasSort !== false) payload.sort_order = Number(form.sort_order) || 1;
    resource.arrayFields?.forEach((field) => { payload[field] = String(payload[field]).split(",").map((item) => item.trim()).filter(Boolean); });
    resource.numberFields?.forEach((field) => { payload[field] = Number(payload[field]); });
    if (activeKey === "projects" && !payload.slug) payload.slug = slugify(payload.title);

    setIsSaving(true);
    setStatus("");
    const result = editingId
      ? await supabase.from(resource.table).update(payload).eq("id", editingId)
      : await supabase.from(resource.table).insert(payload);
    setIsSaving(false);

    if (result.error) {
      setStatus(result.error.message);
      return;
    }
    setStatus(editingId ? "Perubahan tersimpan." : "Konten baru berhasil ditambahkan.");
    await loadRecords();
    resetForm();
  }

  async function deleteRecord(id) {
    if (!window.confirm("Hapus konten ini? Tindakan ini tidak bisa dibatalkan.")) return;
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.from(resource.table).delete().eq("id", id);
    if (error) {
      setStatus(error.message);
      return;
    }
    setStatus("Konten dihapus.");
    await loadRecords();
    if (editingId === id) resetForm();
  }

  async function togglePublished(row) {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.from(resource.table).update({ is_published: !row.is_published }).eq("id", row.id);
    if (error) setStatus(error.message);
    else await loadRecords();
  }

  async function signOut() {
    const supabase = getSupabaseBrowserClient();
    await supabase?.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <main className={styles.dashboardPage}>
      <header className={styles.dashboardHeader}>
        <Link className={styles.brand} href="/"><span>F</span> Fahzri / Eng.</Link>
        <div className={styles.userArea}><span>{userEmail}</span><button onClick={signOut}>Sign out</button></div>
      </header>
      <div className={styles.dashboardIntro}><p className={styles.eyebrow}>Portfolio CMS</p><h1>Keep the work<br /><em>moving.</em></h1><p>Perubahan yang Anda simpan di sini tersedia di halaman publik setelah pengunjung melakukan refresh.</p></div>
      <section className={styles.workspace}>
        <nav className={styles.tabs} aria-label="Content sections">
          {Object.entries(resources).map(([key, item]) => <button key={key} className={activeKey === key ? styles.activeTab : ""} onClick={() => setActiveKey(key)}>{item.label}</button>)}
        </nav>
        <div className={styles.editorGrid}>
          <form className={styles.editorCard} onSubmit={saveRecord}>
            <div className={styles.cardHeader}><div><p className={styles.eyebrow}>{editingId ? "Editing" : "New entry"}</p><h2>{editingId ? `Edit ${resource.singular}` : `Add ${resource.singular}`}</h2></div>{editingId && <button type="button" className={styles.textButton} onClick={resetForm}>Cancel</button>}</div>
            <div className={styles.formFields}>
              {resource.fields.map((field) => <label key={field.name}>{field.label}
                {field.type === "textarea" ? <textarea value={form[field.name] ?? ""} onChange={(event) => updateField(field.name, event.target.value)} required={field.required} />
                  : field.type === "select" ? <select value={form[field.name] ?? ""} onChange={(event) => updateField(field.name, event.target.value)}>{field.options.map((option) => <option key={option} value={option}>{option}</option>)}</select>
                    : <input type={field.type} value={form[field.name] ?? ""} onChange={(event) => updateField(field.name, event.target.value)} required={field.required} />}
                {field.hint && <small>{field.hint}</small>}
              </label>)}
              {resource.assetField && <label>Image asset<input type="file" accept="image/*" onChange={uploadAsset} disabled={Boolean(uploadingField)} />{uploadingField && <small>Uploading image…</small>}{form[resource.assetField] && <small>Stored path: {form[resource.assetField]}</small>}</label>}
              <div className={styles.inlineFields}>{resource.hasSort !== false && <label>Display order<input type="number" min="1" value={form.sort_order ?? 1} onChange={(event) => updateField("sort_order", event.target.value)} /></label>}<label className={styles.checkboxLabel}><input type="checkbox" checked={Boolean(form.is_published)} onChange={(event) => updateField("is_published", event.target.checked)} /> Published</label></div>
            </div>
            {status && <p className={styles.formMessage}>{status}</p>}
            <button className={styles.primaryButton} type="submit" disabled={isSaving}>{isSaving ? "Saving…" : editingId ? "Save changes" : `Add ${resource.singular}`}<span>↗</span></button>
          </form>
          <section className={styles.recordsCard}>
            <div className={styles.cardHeader}><div><p className={styles.eyebrow}>Current content</p><h2>{resource.label}</h2></div><span className={styles.count}>{records.length} items</span></div>
            {isLoading ? <p className={styles.empty}>Loading content…</p> : records.length === 0 ? <p className={styles.empty}>No entries yet. Add the first one from the form.</p> : <div className={styles.recordsList}>{records.map((row) => <article key={row.id} className={styles.record}><div className={styles.recordOrder}>{String(row.sort_order ?? 1).padStart(2, "0")}</div><div className={styles.recordMain}><h3>{row.title || row.role || row.full_name || row.degree || row.metric}</h3><p>{resource.summary(row)}</p></div><button className={row.is_published ? styles.published : styles.draft} onClick={() => togglePublished(row)}>{row.is_published ? "Published" : "Draft"}</button><div className={styles.recordActions}><button onClick={() => startEdit(row)}>Edit</button><button onClick={() => deleteRecord(row.id)}>Delete</button></div></article>)}</div>}
          </section>
        </div>
      </section>
    </main>
  );
}
