import React, {useState} from 'react';
import {flushSync} from 'react-dom';
import site from './content.js';
import {CURRENT, POLICY, controls, evidence, records} from './data.js';
import {checkRecord, gaps} from './engine.js';
import {ACROSS, SERVICES, STAGES, WHY} from './aws.js';
import {PROGRESS} from './forms.js';
import {vt} from './fx.js';
import Workspace from './Workspace.jsx';
import PilotForm from './PilotForm.jsx';
import ContactForm from './ContactForm.jsx';

export function Logo({size = 30}) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <rect x="1" y="1" width="38" height="38" rx="6" fill="#14231d" />
      <path d="M12 9h12l5 5v17H12z" fill="#f4f1ea" />
      <path d="M24 9v5h5" fill="none" stroke="#14231d" strokeWidth="1.4" />
      <path d="M15.5 22.5l3 3 6-7" fill="none" stroke="#1f6b4f" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const G = gaps(records, evidence);
const OPEN = G.filter((g) => g.level !== 'none');

function Header() {
  const [open, setOpen] = useState(false);
  const links = [['Method', '/#method'], ['Features', '/#features'], ['Consent checks', '/#checks'], ['Pricing', '/#pricing'], ['Technology', '/#technology'], ['Contact', '/#contact']];
  return (
    <header className="hd">
      <a href="/" className="brand" aria-label="ConsentIQ home"><Logo /><span>ConsentIQ</span></a>
      <nav id="nav" className={open ? 'nav open' : 'nav'} aria-label="Main">
        {links.map(([t, h]) => <a key={t} href={h} onClick={() => setOpen(false)}>{t}</a>)}
        <a className="nav-app" href="/app" onClick={() => setOpen(false)}>Open the compliance workspace</a>
      </nav>
      <a className="hd-cta" href="#demo" data-magnetic>Request a demo</a>
      <button className="menu" aria-expanded={open} aria-controls="nav" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button>
    </header>
  );
}

function Hero() {
  const c3 = G.find((g) => g.id === 'CTL-03');
  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="label" data-r>Compliance management · adult-oriented digital businesses</p>
        <h1 data-r>Organize compliance <span className="hl">with confidence.</span></h1>
        <p className="lede" data-r style={{'--d': '160ms'}}>ConsentIQ is a proposed platform that keeps your policies, consent records, audit evidence and reviews in one organised place — and shows every potential gap next to the clause and the records behind it, so qualified people can decide what it means.</p>
        <div className="cta" data-r style={{'--d': '240ms'}}><a className="btn" href="#demo" data-magnetic>Request a demo</a><a className="btn ghost" href="/app">Open the workspace</a></div>
      </div>
      <div className="paper" data-r style={{'--d': '200ms'}}>
        <div className="paper-head"><span>{POLICY.title}</span><span>v{CURRENT}</span></div>
        <ol className="clauses">{Object.entries(POLICY.versions[CURRENT].clauses).slice(1, 4).map(([id, t]) => <li key={id} className={id === 'C3' ? 'hit' : ''}><span className="cl">§ {id.slice(1)}</span><p>{id === 'C3' ? <><span className="mark">{t}</span></> : t}</p></li>)}</ol>
        <aside className="note-card">
          <p className="label">Potential gap · {c3.id}</p>
          <ul>{c3.sources.map((s) => <li key={s.id}><b>{s.id}</b> {s.issue}</li>)}</ul>
        </aside>
        <span className="stamp" aria-hidden="true">for review</span>
      </div>
    </section>
  );
}

function Method() {
  const steps = [['Policy clause', 'Your own documented requirement, from your internal framework.', '§ 3'], ['Records & evidence', 'Consent records, agreements, procedures and reports you already hold.', 'M-1009 · EV-04'], ['Potential gap', 'A specific mismatch, with links to both the clause and its sources.', 'CTL-03'], ['Professional review', 'A compliance owner reviews, assigns and resolves — with a written note.', 'RV-001']];
  return (
    <section className="sec" id="method" aria-labelledby="m-title">
      <div className="sec-head"><p className="label">The differentiator</p><h2 id="m-title">Every finding shows its working.</h2><p className="intro">AI-assisted comparison of documented policies and operational evidence, with findings linked to their sources for professional review. No unexplained scores, no conclusions without a citation.</p></div>
      <ol className="method" data-r>{steps.map(([t, d, ref], i) => <li key={t} style={{'--i': i}}><span className="ref">{ref}</span><h3>{t}</h3><p>{d}</p></li>)}</ol>
    </section>
  );
}

