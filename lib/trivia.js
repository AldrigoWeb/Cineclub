import {db} from './db';
const MODEL=process.env.GEMINI_MODEL||'gemini-2.5-flash';
// lunedì della settimana corrente (UTC): le domande cambiano ogni lunedì
export const weekKey=()=>{const d=new Date();d.setUTCDate(d.getUTCDate()-(d.getUTCDay()+6)%7);return d.toISOString().slice(0,10)};
const shuffle=a=>{const r=[...a];for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]]}return r};
async function ask(films){
 const lista=films.map((f,i)=>`${i+1}. ${f.title} (${f.year||'?'}), regia di ${f.director||'sconosciuto'}`).join('\n');
 const prompt=`Sei il quizzettaro di un cineclub tra amici. Per ciascun film di questa lista scrivi UNA domanda trivia in italiano su una curiosità vera e verificabile (produzione, cast, regista, dietro le quinte, premi). Regole: NIENTE spoiler sulla trama o sul finale; esattamente 4 opzioni plausibili; "correct" è l'indice (0-3) dell'opzione giusta; "explanation" è la curiosità in 1-2 frasi. Se non sei sicuro di un fatto, scegli un altro fatto di cui sei sicuro.\n\n${lista}\n\nRispondi con un array JSON di 3 oggetti, nello stesso ordine, con "film" = numero del film nella lista.`;
 const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,{
  method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':process.env.GEMINI_API_KEY},
  body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{responseMimeType:'application/json',responseSchema:{type:'ARRAY',items:{type:'OBJECT',
   properties:{film:{type:'INTEGER'},question:{type:'STRING'},options:{type:'ARRAY',items:{type:'STRING'}},correct:{type:'INTEGER'},explanation:{type:'STRING'}},
   required:['film','question','options','correct','explanation']}}}})});
 const j=await r.json();
 if(!r.ok)throw new Error('Gemini '+r.status+': '+(j.error?.message||'errore sconosciuto'));
 const tx=j.candidates?.[0]?.content?.parts?.[0]?.text;
 if(!tx)throw new Error('Gemini ha risposto vuoto: '+JSON.stringify(j.promptFeedback||j).slice(0,200));
 return JSON.parse(tx);
}
export async function getTrivia(){
 const week=weekKey();
 const get=()=>db.from('trivia').select('*').eq('week',week).order('idx');
 let {data}=await get();
 if((data||[]).length>=3)return {qs:data,err:''};
 let err='';
 try{
  const {data:lib}=await db.from('library').select('tmdb_id,title,year,director');
  if(lib?.length){
   const films=shuffle(lib).slice(0,3);
   const qs=await ask(films);
   const rows=qs.slice(0,3).map((q,i)=>{
    const f=films[i];
    if(!f||!q.question||!Array.isArray(q.options)||q.options.length!==4||!(q.correct>=0&&q.correct<=3))return null;
    // rimescolo le opzioni: i modelli tendono a mettere la risposta giusta sempre nello stesso posto
    const right=q.options[q.correct],opts=shuffle(q.options);
    return {week,idx:i,film_id:f.tmdb_id,film_title:f.title,question:q.question,options:opts,correct:opts.indexOf(right),explanation:q.explanation||''};
   }).filter(Boolean);
   // se due amici aprono la pagina insieme, vince il primo e l'altro non duplica
   if(!rows.length)err='Le domande generate non avevano il formato giusto.';
   else{const {error}=await db.from('trivia').upsert(rows,{onConflict:'week,idx',ignoreDuplicates:true});if(error)err='Supabase: '+error.message}
  }else err='La libreria è vuota.';
 }catch(e){console.error('trivia',e);err=String(e.message||e)}
 ({data}=await get());
 return {qs:data||[],err};
}
