'use client';
import {useState} from 'react';import ReviewItem from './review-item';
const FIRST=4,STEP=6;
export default function ReviewList({items}){
 const [n,setN]=useState(FIRST);
 // le tue recensioni per prime (l'ordine tra le altre resta dalla più recente)
 const all=[...items.filter(x=>x.mine),...items.filter(x=>!x.mine)];
 const shown=all.slice(0,n),left=all.length-shown.length;
 return <>
  <div className="feed rl">{shown.map(({r,mine})=><ReviewItem key={r.id} r={r} mine={mine}/>)}</div>
  {(left>0||n>FIRST)&&<div className="btns" style={{justifyContent:'center',marginTop:14}}>
   {left>0&&<button className="btn" onClick={()=>setN(n+STEP)}>Mostra altre {Math.min(STEP,left)} recensioni{left>STEP?` (ne restano ${left})`:''}</button>}
   {n>FIRST&&<button className="btn" onClick={()=>setN(FIRST)}>Comprimi</button>}</div>}
 </>;
}
