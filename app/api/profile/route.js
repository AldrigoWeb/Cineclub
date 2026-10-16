import {NextResponse} from 'next/server';import AV from '../../../lib/avatars.json';import {db} from '../../../lib/db';
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
