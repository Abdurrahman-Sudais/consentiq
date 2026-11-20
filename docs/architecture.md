# Architecture

Status: **proposed**. The website and the prototype run entirely in the browser on fictional data. None of the AWS services below are deployed or connected.

## Today: browser-only prototype

- Vite + React, server-rendered to static HTML for every route (`scripts/prerender.mjs`).
- Fictional policies, controls, consent records, evidence and source updates live in `src/data.js`; consent checks, gap identification, policy comparison and review rules are pure functions in `src/engine.js`, tested with `node --test`.
- Changes persist in `localStorage`; roles are switched in the UI, not authenticated.

## Why AWS

ConsentIQ is a proposed compliance management platform for adult-oriented digital businesses. It works with sensitive documents and consent records that must be extracted accurately, compared carefully and kept as protected evidence. Designing on AWS lets it extract document structure, compare policies with evidence, and store records under customer-controlled encryption.

## Proposed production service

| Stage | Services | What happens |
|---|---|---|
| 1. Documents in | Amazon S3, Amazon Textract | Policies and evidence are uploaded to encrypted storage and their text, tables and fields extracted. |
| 2. Records | Amazon DynamoDB | Policies, controls, consent records and review tasks are stored as structured records. |
| 3. Compare & summarise | Amazon Bedrock | Documented policies are compared with operational evidence; potential gaps are summarised with links to their sources. |
| 4. Review workflows | AWS Lambda | Checks run on schedule, review tasks are created and assigned, and resolutions are recorded. |
| 5. Protect | AWS KMS | Every document and record is encrypted with customer-managed keys. |
| Across every stage | AWS KMS, Amazon Cognito, AWS Lambda, AWS CloudTrail | AWS KMS encrypts every document and record; Amazon Cognito separates compliance, DPO, legal and auditor roles; AWS Lambda runs checks and workflows; AWS CloudTrail records access to protected evidence |

### Services and their role

- **Amazon Bedrock** — Compares policies with evidence and drafts finding summaries for professional review.
- **Amazon Textract** — Extracts text, tables and fields from policy and evidence documents.
- **Amazon S3** — Stores compliance evidence and documents, encrypted.
- **Amazon DynamoDB** — Stores policies, controls, consent records and review tasks.
- **AWS Lambda** — Runs consent checks and review workflows.
- **AWS KMS** — Manages the encryption keys for documents and records.
- **Amazon Cognito** — Authenticates users and enforces role-based access.
- **AWS CloudTrail** — Keeps an audit trail of access to protected resources.

The same lists live in `src/aws.js` and are shown on the home page (`#technology`).

### Design rules

1. **Findings are not legal advice.** ConsentIQ highlights potential gaps against your internal framework; qualified professionals decide what they mean.
2. **Every finding links to its source.** Each gap cites the policy clause and the records or evidence behind it.
3. **People resolve gaps.** Only a compliance owner can resolve a finding, with a written note.
4. **Protected records.** Encrypted storage, role-based access and an audit trail of every review action.

## Website lead capture

The pilot and contact forms post to HubSpot (see `docs/crm-plan.md`). If a server-side intake is needed later, Amazon API Gateway + AWS Lambda can validate submissions and Amazon SES can notify the founder.
