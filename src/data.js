// Fictional compliance data for the workspace prototype: one organisation, its internal policy (two versions),
// controls from its internal framework, pseudonymous consent records, evidence and an example source feed.
// Nothing here describes a real law, regulator or company.

export const ORG = {name: 'Northlight Media Ltd (fictional)', today: '2026-07-15'};

export const POLICY = {
  title: 'Privacy & Consent Policy',
  versions: {
    '2.1': {date: '2026-01-10', clauses: {
      C1: 'Each consent is recorded with the policy version, a timestamp and the method used.',
      C3: 'Requests to withdraw consent are processed within 45 days.',
      C4: 'Consent records are kept for three years after an account closes, then deleted.',
      C6: 'Every processor has a signed data processing agreement.',
      C7: 'Marketing consent is collected separately from the terms of service.',
    }},
    '3.0': {date: '2026-06-01', clauses: {
      C1: 'Each consent is recorded with the policy version, a timestamp and the method used.',
      C2: 'After a material policy change, members re-confirm consent within 30 days.',
      C3: 'Requests to withdraw consent are processed within 30 days.',
      C4: 'Consent records are kept for three years after an account closes, then deleted.',
      C5: 'Age assurance evidence is held for every member account.',
      C6: 'Every processor has a signed data processing agreement, reviewed at least once a year.',
      C7: 'Marketing consent is collected separately from the terms of service.',
    }},
  },
};
export const CURRENT = '3.0';

/** Controls in the organisation's internal framework, each tied to a policy clause. */
export const controls = [
  {id: 'CTL-01', clause: 'C1', title: 'Complete consent records'},
  {id: 'CTL-02', clause: 'C2', title: 'Re-confirmation after policy change'},
  {id: 'CTL-03', clause: 'C3', title: 'Timely withdrawal'},
  {id: 'CTL-04', clause: 'C4', title: 'Retention and deletion'},
  {id: 'CTL-05', clause: 'C5', title: 'Age assurance evidence'},
  {id: 'CTL-06', clause: 'C6', title: 'Processor agreements'},
  {id: 'CTL-07', clause: 'C7', title: 'Separate marketing consent'},
];

// [id, purpose, version, consented, method, withdrawn, processed, closed, ageEvidence, reconfirmed]
const R = (id, purpose, version, at, method, withdrawn = null, processed = null, closed = null, age = true, reconfirmed = null) => ({id, purpose, version, at, method, withdrawn, processed, closed, age, reconfirmed});
export const records = [
  R('M-1001', 'service', '3.0', '2026-06-04', 'checkbox'),
  R('M-1002', 'marketing', '3.0', '2026-06-04', 'checkbox'),
  R('M-1003', 'service', '2.1', '2026-02-11', 'checkbox', null, null, null, true, '2026-06-12'),
  R('M-1004', 'service', '2.1', '2026-03-02', 'checkbox'),
  R('M-1005', 'marketing', '2.1', '2026-03-02', 'bundled'),
  R('M-1006', 'service', '3.0', '2026-06-20', 'email'),
  R('M-1007', 'marketing', '3.0', '2026-06-08', 'email', '2026-06-10', '2026-06-21'),
  R('M-1008', 'marketing', '2.1', '2026-01-22', 'checkbox', '2026-04-01', '2026-05-12', null, true, '2026-06-05'),
  R('M-1009', 'marketing', '3.0', '2026-06-02', 'checkbox', '2026-06-03', null),
  R('M-1010', 'service', '2.1', '2022-11-05', 'checkbox', null, null, '2023-01-15'),
  R('M-1011', 'service', '3.0', '2026-06-15', 'checkbox', null, null, null, false),
  R('M-1012', 'service', '3.0', '2026-07-01', 'checkbox'),
  R('M-1013', 'service', '2.1', '2026-04-18', 'checkbox', null, null, null, false),
  R('M-1014', 'marketing', '3.0', '2026-06-30', 'checkbox'),
  R('M-1015', 'service', '3.0', '2026-06-30', 'checkbox'),
  R('M-1016', 'service', '3.0', '2026-06-11', 'email'),
];

// Evidence: what the organisation can show. reviewed = last review date.
export const evidence = [
  {id: 'EV-01', title: 'DPA — payment processor', type: 'Agreement', control: 'CTL-06', signed: '2025-03-04', reviewed: '2026-03-01'},
  {id: 'EV-02', title: 'DPA — email delivery provider', type: 'Agreement', control: 'CTL-06', signed: '2024-02-19', reviewed: '2025-01-20'},
  {id: 'EV-03', title: 'Age assurance vendor report, Q2', type: 'Report', control: 'CTL-05', signed: '2026-07-02', reviewed: '2026-07-05'},
  {id: 'EV-04', title: 'Withdrawal handling procedure', type: 'Procedure', control: 'CTL-03', signed: '2025-11-12', reviewed: '2025-11-12', says: '45 days'},
  {id: 'EV-05', title: 'Retention schedule', type: 'Schedule', control: 'CTL-04', signed: '2026-02-01', reviewed: '2026-02-01'},
  {id: 'EV-06', title: 'Sign-up flow screenshots (v3.0)', type: 'Screenshot', control: 'CTL-07', signed: '2026-06-01', reviewed: '2026-06-01'},
];

/** An example source feed. Items are illustrative, not real publications. */
export const sources = [
  {id: 'SRC-1', date: '2026-07-08', from: 'Example regulator (illustrative)', title: 'Updated guidance on keeping age assurance evidence', controls: ['CTL-05']},
  {id: 'SRC-2', date: '2026-06-24', from: 'Example industry body (illustrative)', title: 'FAQ on recording consent method and version', controls: ['CTL-01']},
  {id: 'SRC-3', date: '2026-05-30', from: 'Example regulator (illustrative)', title: 'Consultation on withdrawal response times', controls: ['CTL-03']},
];

export const roles = [
  {id: 'officer', label: 'Compliance Officer', can: ['task', 'resolve', 'source', 'export']},
  {id: 'dpo', label: 'Data Protection Officer', can: ['task', 'resolve', 'source', 'export']},
  {id: 'legal', label: 'Legal Operations', can: ['comment']},
  {id: 'auditor', label: 'Auditor', can: ['export']},
];
export const people = {officer: 'Chiamaka Obi', dpo: 'Tunde Afolabi', legal: 'Halima Garba', auditor: 'External auditor'};
