"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/ui/Logo";
import SiteLink from "@/components/ui/SiteLink";
import { services, servicePath } from "@/content/services";
import { features } from "@/content/site";
import { usePageKey } from "./usePageKey";

const serviceIcons = { project: "hardhat", logistics: "truck", realEstate: "building", sourcing: "package" };

export default function Header() {
  const t = useTranslations("nav");
  const s = useTranslations("services");
  const page = usePageKey();
  const [menu, setMenu] = useState(false);
  const [drop, setDrop] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const dropButton = useRef<HTMLButtonElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const isService = page in serviceIcons;
  const close = () => {
    setMenu(false);
    setDrop(false);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(scrollY > 8);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menu && !drop) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      (menu ? menuButton : dropButton).current?.focus();
      setMenu(false);
      setDrop(false);
    };
    const onClick = (e: PointerEvent) => {
      if (drop && !dropRef.current?.contains(e.target as Node)) setDrop(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onClick);
    };
  }, [menu, drop]);

  useEffect(() => {
    document.documentElement.style.overflow = menu ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menu]);

  const link = (current: boolean) =>
    `relative py-2 font-bold transition hover:text-accent-ink ${
      current ? "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[3px] after:bg-accent" : ""
    }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-[var(--header)] bg-white transition-shadow duration-300 ${
        scrolled || menu ? "shadow-[0_1px_0_rgb(var(--c-line))]" : ""
      }`}
    >
      <div className="wrap flex h-full items-center justify-between gap-6">
        <SiteLink href="/" aria-label={t("homeLabel")} onClick={close}>
          <Logo eager className="h-12 sm:h-14" />
        </SiteLink>

        <nav aria-label={t("main")} className="hidden items-center gap-8 lg:flex">
          <div
            ref={dropRef}
            className="relative"
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setDrop(false);
            }}
          >
            <button
              ref={dropButton}
              type="button"
              aria-expanded={drop}
              aria-controls="services-menu"
              onClick={() => setDrop(!drop)}
              className={`flex items-center gap-1.5 ${link(isService)}`}
            >
              {t("services")}
              <ChevronDown aria-hidden="true" className={`h-4 w-4 transition ${drop ? "rotate-180" : ""}`} />
            </button>
            <div
              id="services-menu"
              hidden={!drop}
              className="absolute start-1/2 top-full mt-3 w-[25rem] -translate-x-1/2 rounded-xl border border-line bg-white p-2 shadow-[0_24px_60px_-12px_rgb(4_23_51/0.25)] rtl:translate-x-1/2"
            >
              <ul>
                {services.map(({ key }) => (
                  <li key={key}>
                    <SiteLink
                      href={servicePath(key)}
                      aria-current={page === key ? "page" : undefined}
                      onClick={close}
                      className="flex items-center gap-4 rounded-lg px-4 py-3 font-bold hover:bg-mist"
                    >
                      <Icon name={serviceIcons[key]} className="h-6 w-6" />
                      {s(`${key}.name`)}
                    </SiteLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <SiteLink href="/about" aria-current={page === "about" ? "page" : undefined} className={link(page === "about")}>
            {t("about")}
          </SiteLink>
          <SiteLink
            href="/contact"
            aria-current={page === "contact" ? "page" : undefined}
            className={link(page === "contact")}
          >
            {t("contact")}
          </SiteLink>
          {features.investorLogin && (
            <a href={features.investorLoginUrl} className={link(false)}>
              {t("investorLogin")}
            </a>
          )}
          <SiteLink href="/contact" className="btn btn-primary !min-h-[2.75rem] !px-5">
            {t("talk")}
          </SiteLink>
        </nav>

        <button
          ref={menuButton}
          type="button"
          className="-me-2 grid h-12 w-12 place-items-center lg:hidden"
          aria-expanded={menu}
          aria-controls="mobile-menu"
          aria-label={menu ? t("closeMenu") : t("openMenu")}
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      <div
        id="mobile-menu"
        hidden={!menu}
        className="fixed inset-x-0 bottom-0 top-[var(--header)] overflow-y-auto bg-white lg:hidden"
      >
        <nav aria-label={t("main")} className="wrap flex min-h-full flex-col gap-8 py-8">
          <ul className="divide-y divide-line border-y border-line text-xl font-extrabold tracking-[-0.02em]">
            <li>
              <SiteLink href="/" onClick={close} className="block py-4" aria-current={page === "home" ? "page" : undefined}>
                {t("home")}
              </SiteLink>
            </li>
            {services.map(({ key }) => (
              <li key={key}>
                <SiteLink
                  href={servicePath(key)}
                  onClick={close}
                  aria-current={page === key ? "page" : undefined}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  {s(`${key}.name`)}
                  <Icon name={serviceIcons[key]} />
                </SiteLink>
              </li>
            ))}
            <li>
              <SiteLink href="/about" onClick={close} className="block py-4" aria-current={page === "about" ? "page" : undefined}>
                {t("about")}
              </SiteLink>
            </li>
            <li>
              <SiteLink href="/contact" onClick={close} className="block py-4" aria-current={page === "contact" ? "page" : undefined}>
                {t("contact")}
              </SiteLink>
            </li>
            {features.investorLogin && (
              <li>
                <a href={features.investorLoginUrl} className="block py-4">
                  {t("investorLogin")}
                </a>
              </li>
            )}
          </ul>
          <SiteLink href="/contact" onClick={close} className="btn btn-primary">
            {t("talk")}
          </SiteLink>
        </nav>
      </div>
    </header>
  );
}
