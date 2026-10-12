import {db} from '../../../lib/db';import {t} from '../../../lib/tmdb';
export async function POST(req){
 const {id,status}=await req.json();
 if(status==='none'){await db.from('library').delete().eq('tmdb_id',id);return Response.json({ok:1})}
 const m=await t(`/movie/${id}`,{append_to_response:'credits'});
 const {error}=await db.from('library').upsert({tmdb_id:id,title:m.title,year:+(m.release_date||'').slice(0,4)||null,
  poster:m.poster_path,backdrop:m.backdrop_path,overview:m.overview,genres:(m.genres||[]).map(g=>g.name),
  director:m.credits?.crew?.find(c=>c.job==='Director')?.name||'',status});
 return Response.json({ok:!error},{status:error?500:200});
}
