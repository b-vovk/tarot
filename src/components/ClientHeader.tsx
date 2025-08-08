// src/components/ClientHeader.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

export default function ClientHeader() {
  const { t, lang, setLang } = useI18n();

  return (
    <>
      <Link href="/" className="brand" aria-label={t("home")}>
        <Image src="/logo.svg" alt="" className="brandLogo" width={36} height={36} priority aria-hidden />
      </Link>
      <div className="langSwitcher">
        <label htmlFor="lang-select" className="langLabel"></label>
        <select
          id="lang-select"
          value={lang}
          onChange={(e) => setLang(e.target.value as Lang)}
          aria-label={t("languageAria")}
          className="langSelect"
        >
          <option value="en">English</option>
          <option value="uk">Українська</option>
        </select>
      </div>
    </>
  );
}
