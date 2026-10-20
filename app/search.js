'use client';
import {useState,useEffect} from 'react';import Link from 'next/link';
export default function Search(){
 const [q,setQ]=useState('');const [r,setR]=useState({films:[],people:[]});
 useEffect(()=>{const h=setTimeout(async()=>{
  try{if(q.length<2)return setR({films:[],people:[]});
   const d=await (await fetch('/api/search?q='+encodeURIComponent(q))).json();setR(Array.isArray(d)?{films:d,people:[]}:d)}catch{setR({films:[],people:[]})}},300);return()=>clearTimeout(h)},[q]);
 const any=r.films.length>0||r.people.length>0;
 return <div className="search"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Cerca un film, un attore o un regista" aria-label="Cerca film, attori e registi"/>
  {any&&<ul>{r.films.map(m=><li key={m.id}><Link href={`/film/${m.id}`} onClick={()=>setQ('')}>
   {m.poster?<img src={`https://image.tmdb.org/t/p/w92${m.poster}`} alt=""/>:<i/>}<span>{m.title} <small>{m.year}</small></span></Link></li>)}
   {r.people.length>0&&<li className="sh">Persone</li>}
   {r.people.map(p=><li key={'p'+p.id}><Link href={`/persona/${p.id}`} onClick={()=>setQ('')}>
    {p.photo?<img className="pf" src={`https://image.tmdb.org/t/p/w92${p.photo}`} alt=""/>:<i className="pf"/>}
    <span>{p.name}<small className="pd">{p.dept}{p.known.length>0&&` · ${p.known.join(', ')}`}</small></span></Link></li>)}</ul>}</div>;
}
