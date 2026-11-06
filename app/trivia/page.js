import {getTrivia,weekKey} from '../../lib/trivia';import {db} from '../../lib/db';import Trivia from './trivia';
export const dynamic='force-dynamic';
// tempo massimo per la generazione delle domande (secondi)
export const maxDuration=60;
export default async function Page(){
 const {qs,err}=await getTrivia();
 if(!qs.length)return <div className="empty">Le domande di oggi non sono ancora pronte. Ricarica tra un minuto.{err&&<p className="err">Dettaglio: {err}</p>}</div>;
 const {data:pl}=await db.from('library').select('tmdb_id,poster').in('tmdb_id',qs.map(q=>q.film_id));
 const posters=Object.fromEntries((pl||[]).map(x=>[x.tmdb_id,x.poster]));
 return <Trivia qs={qs} week={weekKey()} posters={posters}/>;
}