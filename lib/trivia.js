import {db} from './db';
const MODEL=process.env.GEMINI_MODEL||'gemini-2.5-flash';
// quante domande al giorno: cambia solo questo numero
export const N=15;
// quante domande per richiesta a Gemini
const LOTTO=5;
// pausa tra una richiesta e l'altra (il piano gratuito ha un limite al minuto)
const RESPIRO=13000;
// dopo un 429 (limite di richieste) non richiamo Gemini per 2 minuti
const PAUSA_429=2*60*1000;
let pausaFino=0;
let inCorso=null;
// data di oggi in Italia (YYYY-MM-DD): le domande cambiano ogni giorno a mezzanotte
export const dayKey=()=>new Date().toLocaleDateString('sv-SE',{timeZone:'Europe/Rome'});
// alias: la colonna della tabella si chiama "week" ma ora contiene il giorno
export const weekKey=dayKey;
const shuffle=a=>{const r=[...a];for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]]}return r};
const sleep=ms=>new Promise(res=>setTimeout(res,ms));
async function callGemini(prompt){
 const body=JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{responseMimeType:'application/json',responseSchema:{type:'ARRAY',items:{type:'OBJECT',
  properties:{film:{type:'INTEGER'},question:{type:'STRING'},options:{type:'ARRAY',items:{type:'STRING'}},correct:{type:'INTEGER'},explanation:{type:'STRING'}},
  required:['film','question','options','correct','explanation']}}}});
 for(let t=0;t<3;t++){
  const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,{
   method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':process.env.GEMINI_API_KEY},body});
  const j=await r.json();
  if(r.ok){
   const tx=j.candidates?.[0]?.content?.parts?.[0]?.text;
   if(!tx)throw new Error('Gemini ha risposto vuoto: '+JSON.stringify(j.promptFeedback||j).slice(0,200));
   return JSON.parse(tx);
  }
  // 429: limite al minuto, fermo tutto per un po' invece di riprovare subito
  if(r.status===429){pausaFino=Date.now()+PAUSA_429;throw new Error('Gemini 429: limite di richieste al minuto')}
  // 503: modello occupato, riprovo dopo una pausa crescente
  if(r.status===503&&t<2){await sleep(8000*(t+1));continue}
  throw new Error('Gemini '+r.status+': '+(j.error?.message||'errore sconosciuto'));
 }
}
async function ask(films){
 const lista=films.map((f,i)=>`${i+1}. ${f.title} (${f.year||'?'}), regia di ${f.director||'sconosciuto'}`).join('\n');
 const prompt=`Sei il quizzettaro di un cineclub tra amici. Per ciascun film di questa lista scrivi UNA domanda trivia in italiano su una curiosità vera e verificabile (produzione, cast, regista, dietro le quinte, premi). Regole: NIENTE spoiler sulla trama o sul finale; esattamente 4 opzioni plausibili; "correct" è l'indice (0-3) dell'opzione giusta; "explanation" è la curiosità in 1-2 frasi. Se non sei sicuro di un fatto, scegli un altro fatto di cui sei sicuro. Non ripetere lo stesso tipo di domanda per film diversi.\n\n${lista}\n\nRispondi con un array JSON di ${films.length} oggetti, nello stesso ordine, con "film" = numero del film nella lista.`;
 return callGemini(prompt);
}
// genera le domande di oggi: una sola volta alla volta, anche se più persone aprono la pagina
async function generate(day){
 if(inCorso)return inCorso;
 inCorso=(async()=>{
  const {data:lib}=await db.from('library').select('tmdb_id,title,year,director');
  if(!lib?.length)throw new Error('La libreria è vuota.');
  const need=Math.min(N,lib.length);
  const films=shuffle(lib).slice(0,need);
  const lotti=[];for(let i=0;i<films.length;i+=LOTTO)lotti.push(films.slice(i,i+LOTTO));
  const coppie=[];
  for(let k=0;k<lotti.length;k++){
   if(k>0)await sleep(RESPIRO);
   const qs=await ask(lotti[k]);
   lotti[k].forEach((f,j)=>coppie.push({f,q:qs[j]}));
  }
  const rows=coppie.map(({f,q},i)=>{
   if(!f||!q||!q.question||!Array.isArray(q.options)||q.options.length!==4||!(q.correct>=0&&q.correct<=3))return null;
   // rimescolo le opzioni: i modelli tendono a mettere la risposta giusta sempre nello stesso posto
   const right=q.options[q.correct],opts=shuffle(q.options);
   return {week:day,idx:i,film_id:f.tmdb_id,film_title:f.title,question:q.question,options:opts,correct:opts.indexOf(right),explanation:q.explanation||''};
  }).filter(Boolean);
  if(!rows.length)throw new Error('Le domande generate non avevano il formato giusto.');
  // se due amici aprono la pagina insieme, vince il primo e l'altro non duplica
  const {error}=await db.from('trivia').upsert(rows,{onConflict:'week,idx',ignoreDuplicates:true});
  if(error)throw new Error('Supabase: '+error.message);
 })().finally(()=>{inCorso=null});
 return inCorso;
}
export async function getTrivia(){
 const day=dayKey();
 const get=()=>db.from('trivia').select('*').eq('week',day).order('idx');
 let {data}=await get();
 const {data:lib}=await db.from('library').select('tmdb_id');
 const need=Math.min(N,lib?.length||0);
 if((data||[]).length>=need&&need>0)return {qs:data,err:''};
 let err='';
 if(Date.now()<pausaFino){
  err='Gemini è in pausa per il limite di richieste: riprova tra un paio di minuti.';
 }else{
  try{await generate(day)}catch(e){console.error('trivia',e);err=String(e.message||e)}
 }
 ({data}=await get());
 return {qs:data||[],err};
}