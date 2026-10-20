import {t} from '../../../lib/tmdb';import {filmsOf} from '../../../lib/persone';
// ?q=nome[&role=actor]  -> cerca registi (o attori) su TMDB   |   ?id=123[&role=actor] -> i suoi film
export async function GET(req){
 const p=new URL(req.url).searchParams,id=Number(p.get('id')),q=(p.get('q')||'').trim(),role=p.get('role')==='actor'?'actor':'director';
 if(id)return Response.json({films:filmsOf(await t(`/person/${id}/movie_credits`),role)});
 if(q.length<2)return Response.json({people:[]});
 const r=await t('/search/person',{query:q}),dept=role==='actor'?'Acting':'Directing';
 const people=(r.results||[]).filter(x=>x.known_for_department===dept).slice(0,6)
  .map(x=>({id:x.id,name:x.name,known:(x.known_for||[]).map(k=>k.title||k.name).filter(Boolean).slice(0,3)}));
 return Response.json({people});
}
