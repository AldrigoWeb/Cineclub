import {db} from '../../lib/db';import Sfida from './sfida';
export const dynamic='force-dynamic';
export default async function Page(){
 const {data}=await db.from('library').select('tmdb_id,title,year,poster,genres,director').eq('status','seen');
 return <Sfida films={data||[]}/>;
}
