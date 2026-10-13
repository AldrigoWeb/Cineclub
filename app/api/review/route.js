import {db} from '../../../lib/db';import {getMe} from '../../../lib/me';
const bad=s=>Response.json({ok:0},{status:s});
const clean=(rating,comment)=>(rating>=1&&rating<=5&&comment?.trim())?{rating,comment:comment.trim().slice(0,500)}:null;
const res=error=>Response.json({ok:!error},{status:error?500:200});
async function mine(id,me){const {data}=await db.from('reviews').select('author').eq('id',id).maybeSingle();
 return !!(data&&me&&data.author.trim().toLowerCase()===me.name.trim().toLowerCase())}
export async function POST(req){
 const me=await getMe();if(!me)return bad(401);
 const {id,rating,comment}=await req.json();const c=clean(rating,comment);if(!c)return bad(400);
 return res((await db.from('reviews').insert({tmdb_id:id,author:me.name,...c})).error);
}
export async function PATCH(req){
 const me=await getMe();const {id,rating,comment}=await req.json();const c=clean(rating,comment);
 if(!c)return bad(400);if(!await mine(id,me))return bad(403);
 return res((await db.from('reviews').update(c).eq('id',id)).error);
}
export async function DELETE(req){
 const me=await getMe();const {id}=await req.json();
 if(!await mine(id,me))return bad(403);
 return res((await db.from('reviews').delete().eq('id',id)).error);
}
