import {t} from '../../../lib/tmdb';
export async function GET(req){
 const q=new URL(req.url).searchParams.get('q')||'';
 if(q.length<2)return Response.json([]);
 const r=await t('/search/movie',{query:q});
 return Response.json((r.results||[]).slice(0,8).map(m=>({id:m.id,title:m.title,year:(m.release_date||'').slice(0,4),poster:m.poster_path})));
}
