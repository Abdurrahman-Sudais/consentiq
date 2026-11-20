import React, {useEffect, useState} from 'react';
import {flushSync} from 'react-dom';
import site from './content.js';
import {CURRENT, ORG, POLICY, controls, evidence, people, records, roles, sources} from './data.js';
import {act, can, checkEvidence, checkRecord, compare, days, gaps, initial} from './engine.js';
import {vt} from './fx.js';
import {Logo} from './App.jsx';

const KEY = 'consentiq-workspace-v1';
const G = gaps(records, evidence);
const csvRow = (r) => r.map((x) => `"${String(x ?? '').replace(/"/g, '""')}"`).join(',');

export default function Workspace() {
  const [state, setState] = useState(() => initial(roles));
  const [tab, setTab] = useState('gaps');
  const [sel, setSel] = useState('CTL-03');
  const [flagged, setFlagged] = useState(false);
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState('');
  useEffect(() => { try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s?.tasks) setState(s); } catch { /* ignore */ } }, []);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ } }, [state]);

  const actor = people[state.role];
  const allow = (p) => can(roles, state.role, p);
  const f = (k) => form[k] ?? '';
  const setF = (k, v) => setForm({...form, [k]: v});
  const run = (a, clear) => { const r = act(state, a, {roles, actor}); setMsg(r.ok ? '' : r.error); if (r.ok) { setState(r.state); if (clear) setForm({...form, [clear]: ''}); } };
  const go = (t) => vt(() => flushSync(() => { setTab(t); setMsg(''); }));
  const pick = (id) => vt(() => flushSync(() => { setSel(id); setMsg(''); }));
  const g = G.find((x) => x.id === sel);
  const task = state.tasks.find((t) => t.control === sel && t.status !== 'resolved') || [...state.tasks].reverse().find((t) => t.control === sel);
  const exportPack = () => {
    const lines = ['ConsentIQ evidence pack (fictional)', `Organisation,${ORG.name}`, `Prepared,${ORG.today}`, '', csvRow(['control', 'clause', 'requirement', 'potential gaps', 'sources', 'review task', 'status', 'resolution']),
      ...G.map((x) => { const t = [...state.tasks].reverse().find((y) => y.control === x.id); return csvRow([x.id, x.clause, x.text, x.sources.length, x.sources.map((s) => `${s.id}: ${s.issue}`).join(' | '), t?.id, t?.status, t?.resolution]); }),
      '', csvRow(['evidence', 'title', 'type', 'control', 'signed', 'last reviewed']), ...evidence.map((e) => csvRow([e.id, e.title, e.type, e.control, e.signed, e.reviewed])),
      '', csvRow(['time', 'actor', 'ref', 'action']), ...state.log.map((l) => csvRow([l.at, l.actor, l.ref, l.summary]))];
    const url = URL.createObjectURL(new Blob([lines.join('\n')], {type: 'text/csv'})); const a = document.createElement('a'); a.href = url; a.download = 'consentiq-evidence-pack.csv'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="ws">
      <header className="ws-top">
        <a href="/" className="brand" aria-label="Back to the ConsentIQ website"><Logo size={26} /><span>ConsentIQ</span></a>
        <span className="mono">{ORG.name} · as of {ORG.today}</span>
        <label className="ws-role">Signed in as <select value={state.role} onChange={(e) => run({type: 'role', role: e.target.value})}>{roles.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}</select></label>
        <button className="btn ghost sm" onClick={() => { setState(initial(roles)); setMsg(''); }}>Reset</button>
      </header>
      <p className="ws-banner">Fictional organisation and records · findings are potential gaps against an internal framework, for professional review · not legal advice</p>
      <main className="ws-main">
        <div className="ws-head"><h1>{site.app.title}</h1><div className="ws-tabs" role="tablist">{[['gaps', 'Gaps & reviews'], ['policy', 'Policy'], ['consent', 'Consent records'], ['evidence', 'Evidence'], ['sources', 'Sources'], ['audit', 'Audit log']].map(([id, l]) => <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? 'on' : ''} onClick={() => go(id)}>{l}</button>)}</div></div>
        {msg && <p className="ws-err" role="alert">{msg}</p>}

        {tab === 'gaps' && (<div className="ws-grid">
          <aside className="sheet"><h2>Controls <small>internal framework</small></h2><ul className="ctl">{G.map((x) => { const t = [...state.tasks].reverse().find((y) => y.control === x.id); return <li key={x.id}><button className={x.id === sel ? 'on' : ''} onClick={() => pick(x.id)}><span className={`dot l-${t?.status === 'resolved' ? 'none' : x.level}`} aria-hidden="true" /><span><b>{x.id} · {x.title}</b><small>{x.level === 'none' ? 'No potential gap found' : `${x.sources.length} source${x.sources.length > 1 ? 's' : ''}`}{t ? ` · ${t.id} ${t.status}` : ''}</small></span></button></li>; })}</ul></aside>
          <section className="sheet doc" style={{viewTransitionName: 'doc'}}>
            <p className="mono">{g.id} · policy v{CURRENT} § {g.clause.slice(1)}</p>
            <h2>{g.title}</h2>
            <blockquote>“{g.text}”</blockquote>
            {g.level === 'none' ? <p className="okline">No potential gap found in the records and evidence on file.</p> : (<>
              <h3>Potential gap · {g.level === 'high' ? 'higher attention' : 'review'}</h3>
              <table className="tbl"><thead><tr><th scope="col">Source</th><th scope="col">Type</th><th scope="col">What we found</th></tr></thead><tbody>{g.sources.map((s, i) => <tr key={i}><th scope="row"><code>{s.id}</code></th><td>{s.kind}</td><td>{s.issue}</td></tr>)}</tbody></table>
              <p className="fine">Draft summary for review: {g.sources.length} item{g.sources.length > 1 ? 's' : ''} may not match § {g.clause.slice(1)} of your policy. Confirm against the source records and, where needed, qualified advice before acting.</p></>)}
          </section>
          <aside className="sheet"><h2>Review</h2>
            {task ? (<div className="task"><p><b>{task.id}</b> · {task.status}<br /><small>Owner {task.owner}{task.due ? ` · due ${task.due}` : ''}</small></p>
              {task.resolution && <p className="okline">Resolved: “{task.resolution}”</p>}
              {task.status !== 'resolved' && <><div className="acts">{task.status === 'open' && <button className="btn sm ghost" disabled={!allow('task')} onClick={() => run({type: 'status', id: task.id, value: 'in review'})}>Start review</button>}</div>
                <label className="lbl">Resolution note<textarea rows="3" value={f('res')} onChange={(e) => setF('res', e.target.value)} disabled={!allow('resolve')} placeholder="e.g. Procedure updated to 30 days; M-1009 processed 15 July" /></label>
                <button className="btn sm" disabled={!allow('resolve')} onClick={() => run({type: 'status', id: task.id, value: 'resolved', note: f('res')}, 'res')}>Resolve</button></>}
              <label className="lbl">Comment<input value={f('cm')} onChange={(e) => setF('cm', e.target.value)} disabled={!allow('comment') && !allow('task')} placeholder="Add context for the owner" /></label>
              <button className="btn sm ghost" disabled={!allow('comment') && !allow('task')} onClick={() => run({type: 'comment', id: task.id, note: f('cm')}, 'cm')}>Comment</button>
              <ul className="notes">{task.notes.map((n, i) => <li key={i}><b>{n.by}</b> {n.text}</li>)}</ul></div>)
              : g.level === 'none' ? <p className="fine">Nothing to review.</p> : (<div className="task">
                <label className="lbl">Owner<select value={f('owner')} onChange={(e) => setF('owner', e.target.value)} disabled={!allow('task')}><option value="">Choose…</option>{Object.values(people).slice(0, 3).map((p) => <option key={p}>{p}</option>)}</select></label>
                <label className="lbl">Due<input type="date" value={f('due')} onChange={(e) => setF('due', e.target.value)} disabled={!allow('task')} /></label>
                <button className="btn sm" disabled={!allow('task')} onClick={() => run({type: 'task', control: g.id, owner: f('owner'), due: f('due')})}>Create review task</button></div>)}
            {!allow('task') && <p className="fine">The {roles.find((r) => r.id === state.role).label} role {allow('comment') ? 'can comment on' : 'can view'} reviews.</p>}
          </aside>
        </div>)}

        {tab === 'policy' && (<section className="sheet"><h2>{POLICY.title} · v2.1 → v{CURRENT}</h2><p className="fine">v2.1 dated {POLICY.versions['2.1'].date}; v{CURRENT} dated {POLICY.versions[CURRENT].date}.</p>
          <ol className="diff">{compare('2.1', CURRENT).map((c) => <li key={c.id} className={`d-${c.change}`}><span className="cl">§ {c.id.slice(1)}</span><div>{c.change === 'changed' && <p className="was"><del>{c.before}</del></p>}<p>{c.after || <del>{c.before}</del>}</p></div><span className="chg">{c.change}</span></li>)}</ol></section>)}

        {tab === 'consent' && (<section className="sheet"><h2>Consent records <small>pseudonymous</small></h2>
          <label className="chk"><input type="checkbox" checked={flagged} onChange={(e) => setFlagged(e.target.checked)} /> Show only records with potential issues</label>
          <div className="tbl-wrap"><table className="tbl"><thead><tr><th scope="col">Record</th><th scope="col">Purpose</th><th scope="col">Version</th><th scope="col">Consented</th><th scope="col">Method</th><th scope="col">Withdrawn</th><th scope="col">Processed</th><th scope="col">Checks</th></tr></thead>
            <tbody>{records.map((r) => ({r, is: checkRecord(r)})).filter(({is}) => !flagged || is.length).map(({r, is}) => <tr key={r.id} className={is.length ? 'flag' : ''}><th scope="row"><code>{r.id}</code></th><td>{r.purpose}</td><td>{r.version ? `v${r.version}` : '—'}</td><td>{r.at}</td><td>{r.method || '—'}</td><td>{r.withdrawn || '—'}</td><td>{r.processed || (r.withdrawn ? 'open' : '—')}</td><td>{is.length ? is.map((x) => <span key={x.control} className="iss"><button className="link" onClick={() => { setSel(x.control); go('gaps'); }}>{x.control}</button> {x.issue}</span>) : <span className="okline">OK</span>}</td></tr>)}</tbody></table></div></section>)}

        {tab === 'evidence' && (<section className="sheet"><h2>Evidence locker</h2><div className="tbl-wrap"><table className="tbl"><thead><tr><th scope="col">Evidence</th><th scope="col">Type</th><th scope="col">Control</th><th scope="col">Signed / dated</th><th scope="col">Last reviewed</th><th scope="col">Check</th></tr></thead>
          <tbody>{evidence.map((e) => { const is = checkEvidence(e); return <tr key={e.id} className={is.length ? 'flag' : ''}><th scope="row"><code>{e.id}</code> {e.title}</th><td>{e.type}</td><td>{e.control}</td><td>{e.signed}</td><td>{e.reviewed} <small>({days(e.reviewed, ORG.today)} d ago)</small></td><td>{is.length ? is[0].issue : <span className="okline">OK</span>}</td></tr>; })}</tbody></table></div>
          <p className="fine">Controls with no evidence on file: {controls.filter((c) => !evidence.some((e) => e.control === c.id)).map((c) => c.id).join(', ')}.</p>
          {allow('export') ? <button className="btn sm" onClick={exportPack}>Export evidence pack (CSV)</button> : <p className="fine">Evidence packs are exported by the compliance officer, DPO or auditor.</p>}</section>)}

        {tab === 'sources' && (<section className="sheet"><h2>Source monitoring <small>example feed</small></h2><p className="fine">Updates from sources you choose to follow, mapped to the controls they may affect. The items below are illustrative.</p>
          <ul className="feed">{sources.map((s) => { const r = state.sources[s.id]; return <li key={s.id} className={r ? 'done' : ''}><div><p className="mono">{s.date} · {s.from}</p><b>{s.title}</b><small>May affect {s.controls.join(', ')}</small>{r && <p className="okline">Reviewed by {r.by}: “{r.note}”</p>}</div>
            {!r && <div className="feed-act"><input aria-label={`Review note for ${s.id}`} placeholder="What this means for your controls" value={f(s.id)} onChange={(e) => setF(s.id, e.target.value)} disabled={!allow('source')} /><button className="btn sm" disabled={!allow('source')} onClick={() => run({type: 'source', id: s.id, note: f(s.id)}, s.id)}>Mark reviewed</button></div>}</li>; })}</ul></section>)}

        {tab === 'audit' && (<section className="sheet"><h2>Audit log</h2><ul className="log">{state.log.map((l, i) => <li key={i}><time>{new Date(l.at).toLocaleString()}</time><b>{l.actor}</b><code>{l.ref}</code>{l.summary}</li>)}{!state.log.length && <li className="fine">Every review action appears here with who and when.</li>}</ul></section>)}
      </main>
    </div>
  );
}
