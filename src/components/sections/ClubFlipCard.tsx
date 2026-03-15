"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { SiteLocale } from "@/config/locales";
import type { Club } from "@/content/types";

interface ClubFlipCardProps {
  club: Club;
  locale: SiteLocale;
}

interface MemberProfile {
  id: string;
  name: string;
  role: string;
  email: string;
  instagram: string;
  linkedin: string;
  photo: string;
  fallbackPhoto: string;
}

interface MemberSeed {
  name: string;
  role: string;
  email: string;
  instagram: string;
  linkedin: string;
  photo?: string;
}

const PUP_PHOTOS = [
  "/images/clubs/PUP/nouary.png",
  "/images/clubs/PUP/meryam.jpg",
  "/images/clubs/PUP/faiza.png",
  "/images/clubs/PUP/karima.jpg",
  "/images/clubs/PUP/Marini.jpg",
  "/images/clubs/PUP/saloua.jpg",
  "/images/clubs/PUP/es-sofi.jpg",
  "/images/clubs/PUP/oulhint.jpg",
  "/images/clubs/PUP/maider.png",
  "/images/clubs/PUP/boukachmour.jpg",
];

const MTZ_PHOTOS = [
  "/images/clubs/MTZ/Abdelilah El Kasmy.jpeg",
  "/images/clubs/MTZ/Amine Boustiti.jpeg",
  "/images/clubs/MTZ/Aziz iguidre.jpeg",
  "/images/clubs/MTZ/Dina Droukli.jpeg",
  "/images/clubs/MTZ/Hajar Touimi.jpeg",
  "/images/clubs/MTZ/Ikram Kab.jpeg",
  "/images/clubs/MTZ/Ilyas Baba.jpeg",
  "/images/clubs/MTZ/Imane dchiouch.jpeg",
  "/images/clubs/MTZ/Khadija el-mesbahi.jpeg",
  "/images/clubs/MTZ/Samia el badri.jpeg",
  "/images/clubs/MTZ/Sebbane Saad2.jpeg",
  "/images/clubs/MTZ/Taoufik ouanzi.jpeg",
  "/images/clubs/MTZ/Wahiba raki.jpeg",
  "/images/clubs/MTZ/Yassine El Addaoui.jpeg",
];

const IEC_PHOTOS = [
  "/images/clubs/IEC/2D566E49A139 - Chaimae El Otmani.jpeg",
  "/images/clubs/IEC/20250908_191524 - MAHA ELGHZIZAL.jpg",
  "/images/clubs/IEC/20251027_160408 - Zineb OUADDAD.jpg",
  "/images/clubs/IEC/IMG_2143 - khadija elmesbahi.jpeg",
  "/images/clubs/IEC/IMG_2883 - IKRAM OUCHANE.jpeg",
  "/images/clubs/IEC/IMG_3779 - Fatima Zahrae Alhayti.jpeg",
  "/images/clubs/IEC/IMG_5239 - Ikram Mabsoute.jpeg",
  "/images/clubs/IEC/IMG_8511 - Ghaita Jaouane.jpeg",
  "/images/clubs/IEC/IMG-20250525-WA0027 - Khawla Chahboune.jpg",
  "/images/clubs/IEC/IMG-20260215-WA0219 - Reda Fechtali.jpg",
  "/images/clubs/IEC/IMG-20260305-WA0021 - IKRAM ERRAHMOUNI.jpg",
  "/images/clubs/IEC/IMG-20260310-WA0110 - Khalladi daoud.jpg",
  "/images/clubs/IEC/yassine.jpeg",
];

const POWERUP_MEMBERS: MemberSeed[] = [
  {
    name: "Lhoussaine Nouary",
    role: "Leadership",
    email: "nouary.houssaine@gmail.com",
    linkedin: "https://www.linkedin.com/in/nouary-lhoussaine",
    instagram: "lhoussaine.nouary",
    photo: "/images/clubs/PUP/nouary.png",
  },
  {
    name: "Meryam Es-Sofi",
    role: "Communication",
    email: "meryam.essofi@usmba.ac.ma",
    linkedin: "meryam es-sofi",
    instagram: "Meryaamesf",
    photo: "/images/clubs/PUP/es-sofi.jpg",
  },
  {
    name: "Faiza Al Houz",
    role: "Finance",
    email: "faiza.alhouz@usmba.ac.ma",
    linkedin: "https://www.linkedin.com/in/faiza-al-houz-456b1b319",
    instagram: "https://www.instagram.com/alhouzfaiza",
    photo: "/images/clubs/PUP/faiza.png",
  },
  {
    name: "Khaoula Marini",
    role: "Organisation",
    email: "khaoula.marini@usmba.ac.ma",
    linkedin: "khaoula marini",
    instagram: "kha__w__lah",
    photo: "/images/clubs/PUP/Marini.jpg",
  },
  {
    name: "Saloua Moughar",
    role: "Communication",
    email: "saloua.moughar@usmba.ac.ma",
    linkedin: "https://www.linkedin.com/in/saloua-moughar-b10802293",
    instagram: "saloua.moughar",
    photo: "/images/clubs/PUP/saloua.jpg",
  },
  {
    name: "Karima Ameskine",
    role: "Organisation",
    email: "ameskinekarima@gmail.com",
    linkedin: "www.linkedin.com/in/karima-ameskine-09130b2ba",
    instagram: "@ame.karima",
    photo: "/images/clubs/PUP/karima.jpg",
  },
  {
    name: "Zainab Maider",
    role: "Media",
    email: "maiderzainab6@gmail.com",
    linkedin: "maider zainab",
    instagram: "maider.zainab",
    photo: "/images/clubs/PUP/maider.png",
  },
  {
    name: "Zakaria Oulhint",
    role: "Design",
    email: "oulhintzedu@gmail.com",
    linkedin: "https://www.linkedin.com/in/zakaria-oulhint/",
    instagram: "oulhint.zakaria",
    photo: "/images/clubs/PUP/oulhint.jpg",
  },
  {
    name: "Nouhaila Boukachmour",
    role: "Sponsoring",
    email: "nouhaila.boukachmour@usmba.ac.ma",
    linkedin: "https://www.linkedin.com/in/nouhaila-boukachmour-302002253",
    instagram: "https://www.instagram.com/nb1009_",
    photo: "/images/clubs/PUP/boukachmour.jpg",
  },
];

