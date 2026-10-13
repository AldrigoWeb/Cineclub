import {cookies} from 'next/headers';import {db} from './db';
export async function getMe(){
 const id=(await cookies()).get('me')?.value;if(!id)return null;
 const {data}=await db.from('profiles').select('*').eq('id',id).maybeSingle();return data||null;
}
