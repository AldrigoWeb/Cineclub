import {t} from '../../../lib/tmdb';
export async function GET(req){
 const q=new URL(req.url).searchParams.get('q')||'';
 if(q.length<2)return Response.json({films:[],people:[]});
 const [f,p]=await Promise.all([t('/search/movie',{query:q}),t('/search/person',{query:q})]);
 const films=(f.results||[]).slice(0,5).map(m=>({id:m.id,title:m.title,year:(m.release_date||'').slice(0,4),poster:m.poster_path}));
 const people=(p.results||[]).filter(x=>x.known_for_department==='Acting'||x.known_for_department==='Directing').slice(0,3)
  .map(x=>({id:x.id,name:x.name,photo:x.profile_path,
   dept:x.known_for_department==='Directing'?'Regista':x.gender===1?'Attrice':'Attore',
   known:(x.known_for||[]).map(k=>k.title||k.name).filter(Boolean).slice(0,2)}));
 return Response.json({films,people});
}
