'use client';
import {useState} from 'react';import {useRouter} from 'next/navigation';
export default function AddedBy({id,cur,names}){
 const r=useRouter();const [busy,setBusy]=useState(false);
 const opts=cur&&!names.some(n=>n.toLowerCase()===cur.toLowerCase())?[cur,...names]:names;
 const change=async e=>{setBusy(true);
  await fetch('/api/library',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,added_by:e.target.value})});
  setBusy(false);r.refresh()};
 return <label className="addby">Aggiunto da
  <select value={cur} disabled={busy} onChange={change} aria-label="Chi ha aggiunto il film">
   <option value="">— nessuno —</option>{opts.map(n=><option key={n} value={n}>{n}</option>)}</select></label>;
}
