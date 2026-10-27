import {getTrivia,weekKey} from '../../lib/trivia';import Trivia from './trivia';
export const dynamic='force-dynamic';
export default async function Page(){
 const {qs,err}=await getTrivia();
 if(!qs.length)return <div className="empty">Le domande di questa settimana non sono ancora pronte. Riprova tra poco.{err&&<p className="err">Dettaglio: {err}</p>}</div>;
 return <Trivia qs={qs} week={weekKey()}/>;
}
