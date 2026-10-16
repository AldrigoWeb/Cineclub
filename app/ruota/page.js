import {db} from '../../lib/db';import Ruota from './ruota';
export const dynamic='force-dynamic';
export default async function Page(){
 const {data}=await db.from('library').select('tmdb_id,title,year,poster,genres,director,status');
 return <Ruota films={data||[]}/>;
}
