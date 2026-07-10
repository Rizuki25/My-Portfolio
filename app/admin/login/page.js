"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "../../../lib/supabase/browser";
import styles from "../admin.module.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("error") === "unauthorized") {
      setMessage("Akun ini belum terdaftar sebagai admin portofolio.");
    }
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setMessage("Konfigurasi Supabase belum ditemukan. Periksa file .env.local.");
      return;
    }

    setIsLoading(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className={styles.loginPage}>
      <Link className={styles.brand} href="/"><span>F</span> Fahzri / Eng.</Link>
      <section className={styles.loginCard}>
        <p className={styles.eyebrow}>Private workspace</p>
        <h1>Portfolio<br /><em>control room.</em></h1>
        <p className={styles.intro}>Masuk dengan akun admin Supabase Anda untuk mengelola konten yang tampil di portofolio.</p>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></label>
          <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" /></label>
          {message && <p className={styles.formMessage}>{message}</p>}
          <button className={styles.primaryButton} type="submit" disabled={isLoading}>{isLoading ? "Signing in…" : "Sign in"}<span>↗</span></button>
        </form>
      </section>
      <p className={styles.loginFooter}>Protected by Supabase Auth</p>
    </main>
  );
}
