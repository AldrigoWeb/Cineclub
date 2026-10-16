import {redirect} from 'next/navigation';import {getMe} from '../../lib/me';import {Avatar,isImg} from '../avatar';import AVATARS from '../../lib/avatars.json';
export const dynamic='force-dynamic';
const EMO=['🎬','🍿','🦊','🐺','🦉','🐱','🐼','🦁','🐸','🐙','👻','🤖','🧙','🦇','🎭','🌙'];
const COL=['#a3243f','#c98a1b','#2b7a78','#5b4bb7','#2e6fba','#b8528c','#3f8f4f','#8a5a2b'];
const MSG={'1':'Scrivi un nome.','2':'Questo nome è già usato da un altro profilo.','3':'Salvataggio non riuscito, riprova.'};
export default async function Profilo({searchParams}){
 const me=await getMe();if(!me)redirect('/chi');
 const sp=await searchParams;
 const opts=[me.emoji,...(AVATARS.length?AVATARS:EMO).filter(x=>x!==me.emoji)];
 const cols=COL.includes(me.color)?COL:[me.color,...COL];
 return <div className="chi"><h2>Il tuo profilo</h2>
  <div style={{display:'flex',justifyContent:'center'}}><Avatar v={me.emoji} color={me.color}/></div>
  <form method="POST" action="/api/profile" className="rf"><input type="hidden" name="act" value="update"/>
   <input name="name" defaultValue={me.name} placeholder="Il tuo nome" aria-label="Nome" required maxLength={20}/>
   <div className={'pk'+(AVATARS.length?' img':'')}>{opts.map(m=><label key={m}><input type="radio" name="emoji" value={m} defaultChecked={m===me.emoji}/><span>{isImg(m)?<img src={m} alt=""/>:m}</span></label>)}</div>
   <div className="pk">{cols.map(c=><label key={c}><input type="radio" name="color" value={c} defaultChecked={c===me.color}/><span style={{background:c}}/></label>)}</div>
   {sp.e&&<p className="err">{MSG[sp.e]||MSG['3']}</p>}
   {sp.ok&&<p className="okm">Profilo aggiornato.</p>}
   <div className="btns" style={{justifyContent:'center'}}><button className="btn p">Salva</button><a href="/" className="btn">Torna alla home</a></div></form>
  <p className="rinfo">Se cambi nome, anche le tue recensioni passano al nuovo nome.</p></div>;
}
