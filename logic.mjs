export const WINDOWS = Object.freeze({ OVERDUE:'OVERDUE', DUE_7:'DUE_7', DUE_30:'DUE_30', DUE_60:'DUE_60', LATER:'LATER', REVIEW:'REVIEW' });

export function parseDateOnly(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [y,m,d] = value.split('-').map(Number);
  const dt = new Date(Date.UTC(y,m-1,d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m-1 || dt.getUTCDate() !== d) return null;
  return dt;
}

export function dayDiff(fromDate, toDate) {
  return Math.round((toDate.getTime() - fromDate.getTime()) / 86400000);
}

export function classifyRenewal(renewalDate, asOfDate) {
  const asOf = parseDateOnly(asOfDate);
  const renewal = parseDateOnly(renewalDate);
  if (!asOf) throw new Error('Invalid as-of date');
  if (!renewal) return { state: WINDOWS.REVIEW, days: null, reason: 'Missing or invalid renewal date' };
  const days = dayDiff(asOf, renewal);
  if (days < 0) return { state: WINDOWS.OVERDUE, days, reason: `${Math.abs(days)} day${Math.abs(days)===1?'':'s'} overdue` };
  if (days <= 7) return { state: WINDOWS.DUE_7, days, reason: `${days} day${days===1?'':'s'} away` };
  if (days <= 30) return { state: WINDOWS.DUE_30, days, reason: `${days} days away` };
  if (days <= 60) return { state: WINDOWS.DUE_60, days, reason: `${days} days away` };
  return { state: WINDOWS.LATER, days, reason: `${days} days away` };
}

export function safeCsvCell(value) {
  let s = value == null ? '' : String(value);
  if (/^[=+\-@]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g,'""')}"`;
}

export function toCsv(records, asOfDate) {
  const headers = ['vendor','renewal_date','owner','notes','state','days_remaining','reason'];
  const rows = records.map(r => {
    const c = classifyRenewal(r.renewalDate || '', asOfDate);
    const vals = [r.vendor || '', r.renewalDate || '', r.owner || '', r.notes || '', c.state, c.days ?? '', c.reason];
    return vals.map(safeCsvCell).join(',');
  });
  return [headers.map(safeCsvCell).join(','), ...rows].join('\r\n') + '\r\n';
}

export function sortRecords(records, asOfDate) {
  const priority = {OVERDUE:0,DUE_7:1,DUE_30:2,DUE_60:3,REVIEW:4,LATER:5};
  return records.map((r,i)=>({r,i,c:classifyRenewal(r.renewalDate||'',asOfDate)}))
    .sort((a,b)=> priority[a.c.state]-priority[b.c.state] || ((a.c.days??1e9)-(b.c.days??1e9)) || a.i-b.i)
    .map(x=>x.r);
}
