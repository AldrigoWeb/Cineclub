'use client';
import {useEffect,useState} from 'react';import Link from 'next/link';
import './trivia.css';
export default function Trivia({qs,week}){
 const k='trivia-'+week;const [a,setA]=useState({});
 useEffect(()=>{try{setA(JSON.parse(localStorage.getItem(k)||'{}'))}catch{}},[k]);
 const pick=(id,i)=>{if(a[id]!==undefined)return;const n={...a,[id]:i};setA(n);try{localStorage.setItem(k,JSON.stringify(n))}catch{}};
 const done=qs.filter(q=>a[q.id]!==undefined).length,ok=qs.filter(q=>a[q.id]===q.correct).length;
 return <>
  <div className="row"><h2>Trivia della settimana</h2><span>{done===qs.length?`Hai indovinato ${ok} su ${qs.length}`:`${done} di ${qs.length} risposte`}</span></div>
  <div className="tv">{qs.map((q,n)=>{const s=a[q.id],ans=s!==undefined;
   return <section key={q.id} className="rf tq">
    <small>Domanda {n+1} · <Link href={`/film/${q.film_id}`} style={{textDecoration:'underline'}}>{q.film_title}</Link></small>
    <h3>{q.question}</h3>
    <div className="to">{q.options.map((o,i)=>
     <button key={i} disabled={ans} onClick={()=>pick(q.id,i)}
      className={'btn top'+(ans&&i===q.correct?' ok':'')+(ans&&i===s&&i!==q.correct?' ko':'')}>{o}</button>)}</div>
    {ans&&<p className="tx"><b>{s===q.correct?'Esatto!':'Non proprio.'}</b> {q.explanation}</p>}
   </section>})}</div>
  <p className="rinfo">Le domande sono generate da un'IA e a volte sbaglia: se una curiosità non torna, fatevi una risata. Nuove domande ogni lunedì.</p>
 </>;
}
