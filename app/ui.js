import Link from 'next/link';
import './popcorn.css';
export const img=(p,s='w342')=>p?`https://image.tmdb.org/t/p/${s}${p}`:null;
// popcorn pieni = 1 punto, popcorn vuoto = mezzo punto (arrotondato al mezzo)
export function Pop({v}){
 const r=Math.round(v*2)/2,f=Math.floor(r),half=r-f>=.5;
 return <span className="pop" aria-label={`${r} su 5 popcorn`}>{Array.from({length:f},(_,i)=><span key={i} className="pf">🍿</span>)}{half&&<span className="pe">🍿</span>}</span>;
}
export const stars=n=><Pop v={n}/>;
export function Card({id,title,year,poster,sub}){
 return <Link href={`/film/${id}`} className="card">
  <div className="poster">{poster?<img src={img(poster)} alt={title} loading="lazy"/>:<b>{title}</b>}</div>
  <div className="meta"><strong>{title}</strong>{sub||year}</div></Link>;
}
