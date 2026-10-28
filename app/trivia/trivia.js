'use client';
import {useEffect,useState} from 'react';import Link from 'next/link';import {img} from '../ui';
import './trivia.css';
export default function Trivia({qs,week,posters={}}){
 const k='trivia-'+week;const [a,setA]=useState({});
 useEffect(()=>{try{setA(JSON.parse(localStorage.getItem(k)||'{}'))}catch{}},[k]);
 const pick=(id,i)=>{if(a[id]!==undefined)return;const n={...a,[id]:i};setA(n);try{localStorage.setItem(k,JSON.stringify(n))}catch{}};
 const done=qs.filter(q=>a[q.id]!==undefined).length,ok=qs.filter(q=>a[q.id]===q.correct).length;
 const pct=qs.length?done/qs.length*100:0;
 return <div className="tr">
  <header className="trh">
   <div><small>Questa settimana</small><h2>Trivia del cineclub</h2></div>
   <div className="score"><b>{ok}</b><span>/{qs.length}</span></div>
  </header>
  <div className="trbar"><i style={{width:pct+'%'}}/></div>
  <p className="trsub">{done===qs.length?`Finito: ${ok} su ${qs.length} indovinate`:done?`${done} di ${qs.length} risposte`:'Tre domande, zero pressione.'}</p>
  <ol className="trl">{qs.map((q,n)=>{const s=a[q.id],ans=s!==undefined,p=posters[q.film_id];
   return <li key={q.id} className="tq2">
    <div className="tqh">
     {p?<img src={img(p,'w185')} alt=""/>:<span className="tqn">{String(n+1).padStart(2,'0')}</span>}
     <div>
      <small>Domanda {n+1} · <Link href={`/film/${q.film_id}`}>{q.film_title}</Link></small>
      <h3>{q.question}</h3></div></div>
    <div className="tqo">{q.options.map((o,i)=>{const cls=ans?(i===q.correct?' ok':i===s?' ko':' dim'):'';
     return <button key={i} disabled={ans} onClick={()=>pick(q.id,i)} className={'to2'+cls}><span className="L">{'ABCD'[i]}</span>{o}</button>})}</div>
    {ans&&<p className={'trx '+(s===q.correct?'win':'lose')}><b>{s===q.correct?'Esatto!':'Non proprio.'}</b> {q.explanation}</p>}
   </li>})}</ol>
  <p className="trfoot">Le domande le genera un'IA e a volte sbaglia: se una curiosità non torna, fatevi una risata. Nuove domande ogni lunedì.</p>
 </div>;
}