const TRENZ_MEMBERS: MemberSeed[] = [
  {
    name: "Amine Boustiti",
    role: "Président · GM2",
    email: "",
    linkedin: "",
    instagram: "",
    photo: "/images/clubs/MTZ/Amine Boustiti.jpeg",
  },
  {
    name: "Taoufik Ouanzi",
    role: "Vice-président · GMT2",
    email: "",
    linkedin: "",
    instagram: "",
    photo: "/images/clubs/MTZ/Taoufik ouanzi.jpeg",
  },
  {
    name: "Dina Droukli",
    role: "Secrétaire générale · GM2",
    email: "",
    linkedin: "",
    instagram: "",
    photo: "/images/clubs/MTZ/Dina Droukli.jpeg",
  },
  {
    name: "Wahiba Raki",
    role: "Resp. RH · GM2",
    email: "",
    linkedin: "",
    instagram: "",
    photo: "/images/clubs/MTZ/Wahiba raki.jpeg",
  },
  {
    name: "Yassine El Addaoui",
    role: "Resp. interne · GM2",
    email: "",
    linkedin: "",
    instagram: "",
    photo: "/images/clubs/MTZ/Yassine El Addaoui.jpeg",
  },
  {
    name: "Khadija El-Mesbahi",
    role: "Resp. formation · GIND1",
    email: "",
    linkedin: "",
    instagram: "",
    photo: "/images/clubs/MTZ/Khadija el-mesbahi.jpeg",
  },
  {
    name: "Ilyas Baba",
    role: "Resp. externe · GM2",
    email: "",
    linkedin: "",
    instagram: "",
    photo: "/images/clubs/MTZ/Ilyas Baba.jpeg",
  },
  {
    name: "Imane Dchiouch",
    role: "Trésorière · GMT2",
    email: "",
    linkedin: "",
    instagram: "",
    photo: "/images/clubs/MTZ/Imane dchiouch.jpeg",
  },
  {
    name: "Abla Jalal",
    role: "Cellule média · CP2",
    email: "",
    linkedin: "",
    instagram: "",
    photo: "/images/uknown women.png",
  },
  {
    name: "Ikram Kab",
    role: "Cellule média · GM2",
    email: "",
    linkedin: "",
    instagram: "",
    photo: "/images/clubs/MTZ/Ikram Kab.jpeg",
  },
  {
    name: "Chaimae El Azzouzi",
    role: "Cellule média · GM2",
    email: "",
    linkedin: "",
    instagram: "",
    photo: "/images/uknown women.png",
  },
  {
    name: "Khadija Eddebbarhi",
    role: "Cellule média · GM2",
    email: "",
    linkedin: "",
    instagram: "",
    photo: "/images/uknown women.png",
  },
  {
    name: "Abdelilah El Kasmy",
    role: "Cellule organisation · GMT2",
    email: "",
    linkedin: "",
    instagram: "",
    photo: "/images/clubs/MTZ/Abdelilah El Kasmy.jpeg",
  },
  {
    name: "Saad Sebbane",
    role: "Cellule R&D · GMT2",
    email: "",
    linkedin: "",
    instagram: "",
    photo: "/images/clubs/MTZ/Sebbane Saad2.jpeg",
  },
  {
    name: "Aziz Iguidre",
    role: "Cellule R&D · GMT2",
    email: "",
    linkedin: "",
    instagram: "",
    photo: "/images/clubs/MTZ/Aziz iguidre.jpeg",
  },
  {
    name: "Samia El Badri",
    role: "Cellule com · GMT2",
    email: "",
    linkedin: "",
    instagram: "",
    photo: "/images/clubs/MTZ/Samia el badri.jpeg",
  },
  {
    name: "Hajar Touimi",
    role: "Cellule com · GMT2",
    email: "",
    linkedin: "",
    instagram: "",
    photo: "/images/clubs/MTZ/Hajar Touimi.jpeg",
  },
];

