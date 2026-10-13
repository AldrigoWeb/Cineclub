'use client';
import {useRouter} from 'next/navigation';
export default function FiltroRegista({registi,sel}){
 const r=useRouter();
 return <select value={sel||''} onChange={e=>r.push(e.target.value?`/?regista=${encodeURIComponent(e.target.value)}`:'/')} aria-label="Filtra per regista" style={{maxWidth:300}}>
  <option value="">Tutti i registi</option>
  {registi.map(([n,c])=><option key={n} value={n}>{n} ({c})</option>)}</select>;
}
