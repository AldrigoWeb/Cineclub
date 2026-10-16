'use client';
import {useEffect,useRef,useState} from 'react';import Link from 'next/link';import {img} from '../ui';
const HUE=[345,40,175,265,210,320];
export default function Wrapped({slides}){
 const [i,setI]=useState(0);const x0=useRef(0);const n=slides.length;
 const go=d=>setI(v=>Math.min(n-1,Math.max(0,v+d)));
 useEffect(()=>{const k=e=>{if(e.key==='ArrowRight')go(1);if(e.key==='ArrowLeft')go(-1)};
  addEventListener('keydown',k);return()=>removeEventListener('keydown',k)},[n]);
 const s=slides[i];
 return <div className="wr" style={{'--h':HUE[i%HUE.length]}}
  onTouchStart={e=>{x0.current=e.touches[0].clientX}}
  onTouchEnd={e=>{const d=e.changedTouches[0].clientX-x0.current;if(Math.abs(d)>50)go(d<0?1:-1)}}>
  <div className="wbar">{slides.map((_,j)=><span key={j} className={j<=i?'on':''}/>)}</div>
  <Link href="/" className="wx" aria-label="Chiudi">✕</Link>
  <button className="wz l" onClick={()=>go(-1)} aria-label="Indietro"/>
  <button className="wz r" onClick={()=>go(1)} aria-label="Avanti"/>
  <div className="ws" key={i}>
   <small>{s.c}</small>
   {s.p&&<div className="poster wp"><img src={img(s.p,'w500')} alt=""/></div>}
   {s.av&&<span className="av wa" style={{background:s.av.color}}>{s.av.emoji}</span>}
   {s.av&&<div className="wn">{s.av.name}</div>}
   <h2>{s.t}</h2>
   {s.q&&<blockquote>“{s.q}”</blockquote>}
   {s.s&&<p>{s.s}</p>}
   {i===n-1&&<Link href="/" className="btn p">Torna alla home</Link>}
  </div></div>;
}
