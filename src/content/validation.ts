import type { SiteContent } from "./types";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

export function validateSiteContent(data: SiteContent): SiteContent {
  assert(!!data.meta.siteName, "meta.siteName is required");
  assert(data.navigation.length > 0, "navigation must not be empty");
  assert(data.mobileNavigation.length > 0, "mobileNavigation must not be empty");
  assert(data.home.stats.length > 0, "home.stats must not be empty");
  assert(data.programme.day1.length > 0, "programme.day1 must not be empty");
  assert(data.programme.day2.length > 0, "programme.day2 must not be empty");
  assert(data.filieres.items.length === 4, "filieres.items must contain 4 items");
  assert(!!data.competition.statAxes, "competition.statAxes is required");
  assert(!!data.competition.statFormat, "competition.statFormat is required");
  assert(!!data.competition.statDate, "competition.statDate is required");
  assert(!!data.competition.statVenue, "competition.statVenue is required");
  assert(!!data.competition.statIdeas, "competition.statIdeas is required");
  assert(data.competition.axes.length > 0, "competition.axes must not be empty");
  assert(data.competition.criteria.length > 0, "competition.criteria must not be empty");
  assert(data.competition.timeline.length > 0, "competition.timeline must not be empty");
  assert(data.competition.formats.length > 0, "competition.formats must not be empty");
  assert(data.competition.partners.length > 0, "competition.partners must not be empty");
  assert(!!data.competition.contact.name, "competition.contact.name is required");
  assert(!!data.competition.contact.email, "competition.contact.email is required");
  assert(!!data.competition.contact.phone, "competition.contact.phone is required");
  assert(!!data.competition.registrationHeading, "competition.registrationHeading is required");
  assert(!!data.competition.deadlineLabel, "competition.deadlineLabel is required");
  assert(data.intervenants.speakers.length > 0, "intervenants.speakers must not be empty");
  assert(data.clubsPage.clubs.length > 0, "clubsPage.clubs must not be empty");
  assert(data.comite.members.length > 0, "comite.members must not be empty");
  assert(data.comiteScientifique.members.length > 0, "comiteScientifique.members must not be empty");
  assert(!!data.sponsors.hero.title, "sponsors.hero.title is required");
  assert(data.sponsors.goals.items.length > 0, "sponsors.goals.items must not be empty");
  assert(data.sponsors.tiers.gold.benefits.length > 0, "sponsors.tiers.gold.benefits must not be empty");
  assert(data.sponsors.process.steps.length > 0, "sponsors.process.steps must not be empty");
  assert(data.sponsors.form.tierOptions.length > 0, "sponsors.form.tierOptions must not be empty");
  assert(data.sponsors.resources.items.length > 0, "sponsors.resources.items must not be empty");
  assert(!!data.sponsors.missingSiteLabel, "sponsors.missingSiteLabel is required");
  return data;
}