const IEC_MEMBERS: MemberSeed[] = [
  {
    name: "Zineb Ouaddad",
    role: "Chef Média",
    email: "",
    instagram: "https://www.instagram.com/zinebouaddad004?igsh=MXE2MDZ4cm50YzJ5NQ==",
    linkedin:
      "https://www.linkedin.com/in/zineb-ouaddad-909265333?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    photo: "/images/clubs/IEC/20251027_160408 - Zineb OUADDAD.jpg",
  },
  {
    name: "Chaimae El Otmani",
    role: "Chef de projet",
    email: "",
    instagram: "https://www.instagram.com/chaimaeelotmani04?igsh=dXdxeGpiaTA0M3Y3&utm_source=qr",
    linkedin:
      "https://www.linkedin.com/in/chaimae-el-otmani-84b262333?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    photo: "/images/clubs/IEC/2D566E49A139 - Chaimae El Otmani.jpeg",
  },
  {
    name: "Ikram Ouchane",
    role: "Média",
    email: "",
    instagram: "https://www.instagram.com/ikrvmmmmmmm?igsh=MXUzeTFsY21ubG83bQ%3D%3D&utm_source=qr",
    linkedin:
      "https://www.linkedin.com/in/ikram-ouchane-0a524a301?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    photo: "/images/clubs/IEC/IMG_2883 - IKRAM OUCHANE.jpeg",
  },
  {
    name: "Khadija El-Mesbahi",
    role: "Sponsoring",
    email: "",
    instagram: "https://www.instagram.com/mesbhk?igsh=MTEwbWVmN2JtNnI1Yw%3D%3D&utm_source=qr",
    linkedin:
      "https://www.linkedin.com/in/khadija-el-mesbahi-6a10aa363?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    photo: "/images/clubs/IEC/IMG_2143 - khadija elmesbahi.jpeg",
  },
  {
    name: "Reda Fechtali",
    role: "Sous chef de formation",
    email: "",
    instagram: "https://www.instagram.com/its_me.redaa?igsh=MWRmeTg4bzZmMTRoaQ==",
    linkedin:
      "https://www.linkedin.com/in/reda-fechtali-0b9278369?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    photo: "/images/clubs/IEC/IMG-20260215-WA0219 - Reda Fechtali.jpg",
  },
  {
    name: "Khaoula Chahboune",
    role: "Chef de formation",
    email: "",
    instagram: "https://www.instagram.com/khaoula.chahboune?igsh=MW9xNnQ2cHY3cGZ4Mw==",
    linkedin: "https://www.linkedin.com/in/khaoula-chahboune-822421331",
    photo: "/images/clubs/IEC/IMG-20250525-WA0027 - Khawla Chahboune.jpg",
  },
  {
    name: "Fatima Zahrae Alhayti",
    role: "Responsable des affaires internes",
    email: "",
    instagram: "https://www.instagram.com/fatima_zahrae_alhayti?igsh=MTU2djN4ZnE3OW1uaw%3D%3D&utm_source=qr",
    linkedin:
      "https://www.linkedin.com/in/fatima-zahrae-al-hayti-322558296?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    photo: "/images/clubs/IEC/IMG_3779 - Fatima Zahrae Alhayti.jpeg",
  },
  {
    name: "Ikram Er-Rahmouni",
    role: "Vice-présidente IEC 4.0",
    email: "",
    instagram: "https://www.instagram.com/ikramer_rahmouni?igsh=MWNrbTN3ZGQzNm1vYw==",
    linkedin:
      "https://www.linkedin.com/in/ikram-er-rahmouni-75344332a?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    photo: "/images/clubs/IEC/IMG-20260305-WA0021 - IKRAM ERRAHMOUNI.jpg",
  },
  {
    name: "Ghaita Jaouane",
    role: "External manager",
    email: "",
    instagram: "https://www.instagram.com/ghita_jaouane?igsh=dXV5N2pqYjF1OGZl",
    linkedin:
      "https://www.linkedin.com/in/ghita-jaouane-9ba918298?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    photo: "/images/clubs/IEC/IMG_8511 - Ghaita Jaouane.jpeg",
  },
  {
    name: "Ikram Mabsoute",
    role: "Secrétaire générale",
    email: "",
    instagram: "https://www.instagram.com/i_k_r_a_m_e_2?igsh=OHR3ZXZobzU4Yjc0&utm_source=qr",
    linkedin:
      "https://www.linkedin.com/in/ikram-mabsoute-01baba318?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    photo: "/images/clubs/IEC/IMG_5239 - Ikram Mabsoute.jpeg",
  },
  {
    name: "Maha El-Ghzizal",
    role: "Présidente",
    email: "",
    instagram: "https://www.instagram.com/maha__el__?igsh=MW83OGp1a3g5eW5vcg==",
    linkedin:
      "https://www.linkedin.com/in/maha-el-ghzizal-187265333?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    photo: "/images/clubs/IEC/20250908_191524 - MAHA ELGHZIZAL.jpg",
  },
  {
    name: "Daoued Khalladi",
    role: "Trésorier",
    email: "",
    instagram: "https://www.instagram.com/daoud_khalladi?igsh=MWw2bnRpeDYxNDdrMQ==",
    linkedin:
      "https://www.linkedin.com/in/daoued-khalladi-699913358?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    photo: "/images/clubs/IEC/IMG-20260310-WA0110 - Khalladi daoud.jpg",
  },
  {
    name: "Yassine Koummich",
    role: "Designer",
    email: "",
    instagram: "https://www.instagram.com/deagotheflows?igsh=bmpxdXRuZ21udnBx",
    linkedin:
      "https://www.linkedin.com/in/yassine-koummich-89b450388?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    photo: "/images/clubs/IEC/yassine.jpeg",
  },
];

const TEAM_SEEDS: Record<string, Array<{ name: string; role: string }>> = {
  trenz: TRENZ_MEMBERS.map((member) => ({ name: member.name, role: member.role })),
};

const ACCENT_BY_CLUB: Record<string, string> = {
  powerup: "#F97316",
  trenz:   "#6366F1",
  iec:     "#EC4899",
};

function clubImagePool(clubId: string) {
  if (clubId === "trenz") return MTZ_PHOTOS;
  if (clubId === "iec")   return IEC_PHOTOS;
  return PUP_PHOTOS;
}

