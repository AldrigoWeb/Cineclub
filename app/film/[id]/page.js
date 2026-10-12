import {db} from '../../../lib/db';import {t} from '../../../lib/tmdb';import {Card,img,stars} from '../../ui';import Actions from './actions';
export const dynamic='force-dynamic';
export default async function Film({params}){
 const {id}=await params;
 const m=await t(`/movie/${id}`,{append_to_response:'credits,recommendations'});
 const [{data:l},{data:rv=[]}]=await Promise.all([
  db.from('library').select('status').eq('tmdb_id',id).maybeSingle(),
  db.from('reviews').select('*').eq('tmdb_id',id).order('created_at',{ascending:false})]);
 if(!m.title)return <div className="empty">Film non trovato.</div>;
 const dir=m.credits?.crew?.find(c=>c.job==='Director')?.name;
 const cast=(m.credits?.cast||[]).slice(0,6).map(c=>c.name).join(', ');
 const a=rv.length?rv.reduce((s,x)=>s+x.rating,0)/rv.length:null;
 const sim=(m.recommendations?.results||[]).filter(x=>x.poster_path).slice(0,6);
 return <>
  {m.backdrop_path&&<div className="hero" style={{backgroundImage:`url(${img(m.backdrop_path,'w1280')})`}}/>}
  <section className="mh">
   <div className="poster">{m.poster_path?<img src={img(m.poster_path,'w500')} alt={m.title}/>:<b>{m.title}</b>}</div>
   <div><h2>{m.title}</h2>
    <div className="meta">{(m.release_date||'').slice(0,4)}{dir&&`, di ${dir}`}{m.runtime?`, ${m.runtime} min`:''}<br/>{(m.genres||[]).map(g=>g.name).join(', ')}</div>
    {a!=null&&<p><span className="stars">{stars(a)}</span> {a.toFixed(1)} su {rv.length} voti del gruppo</p>}
    {m.tagline&&<p><i>{m.tagline}</i></p>}<p>{m.overview||'Trama non disponibile in italiano.'}</p>
    {cast&&<p className="meta">Cast: {cast}</p>}
    <Actions id={+id} status={l?.status||null}/></div></section>
  <div className="row"><h2>Recensioni ({rv.length})</h2></div>
  {rv.length?<div className="feed">{rv.map(r=><article className="rev" key={r.id}><div><span className="stars">{stars(r.rating)}</span> <b>{r.author}</b><p>{r.comment}</p></div></article>)}</div>:<div className="empty">Ancora nessuna recensione. Scrivi la prima.</div>}
  {sim.length>0&&<><div className="row"><h2>Se ti è piaciuto, guarda anche</h2></div>
   <div className="grid">{sim.map(x=><Card key={x.id} id={x.id} title={x.title} year={(x.release_date||'').slice(0,4)} poster={x.poster_path}/>)}</div></>}
 </>;
}
