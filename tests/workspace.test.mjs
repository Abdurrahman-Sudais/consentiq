import test from 'node:test';
import assert from 'node:assert/strict';
import site from '../src/content.js';
import {evidence, people, records, roles} from '../src/data.js';
import {act, checkEvidence, checkRecord, compare, gaps, initial} from '../src/engine.js';

const rec = (id) => records.find((r) => r.id === id);

test('withdrawals are judged by the policy in force when requested', () => {
  assert.deepEqual(checkRecord(rec('M-1008')), [], '41 days under the 45-day v2.1 policy is within the limit');
  assert.match(checkRecord(rec('M-1009'))[0].issue, /still open/);
});

test('record checks: re-confirmation, retention, age assurance and bundled marketing consent', () => {
  assert.ok(checkRecord(rec('M-1004')).some((x) => x.control === 'CTL-02'));
  assert.deepEqual(checkRecord(rec('M-1003')), [], 're-confirmed members are fine');
  assert.ok(checkRecord(rec('M-1010')).some((x) => x.control === 'CTL-04'));
  assert.ok(checkRecord(rec('M-1011')).some((x) => x.control === 'CTL-05'));
  assert.ok(checkRecord(rec('M-1005')).some((x) => x.control === 'CTL-07'));
});

test('evidence checks catch overdue reviews and procedures that contradict the policy', () => {
  assert.equal(checkEvidence(evidence.find((e) => e.id === 'EV-02'))[0].control, 'CTL-06');
  assert.match(checkEvidence(evidence.find((e) => e.id === 'EV-04'))[0].issue, /45 days/);
  assert.deepEqual(checkEvidence(evidence.find((e) => e.id === 'EV-01')), []);
});

test('every potential gap cites its clause and sources', () => {
  const g = gaps(records, evidence);
  assert.equal(g.find((x) => x.id === 'CTL-01').level, 'none');
  for (const x of g.filter((y) => y.level !== 'none')) { assert.ok(x.text && x.clause); assert.ok(x.sources.every((s) => s.id && s.issue)); }
  const c = compare('2.1', '3.0');
  assert.deepEqual(c.filter((x) => x.change === 'added').map((x) => x.id), ['C2', 'C5']);
  assert.deepEqual(c.filter((x) => x.change === 'changed').map((x) => x.id), ['C3', 'C6']);
});

test('review workflow: owners create tasks, legal comments, only the officer or DPO resolves with a note', () => {
  const ctx = (s) => ({roles, actor: people[s.role]});
  let s = initial(roles);
  s = act(s, {type: 'task', control: 'CTL-03', owner: 'Tunde Afolabi', due: '2026-07-31'}, ctx(s)).state;
  assert.equal(act(s, {type: 'task', control: 'CTL-03', owner: 'x'}, ctx(s)).ok, false);
  const legal = act(s, {type: 'role', role: 'legal'}, ctx(s)).state;
  const commented = act(legal, {type: 'comment', id: 'RV-001', note: 'Check the SOP owner'}, ctx(legal)).state;
  assert.equal(commented.tasks[0].notes.length, 1);
  assert.match(act(commented, {type: 'status', id: 'RV-001', value: 'resolved', note: 'Updated the SOP'}, ctx(commented)).error, /compliance officer|DPO/);
  assert.match(act(s, {type: 'status', id: 'RV-001', value: 'resolved', note: 'done'}, ctx(s)).error, /at least 10/);
  s = act(s, {type: 'status', id: 'RV-001', value: 'resolved', note: 'Procedure updated to 30 days; M-1009 processed'}, ctx(s)).state;
  assert.equal(s.tasks[0].status, 'resolved');
});

test('founder and contact', () => {
  assert.equal(site.team[0].name, 'Samuel Nnamdi');
  assert.equal(site.email, 'samuel@consentiq.site');
});
