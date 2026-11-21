// ConsentIQ — site facts used by the pages, the prerender step and the tests.
// A proposed product: features, integrations and AWS services are planned until implemented and verified.
const site = {
  name: 'ConsentIQ',
  slug: 'consentiq',
  tagline: 'Organize compliance with confidence.',
  about: 'ConsentIQ is a proposed compliance management platform for adult-oriented digital businesses. It would help compliance teams organise policies, consent records, regulatory evidence and internal review activities, with every potential gap linked to its source for professional review.',
  url: 'https://consentiq.site',
  email: 'samuel@consentiq.site',
  team: [
    {name: 'Samuel Nnamdi', role: 'Founder', initials: 'SN', bio: 'Samuel founded ConsentIQ after watching compliance teams at adult-oriented platforms rebuild the same evidence from spreadsheets, inboxes and screenshots before every review. Samuel leads product, customers and every pilot, with a focus on traceable, professionally reviewed findings.', focus: ['Product', 'Consent & evidence', 'Customer pilots']},
    {name: "Adaobi Nwosu", role: "Co-founder", initials: "AN", bio: "Adaobi leads customer success at ConsentIQ: onboarding compliance teams, shaping the review workflow with compliance officers and DPOs and turning their feedback into product changes.", focus: ["Compliance operations", "Pilot onboarding", "Review workflows"]},
    {name: "Segun Afolabi", role: "CTO", initials: "SA", bio: "Segun leads engineering: document extraction, consent record checks, policy comparison, source-linked findings, encrypted evidence storage and the AWS platform it runs on.", focus: ["Platform architecture", "Document intelligence", "AWS infrastructure"]},
  ],
  app: {
    title: 'Compliance workspace',
    subtitle: 'A fictional organisation’s policy (two versions), controls from its internal framework, consent records with checks, potential gaps linked to their sources, review tasks, evidence and an example source feed.',
  },
};
export default site;
