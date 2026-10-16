'use client';
import {useMemo,useRef,useState} from 'react';import Link from 'next/link';import {img} from '../ui';
import './ruota.css';
const MAX=12,SPIN_MS=4800;
const COL=['#a3243f','#c98a1b','#2b7a78','#5b4bb7','#2e6fba','#b8528c'],ALT='#3f8f4f';
// mescolata con seme: stessa sequenza su server e browser (niente errori di idratazione)
const rng=s=>()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const pick=(a,seed,n)=>{const r=[...a],f=rng(seed);for(let i=r.length-1;i>0;i--){const j=Math.floor(f()*(i+1));[r[i],r[j]]=[r[j],r[i]]}return r.slice(0,n)};
const P=(deg,r)=>{const a=deg*Math.PI/180;return [(r*Math.sin(a)).toFixed(2),(-r*Math.cos(a)).toFixed(2)]};
const cut=(s,n)=>s.length>n?s.slice(0,n-1).trimEnd()+'…':s;
function Wheel({items,rot,spinning}){
 const n=items.length,step=360/n,fs=n<=6?9:n<=9?7.5:6.2,mx=n<=6?18:n<=9?15:13;
 return <svg viewBox="-100 -100 200 200" className="rw" style={{transform:`rotate(${rot}deg)`,transition:spinning?`transform ${SPIN_MS}ms cubic-bezier(.12,.65,.08,1)`:'none'}}>
  <circle r="98" fill="#25141c" stroke="#f0c05a" strokeWidth="2"/>
  {items.map((f,i)=>{const a0=i*step,a1=(i+1)*step,[x0,y0]=P(a0,94),[x1,y1]=P(a1,94);
   const fill=(n%6===1&&i===n-1)?ALT:COL[i%6];
   return <g key={f.tmdb_id}><path d={`M0 0L${x0} ${y0}A94 94 0 0 1 ${x1} ${y1}Z`} fill={fill} stroke="#180d12" strokeWidth="1"/>
    <text transform={`rotate(${a0+step/2-90})`} x="88" y="0" textAnchor="end" dominantBaseline="central" fontSize={fs} fill="#fff" fontWeight="600">{cut(f.title,mx)}</text></g>})}
  <circle r="9" fill="#f0c05a" stroke="#180d12" strokeWidth="2"/>
 </svg>;
}
export default function Ruota({films}){
 const [src,setSrc]=useState('want');const [mode,setMode]=useState('none');const [val,setVal]=useState('');
 const [seed,setSeed]=useState(1);const [rot,setRot]=useState(0);const [spinning,setSpinning]=useState(false);const [res,setRes]=useState(null);
 const [q,setQ]=useState('');const [people,setPeople]=useState([]);const [ext,setExt]=useState(null);
 const [hideSeen,setHideSeen]=useState(true);const [busy,setBusy]=useState(false);const [err,setErr]=useState('');
 const timer=useRef(null);
 const seenIds=useMemo(()=>new Set(films.filter(f=>f.status==='seen').map(f=>f.tmdb_id)),[films]);
 const base=useMemo(()=>films.filter(f=>src==='all'||f.status===(src==='want'?'want':'seen')),[films,src]);
 const opts=useMemo(()=>{if(mode!=='director'&&mode!=='genre')return [];const c={};
  base.forEach(f=>(mode==='genre'?f.genres||[]:[f.director].filter(Boolean)).forEach(k=>{c[k]=(c[k]||0)+1}));
  return Object.entries(c).filter(([,k])=>k>=2).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]))},[base,mode]);
 const pool=useMemo(()=>mode==='any'?(ext?ext.films.filter(f=>!hideSeen||!seenIds.has(f.tmdb_id)).map(f=>({...f,director:ext.name})):[])
  :mode==='none'?base:val===''?[]:base.filter(f=>mode==='genre'?(f.genres||[]).includes(val):f.director===val),[base,mode,val,ext,hideSeen,seenIds]);
 const items=useMemo(()=>pick(pool,seed,MAX),[pool,seed]);
 const ready=items.length>=2&&!spinning;
 const reset=fn=>{if(spinning)return;fn();setRes(null)};
 const search=async e=>{e.preventDefault();if(q.trim().length<2||busy)return;setBusy(true);setErr('');setPeople([]);
  try{const r=await fetch('/api/regista?q='+encodeURIComponent(q.trim())).then(x=>x.json());setPeople(r.people||[]);if(!(r.people||[]).length)setErr('Nessun regista trovato.')}
  catch{setErr('Ricerca non riuscita, riprova.')}setBusy(false)};
 const choose=async p=>{if(spinning)return;setBusy(true);setErr('');setRes(null);
  try{const r=await fetch('/api/regista?id='+p.id).then(x=>x.json());setExt({name:p.name,films:r.films||[]});setPeople([]);setSeed(Math.floor(Math.random()*1e9)+2)}
  catch{setErr('Non riesco a caricare i suoi film.')}setBusy(false)};
 const spin=()=>{
  const w=Math.floor(Math.random()*items.length),step=360/items.length,jit=(Math.random()-.5)*.7;
  const want=((360-(w+.5+jit)*step)%360+360)%360,cur=((rot%360)+360)%360;
  const delta=((want-cur)%360+360)%360+360*(5+Math.floor(Math.random()*3));
  setRes(null);setSpinning(true);setRot(rot+delta);
  clearTimeout(timer.current);timer.current=setTimeout(()=>{setSpinning(false);setRes(items[w])},SPIN_MS+150);
 };
 return <>
  <div className="row"><h2>La ruota</h2><span>Lasciamo scegliere al caso</span></div>
  {mode!=='any'&&<div className="rseg"><span>Pesca da</span>{[['want','Da vedere'],['seen','Già visti'],['all','Tutti']].map(([k,l])=>
   <button key={k} className={'btn'+(src===k?' on':'')} onClick={()=>reset(()=>{setSrc(k);setVal('')})}>{l}</button>)}</div>}
  <div className="rseg"><span>Filtra per</span>{[['none','Niente'],['director','Regista'],['genre','Genere'],['any','Regista a scelta']].map(([k,l])=>
   <button key={k} className={'btn'+(mode===k?' on':'')} onClick={()=>reset(()=>{setMode(k);setVal('')})}>{l}</button>)}</div>
  {(mode==='director'||mode==='genre')&&(opts.length?<select value={val} onChange={e=>reset(()=>setVal(e.target.value))} aria-label="Filtro" className="rsel">
    <option value="">{mode==='genre'?'Scegli un genere…':'Scegli un regista…'}</option>
    {opts.map(([k,n])=><option key={k} value={k}>{k} ({n})</option>)}</select>
   :<div className="empty">Non ci sono {mode==='genre'?'generi':'registi'} con almeno 2 film in questa selezione.</div>)}
  {mode==='any'&&<div className="rany">
   <form onSubmit={search}><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Scrivi un regista, es. Nolan" aria-label="Cerca regista"/>
    <button className="btn p" disabled={busy||q.trim().length<2}>{busy?'…':'Cerca'}</button></form>
   {err&&<p className="err">{err}</p>}
   {people.length>0&&<div className="rpeople">{people.map(p=><button key={p.id} className="btn" onClick={()=>choose(p)}>{p.name}{p.known.length>0&&<small>{p.known.join(', ')}</small>}</button>)}</div>}
   {ext&&<label className="rchk"><input type="checkbox" checked={hideSeen} onChange={e=>reset(()=>setHideSeen(e.target.checked))}/> Escludi i film già visti da voi</label>}</div>}
  {items.length>=2?<div className="rwrap"><div className="rptr">▼</div><Wheel items={items} rot={rot} spinning={spinning}/></div>
   :<div className="empty">{mode==='any'&&!ext?'Cerca un regista qui sopra per riempire la ruota con i suoi film.':pool.length===1?'Con un solo film non serve la ruota: ':'Servono almeno 2 film per far girare la ruota. '}{pool.length===1&&<Link href={`/film/${pool[0].tmdb_id}`} style={{textDecoration:'underline'}}>{pool[0].title}</Link>}</div>}
  <div className="rinfo">{mode==='any'&&ext?`Film di ${ext.name}: `:''}{pool.length} film in gara{pool.length>MAX?`, ne ho estratti ${MAX} a caso`:''}</div>
  <div className="btns" style={{justifyContent:'center'}}>
   <button className="btn p" disabled={!ready} onClick={spin}>{spinning?'Gira…':res?'Gira ancora':'Gira la ruota'}</button>
   {pool.length>MAX&&<button className="btn" disabled={spinning} onClick={()=>reset(()=>setSeed(Math.floor(Math.random()*1e9)+2))}>Rimescola</button>}</div>
  {res&&<div className="rwin"><small>Stasera si guarda</small>
   <Link href={`/film/${res.tmdb_id}`} className="card"><div className="poster">{res.poster?<img src={img(res.poster)} alt={res.title}/>:<b>{res.title}</b>}</div>
    <div className="meta"><strong>{res.title}</strong>{[res.year,res.director].filter(Boolean).join(' · ')}</div></Link></div>}
 </>;
}
