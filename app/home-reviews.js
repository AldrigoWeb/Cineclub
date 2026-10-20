'use client';
import {useState} from 'react';import {stars} from './ui';
const FIRST=6,STEP=8;
function Item({r}){
 const [open,setOpen]=useState(false);const long=r.comment.length>150;
 return <article className="rev"><div><a href={`/film/${r.tmdb_id}`}><h3>{r.title}</h3></a><span className="stars">{stars(r.rating)}</span>
  <p className={long&&!open?'clamp':''}>{r.comment}</p>
  {long&&<button className="more" onClick={()=>setOpen(!open)}>{open?'Mostra meno':'Leggi tutto'}</button>}
  <small>{r.author}, {r.date}</small></div></article>;
}
export default function HomeReviews({items}){
 const [n,setN]=useState(FIRST);const shown=items.slice(0,n),left=items.length-shown.length;
 return <>
  <div className="feed rl">{shown.map(r=><Item key={r.id} r={r}/>)}</div>
  {(left>0||n>FIRST)&&<div className="btns" style={{justifyContent:'center',marginTop:14}}>
   {left>0&&<button className="btn" onClick={()=>setN(n+STEP)}>Mostra altre {Math.min(STEP,left)} recensioni{left>STEP?` (ne restano ${left})`:''}</button>}
   {n>FIRST&&<button className="btn" onClick={()=>setN(FIRST)}>Comprimi</button>}</div>}
 </>;
}
