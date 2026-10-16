import {db} from '../../lib/db';import {Avatar} from '../avatar';import AVATARS from '../../lib/avatars.json';
export const dynamic='force-dynamic';
const EMO=['🎬','🍿','🦊','🐺','🦉','🐱','🐼','🦁','🐸','🐙','👻','🤖','🧙','🦇','🎭','🌙'];
const COL=['#a3243f','#c98a1b','#2b7a78','#5b4bb7','#2e6fba','#b8528c','#3f8f4f','#8a5a2b'];
const ps0=v=>Number(v)||0;
export default async function Chi({searchParams}){
 const sp=await searchParams;const e=sp.e;const del=ps0(sp.del);const {data}=await db.from('profiles').select('*').order('id');const ps=data||[];const dp=ps.find(p=>p.id===del);
 return <div className="chi"><h2>Chi sei?</h2>
  <div className="profs">{ps.map(p=><form key={p.id} method="POST" action="/api/profile"><input type="hidden" name="act" value="select"/><input type="hidden" name="id" value={p.id}/>
   <button className="prof"><Avatar v={p.emoji} color={p.color}/><span>{p.name}</span></button></form>)}</div>
  {dp&&<form method="POST" action="/api/profile" className="rf"><input type="hidden" name="act" value="delete"/><input type="hidden" name="id" value={dp.id}/>
   <p>Eliminare il profilo <b><Avatar v={dp.emoji} color={dp.color} className="av sm"/> {dp.name}</b>?</p>
   <label><input type="checkbox" name="reviews" value="1"/> Elimina anche le sue recensioni</label>
   <button className="btn p" style={{background:'#a3243f'}}>Sì, elimina</button> <a href="/chi" className="btn">Annulla</a></form>}
  <details open={!ps.length||!!e}><summary className="btn">+ Nuovo profilo</summary>
   <form method="POST" action="/api/profile" className="rf"><input type="hidden" name="act" value="create"/>
    <input name="name" placeholder="Il tuo nome" required maxLength={20}/>
    <div className={'pk'+(AVATARS.length?' img':'')}>{(AVATARS.length?AVATARS:EMO).map((m,i)=><label key={m}><input type="radio" name="emoji" value={m} defaultChecked={i===0}/><span>{m.startsWith('/')?<img src={m} alt=""/>:m}</span></label>)}</div>
    <div className="pk">{COL.map((c,i)=><label key={c}><input type="radio" name="color" value={c} defaultChecked={i===0}/><span style={{background:c}}/></label>)}</div>
    {e&&<p className="err">{e==='2'?'Questo nome esiste già.':'Scrivi un nome.'}</p>}
    <button className="btn p">Crea profilo</button></form></details>
  {ps.length>0&&!dp&&<details><summary className="btn">Elimina un profilo</summary>
   <div className="profs" style={{marginTop:14}}>{ps.map(p=><a key={p.id} href={`/chi?del=${p.id}`} className="prof"><Avatar v={p.emoji} color={p.color}/><span>{p.name}</span></a>)}</div></details>}
 </div>;
}
