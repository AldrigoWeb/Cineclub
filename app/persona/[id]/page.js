import {t} from '../../../lib/tmdb';import {db} from '../../../lib/db';import {Card,img} from '../../ui';import {filmsOf} from '../../../lib/persone';
export const dynamic='force-dynamic';
export default async function Persona({params}){
 const {id}=await params;
 const [p,c,{data:lib}]=await Promise.all([t(`/person/${Number(id)}`),t(`/person/${Number(id)}/movie_credits`),db.from('library').select('tmdb_id,status')]);
 if(!p.name)return <div className="empty">Persona non trovata.</div>;
 const st=Object.fromEntries((lib||[]).map(l=>[l.tmdb_id,l.status]));
 const secs=[['Come attore',filmsOf(c,'actor',false)],['Come regista',filmsOf(c,'director')]];
 if(p.known_for_department==='Directing')secs.reverse();
 const bio=(p.biography||'').trim();
 return <>
  <section className="pp">
   <div className="poster">{p.profile_path?<img src={img(p.profile_path,'w342')} alt={p.name}/>:<b>{p.name}</b>}</div>
   <div><h2>{p.name}</h2>
    <div className="meta">{[p.birthday&&`nato nel ${p.birthday.slice(0,4)}`,p.place_of_birth].filter(Boolean).join(' · ')}</div>
    {bio&&<p>{bio.length>420?bio.slice(0,420).trimEnd()+'…':bio}</p>}</div></section>
  {secs.every(([,f])=>!f.length)&&<div className="empty">Nessun film trovato per {p.name}.</div>}
  {secs.filter(([,f])=>f.length).map(([title,f])=><div key={title}>
   <div className="row"><h2>{title}</h2><span>{f.length} film</span></div>
   <div className="grid">{f.map(x=><Card key={x.tmdb_id} id={x.tmdb_id} title={x.title} poster={x.poster}
    sub={<>{[x.year,x.role].filter(Boolean).join(' · ')}{st[x.tmdb_id]&&<div className="why">{st[x.tmdb_id]==='seen'?'✓ Visto da voi':'In lista'}</div>}</>}/>)}</div></div>)}
 </>;
}
