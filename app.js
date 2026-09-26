import { classifyRenewal, sortRecords, toCsv } from './logic.mjs';

const BASE_AS_OF = '2026-09-25';
const BASE_DATA = Object.freeze([
  {vendor:'Payroll platform', renewalDate:'2026-09-20', owner:'Operations', notes:'Synthetic example — already past due.'},
  {vendor:'Scheduling software', renewalDate:'2026-09-30', owner:'Office Manager', notes:'Review this week.'},
  {vendor:'CRM subscription', renewalDate:'2026-10-18', owner:'Sales Ops', notes:'Check seat count before renewal.'},
  {vendor:'Cloud storage', renewalDate:'2026-11-15', owner:'IT Lead', notes:'Confirm current usage.'},
  {vendor:'Insurance broker portal', renewalDate:'2027-01-15', owner:'Finance', notes:'Later renewal.'},
  {vendor:'Facilities service', renewalDate:'', owner:'Operations', notes:'Date missing — requires review.'}
]);

let records = BASE_DATA.map(x=>({...x}));
const $ = id => document.getElementById(id);
const asOf = $('asOf');
const filter = $('filter');
const tbody = $('rows');
const summary = $('summary');
const addForm = $('addForm');

function textCell(text, className='') {
  const td=document.createElement('td'); td.textContent=text; if(className) td.className=className; return td;
}

function render(){
  const date = asOf.value || BASE_AS_OF;
  const selected = filter.value;
  const sorted = sortRecords(records,date);
  tbody.textContent='';
  const counts={};
  for(const rec of sorted){
    const c=classifyRenewal(rec.renewalDate||'',date); counts[c.state]=(counts[c.state]||0)+1;
    if(selected!=='ALL' && selected!==c.state) continue;
    const tr=document.createElement('tr');
    tr.dataset.state=c.state;
    tr.append(
      textCell(rec.vendor||'—'), textCell(rec.owner||'REVIEW','owner'), textCell(rec.renewalDate||'Missing'),
      textCell(c.days==null?'—':String(c.days)), textCell(c.state,'state'), textCell(c.reason), textCell(rec.notes||'')
    );
    tbody.appendChild(tr);
  }
  const visible=tbody.children.length;
  summary.textContent=`${visible} visible · ${records.length} total · As of ${date}`;
}

asOf.value=BASE_AS_OF;
asOf.addEventListener('change',render);
filter.addEventListener('change',render);
$('reset').addEventListener('click',()=>{records=BASE_DATA.map(x=>({...x}));asOf.value=BASE_AS_OF;filter.value='ALL';render();});
$('export').addEventListener('click',()=>{
  const date=asOf.value||BASE_AS_OF;
  const selected=filter.value;
  const visible = sortRecords(records,date).filter(r=>selected==='ALL'||classifyRenewal(r.renewalDate||'',date).state===selected);
  const blob=new Blob([toCsv(visible,date)],{type:'text/csv;charset=utf-8'});
  const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`vendor-renewals-${date}.csv`; a.click(); setTimeout(()=>URL.revokeObjectURL(url),0);
});
addForm.addEventListener('submit',e=>{
  e.preventDefault(); const fd=new FormData(addForm);
  records.push({vendor:String(fd.get('vendor')||'').trim(),renewalDate:String(fd.get('renewalDate')||''),owner:String(fd.get('owner')||'').trim(),notes:String(fd.get('notes')||'').trim()});
  addForm.reset(); filter.value='ALL'; render();
});
render();