function socialHandle(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "_");
}
function socialSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function normalizeInstagram(input: string, name: string) {
  const raw = input.trim();
  if (!raw) return `https://www.instagram.com/${socialHandle(name)}`;
  if (/^https?:\/\//i.test(raw)) return raw;
  const handle = raw.replace(/^@/, "").replace(/\s+/g, "_").replace(/[^a-zA-Z0-9._]/g, "").toLowerCase();
  return `https://www.instagram.com/${handle}`;
}
function normalizeLinkedin(input: string, name: string) {
  const raw = input.trim();
  if (!raw)                      return `https://www.linkedin.com/in/${socialSlug(name)}`;
  if (/^https?:\/\//i.test(raw)) return raw;
  if (/^www\./i.test(raw))       return `https://${raw}`;
  return `https://www.linkedin.com/in/${socialSlug(raw)}`;
}

function buildMembers(club: Club): MemberProfile[] {
  const pool = clubImagePool(club.id);
  if (club.id === "powerup") {
    return POWERUP_MEMBERS.map((m, i) => ({
      id:            `${club.id}-member-${i + 1}`,
      name:          m.name,
      role:          m.role,
      email:         m.email.trim(),
      instagram:     normalizeInstagram(m.instagram, m.name),
      linkedin:      normalizeLinkedin(m.linkedin, m.name),
      photo:         m.photo ?? pool[i % pool.length],
      fallbackPhoto: PUP_PHOTOS[i % PUP_PHOTOS.length],
    }));
  }
  if (club.id === "trenz") {
    return TRENZ_MEMBERS.map((member, i) => {
      const photo = member.photo ?? MTZ_PHOTOS[i % MTZ_PHOTOS.length];
      return {
        id: `${club.id}-member-${i + 1}`,
        name: member.name,
        role: member.role,
        email: `${socialHandle(club.id)}.${i + 1}@Innov'Industry-club.test`,
        instagram: normalizeInstagram(member.instagram, member.name),
        linkedin: normalizeLinkedin(member.linkedin, member.name),
        photo,
        fallbackPhoto: photo, // keep fallback aligned to the intended photo to avoid cross-person swaps
      };
    });
  }
  if (club.id === "iec") {
    return IEC_MEMBERS.map((member, i) => ({
      id: `${club.id}-member-${i + 1}`,
      name: member.name,
      role: member.role,
      email: member.email.trim(),
      instagram: normalizeInstagram(member.instagram, member.name),
      linkedin: normalizeLinkedin(member.linkedin, member.name),
      photo: member.photo ?? IEC_PHOTOS[i % IEC_PHOTOS.length],
      fallbackPhoto: IEC_PHOTOS[i % IEC_PHOTOS.length],
    }));
  }
  const seeds = TEAM_SEEDS[club.id] ?? TEAM_SEEDS.trenz;
  return seeds.map((seed, i) => {
    const safe = socialHandle(seed.name);
    return {
      id:            `${club.id}-member-${i + 1}`,
      name:          seed.name,
      role:          seed.role,
      email:         `${socialHandle(club.id)}.${i + 1}@Innov'Industry-club.test`,
      instagram:     `https://instagram.com/${safe}_${club.id}`,
      linkedin:      `https://linkedin.com/in/${safe}-${club.id}`,
      photo:         pool[i % pool.length],
      fallbackPhoto: PUP_PHOTOS[i % PUP_PHOTOS.length],
    };
  });
}

function textByLocale(locale: SiteLocale) {
  if (locale === "en")  return { viewTeam: "View team",     team: "TEAM",   back: "Back",   members: "members" };
  if (locale === "ar")  return { viewTeam: "عرض الفريق",    team: "الفريق", back: "رجوع",   members: "أعضاء"   };
  return                       { viewTeam: "Voir l'équipe", team: "ÉQUIPE", back: "Retour", members: "membres" };
}

/* ── Icons ──────────────────────────────────────────────────────────── */
function ArrowCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path d="M20 12a8 8 0 1 1-2.3-5.6" /><path d="M20 4v6h-6" />
    </svg>
  );
}
function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5A2.48 2.48 0 1 0 5 8.46a2.48 2.48 0 0 0-.02-4.96ZM3 9.5h4v11H3v-11Zm7 0h3.82v1.57h.05c.53-1 1.84-2.07 3.79-2.07 4.05 0 4.8 2.66 4.8 6.11v5.39h-4v-4.78c0-1.14-.02-2.61-1.59-2.61s-1.84 1.24-1.84 2.53v4.86h-4v-11Z" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}
function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MEMBER ID CARD
   ─────────────────────────────────────────────────────────────────────
   Resting  → bigger thumbnail, strict 1:1 photo, name strip below.
              3 per row inside the back face.

   Clicked  → a portal overlay card mounts on document.body, appearing
              dead-center on the viewport. A blurred backdrop dims the
              page. Clicking the backdrop or pressing Escape closes it.
              This pattern is 100% reliable on desktop — no mouseleave
              flicker, no stacking context trapping.
