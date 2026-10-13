import {db} from '../../lib/db';
export const dynamic='force-dynamic';
const EMO=['🎬','🍿','🦊','🐺','🦉','🐱','🐼','🦁','🐸','🐙','👻','🤖','🧙','🦇','🎭','🌙'];
const COL=['#a3243f','#c98a1b','#2b7a78','#5b4bb7','#2e6fba','#b8528c','#3f8f4f','#8a5a2b'];
export default async function Chi({searchParams}){
 const e=(await searchParams).e;const {data}=await db.from('profiles').select('*').order('id');const ps=data||[];
 return <div className="chi"><h2>Chi sei?</h2>
  <div className="profs">{ps.map(p=><form key={p.id} method="POST" action="/api/profile"><input type="hidden" name="act" value="select"/><input type="hidden" name="id" value={p.id}/>
   <button className="prof"><span className="av" style={{background:p.color}}>{p.emoji}</span><span>{p.name}</span></button></form>)}</div>
  <details open={!ps.length||!!e}><summary className="btn">+ Nuovo profilo</summary>
   <form method="POST" action="/api/profile" className="rf"><input type="hidden" name="act" value="create"/>
    <input name="name" placeholder="Il tuo nome" required maxLength={20}/>
    <div className="pk">{EMO.map((m,i)=><label key={m}><input type="radio" name="emoji" value={m} defaultChecked={i===0}/><span>{m}</span></label>)}</div>
    <div className="pk">{COL.map((c,i)=><label key={c}><input type="radio" name="color" value={c} defaultChecked={i===0}/><span style={{background:c}}/></label>)}</div>
    {e&&<p className="err">{e==='2'?'Questo nome esiste già.':'Scrivi un nome.'}</p>}
    <button className="btn p">Crea profilo</button></form></details></div>;
}
