import Link from 'next/link';
export const img=(p,s='w342')=>p?`https://image.tmdb.org/t/p/${s}${p}`:null;
export const stars=n=>'★'.repeat(Math.round(n))+'☆'.repeat(5-Math.round(n));
export function Card({id,title,year,poster,sub}){
 return <Link href={`/film/${id}`} className="card">
  <div className="poster">{poster?<img src={img(poster)} alt={title} loading="lazy"/>:<b>{title}</b>}</div>
  <div className="meta"><strong>{title}</strong>{sub||year}</div></Link>;
}