═══════════════════════════════════════════════════════════════════════ */
function MemberIdCard({
  member,
  index,
  accent,
  isHovered,
  isMuted,
  showMembers,
  onEnter,
  onPrev,
  onNext,
  totalMembers,
  isOpen,
  onClose,
}: {
  member:       MemberProfile;
  index:        number;
  accent:       string;
  isHovered:    boolean;
  isMuted:      boolean;
  showMembers:  boolean;
  onEnter:      () => void;
  onPrev:       () => void;
  onNext:       () => void;
  totalMembers: number;
  isOpen:       boolean;
  onClose:      () => void;
}) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  return (
    <>
      {/* ════════════════════════════════════
          THUMBNAIL — lives inside the grid
      ════════════════════════════════════ */}
      <article
        data-member-index={index}
        className="relative w-full select-none"
        style={{
          cursor:          "pointer",
          zIndex:          isHovered ? 10 : 1,
          transitionDelay: showMembers ? `${index * 68}ms` : "0ms",
          opacity:         showMembers ? (isMuted ? 0.28 : 1)             : 0,
          transform:       showMembers ? (isMuted ? "scale(0.91)" : "scale(1)") : "scale(0.94) translateY(16px)",
          filter:          isMuted ? "blur(1.5px) grayscale(0.5)" : "none",
          transition:      "opacity 0.3s ease-out, transform 0.32s ease-out, filter 0.3s ease-out",
        }}
      >
        <div
          style={{
            overflow:        "hidden",
            borderRadius:    "10px",
            border:          "1.5px solid rgba(255,255,255,0.09)",
            backgroundColor: "rgba(255,255,255,0.03)",
            boxShadow:       "0 2px 8px rgba(0,0,0,0.22)",
          }}
        >
          {/* Top accent bar */}
          <div style={{ height: "2.5px", backgroundColor: accent, opacity: 0.5 }} />

          {/* 1:1 square photo */}
          <div style={{ position: "relative", width: "100%", paddingTop: "100%", overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={member.photo}
              alt={member.name}
              style={{
                position:       "absolute",
                inset:          0,
                width:          "100%",
                height:         "100%",
                objectFit:      "cover",
                objectPosition: "top center",
                display:        "block",
                transform:      "scale(1.0)",
                transition:     "transform 0.4s cubic-bezier(0.22,0.86,0.32,1)",
              }}
              onError={(e) => {
                const t = e.currentTarget;
                if (t.src.endsWith(member.fallbackPhoto)) return;
                t.src = member.fallbackPhoto;
              }}
            />
            {/* Gradient */}
            <div style={{
              position:   "absolute",
              inset:      0,
              background: "linear-gradient(to top, rgba(10,14,20,0.85) 0%, transparent 55%)",
            }} />
            {/* Serial chip */}
            <div style={{
              position:        "absolute",
              top:             "6px",
              left:            "6px",
              fontFamily:      "monospace",
              fontSize:        "9px",
              fontWeight:      700,
              letterSpacing:   "0.08em",
              padding:         "2px 6px",
              backgroundColor: `${accent}1a`,
              border:          `1px solid ${accent}44`,
              color:           accent,
            }}>
              {String(index + 1).padStart(2, "0")}
            </div>
            {/* Role */}
            <span style={{
              position:      "absolute",
              bottom:        "7px",
              left:          "7px",
              fontFamily:    "monospace",
              fontSize:      "8.5px",
              fontWeight:    700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color:         accent,
              textShadow:    `0 0 12px ${accent}88`,
            }}>
              {member.role}
            </span>
          </div>

          {/* Name strip */}
          <div style={{ padding: "9px 11px 10px" }}>
            <p style={{
              fontFamily:    "var(--font-teko, system-ui)",
              fontWeight:    700,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              lineHeight:    1.2,
              color:         "var(--color-ink, #f0ede6)",
              fontSize:      "12px",
              whiteSpace:    "nowrap",
              overflow:      "hidden",
              textOverflow:  "ellipsis",
              marginBottom:  "4px",
            }}>
              {member.name}
            </p>
            {/* Hover hint */}
            <p style={{
              fontFamily:    "monospace",
              fontSize:      "7.5px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color:         `${accent}66`,
              whiteSpace:    "nowrap",
            }}>
              ↗ survoler pour plus
            </p>
          </div>
        </div>
      </article>

      {/* ════════════════════════════════════
          CLICK OVERLAY — portal to document.body
      ════════════════════════════════════ */}
      {isOpen && typeof document !== "undefined" && createPortal(
        <>
          <style>{`
            @keyframes memberPulse {
              0%,100% { opacity:0.5; transform:scale(1);   }
              50%     { opacity:1;   transform:scale(1.6); }
            }
            @keyframes overlayCardIn {
              from { opacity:0; transform:translate(-50%,-50%) scale(0.86); }
              to   { opacity:1; transform:translate(-50%,-50%) scale(1);    }
            }
            @keyframes overlayBgIn {
              from { opacity:0; }
              to   { opacity:1; }
            }
          `}</style>

          {/* Backdrop — covers entire page, click to dismiss */}
          <div
            onClick={() => onClose()}
            style={{
              position:        "fixed",
              inset:           0,
              zIndex:          9000,
              backgroundColor: "rgba(16,24,39,0.75)",
              backdropFilter:  "blur(7px)",
              WebkitBackdropFilter: "blur(7px)",
              animation:       "overlayBgIn 0.28s ease-out both",
              cursor:          "pointer",
            }}
          />

          {/* Nav + card wrapper — centered, with nav buttons floating on sides */}
          <div
            onMouseEnter={onEnter}
            onMouseLeave={onClose}
            onClick={(e) => e.stopPropagation()}
            style={{
              position:       "fixed",
              top:            "50%",
              left:           "50%",
              transform:      "translate(-50%, -50%)",
              zIndex:         9001,
              display:        "flex",
              alignItems:     "center",
              gap:            "16px",
              animation:      "overlayCardIn 0.36s cubic-bezier(0.22,0.86,0.32,1) both",
            }}
          >
            {/* ← Prev button */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onPrev(); }}
              disabled={index === 0}
              style={{
                flexShrink:      0,
                width:           "44px",
                height:          "44px",
                borderRadius:    "50%",
                border:          `1.5px solid ${index === 0 ? "rgba(255,255,255,0.1)" : accent}`,
                backgroundColor: index === 0 ? "rgba(255,255,255,0.04)" : `${accent}18`,
                color:           index === 0 ? "rgba(255,255,255,0.2)" : accent,
                cursor:          index === 0 ? "not-allowed" : "pointer",
                display:         "flex",
                alignItems:      "center",
                justifyContent:  "center",
                transition:      "background-color 0.2s, border-color 0.2s",
                boxShadow:       index === 0 ? "none" : `0 0 16px ${accent}22`,
              }}
              aria-label="Previous member"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* The big centered ID card */}
            <div
              style={{
                width:           "min(520px, calc(100vw - 140px))",
                maxHeight:       "92vh",
                overflowY:       "auto",
                borderRadius:    "16px",
                overflow:        "hidden",
                border:          `1.5px solid ${accent}`,
                backgroundColor: "rgba(16,24,39,0.98)",
                boxShadow:       `0 48px 120px rgba(0,0,0,0.85), 0 0 0 1px ${accent}28, 0 0 80px ${accent}1a`,
              }}
            >
            {/* Accent bar */}
            <div style={{ height: "3px", backgroundColor: accent }} />

            {/* Photo — true 1:1 square for maximum face impact */}
            <div style={{ position: "relative", width: "100%", paddingTop: "85%", overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={member.photo}
                alt={member.name}
                style={{
                  position:       "absolute",
                  inset:          0,
                  width:          "100%",
                  height:         "100%",
                  objectFit:      "cover",
                  objectPosition: "top center",
                  display:        "block",
                  transform:      "scale(1.04)",
                }}
                onError={(e) => {
                  const t = e.currentTarget;
                  if (t.src.endsWith(member.fallbackPhoto)) return;
                  t.src = member.fallbackPhoto;
                }}
              />
              {/* Deep gradient */}
              <div style={{
                position:   "absolute",
                inset:      0,
                background: "linear-gradient(to top, rgba(10,14,20,1) 0%, rgba(10,14,20,0.25) 55%, transparent 100%)",
              }} />

              {/* Serial */}
              <div style={{
                position:        "absolute",
                top:             "12px",
                left:            "12px",
                fontFamily:      "monospace",
                fontSize:        "10px",
                fontWeight:      700,
                letterSpacing:   "0.1em",
                padding:         "3px 8px",
                backgroundColor: `${accent}1a`,
                border:          `1px solid ${accent}55`,
                color:           accent,
              }}>
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* Active indicator */}
              <div style={{
                position:    "absolute",
                top:         "14px",
                right:       "12px",
                display:     "flex",
                alignItems:  "center",
                gap:         "6px",
              }}>
                <span style={{
                  fontFamily:    "monospace",
                  fontSize:      "9px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color:         `${accent}99`,
                }}>active</span>
                <span style={{
                  width:           "7px",
                  height:          "7px",
                  borderRadius:    "50%",
                  backgroundColor: accent,
                  boxShadow:       `0 0 10px ${accent}`,
                  animation:       "memberPulse 1.8s ease-in-out infinite",
                  display:         "block",
                }} />
              </div>

              {/* Role over photo */}
              <span style={{
                position:      "absolute",
                bottom:        "18px",
                left:          "20px",
                fontFamily:    "monospace",
                fontSize:      "14px",
                fontWeight:    700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color:         accent,
                textShadow:    `0 0 22px ${accent}88`,
              }}>
                {member.role}
              </span>
            </div>

            {/* Info panel */}
            <div style={{ padding: "24px 26px 28px" }}>
              {/* Name */}
              <p style={{
                fontFamily:    "var(--font-teko, system-ui)",
                fontWeight:    700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                lineHeight:    1.2,
                color:         "var(--color-ink, #f0ede6)",
                fontSize:      "26px",
                marginBottom:  "4px",
              }}>
                {member.name}
              </p>

              {/* Separator */}
              <div style={{ height: "1px", backgroundColor: `${accent}28`, margin: "14px 0" }} />

              {/* Email */}
              <p style={{
                fontFamily:   "monospace",
                fontSize:     "13px",
                color:        "rgba(240,237,230,0.4)",
                overflow:     "hidden",
                textOverflow: "ellipsis",
                whiteSpace:   "nowrap",
                marginBottom: "18px",
              }}>
                {member.email}
              </p>

              {/* Social buttons */}
              <div style={{ display: "flex", gap: "10px" }}>
                <Link
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`${member.name} LinkedIn`}
                  style={{
                    flex:            1,
                    display:         "inline-flex",
                    alignItems:      "center",
                    justifyContent:  "center",
                    gap:             "9px",
                    height:          "50px",
                    fontFamily:      "monospace",
                    fontSize:        "13px",
                    fontWeight:      700,
                    letterSpacing:   "0.1em",
                    textTransform:   "uppercase",
                    color:           accent,
                    backgroundColor: `${accent}14`,
                    border:          `1px solid ${accent}40`,
                    borderRadius:    "9px",
                    textDecoration:  "none",
                    transition:      "background-color 0.18s, border-color 0.18s",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.backgroundColor = `${accent}26`;
                    el.style.borderColor     = `${accent}80`;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.backgroundColor = `${accent}14`;
                    el.style.borderColor     = `${accent}40`;
                  }}
                >
                  <LinkedInIcon />
                  <span>LinkedIn</span>
                </Link>

                <Link
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`${member.name} Instagram`}
                  style={{
                    flex:            1,
                    display:         "inline-flex",
                    alignItems:      "center",
                    justifyContent:  "center",
                    gap:             "9px",
                    height:          "50px",
                    fontFamily:      "monospace",
                    fontSize:        "13px",
                    fontWeight:      700,
                    letterSpacing:   "0.1em",
                    textTransform:   "uppercase",
                    color:           accent,
                    backgroundColor: `${accent}14`,
                    border:          `1px solid ${accent}40`,
                    borderRadius:    "9px",
                    textDecoration:  "none",
                    transition:      "background-color 0.18s, border-color 0.18s",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.backgroundColor = `${accent}26`;
                    el.style.borderColor     = `${accent}80`;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement;
                    el.style.backgroundColor = `${accent}14`;
                    el.style.borderColor     = `${accent}40`;
                  }}
                >
                  <InstagramIcon />
                  <span>Instagram</span>
                </Link>
              </div>
            </div>
            </div>{/* end ID card inner */}

            {/* → Next button */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              disabled={index === totalMembers - 1}
              style={{
                flexShrink:      0,
                width:           "44px",
                height:          "44px",
                borderRadius:    "50%",
                border:          `1.5px solid ${index === totalMembers - 1 ? "rgba(255,255,255,0.1)" : accent}`,
                backgroundColor: index === totalMembers - 1 ? "rgba(255,255,255,0.04)" : `${accent}18`,
                color:           index === totalMembers - 1 ? "rgba(255,255,255,0.2)" : accent,
                cursor:          index === totalMembers - 1 ? "not-allowed" : "pointer",
                display:         "flex",
                alignItems:      "center",
                justifyContent:  "center",
                transition:      "background-color 0.2s, border-color 0.2s",
                boxShadow:       index === totalMembers - 1 ? "none" : `0 0 16px ${accent}22`,
              }}
              aria-label="Next member"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

          </div>{/* end nav+card wrapper */}
        </>,
        document.body
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════ */
export function ClubFlipCard({ club, locale }: ClubFlipCardProps) {
  const [flipped,           setFlipped]           = useState(false);
  const [showMembers,       setShowMembers]       = useState(false);
  const [hoveredMemberId,   setHoveredMemberId]   = useState<string | null>(null);
  const [openedMemberIndex, setOpenedMemberIndex] = useState<number | null>(null);
  const gridRef    = useRef<HTMLDivElement | null>(null);

  // ── All hover timing lives here as refs — never causes re-renders
  const hoverTimer   = useRef<ReturnType<typeof setTimeout> | null>(null); // delay before open
  const closeTimer   = useRef<ReturnType<typeof setTimeout> | null>(null); // delay before close
  const coolTimer    = useRef<ReturnType<typeof setTimeout> | null>(null); // cooldown after close
  const pendingIdx   = useRef<number | null>(null);  // index waiting to open
  const isCooling    = useRef(false);                // true during cooldown
  const isOpenRef    = useRef(false);                // true while overlay showing

  const labels  = useMemo(() => textByLocale(locale), [locale]);
  const members = useMemo(() => buildMembers(club),   [club]);
  const accent  = ACCENT_BY_CLUB[club.id] ?? "#F97316";

  // Keep isOpenRef in sync
  useEffect(() => { isOpenRef.current = openedMemberIndex !== null; }, [openedMemberIndex]);

  const clearHoverTimer  = () => { if (hoverTimer.current)  clearTimeout(hoverTimer.current);  };

  const openMember = useCallback((idx: number) => {
    setHoveredMemberId(members[idx]?.id ?? null);
    setOpenedMemberIndex(idx);
    isOpenRef.current = true;
  }, [members]);

  const closeMember = () => {
    clearHoverTimer();
    // Fade-out delay
    closeTimer.current = setTimeout(() => {
      setOpenedMemberIndex(null);
      setHoveredMemberId(null);
      isOpenRef.current = false;
      // Cooldown — no new hovers for 600ms
      isCooling.current = true;
      coolTimer.current = setTimeout(() => { isCooling.current = false; }, 600);
    }, 450);
  };

  // ── Single pointermove on document — pure rect hit-test, no DOM callbacks
  useEffect(() => {
    if (!showMembers) return;
    let lastIdx: number | null = null;

    const onMove = (e: PointerEvent) => {
      // Frozen while overlay open or cooling down
      if (isOpenRef.current || isCooling.current) {
        lastIdx = null;
        return;
      }
      const grid = gridRef.current;
      if (!grid) return;
      const cards = grid.querySelectorAll<HTMLElement>("article[data-member-index]");
      let hitIdx: number | null = null;
      for (const card of cards) {
        const r = card.getBoundingClientRect();
        if (e.clientX >= r.left && e.clientX <= r.right &&
            e.clientY >= r.top  && e.clientY <= r.bottom) {
          hitIdx = Number(card.dataset.memberIndex);
          break;
        }
      }
      if (hitIdx === lastIdx) return;
      // Left a card — cancel pending open
      clearHoverTimer();
      pendingIdx.current = null;
      setHoveredMemberId(null);
      lastIdx = hitIdx;
      if (hitIdx !== null) {
        // Entered a new card — wait 480ms before opening
        setHoveredMemberId(members[hitIdx]?.id ?? null);
        pendingIdx.current = hitIdx;
        hoverTimer.current = setTimeout(() => {
          if (pendingIdx.current === hitIdx && !isOpenRef.current && !isCooling.current) {
            openMember(hitIdx);
          }
        }, 480);
      }
    };

    document.addEventListener("pointermove", onMove);
    return () => { document.removeEventListener("pointermove", onMove); };
  }, [showMembers, members, openMember]);

  useEffect(() => {
    if (!flipped) {
      setShowMembers(false);
      setHoveredMemberId(null);
      return;
    }
    const t = window.setTimeout(() => setShowMembers(true), 760);
    return () => window.clearTimeout(t);
  }, [flipped]);

  return (
    <div className="relative min-h-[600px] [perspective:1800px]">
      <div
        className={[
          "relative min-h-[600px] w-full",
          "transition-transform duration-[780ms] ease-[cubic-bezier(0.22,0.86,0.32,1)]",
          "[transform-style:preserve-3d]",
          flipped ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]",
        ].join(" ")}
      >

        {/* ════════════════════════════════════════
            FRONT FACE — unchanged
        ════════════════════════════════════════ */}
        <article className="glass-card absolute inset-0 flex h-full flex-col p-6 [backface-visibility:hidden]">
          <div className="grid flex-1 gap-5 lg:grid-cols-[0.22fr_0.78fr]">
            <div className="flex flex-col items-center lg:items-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={club.logo}
                alt={club.name}
                className="h-24 w-24 rounded-2xl border border-edge bg-white/10 p-3"
              />
              <p className="mt-4 text-sm font-semibold text-accent">{club.tagline}</p>
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">{club.name}</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink/75">{club.description}</p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                <Link href={`tel:${club.phone}`} className="rounded-full border border-edge px-4 py-2 hover:text-accent">
                  {club.phone}
                </Link>
                <Link href={`mailto:${club.email}`} className="rounded-full border border-edge px-4 py-2 hover:text-accent">
                  {club.email}
                </Link>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.14em]">
                {club.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-edge px-3 py-1.5 text-ink/75 hover:text-accent"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setFlipped(true)}
            className="group/flip relative mt-5 w-full overflow-hidden border border-edge/80 px-4 py-3 font-display text-lg font-semibold uppercase tracking-[0.1em] text-ink/65 transition-colors duration-300 hover:text-[#1F2937]"
          >
            <span
              className="absolute inset-y-0 left-0 w-0 transition-all duration-500 ease-out group-hover/flip:w-full"
              style={{ backgroundColor: accent }}
            />
            <span className="relative z-10 inline-flex items-center gap-2">
              {labels.viewTeam}
              <span
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border transition-transform duration-500 group-hover/flip:rotate-180"
                style={{ borderColor: accent }}
              >
                <ArrowCircleIcon />
              </span>
            </span>
          </button>
        </article>

        {/* ════════════════════════════════════════
            BACK FACE
        ════════════════════════════════════════ */}
        <article className="glass-card absolute inset-0 flex h-full flex-col overflow-hidden p-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">

          {/* Top accent bar */}
          <div className="h-[3px] w-full flex-shrink-0" style={{ backgroundColor: accent }} />

          {/* Header */}
          <header className="flex flex-shrink-0 items-center justify-between gap-2 border-b border-edge/50 px-4 py-3">
            <div className="flex min-w-0 items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={club.logo}
                alt={club.name}
                className="h-7 w-7 flex-shrink-0 rounded-md border border-edge/60 bg-white/10 p-0.5 object-contain"
              />
              <div className="min-w-0">
                <p className="font-mono text-[9px] uppercase tracking-[0.24em]" style={{ color: accent }}>
                  {"// "}{labels.team}
                </p>
                <h3 className="truncate font-display text-sm font-bold text-ink">{club.name}</h3>
              </div>
            </div>
            <div className="flex flex-shrink-0 items-center gap-2">
              <span className="font-mono text-[9px] uppercase tracking-[0.12em]" style={{ color: `${accent}77` }}>
                {members.length}&nbsp;{labels.members}
              </span>
              <button
                type="button"
                onClick={() => setFlipped(false)}
                className="flex items-center gap-1 border border-edge/55 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/50 transition-all duration-200 hover:border-edge hover:text-ink"
              >
                <ChevronLeftIcon />
                {labels.back}
              </button>
            </div>
          </header>

          {/* Member grid — 3 columns */}
          <div
            className="min-h-0 flex-1 overflow-y-auto"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(255,255,255,0.08) transparent",
              padding:        "12px 14px 16px",
            }}
          >
            <div
              ref={gridRef}
              style={{
                display:             "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap:                 "9px",
                justifyItems:        "center",
                paddingBottom:       "12px",
                paddingTop:          "4px",
                paddingLeft:         "6px",
                paddingRight:        "6px",
              }}
            >
              {members.map((member, index) => (
                <MemberIdCard
                  key={member.id}
                  member={member}
                  index={index}
                  accent={accent}
                  isHovered={hoveredMemberId === member.id}
                  isMuted={hoveredMemberId !== null && hoveredMemberId !== member.id}
                  showMembers={showMembers}
                  onEnter={() => setHoveredMemberId(member.id)}
                  totalMembers={members.length}
                  isOpen={openedMemberIndex === index}
                  onClose={() => closeMember()}
                  onPrev={() => { const p = index - 1; if (p >= 0) openMember(p); }}
                  onNext={() => { const n = index + 1; if (n < members.length) openMember(n); }}
                />
              ))}
            </div>

            {/* Scroll hint */}
            <div className="mt-1 flex items-center gap-2 px-1">
              <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${accent}1e)` }} />
              <span className="font-mono text-[7.5px] uppercase tracking-[0.18em]" style={{ color: `${accent}3a` }}>
                scroll
              </span>
              <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${accent}1e)` }} />
            </div>
          </div>
        </article>

      </div>
    </div>
  );
}

