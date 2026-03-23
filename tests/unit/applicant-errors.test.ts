import { describe, expect, it } from "vitest";
import { getApplicantErrorDetails } from "@/applicant/errors";

describe("applicant error helpers", () => {
  it("maps missing game leaderboard relation to schema_missing", () => {
    const details = getApplicantErrorDetails(
      new Error('relation "application_game_quiz_scores" does not exist')
    );

    expect(details.code).toBe("schema_missing");
    expect(details.message).toContain("002_application_portal_features.sql");
  });

  it("maps missing legacy-alignment columns to schema_missing", () => {
    const details = getApplicantErrorDetails(new Error('column "locale" does not exist'));

    expect(details.code).toBe("schema_missing");
    expect(details.message).toContain("003_align_legacy_applicant_applications.sql");
  });

  it("maps legacy not-null blockers to the relax-constraints migration", () => {
    const details = getApplicantErrorDetails(
      new Error('null value in column "user_email" of relation "applicant_applications" violates not-null constraint')
    );

    expect(details.code).toBe("schema_missing");
    expect(details.message).toContain("004_relax_legacy_applicant_constraints.sql");
  });
});
