'use client';
import {useState,useEffect} from 'react';import Link from 'next/link';
export default function Search(){
 const [q,setQ]=useState('');const [r,setR]=useState([]);
 useEffect(()=>{const h=setTimeout(async()=>{
  try{setR(q.length<2?[]:await (await fetch('/api/search?q='+encodeURIComponent(q))).json())}catch{setR([])}},300);return()=>clearTimeout(h)},[q]);
 return <div className="search"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cerca un film in tutto l'archivio TMDB" aria-label="Cerca film"/>
  {r.length>0&&<ul>{r.map(m=><li key={m.id}><Link href={`/film/${m.id}`} onClick={()=>setQ('')}>
   {m.poster?<img src={`https://image.tmdb.org/t/p/w92${m.poster}`} alt=""/>:<i/>}<span>{m.title} <small>{m.year}</small></span></Link></li>)}</ul>}</div>;
}
