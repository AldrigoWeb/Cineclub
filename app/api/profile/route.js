import {NextResponse} from 'next/server';import {db} from '../../../lib/db';
const go=(req,p)=>NextResponse.redirect(new URL(p,req.url),303);
const set=(res,id)=>{res.cookies.set('me',String(id),{httpOnly:true,secure:true,sameSite:'lax',maxAge:31536000,path:'/'});return res};
export async function POST(req){
 const f=await req.formData();const act=f.get('act');
 if(act==='exit'){const r=go(req,'/chi');r.cookies.delete('me');return r}
 if(act==='select'){const {data}=await db.from('profiles').select('id').eq('id',Number(f.get('id'))).maybeSingle();
  return data?set(go(req,'/'),data.id):go(req,'/chi')}
 if(act==='create'){const name=String(f.get('name')||'').trim().slice(0,20);if(!name)return go(req,'/chi?e=1');
  const c=String(f.get('color')||'');
  const {data,error}=await db.from('profiles').insert({name,emoji:String(f.get('emoji')||'🎬').slice(0,8),color:/^#[0-9a-f]{6}$/i.test(c)?c:'#a3243f'}).select('id').single();
  return error||!data?go(req,'/chi?e=2'):set(go(req,'/'),data.id)}
 return go(req,'/chi');
}
