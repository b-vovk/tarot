// src/components/ClientHeader.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { usePathname, useRouter } from "next/navigation";

export default function ClientHeader() {
  const { t, lang, setLang } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) setMenuOpen(false);
      if (langRef.current && !langRef.current.contains(target)) setLangOpen(false);
    }
    if (menuOpen || langOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [menuOpen, langOpen]);

  function handleHomeClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    if (pathname === "/") {
      // Force a full reload to reset client state on the homepage
      window.location.reload();
    } else {
      router.push("/");
    }
  }

  return (
    <>
      <Link href="/" className="brand" aria-label={t("home")} onClick={handleHomeClick}>
        <Image src="/logo.svg" alt="" className="brandLogo" width={36} height={36} priority aria-hidden />
      </Link>
      <div className="headerNav">
        <div className="headerMenu" ref={menuRef}>
          {menuOpen ? (
            <>
              <Link
                href="/knowledge"
                className="headerPill headerMenuOptionPill"
                onClick={() => setMenuOpen(false)}
              >
                {t("navKnowledge")}
              </Link>
              <button
                type="button"
                className="headerPill headerMenuBackPill"
                onClick={() => setMenuOpen(false)}
                aria-label={t("close")}
                title={t("close")}
              >
                ←
              </button>
            </>
          ) : (
            <button
              type="button"
              className="headerPill headerMenuTrigger"
              onClick={() => setMenuOpen(true)}
              aria-expanded={false}
              aria-haspopup="true"
              aria-label={t("navMenu")}
            >
              {t("navMenu")}
            </button>
          )}
        </div>
        <div className="headerLang" ref={langRef}>
          {langOpen ? (
            <>
              <button
                type="button"
                className="headerPill headerLangOptionPill"
                onClick={() => { setLang("en"); setLangOpen(false); }}
                aria-label="English"
              >
                English
              </button>
              <button
                type="button"
                className="headerPill headerLangOptionPill"
                onClick={() => { setLang("uk"); setLangOpen(false); }}
                aria-label="Українська"
              >
                Українська
              </button>
              <button
                type="button"
                className="headerPill headerMenuBackPill"
                onClick={() => setLangOpen(false)}
                aria-label={t("close")}
                title={t("close")}
              >
                ←
              </button>
            </>
          ) : (
            <button
              type="button"
              className="headerPill headerLangTrigger"
              onClick={() => setLangOpen(true)}
              aria-expanded={false}
              aria-haspopup="true"
              aria-label={t("languageAria")}
            >
              {lang === "uk" ? "Українська" : "English"}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
