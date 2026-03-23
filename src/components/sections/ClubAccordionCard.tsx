"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { SiteLocale } from "@/config/locales";
import type { Club } from "@/content/types";

interface ClubAccordionCardProps {
  club: Club;
  locale: SiteLocale;
  isExpanded: boolean;
  onToggle: () => void;
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
  { name: "Amine Boustiti", role: "Président · GM2", email: "", linkedin: "", instagram: "", photo: "/images/clubs/MTZ/Amine Boustiti.jpeg" },
  { name: "Taoufik Ouanzi", role: "Vice-président · GMT2", email: "", linkedin: "", instagram: "", photo: "/images/clubs/MTZ/Taoufik ouanzi.jpeg" },
  { name: "Dina Droukli", role: "Secrétaire générale · GM2", email: "", linkedin: "", instagram: "", photo: "/images/clubs/MTZ/Dina Droukli.jpeg" },
  { name: "Wahiba Raki", role: "Resp. RH · GM2", email: "", linkedin: "", instagram: "", photo: "/images/clubs/MTZ/Wahiba raki.jpeg" },
  { name: "Yassine El Addaoui", role: "Resp. interne · GM2", email: "", linkedin: "", instagram: "", photo: "/images/clubs/MTZ/Yassine El Addaoui.jpeg" },
  { name: "Khadija El-Mesbahi", role: "Resp. formation · GIND1", email: "", linkedin: "", instagram: "", photo: "/images/clubs/MTZ/Khadija el-mesbahi.jpeg" },
  { name: "Ilyas Baba", role: "Resp. externe · GM2", email: "", linkedin: "", instagram: "", photo: "/images/clubs/MTZ/Ilyas Baba.jpeg" },
  { name: "Imane Dchiouch", role: "Trésorière · GMT2", email: "", linkedin: "", instagram: "", photo: "/images/clubs/MTZ/Imane dchiouch.jpeg" },
  { name: "Abla Jalal", role: "Cellule média · CP2", email: "", linkedin: "", instagram: "", photo: "/images/uknown women.png" },
  { name: "Ikram Kab", role: "Cellule média · GM2", email: "", linkedin: "", instagram: "", photo: "/images/clubs/MTZ/Ikram Kab.jpeg" },
  { name: "Chaimae El Azzouzi", role: "Cellule média · GM2", email: "", linkedin: "", instagram: "", photo: "/images/uknown women.png" },
  { name: "Khadija Eddebbarhi", role: "Cellule média · GM2", email: "", linkedin: "", instagram: "", photo: "/images/uknown women.png" },
  { name: "Abdelilah El Kasmy", role: "Cellule organisation · GMT2", email: "", linkedin: "", instagram: "", photo: "/images/clubs/MTZ/Abdelilah El Kasmy.jpeg" },
  { name: "Saad Sebbane", role: "Cellule R&D · GMT2", email: "", linkedin: "", instagram: "", photo: "/images/clubs/MTZ/Sebbane Saad2.jpeg" },
  { name: "Aziz Iguidre", role: "Cellule R&D · GMT2", email: "", linkedin: "", instagram: "", photo: "/images/clubs/MTZ/Aziz iguidre.jpeg" },
  { name: "Samia El Badri", role: "Cellule com · GMT2", email: "", linkedin: "", instagram: "", photo: "/images/clubs/MTZ/Samia el badri.jpeg" },
  { name: "Hajar Touimi", role: "Cellule com · GMT2", email: "", linkedin: "", instagram: "", photo: "/images/clubs/MTZ/Hajar Touimi.jpeg" },
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

const ACCENT: Record<string, string> = {
  powerup: "#F97316",
  trenz: "#6366F1",
  iec: "#EC4899",
};

function socialHandle(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "_");
}

function socialSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function normalizeInstagram(raw: string, name: string) {
  const value = raw.trim();
  if (!value) return `https://www.instagram.com/${socialHandle(name)}`;
  if (/^https?:\/\//i.test(value)) return value;
  return `https://www.instagram.com/${value.replace(/^@/, "").replace(/\s+/g, "_").replace(/[^a-zA-Z0-9._]/g, "").toLowerCase()}`;
}

function normalizeLinkedin(raw: string, name: string) {
  const value = raw.trim();
  if (!value) return `https://www.linkedin.com/in/${socialSlug(name)}`;
  if (/^https?:\/\//i.test(value)) return value;
  if (/^www\./i.test(value)) return `https://${value}`;
  return `https://www.linkedin.com/in/${socialSlug(value)}`;
}

function pool(clubId: string) {
  if (clubId === "trenz") return MTZ_PHOTOS;
  if (clubId === "iec") return IEC_PHOTOS;
  return PUP_PHOTOS;
}

function buildMembers(club: Club): MemberProfile[] {
  const clubPool = pool(club.id);

  if (club.id === "powerup") {
    return POWERUP_MEMBERS.map((member, index) => ({
      id: `${club.id}-${index}`,
      name: member.name,
      role: member.role,
      email: member.email,
      instagram: normalizeInstagram(member.instagram, member.name),
      linkedin: normalizeLinkedin(member.linkedin, member.name),
      photo: member.photo ?? clubPool[index % clubPool.length],
      fallbackPhoto: PUP_PHOTOS[index % PUP_PHOTOS.length],
    }));
  }

  if (club.id === "trenz") {
    return TRENZ_MEMBERS.map((member, index) => ({
      id: `${club.id}-${index}`,
      name: member.name,
      role: member.role,
      email: "",
      instagram: normalizeInstagram(member.instagram, member.name),
      linkedin: normalizeLinkedin(member.linkedin, member.name),
      photo: member.photo ?? clubPool[index % clubPool.length],
      fallbackPhoto: MTZ_PHOTOS[index % MTZ_PHOTOS.length],
    }));
  }

  if (club.id === "iec") {
    return IEC_MEMBERS.map((member, index) => ({
      id: `${club.id}-${index}`,
      name: member.name,
      role: member.role,
      email: member.email,
      instagram: normalizeInstagram(member.instagram, member.name),
      linkedin: normalizeLinkedin(member.linkedin, member.name),
      photo: member.photo ?? clubPool[index % clubPool.length],
      fallbackPhoto: IEC_PHOTOS[index % IEC_PHOTOS.length],
    }));
  }

  return clubPool.map((photo, index) => ({
    id: `${club.id}-${index}`,
    name: `Member ${index + 1}`,
    role: "Team",
    email: "",
    instagram: `https://instagram.com/${socialHandle(club.id)}_${index + 1}`,
    linkedin: `https://linkedin.com/in/${socialSlug(club.id)}-${index + 1}`,
    photo,
    fallbackPhoto: IEC_PHOTOS[index % IEC_PHOTOS.length],
  }));
}

function textByLocale(locale: SiteLocale) {
  if (locale === "en") return { team: "TEAM", members: "members", viewTeam: "Meet team", close: "Close" };
  if (locale === "ar") return { team: "الفريق", members: "أعضاء", viewTeam: "تعرّف على الفريق", close: "إغلاق" };
  return { team: "ÉQUIPE", members: "membres", viewTeam: "Voir l'équipe", close: "Fermer" };
}

function MemberOverlay({
  member,
  index,
  totalMembers,
  accent,
  onClose,
  onPrev,
  onNext,
}: {
  member: MemberProfile;
  index: number;
  totalMembers: number;
  accent: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-[90] bg-black/75 backdrop-blur" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-[91] w-[min(460px,calc(100vw-1.5rem))] -translate-x-1/2 -translate-y-1/2">
        <div className="outlined-cut-card overflow-hidden bg-[#070a10]">
          <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${accent}, ${accent}44, transparent)` }} />
          <div className="relative aspect-[4/3]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={member.photo}
              alt={member.name}
              className="absolute inset-0 h-full w-full object-cover object-top"
              onError={(event) => {
                const image = event.currentTarget;
                if (image.src.endsWith(member.fallbackPhoto)) return;
                image.src = member.fallbackPhoto;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070a10] via-[#070a1088] to-transparent" />
            <span className="absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: accent }}>
              {member.role}
            </span>
          </div>
          <div className="p-5">
            <p className="font-display text-4xl uppercase leading-none text-[#f0ede6]">{member.name}</p>
            <p className="mt-1 font-mono text-[10px] text-white/35">
              {String(index + 1).padStart(2, "0")} / {String(totalMembers).padStart(2, "0")}
            </p>
            {member.email ? <p className="mt-3 truncate font-mono text-xs text-white/45">{member.email}</p> : null}
            <div className="mt-4 flex gap-2">
              <Link
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded border px-3 py-2 text-center font-mono text-[11px] uppercase tracking-[0.12em]"
                style={{ borderColor: `${accent}38`, color: accent, backgroundColor: `${accent}12` }}
              >
                LinkedIn
              </Link>
              <Link
                href={member.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded border px-3 py-2 text-center font-mono text-[11px] uppercase tracking-[0.12em]"
                style={{ borderColor: `${accent}38`, color: accent, backgroundColor: `${accent}12` }}
              >
                Instagram
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between px-1">
          <button type="button" onClick={onPrev} disabled={index === 0} className="font-mono text-[10px] uppercase tracking-[0.14em] disabled:cursor-not-allowed disabled:text-white/20" style={{ color: index === 0 ? "rgba(255,255,255,.2)" : accent }}>
            Prev
          </button>
          <button type="button" onClick={onClose} className="rounded border border-white/20 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">
            ESC
          </button>
          <button type="button" onClick={onNext} disabled={index === totalMembers - 1} className="font-mono text-[10px] uppercase tracking-[0.14em] disabled:cursor-not-allowed disabled:text-white/20" style={{ color: index === totalMembers - 1 ? "rgba(255,255,255,.2)" : accent }}>
            Next
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}

export function ClubAccordionCard({ club, locale, isExpanded, onToggle }: ClubAccordionCardProps) {
  const [showMembers, setShowMembers] = useState(false);
  const [openedIndex, setOpenedIndex] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const labels = useMemo(() => textByLocale(locale), [locale]);
  const members = useMemo(() => buildMembers(club), [club]);
  const accent = ACCENT[club.id] ?? "#F97316";

  const openMember = useCallback((index: number) => setOpenedIndex(index), []);
  const closeMember = useCallback(() => setOpenedIndex(null), []);

  useEffect(() => {
    if (!isExpanded) {
      setShowMembers(false);
      return;
    }
    const timer = window.setTimeout(() => setShowMembers(true), 220);
    return () => window.clearTimeout(timer);
  }, [isExpanded]);

  return (
    <>
      <article className="relative overflow-hidden border-y border-white/10">
        <span className="absolute bottom-0 left-0 top-0 z-10 w-[2px]" style={{ backgroundColor: accent, opacity: isExpanded ? 1 : 0.45 }} />

        <button
          type="button"
          onClick={onToggle}
          className="relative z-20 flex w-full items-center gap-4 px-7 py-6 text-left transition"
          style={{ backgroundColor: isExpanded ? `${accent}08` : "transparent" }}
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded border p-2" style={{ borderColor: isExpanded ? accent : "rgba(255,255,255,.12)", backgroundColor: isExpanded ? `${accent}14` : "rgba(255,255,255,.04)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={club.logo} alt={club.name} className="h-full w-full object-contain" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="font-display text-4xl uppercase leading-none" style={{ color: isExpanded ? accent : "var(--ink)" }}>
                {club.name}
              </h2>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: `${accent}aa` }}>
                {members.length} {labels.members}
              </span>
            </div>
            <p className="mt-1 truncate font-mono text-[11px] text-ink/60">{club.tagline}</p>
          </div>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border text-lg" style={{ borderColor: isExpanded ? accent : "rgba(255,255,255,.2)", color: isExpanded ? accent : "rgba(255,255,255,.45)" }}>
            {isExpanded ? "−" : "+"}
          </span>
        </button>

        <div
          style={{
            maxHeight: isExpanded ? "420px" : "0px",
            transition: "max-height .45s cubic-bezier(.22,.86,.32,1)",
            overflow: "hidden",
          }}
        >
          <div className="px-7 pb-6">
            <div className="mb-4 flex items-center gap-4">
              <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${accent}55, transparent)` }} />
              <span className="font-mono text-[9px] uppercase tracking-[0.18em]" style={{ color: `${accent}88` }}>
                {"// "}{labels.team}
              </span>
              <div className="h-px w-12" style={{ backgroundColor: `${accent}33` }} />
            </div>

            <div className="mb-5 flex flex-wrap gap-8">
              <p className="max-w-xl flex-1 font-mono text-[12px] leading-relaxed text-white/55">{club.description}</p>
              <div className="space-y-2">
                <Link href={`tel:${club.phone}`} className="block font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: `${accent}bb` }}>
                  ↗ {club.phone}
                </Link>
                {club.links.map((link) => (
                  <Link key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="block font-mono text-[10px] uppercase tracking-[0.12em] text-white/45">
                    ↗ {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="team-scroll flex gap-3 overflow-x-auto pb-2">
              {members.map((member, index) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => openMember(index)}
                  onMouseEnter={() => setHoveredId(member.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="w-28 shrink-0 border bg-black/20 p-1 transition"
                  style={{
                    borderColor: hoveredId === member.id ? accent : "rgba(255,255,255,.14)",
                    opacity: showMembers ? (hoveredId && hoveredId !== member.id ? 0.35 : 1) : 0,
                    transform: showMembers ? "translateY(0)" : "translateY(10px)",
                    transitionDuration: "260ms",
                    transitionDelay: `${index * 35}ms`,
                  }}
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="h-full w-full object-cover object-top"
                      onError={(event) => {
                        const image = event.currentTarget;
                        if (image.src.endsWith(member.fallbackPhoto)) return;
                        image.src = member.fallbackPhoto;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute bottom-1 left-1 right-1 truncate font-mono text-[7px] uppercase tracking-[0.12em]" style={{ color: accent }}>
                      {member.role}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-left font-display text-base uppercase leading-none text-ink/90">
                    {member.name}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </article>

      {openedIndex !== null ? (
        <MemberOverlay
          member={members[openedIndex]}
          index={openedIndex}
          totalMembers={members.length}
          accent={accent}
          onClose={closeMember}
          onPrev={() => {
            if (openedIndex > 0) openMember(openedIndex - 1);
          }}
          onNext={() => {
            if (openedIndex < members.length - 1) openMember(openedIndex + 1);
          }}
        />
      ) : null}
    </>
  );
}

