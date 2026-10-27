import {getTrivia,weekKey} from '../../lib/trivia';import Trivia from './trivia';
export const dynamic='force-dynamic';
export default async function Page(){
 const qs=await getTrivia();
 if(!qs.length)return <div className="empty">Le domande di questa settimana non sono ancora pronte (serve almeno un film in libreria). Riprova tra poco.</div>;
 return <Trivia qs={qs} week={weekKey()}/>;
}
