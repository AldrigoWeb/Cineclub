import {db} from '../../../lib/db';
export async function POST(req){
 const {id,author,rating,comment}=await req.json();
 if(!author?.trim()||!comment?.trim()||!(rating>=1&&rating<=5))return Response.json({ok:0},{status:400});
 const {error}=await db.from('reviews').insert({tmdb_id:id,author:author.trim().slice(0,30),rating,comment:comment.trim().slice(0,500)});
 return Response.json({ok:!error},{status:error?500:200});
}