const FEATURES = [
  ['Documents', 'Compliance document organisation', 'Policies, procedures, agreements and reports in one place, versioned, tagged to the controls they support and searchable by clause.'],
  ['Consent', 'Consent record management', 'Pseudonymous consent records with purpose, policy version, timestamp, method and withdrawal — checked continuously against your current policy.'],
  ['Compare', 'Internal policy comparison', 'Clause-by-clause comparison between policy versions, and between what a policy says and what a procedure or record shows.'],
  ['Gaps', 'Potential compliance gap identification', 'Mismatches grouped by control, each citing the clause, the records and the evidence involved. Potential gaps, never verdicts.'],
  ['Evidence', 'Audit evidence management', 'Evidence linked to controls with review dates, so overdue reviews surface on their own, and an exportable evidence pack for auditors.'],
  ['Reviews', 'Compliance task and review workflows', 'Turn a gap into a review task with an owner and a due date; comments from legal; resolution only by a compliance owner, with a note.'],
  ['Sources', 'Regulatory source monitoring', 'Updates from the sources you choose to follow, mapped to the controls they may affect and queued for review.'],
];

function Features() {
  const [tab, setTab] = useState(0);
  const set = (i) => vt(() => flushSync(() => setTab(i)));
  const [k, t, d] = FEATURES[tab];
  return (
    <section className="sec" id="features" aria-labelledby="f-title">
      <div className="sec-head"><p className="label">Core features</p><h2 id="f-title">Seven tabs in one binder.</h2></div>
      <div className="binder" data-r>
        <div className="tabs" role="tablist" aria-label="Features">{FEATURES.map(([kk], i) => <button key={kk} role="tab" aria-selected={tab === i} className={tab === i ? 'on' : ''} onClick={() => set(i)} style={{'--i': i}}><span>{String(i + 1).padStart(2, '0')}</span>{kk}</button>)}</div>
        <div className="page" role="tabpanel" style={{viewTransitionName: 'page'}}>
          <p className="label">{String(tab + 1).padStart(2, '0')} / 07 · {k}</p>
          <h3>{t}</h3><p>{d}</p>
          <p className="margin">Margin note: in the prototype, try this under the <a href="/app">{k === 'Documents' || k === 'Compare' ? 'Policy' : k === 'Consent' ? 'Consent records' : k === 'Reviews' ? 'Gaps & reviews' : k}</a> tab.</p>
        </div>
      </div>
    </section>
  );
}

function Checks() {
  const rows = records.slice(0, 10).map((r) => ({r, issues: checkRecord(r)}));
  return (
    <section className="sec" id="checks" aria-labelledby="ck-title">
      <div className="split">
        <div><p className="label">Consent checks</p><h2 id="ck-title">Ten records. Read once, checked every day.</h2><p className="intro">Each record is checked against the policy that applied at the time — version recorded, re-confirmation after a change, withdrawal handled within the limit, retention, age assurance and separate marketing consent.</p>
          <p className="tally"><b>{OPEN.length}</b> of {controls.length} controls have potential gaps in the sample organisation.</p></div>
        <div className="ledger" data-r>
          <div className="lg-head"><span>Record</span><span>Purpose</span><span>Version</span><span>Check</span></div>
          {rows.map(({r, issues}, i) => <div key={r.id} className={issues.length ? 'lg-row flag' : 'lg-row'} style={{'--i': i}}><code>{r.id}</code><span>{r.purpose}</span><span>v{r.version}</span><span className="res">{issues.length ? issues[0].issue : 'OK'}</span></div>)}
        </div>
      </div>
    </section>
  );
}

function Principles() {
  return (
    <section className="band" aria-labelledby="pr-t">
      <div className="band-in">
        <h2 id="pr-t" data-r>Organised evidence. <em>Professional judgement.</em></h2>
        <ul>{[['Not legal advice', 'ConsentIQ highlights potential gaps against your internal framework. Qualified professionals and authoritative sources decide what they mean.'], ['Linked to sources', 'Every finding cites the clause and the records or evidence behind it.'], ['People resolve', 'Only a compliance owner resolves a finding, and must say how.'], ['Protected records', 'Encrypted storage, role-based access and an audit trail of every review action.']].map(([t, d], i) => <li key={t} data-r style={{'--d': `${i * 80}ms`}}><b>{t}</b><span>{d}</span></li>)}</ul>
      </div>
    </section>
  );
}

function Who() {
  return (
    <section className="sec" aria-labelledby="who-title">
      <div className="sec-head"><p className="label">Who it’s for</p><h2 id="who-title">For teams who answer for the record.</h2></div>
      <div className="who">{[['Adult subscription platforms', 'High volumes of members, consent changes and age assurance evidence to keep in order.'], ['Sexual wellness marketplaces', 'Many sellers and processors; agreements and procedures that must stay current.'], ['Specialised digital service providers', 'Small teams carrying a large compliance load, who need everything traceable.']].map(([t, d], i) => <article key={t} data-r style={{'--d': `${i * 80}ms`}}><span className="tab-ear" aria-hidden="true">{String.fromCharCode(65 + i)}</span><h3>{t}</h3><p>{d}</p></article>)}</div>
      <p className="decision"><span className="label">Decision-makers</span> Compliance officers · data protection officers · legal operations managers</p>
    </section>
  );
}

