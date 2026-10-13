'use client';
import {useState} from 'react';import {useRouter} from 'next/navigation';
const send=(u,b)=>fetch(u,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)});
export default function Actions({id,status}){
 const r=useRouter();const [n,setN]=useState(0);const [busy,setBusy]=useState(false);
 const set=async s=>{setBusy(true);await send('/api/library',{id,status:s});setBusy(false);r.refresh()};
 const submit=async e=>{e.preventDefault();if(!n)return alert('Scegli un voto da 1 a 5 stelle.');
  const f=e.target;setBusy(true);
  await send('/api/library',{id,status:'seen'});
  await send('/api/review',{id,rating:n,comment:f.c.value});
  f.reset();setN(0);setBusy(false);r.refresh()};
 return <>
  <div className="btns">
   <button disabled={busy} className={'btn '+(status==='want'?'on':'p')} onClick={()=>set('want')}>{status==='want'?'In lista ✓':'Aggiungi alla libreria'}</button>
   <button disabled={busy} className={'btn '+(status==='seen'?'on':'')} onClick={()=>set('seen')}>{status==='seen'?'Visto ✓':'Segna come visto'}</button>
   {status&&<button disabled={busy} className="btn" onClick={()=>set('none')}>Rimuovi</button>}</div>
  <form onSubmit={submit} className="rf"><b>Scrivi la tua recensione</b>
   <div className="pick">{[1,2,3,4,5].map(i=><button type="button" key={i} aria-label={i+' stelle'} className={i<=n?'on':''} onClick={()=>setN(i)}>★</button>)}</div>
   <textarea name="c" rows={3} placeholder="Cosa ne pensi?" required maxLength={500}/>
   <button disabled={busy} className="btn p">Pubblica recensione</button></form></>;
}
