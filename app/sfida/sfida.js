'use client';
import {useMemo,useState} from 'react';import Link from 'next/link';import {img} from '../ui';
import './sfida.css';
const shuffle=a=>{const r=[...a];for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]]}return r};
function Film({f}){return <><div className="poster">{f.poster?<img src={img(f.poster)} alt={f.title}/>:<b>{f.title}</b>}</div>
 <div className="meta"><strong>{f.title}</strong>{[f.year,f.director].filter(Boolean).join(' · ')}</div></>}
export default function Sfida({films}){
 const [mode,setMode]=useState('all');const [val,setVal]=useState('');const [g,setG]=useState(null);
 const opts=useMemo(()=>{const c={};
  films.forEach(f=>(mode==='genre'?f.genres||[]:[f.director].filter(Boolean)).forEach(k=>{c[k]=(c[k]||0)+1}));
  return Object.entries(c).filter(([,n])=>n>=2).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]))},[films,mode]);
 const pool=useMemo(()=>mode==='all'?films:films.filter(f=>mode==='genre'?(f.genres||[]).includes(val):f.director===val),[films,mode,val]);
 const ready=pool.length>=2&&(mode==='all'||val!=='');
 const change=m=>{setMode(m);setVal('')};
 const start=()=>{const [a,b,...q]=shuffle(pool);setG({champ:a,chal:b,q,total:pool.length-1,n:1,flip:Math.random()<.5,done:false})};
 const pick=w=>setG(s=>s.q.length?{...s,champ:w,chal:s.q[0],q:s.q.slice(1),n:s.n+1,flip:Math.random()<.5}:{...s,champ:w,done:true});
 if(g&&g.done)return <>
  <div className="row"><h2>Il vincitore</h2><span>{g.total+1} film a confronto</span></div>
  <div className="win"><Link href={`/film/${g.champ.tmdb_id}`} className="card"><Film f={g.champ}/></Link>
   <div className="btns" style={{justifyContent:'center'}}><button className="btn p" onClick={start}>Rigioca</button><button className="btn" onClick={()=>setG(null)}>Cambia filtro</button></div></div></>;
 if(g){const pair=g.flip?[g.chal,g.champ]:[g.champ,g.chal];return <>
  <div className="row"><h2>Quale preferisci?</h2><span>Sfida {g.n} di {g.total}</span></div>
  <div className="duel">{pair.map(f=><button key={f.tmdb_id} className="opt" onClick={()=>pick(f)}><Film f={f}/></button>)}</div>
  <div className="prog"><button className="btn" onClick={()=>setG(null)}>Esci</button></div></>}
 return <>
  <div className="row"><h2>UwUFUFU</h2><span>Sfida tra film · {films.length} film visti</span></div>
  <p className="prog" style={{textAlign:'left'}}>Due film alla volta: scegli il tuo preferito, resta in gara e sfida il successivo, fino al vincitore.</p>
  <div className="seg">{[['all','Tutti'],['genre','Per genere'],['director','Per regista']].map(([k,l])=>
   <button key={k} className={'btn'+(mode===k?' on':'')} onClick={()=>change(k)}>{l}</button>)}</div>
  <div className="cfg">
   {mode!=='all'&&(opts.length?<select value={val} onChange={e=>setVal(e.target.value)} aria-label="Filtro">
     <option value="">{mode==='genre'?'Scegli un genere…':'Scegli un regista…'}</option>
     {opts.map(([k,n])=><option key={k} value={k}>{k} ({n})</option>)}</select>
    :<div className="empty">Non ci sono ancora {mode==='genre'?'generi':'registi'} con almeno 2 film visti.</div>)}
   <div className="prog" style={{textAlign:'left'}}>{pool.length} film in gara</div>
   <button className="btn p" disabled={!ready} onClick={start}>Inizia la sfida</button>
  </div></>;
}
