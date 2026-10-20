import {NextResponse} from 'next/server';import AV from '../../../lib/avatars.json';import {getMe} from '../../../lib/me';import {db} from '../../../lib/db';
const em=v=>{v=String(v||'');return AV.includes(v)?v:v.startsWith('/')?'🎬':(v.slice(0,8)||'🎬')};
const go=(req,p)=>NextResponse.redirect(new URL(p,req.url),303);
const set=(res,id)=>{res.cookies.set('me',String(id),{httpOnly:true,secure:true,sameSite:'lax',maxAge:31536000,path:'/'});return res};
export async function POST(req){
 const f=await req.formData();const act=f.get('act');
 if(act==='exit'){const r=go(req,'/chi');r.cookies.delete('me');return r}
 if(act==='select'){const {data}=await db.from('profiles').select('id').eq('id',Number(f.get('id'))).maybeSingle();
  return data?set(go(req,'/'),data.id):go(req,'/chi')}
 if(act==='create'){const name=String(f.get('name')||'').trim().slice(0,20);if(!name)return go(req,'/chi?e=1');
  const c=String(f.get('color')||'');
  const {data,error}=await db.from('profiles').insert({name,emoji:em(f.get('emoji')),color:/^#[0-9a-f]{6}$/i.test(c)?c:'#a3243f'}).select('id').single();
  return error||!data?go(req,'/chi?e=2'):set(go(req,'/'),data.id)}
 if(act==='update'){
  const me=await getMe();if(!me)return go(req,'/chi');
  const name=String(f.get('name')||'').trim().slice(0,20);if(!name)return go(req,'/profilo?e=1');
  const c=String(f.get('color')||'');const color=/^#[0-9a-f]{6}$/i.test(c)?c:me.color;
  const emoji=f.get('emoji')?em(f.get('emoji')):me.emoji;
  const {error}=await db.from('profiles').update({name,emoji,color}).eq('id',me.id);
  if(error)return go(req,error.code==='23505'?'/profilo?e=2':'/profilo?e=3');
  if(name!==me.name){
   // le recensioni sono legate al nome: le passo al nuovo nome
   const old=me.name.trim().toLowerCase();
   const {data:rv}=await db.from('reviews').select('id,author');
   const ids=(rv||[]).filter(r=>r.author.trim().toLowerCase()===old).map(r=>r.id);
   if(ids.length){const {error:e2}=await db.from('reviews').update({author:name}).in('id',ids);
    if(e2){await db.from('profiles').update({name:me.name,emoji:me.emoji,color:me.color}).eq('id',me.id);return go(req,'/profilo?e=3')}}
   // anche "aggiunto da" nella libreria (se la colonna esiste)
   const {data:lb}=await db.from('library').select('tmdb_id,added_by');
   const lids=(lb||[]).filter(x=>x.added_by&&x.added_by.trim().toLowerCase()===old).map(x=>x.tmdb_id);
   if(lids.length)await db.from('library').update({added_by:name}).in('tmdb_id',lids);
  }
  return go(req,'/profilo?ok=1')}
 if(act==='delete'){
  const id=Number(f.get('id'));
  const {data:p}=await db.from('profiles').select('name').eq('id',id).maybeSingle();
  if(p){
   if(f.get('reviews')==='1')await db.from('reviews').delete().ilike('author',p.name.replace(/[\\%_]/g,m=>'\\'+m));
   await db.from('profiles').delete().eq('id',id);
  }
  const r=go(req,'/chi');if(req.cookies.get('me')?.value===String(id))r.cookies.delete('me');return r}
 return go(req,'/chi');
}
