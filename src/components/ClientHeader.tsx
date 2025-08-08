// src/components/ClientHeader.tsx
"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function ClientHeader() {
  const { t, lang, setLang } = useI18n();

  return (
    <>
      <Link href="/" className="navLink">{t("home")}</Link>
      <div style={{ marginLeft: "auto" }}>
        <label style={{ marginRight: 8, color: "var(--muted)", fontSize: 12 }}></label>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as any)}
          aria-label="Language"
          style={{ background: "#1a2030", color: "var(--text)", borderRadius: 8, padding: "6px 8px", border: "1px solid rgba(255,255,255,0.12)" }}
        >
          <option value="en">English</option>
          <option value="uk">Українська</option>
        </select>
      </div>
    </>
  );
}
