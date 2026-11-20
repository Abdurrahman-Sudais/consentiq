# ConsentIQ

**Organize compliance with confidence.**

ConsentIQ is a proposed compliance management platform for adult subscription platforms, sexual wellness marketplaces and specialised digital service providers. It would help compliance teams organise policies, consent records, regulatory evidence and internal review activities, comparing documented policies with operational evidence and linking every potential gap to its sources for professional review. ConsentIQ does not provide legal advice.

> ConsentIQ is a proposed product. Features, integrations and AWS services are planned until implemented and verified. Pricing is illustrative, and the prototype uses fictional data. Founder: **Samuel Nnamdi**. Website: `consentiq.site` · contact: `samuel@consentiq.site`.

## Design

The look is a binder of record: cream paper with a red margin rule, green-black ink, forest-green checks, seal-red for potential gaps and highlighter yellow. Inter Tight for headlines, Newsreader for reading text and Martian Mono for clause numbers and labels.

- **Hero:** a highlighted headline beside a policy page whose clause gets marked, a sticky note citing the records behind the gap, and a 'for review' stamp that thuds in.
- **Method (the differentiator):** clause, records and evidence, potential gap, professional review, connected by a line that draws step by step.
- **Core features:** all seven as binder tabs, switching pages with view transitions, with margin notes pointing into the prototype.
- **Consent checks:** a ledger of ten records whose flagged rows fill in on scroll.
- **Principles:** not legal advice, linked to sources, people resolve, protected records.
- **Who it's for:** target customers on tabbed index cards, plus decision-makers.
- **Pricing:** organisation size and module checkboxes building a quote.
- **Technology:** the planned AWS architecture (Bedrock, Textract, S3, DynamoDB, Lambda, KMS) with each service's role and the AWS Activate description.
- **Closing sections:** founder, progress and the demo-request form, numbered FAQ, contact form with a topic picker.
- **Interactions:** a highlighter cursor that widens over links, highlighter-sweep navigation, offset-shadow buttons and a yellow scroll-progress bar.

## Prototype (`/app`)

The compliance workspace covers a fictional organisation, its Privacy & Consent Policy (v2.1 and v3.0), seven controls from its internal framework, sixteen pseudonymous consent records, six evidence items and an illustrative source feed.

- **Gaps & reviews:** each control shows its clause and any potential gap, with a table of the records or evidence behind it and a draft summary for review. Create a review task with an owner and due date, comment, start review, and resolve with a required note.
- **Consent checks:** missing version or method, no re-confirmation after the policy change, withdrawals judged by the policy in force when requested, retention beyond three years, missing age assurance evidence and bundled marketing consent.
- **Policy:** clause-by-clause comparison of v2.1 and v3.0.
- **Evidence:** review dates, an overdue processor agreement, a procedure that contradicts the policy, and a CSV evidence pack.
- **Sources:** example updates mapped to controls, marked reviewed with a note.
- **Audit log** of every action.
- **Roles:** Compliance Officer, Data Protection Officer, Legal Operations (comment only) and Auditor (view and export).

Every decision in the prototype is made by a person and written to a log. Changes persist in the browser's `localStorage`, and motion is skipped for visitors who prefer reduced motion. All pages are server-rendered and readable without JavaScript.

## Structure

```
src/content.js      site facts and founder
src/data.js         fictional data and roles
src/engine.js       the prototype's rules (pure functions, tested)
src/aws.js          the planned AWS architecture shown on the home page
src/forms.js        demo-request and contact form rules and HubSpot payloads (tested)
src/fx.js           interaction layer: reveals, cursor, magnetic and tilt effects, progress bar
src/App.jsx         marketing pages · src/Workspace.jsx the prototype
docs/architecture.md  planned AWS architecture and design rules
docs/crm-plan.md      HubSpot forms, properties and pipeline
```

## Develop

```bash
npm install
npm run dev
```

```bash
npm run build   # Vite build, server render, static prerender of /, /app, /privacy, /terms and 404.html
npm test        # node --test
```

The output in `dist/` is fully static. Configs are included for Netlify/Cloudflare (`public/_headers`, `public/_redirects`) and Vercel (`vercel.json`).

Until HubSpot is configured, the forms keep requests in the browser and open a pre-filled email. To connect it, set `VITE_HUBSPOT_PORTAL_ID`, `VITE_HUBSPOT_FORM_GUID` and `VITE_HUBSPOT_CONTACT_FORM_GUID` (see `.env.example`), and update the privacy notice first.
