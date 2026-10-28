'use client';
import {useState} from 'react';import {useRouter} from 'next/navigation';import {stars} from '../../ui';import PopPick from '../../popcorn-pick';
export default function ReviewItem({r,mine}){
 const rt=useRouter();const [ed,setEd]=useState(false);const [n,setN]=useState(r.rating);const [c,setC]=useState(r.comment);const [busy,setBusy]=useState(false);const [open,setOpen]=useState(false);const long=r.comment.length>150;
 const call=async(m,b)=>{setBusy(true);const x=await fetch('/api/review',{method:m,headers:{'Content-Type':'application/json'},body:JSON.stringify({id:r.id,...b})});
  setBusy(false);if(!x.ok)return alert('Operazione non riuscita.');setEd(false);rt.refresh()};
 if(ed)return <article className="rev rf"><PopPick v={n} set={setN}/>
  <textarea value={c} onChange={e=>setC(e.target.value)} rows={3} maxLength={500}/>
  <div className="btns"><button disabled={busy||!c.trim()} className="btn p" onClick={()=>call('PATCH',{rating:n,comment:c})}>Salva</button>
   <button className="btn" onClick={()=>{setEd(false);setN(r.rating);setC(r.comment)}}>Annulla</button></div></article>;
 return <article className="rev"><div><span className="stars">{stars(r.rating)}</span> <b>{r.author}</b><p className={long&&!open?'clamp':''}>{r.comment}</p>
  {long&&<button className="more" onClick={()=>setOpen(!open)}>{open?'Mostra meno':'Leggi tutto'}</button>}
  {mine&&<div className="btns"><button className="btn" onClick={()=>setEd(true)}>Modifica</button>
   <button disabled={busy} className="btn" onClick={()=>confirm('Eliminare questa recensione?')&&call('DELETE',{})}>Elimina</button></div>}</div></article>;
}
