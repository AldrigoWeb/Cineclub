import {t} from '../../../lib/tmdb';
// ?q=nome  -> cerca registi su TMDB   |   ?id=123 -> film diretti da quella persona
export async function GET(req){
 const p=new URL(req.url).searchParams,id=Number(p.get('id')),q=(p.get('q')||'').trim();
 if(id){
  const c=await t(`/person/${id}/movie_credits`),seen=new Set(),oggi=new Date().toISOString().slice(0,10);
  const films=(c.crew||[]).filter(x=>x.job==='Director'&&x.poster_path&&x.release_date&&x.release_date<=oggi&&!seen.has(x.id)&&seen.add(x.id))
   .sort((a,b)=>(b.vote_count||0)-(a.vote_count||0))
   .map(x=>({tmdb_id:x.id,title:x.title,year:+x.release_date.slice(0,4)||null,poster:x.poster_path}));
  return Response.json({films});
 }
 if(q.length<2)return Response.json({people:[]});
 const r=await t('/search/person',{query:q});
 const people=(r.results||[]).filter(x=>x.known_for_department==='Directing').slice(0,6)
  .map(x=>({id:x.id,name:x.name,known:(x.known_for||[]).map(k=>k.title||k.name).filter(Boolean).slice(0,3)}));
 return Response.json({people});
}
