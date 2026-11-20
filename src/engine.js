// ConsentIQ rules: check consent records against the current policy, compare policy versions, identify potential
// gaps per control with links to the clause and the records or evidence behind them, and manage review tasks.
// Findings are potential gaps for professional review against the organisation's internal framework.
import {CURRENT, ORG, POLICY, controls} from './data.js';

export const can = (roles, roleId, perm) => !!roles.find((r) => r.id === roleId)?.can.includes(perm);
export const days = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);

/** Every check a record fails, each tied to a control. */
export function checkRecord(r, today = ORG.today) {
  const out = [];
  const change = POLICY.versions[CURRENT].date;
  if (!r.version || !r.method) out.push({control: 'CTL-01', issue: `Missing ${!r.version ? 'policy version' : 'consent method'}`});
  if (r.version && r.version !== CURRENT && !r.withdrawn && !r.closed && !r.reconfirmed && days(change, today) > 30) out.push({control: 'CTL-02', issue: `Consented to v${r.version}; no re-confirmation ${days(change, today)} days after v${CURRENT}`});
  if (r.withdrawn) {
    // Judge each withdrawal by the policy in force when it was requested (45 days under v2.1, 30 under v3.0).
    const limit = r.withdrawn < change ? 45 : 30;
    const took = r.processed ? days(r.withdrawn, r.processed) : days(r.withdrawn, today);
    if (took > limit) out.push({control: 'CTL-03', issue: r.processed ? `Withdrawal took ${took} days (limit ${limit})` : `Withdrawal still open after ${took} days (limit ${limit})`});
  }
  if (r.closed && days(r.closed, today) > 3 * 365) out.push({control: 'CTL-04', issue: `Kept ${(days(r.closed, today) / 365).toFixed(1)} years after closure`});
  if (r.purpose === 'service' && !r.age && !r.closed) out.push({control: 'CTL-05', issue: 'No age assurance evidence'});
  if (r.purpose === 'marketing' && r.method === 'bundled') out.push({control: 'CTL-07', issue: 'Marketing consent bundled with terms'});
  return out;
}

export function checkEvidence(ev, today = ORG.today) {
  const out = [];
  if (ev.control === 'CTL-06' && days(ev.reviewed, today) > 365) out.push({control: 'CTL-06', issue: `${ev.title} last reviewed ${days(ev.reviewed, today)} days ago (policy: yearly)`});
  if (ev.says && ev.control === 'CTL-03' && !POLICY.versions[CURRENT].clauses.C3.includes(ev.says)) out.push({control: 'CTL-03', issue: `${ev.title} still says ${ev.says}; policy v${CURRENT} says 30 days`});
  return out;
}

/** Potential gaps per control, each with its clause and linked sources. */
export function gaps(records, evidence, today = ORG.today) {
  return controls.map((c) => {
    const recs = records.flatMap((r) => checkRecord(r, today).filter((x) => x.control === c.id).map((x) => ({kind: 'record', id: r.id, issue: x.issue})));
    const evs = evidence.flatMap((e) => checkEvidence(e, today).filter((x) => x.control === c.id).map((x) => ({kind: 'evidence', id: e.id, issue: x.issue})));
    const hasEvidence = evidence.some((e) => e.control === c.id);
    const missing = !hasEvidence && ['CTL-05', 'CTL-06', 'CTL-07', 'CTL-03', 'CTL-04'].includes(c.id) ? [{kind: 'evidence', id: '—', issue: 'No supporting evidence on file'}] : [];
    const sources = [...recs, ...evs, ...missing];
    const level = !sources.length ? 'none' : sources.length >= 3 || evs.length ? 'high' : 'medium';
    return {...c, text: POLICY.versions[CURRENT].clauses[c.clause], sources, level};
  });
}

/** Clause-by-clause comparison of two policy versions. */
export function compare(a, b) {
  const A = POLICY.versions[a].clauses; const B = POLICY.versions[b].clauses;
  const ids = [...new Set([...Object.keys(A), ...Object.keys(B)])].sort();
  return ids.map((id) => ({id, before: A[id] || null, after: B[id] || null, change: !A[id] ? 'added' : !B[id] ? 'removed' : A[id] === B[id] ? 'same' : 'changed'}));
}

export function initial(roles) { return {tasks: [], sources: {}, log: [], role: roles[0].id}; }
const now = () => new Date().toISOString();

export function act(state, a, {roles, actor}) {
  const fail = (error) => ({state, ok: false, error});
  if (a.type === 'role') return {state: {...state, role: a.role}, ok: true};
  const allow = (p) => can(roles, state.role, p);
  const log = (ref, summary, patch) => ({ok: true, state: {...state, ...patch, log: [{at: now(), actor, ref, summary}, ...state.log]}});
  const note = (a.note || '').trim();
  switch (a.type) {
    case 'task': {
      if (!allow('task')) return fail('Only the compliance officer and DPO create review tasks.');
      if (state.tasks.some((t) => t.control === a.control && t.status !== 'resolved')) return fail('An open review task already exists for this control.');
      if (!a.owner) return fail('Choose an owner.');
      const id = `RV-${String(state.tasks.length + 1).padStart(3, '0')}`;
      return log(id, `Review task for ${a.control} assigned to ${a.owner}`, {tasks: [...state.tasks, {id, control: a.control, owner: a.owner, due: a.due, status: 'open', notes: [], by: actor}]});
    }
    case 'status': {
      const t = state.tasks.find((x) => x.id === a.id); if (!t) return fail('Task not found.');
      if (a.value === 'resolved') {
        if (!allow('resolve')) return fail('Only the compliance officer or DPO resolves a finding.');
        if (note.length < 10) return fail('Record how the finding was resolved (at least 10 characters).');
      } else if (!allow('task')) return fail('You can’t change task status in this role.');
      return log(t.id, `${t.status} → ${a.value}${note ? ` — ${note}` : ''}`, {tasks: state.tasks.map((x) => (x.id === t.id ? {...x, status: a.value, resolution: a.value === 'resolved' ? note : x.resolution} : x))});
    }
    case 'comment': {
      if (!allow('comment') && !allow('task')) return fail('This role can’t comment.');
      const t = state.tasks.find((x) => x.id === a.id); if (!t) return fail('Task not found.');
      if (note.length < 3) return fail('Write a comment.');
      return log(t.id, `Comment: ${note}`, {tasks: state.tasks.map((x) => (x.id === t.id ? {...x, notes: [...x.notes, {by: actor, text: note}]} : x))});
    }
    case 'source': {
      if (!allow('source')) return fail('Only the compliance officer and DPO record source reviews.');
      if (note.length < 10) return fail('Note what the update means for your controls (at least 10 characters).');
      return log(a.id, `Source reviewed — ${note}`, {sources: {...state.sources, [a.id]: {by: actor, note}}});
    }
    default: return fail('Unknown action.');
  }
}