const MODULES = [['consent', 'Consent records', 120], ['compare', 'Policy comparison', 90], ['evidence', 'Evidence & audit', 80], ['sources', 'Source monitoring', 60]];
function Pricing() {
  const [size, setSize] = useState(1);
  const [mods, setMods] = useState(['consent', 'evidence']);
  const sizes = [['Up to 50 staff', 1], ['51–250 staff', 1.8], ['251+ staff', 3]];
  const base = 190; const total = Math.round((base + MODULES.filter(([k]) => mods.includes(k)).reduce((s, [, , p]) => s + p, 0)) * sizes[size][1]);
  return (
    <section className="sec" id="pricing" aria-labelledby="p-title">
      <div className="split">
        <div><p className="label">Business model</p><h2 id="p-title">Priced by organisation size and modules.</h2><p className="intro">A core workspace for documents, gaps and review tasks, plus the modules you need, scaled to the size of your organisation. Illustrative pricing for a proposed product.</p></div>
        <div className="quote" data-r>
          <p className="label">Quote</p>
          <div className="seg">{sizes.map(([l], i) => <button key={l} className={size === i ? 'on' : ''} aria-pressed={size === i} onClick={() => setSize(i)}>{l}</button>)}</div>
          <ul className="mods"><li><label><input type="checkbox" checked disabled /> Core workspace <span>${base}</span></label></li>{MODULES.map(([k, l, p]) => <li key={k}><label><input type="checkbox" checked={mods.includes(k)} onChange={() => setMods(mods.includes(k) ? mods.filter((x) => x !== k) : [...mods, k])} /> {l} <span>${p}</span></label></li>)}</ul>
          <p className="sum"><span>Monthly, illustrative</span><b>${total.toLocaleString()}</b></p>
          <a className="btn" href="#demo" data-magnetic>Request a demo</a>
        </div>
      </div>
    </section>
  );
}

function Technology() {
  return (
    <section className="sec" id="technology" aria-labelledby="tech-title">
      <div className="sec-head"><p className="label">Planned AWS infrastructure</p><h2 id="tech-title">How we use Amazon Web Services.</h2><p className="intro">{WHY}</p></div>
      <ol className="stages">{STAGES.map(([t, svcs, d], i) => <li key={t} data-r style={{'--d': `${i * 80}ms`}}><span className="cl">§ {i + 1}</span><div><h3>{t}</h3><p className="svcs">{svcs.map((s) => <span key={s}>{s}</span>)}</p><p>{d}</p></div></li>)}</ol>
      <div className="across" data-r><p className="label">Across every stage</p><ul>{ACROSS.map(([a, b]) => <li key={a}><b>{a}</b> {b}</li>)}</ul></div>
      <h3 className="sub">Services and their role in ConsentIQ</h3>
      <dl className="svc">{SERVICES.map(([a, b]) => <div key={a}><dt>{a}</dt><dd>{b}</dd></div>)}</dl>
      <div className="activate" data-r><p className="label">AWS Activate · company description</p><p>ConsentIQ is a proposed AI-assisted compliance management platform for adult-oriented digital services and sexual wellness businesses. The planned application will organise policy documents, consent records, audit evidence and internal compliance tasks. Amazon Bedrock will support policy comparison and evidence summaries, while Amazon Textract will extract structured document information. Amazon S3 and Amazon DynamoDB will store protected records, AWS Lambda will coordinate workflows, and AWS KMS will support encryption. Compliance professionals will review generated findings and determine appropriate regulatory actions using authoritative sources and qualified legal advice where required.</p></div>
      <p className="fine">Planned, not yet deployed. This website and the compliance workspace run in your browser on fictional data.</p>
    </section>
  );
}

function Team() {
  const p = site.team[0];
  return <section className="sec" id="team" aria-labelledby="team-title"><div className="team" data-r><span className="av" aria-hidden="true">{p.initials}</span><div><p className="label">Founder</p><h2 id="team-title">{p.name}</h2><p>{p.bio}</p><ul className="tags">{p.focus.map((f) => <li key={f}>{f}</li>)}</ul></div></div></section>;
}

