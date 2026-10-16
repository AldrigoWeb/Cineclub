import {db} from '../lib/db';import {t} from '../lib/tmdb';import {Card,stars} from './ui';import FiltroRegista from './filtro-regista';import {runtimes,sum} from '../lib/stats';
export const dynamic='force-dynamic';
export default async function Home({searchParams}){
 const reg=(await searchParams).regista||'';
 const [{data:all=[]},{data:rv0=[]}]=await Promise.all([
  db.from('library').select('*').order('added_at',{ascending:false}),
  db.from('reviews').select('*').order('created_at',{ascending:false})]);
 const mins=sum(await runtimes(all.filter(f=>f.status==='seen')));
 const registi=Object.entries(all.reduce((c,f)=>{if(f.director)c[f.director]=(c[f.director]||0)+1;return c},{})).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]));
 const lib=reg?all.filter(f=>f.director===reg):all;
 const ids=new Set(lib.map(f=>f.tmdb_id)),rv=reg?rv0.filter(r=>ids.has(r.tmdb_id)):rv0;
 const avg={},cnt={};rv.forEach(r=>{avg[r.tmdb_id]=(avg[r.tmdb_id]||0)+r.rating;cnt[r.tmdb_id]=(cnt[r.tmdb_id]||0)+1});
 Object.keys(avg).forEach(k=>avg[k]/=cnt[k]);
 const seen=lib.filter(f=>f.status==='seen').sort((a,b)=>(avg[b.tmdb_id]??0)-(avg[a.tmdb_id]??0));
 const want=lib.filter(f=>f.status==='want'),have=new Set(all.map(f=>f.tmdb_id));
 // consigli: raccomandazioni TMDB dei film visti meglio votati, pesate sul voto del gruppo
 const top=seen.slice(0,8).map(s=>({...s,a:avg[s.tmdb_id]??3.5}));
 const lists=reg?[]:await Promise.all(top.map(s=>t(`/movie/${s.tmdb_id}/recommendations`).then(r=>(r.results||[]).slice(0,12).map(m=>({m,s})))));
 const sc=new Map();
 lists.flat().forEach(({m,s})=>{if(have.has(m.id)||!m.poster_path)return;
  const o=sc.get(m.id)||{m,v:0,why:s};o.v+=Math.max(.3,s.a-2.5)+m.vote_average/10;sc.set(m.id,o)});
 const recs=[...sc.values()].sort((a,b)=>b.v-a.v).slice(0,12);
 const byId=Object.fromEntries(lib.map(f=>[f.tmdb_id,f]));
 return <>
  <div className="stats">{[[all.filter(f=>f.status==='seen').length,'Film visti'],[`${Math.floor(mins/60)} h`,'Ore di cinema'],[rv0.length,'Recensioni'],[all.filter(f=>f.status==='want').length,'Da vedere'],[registi.length,'Registi']].map(([v,l])=><div className="stat" key={l}><b>{v}</b><span>{l}</span></div>)}</div>
  <div className="row"><h2>{reg?`Film di ${reg}`:'Filtra per regista'}</h2><div style={{display:'flex',gap:10,alignItems:'center'}}>{registi.length>0&&<FiltroRegista registi={registi} sel={reg}/>}{reg&&<a href="/" className="btn">Tutti i film</a>}</div></div>
  {!reg&&<>
  <div className="row"><h2>Da guardare dopo</h2><span>Simili ai film che avete amato di più</span></div>
  {recs.length?<div className="grid">{recs.map(({m,why})=><Card key={m.id} id={m.id} title={m.title} year={(m.release_date||'').slice(0,4)} poster={m.poster_path} sub={<div className="why">Perché avete visto {why.title}</div>}/>)}</div>
   :<div className="empty">Cerca un film qui sopra e segnalo come visto: i consigli arrivano da lì.</div>}</>}
  <div className="row"><h2>In lista</h2><span>{want.length} da vedere</span></div>
  {want.length?<div className="grid">{want.map(f=><Card key={f.tmdb_id} id={f.tmdb_id} title={f.title} year={f.year} poster={f.poster}/>)}</div>:<div className="empty">Aggiungi un film alla libreria e comparirà qui.</div>}
  <div className="row"><h2>La nostra libreria</h2><span>{seen.length} film visti</span></div>
  {seen.length?<div className="grid">{seen.map(f=><Card key={f.tmdb_id} id={f.tmdb_id} title={f.title} year={f.year} poster={f.poster}
   sub={avg[f.tmdb_id]!=null?<><span className="stars">{stars(avg[f.tmdb_id])}</span> {avg[f.tmdb_id].toFixed(1)}</>:f.year}/>)}</div>:<div className="empty">Nessun film visto per ora.</div>}
  <div className="row"><h2>Tutte le recensioni</h2><span>{rv.length} recensioni</span></div>
  <div className="feed">{rv.map(r=>{const f=byId[r.tmdb_id];return <article className="rev" key={r.id}>
   <div><a href={`/film/${r.tmdb_id}`}><h3>{f?.title||'Film'}</h3></a><span className="stars">{stars(r.rating)}</span>
   <p>{r.comment}</p><small>{r.author}, {new Date(r.created_at).toLocaleDateString('it-IT',{day:'numeric',month:'long',year:'numeric'})}</small></div></article>})}</div>
 </>;
}
