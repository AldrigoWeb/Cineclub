'use client';
import './popcorn.css';
// selettore voto: ogni popcorn ha la metà sinistra (mezzo) e la destra (intero)
export default function PopPick({v,set}){
 const slot=i=>v>=i?'pf':v===i-.5?'pe':'off';
 return <div className="popick">{[1,2,3,4,5].map(i=><span key={i} className={'pk2 '+slot(i)}>🍿
  <button type="button" className="hl" aria-label={(i-.5)+' popcorn'} onClick={()=>set(i-.5)}/>
  <button type="button" className="hr" aria-label={i+' popcorn'} onClick={()=>set(i)}/></span>)}
  {v>0&&<small className="pv">{v} su 5</small>}</div>;
}