function Demo() {
  return (
    <section className="sec" id="demo" aria-labelledby="demo-title">
      <div className="split top">
        <div><p className="label">Progress & demos</p><h2 id="demo-title">See your evidence, organised.</h2><p className="intro">ConsentIQ is a proposed product in its building stage. A demo walks through policy upload, consent checks, potential gaps with their sources, and the review workflow. The MVP covers policy document uploads, evidence organisation, review task management and human-reviewed gap assessments.</p>
          <ol className="progress">{PROGRESS.map(([st, t, d]) => <li key={t} className={st === 'Next' ? 'next' : ''}><span>{st}</span><div><b>{t}</b><p>{d}</p></div></li>)}</ol></div>
        <div className="formcard" data-r><PilotForm submitLabel="Request a demo" /></div>
      </div>
    </section>
  );
}

const FAQ = [['Does ConsentIQ tell us whether we are compliant?', 'No. It identifies potential gaps against your own internal framework and links each one to its sources. Compliance professionals, authoritative sources and qualified legal advice decide what a finding means.'], ['Which rules does it check?', 'The controls you define from your own policies. The prototype uses a fictional organisation’s internal framework, not any specific law.'], ['What happens to consent records?', 'They are stored pseudonymously, encrypted with customer-managed keys, and only roles you authorise can see them.'], ['Is ConsentIQ live?', 'Not yet. It is a proposed product; the compliance workspace is a prototype running in your browser on fictional data.']];
function Faq() { return <section className="sec" aria-labelledby="faq-title"><div className="sec-head"><p className="label">FAQ</p><h2 id="faq-title">Questions compliance teams ask.</h2></div><div className="faq">{FAQ.map(([q, a], i) => <details key={q}><summary><span className="cl">Q{i + 1}</span>{q}</summary><p>{a}</p></details>)}</div></section>; }

function Contact() {
  return (
    <section className="sec" id="contact" aria-labelledby="contact-title">
      <div className="split top"><div><p className="label">Contact</p><h2 id="contact-title">Talk to ConsentIQ.</h2><p className="intro">Questions about the product, integrations and data import, security, or partnerships. Messages go directly to the founder.</p><p className="mail"><a href={`mailto:${site.email}`}>{site.email}</a></p></div><div className="formcard" data-r><ContactForm /></div></div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="ft">
      <div className="ft-row"><a href="/" className="brand" aria-label="ConsentIQ home"><Logo /><span>ConsentIQ</span></a><nav aria-label="Footer"><a href="/app">Compliance workspace</a><a href="/#technology">Technology (AWS)</a><a href="/#pricing">Pricing</a><a href="/#contact">Contact</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></nav></div>
      <p className="fine">© 2026 ConsentIQ · {site.email} · Founded by {site.team[0].name}. A proposed product: features, integrations and AWS services are planned, pricing is illustrative and the workspace uses fictional data. ConsentIQ does not provide legal advice.</p>
    </footer>
  );
}

function Home() { return (<><Hero /><Method /><Features /><Checks /><Principles /><Who /><Pricing /><Technology /><Team /><Demo /><Faq /><Contact /></>); }

const LEGAL = {
  privacy: ['Privacy notice', [['This website', 'ConsentIQ is a proposed product. This website and the compliance workspace run in your browser on fictional data.'], ['Compliance workspace', 'Your changes are kept in your browser’s local storage (key consentiq-workspace-v1) and never leave your device.'], ['Forms', `Until a form service is connected, the demo and contact forms open a pre-filled email to ${site.email}; nothing is sent until you send it. Please do not send consent records or confidential documents through the forms.`], ['Cookies & analytics', 'None.']]],
  terms: ['Terms of use', [['A proposed product', 'Nothing here is an offer of service. Pricing is illustrative.'], ['Not legal advice', 'ConsentIQ identifies potential gaps against an internal framework. It does not provide legal advice or determine compliance.'], ['Demonstration only', 'The workspace uses a fictional organisation, fictional records and an illustrative source feed.']]],
};
function Legal({kind}) { const [title, items] = LEGAL[kind]; return <section className="sec legal"><p className="label">Review draft</p><h1>{title}</h1>{items.map(([t, d], i) => <div key={t}><h2><span className="cl">§ {i + 1}</span> {t}</h2><p>{d}</p></div>)}</section>; }
function NotFound() { return <section className="sec legal"><p className="label">404</p><h1>No record of this page.</h1><p>We couldn’t find it in the file.</p><p><a className="btn" href="/">Back to ConsentIQ</a></p></section>; }

export default function App({path = '/'}) {
  if (path.startsWith('/app')) return <Workspace />;
  const page = path === '/' ? <Home /> : path === '/privacy' ? <Legal kind="privacy" /> : path === '/terms' ? <Legal kind="terms" /> : <NotFound />;
  return (<><a className="skip" href="#main">Skip to content</a><Header /><main id="main">{page}</main><Footer /></>);
}
