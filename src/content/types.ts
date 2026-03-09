import type { SiteLocale } from "@/config/locales";

export type { SiteLocale };

export interface NavigationItem {
  href: string;
  label: string;
  shortLabel?: string;
}

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface ScheduleItem {
  time: string;
  title: string;
  location?: string;
}

export interface CompetitionTimelineItem {
  date: string;
  text: string;
}

export interface CompetitionContact {
  name: string;
  email: string;
  phone: string;
  site?: string;
}

export interface Speaker {
  name: string;
  role: string;
  affiliation: string;
  topic: string;
  image?: string;
}

export interface Club {
  id: string;
  name: string;
  tagline: string;
  description: string;
  logo: string;
  phone: string;
  email: string;
  links: FooterLink[];
}

export interface CommitteeMember {
  name: string;
  role: string;
  club: string;
  track?: string;
}

export interface StatItem {
  value: number;
  label: string;
  suffix?: string;
}

export interface Filiere {
  code: string;
  name: string;
  summary: string;
  color: "gesi" | "gm" | "gi" | "gmeca";
}

export interface HomeContent {
  tag: string;
  badge: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  slogan: string;
  primaryCta: FooterLink;
  secondaryCta: FooterLink;
  countdownLabel: string;
  dateLabel: string;
  locationLabel: string;
  challengeLabel: string;
  clubsLabel: string;
  stats: StatItem[];
  filieresTag: string;
  filieresTitle: string;
  filieresSubtitle: string;
  clubsTag: string;
  clubsTitle: string;
  clubsSubtitle: string;
  challengeTag: string;
  challengeTitle: string;
  challengeSubtitle: string;
}

export interface ProgrammeContent {
  tag: string;
  title: string;
  subtitle: string;
  day1Label: string;
  day2Label: string;
  day1: ScheduleItem[];
  day2: ScheduleItem[];
}

export interface FilieresContent {
  tag: string;
  title: string;
  subtitle: string;
  items: Filiere[];
}

export interface CompetitionContent {
  tag: string;
  title: string;
  subtitle: string;
  statAxes: string;
  statFormat: string;
  statDate: string;
  statVenue: string;
  statIdeas: string;
  axesTitle: string;
  axes: string[];
  eligibilityTitle: string;
  eligibility: string;
  prizeTitle: string;
  prizeAmount: string;
  prizeDescription: string;
  criteriaTitle: string;
  criteria: string[];
  timelineTitle: string;
  timeline: CompetitionTimelineItem[];
  formats: string[];
  partners: string[];
  contact: CompetitionContact;
  registrationHeading: string;
  registrationLabel: string;
  registrationUrl: string;
  deadlineLabel: string;
}

export interface SpeakersContent {
  tag: string;
  title: string;
  subtitle: string;
  speakers: Speaker[];
}

export interface ClubsContent {
  tag: string;
  title: string;
  subtitle: string;
  clubs: Club[];
}

export interface CommitteeContent {
  tag: string;
  title: string;
  subtitle: string;
  members: CommitteeMember[];
}

export interface FooterContent {
  about: string;
  quickLinks: FooterLink[];
  clubs: FooterLink[];
  contacts: FooterLink[];
  legal: string;
  badges: string[];
}

export interface LocaleMeta {
  languageLabel: string;
  siteName: string;
  description: string;
}

export interface SiteContent {
  locale: SiteLocale;
  meta: LocaleMeta;
  navigation: NavigationItem[];
  mobileNavigation: NavigationItem[];
  footer: FooterContent;
  home: HomeContent;
  programme: ProgrammeContent;
  filieres: FilieresContent;
  competition: CompetitionContent;
  intervenants: SpeakersContent;
  clubsPage: ClubsContent;
  comite: CommitteeContent;
  comiteScientifique: CommitteeContent;
}
