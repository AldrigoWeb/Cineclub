const norm=s=>String(s||'').trim().toLowerCase();
const avg=a=>a.reduce((s,x)=>s+x,0)/a.length;
const it=n=>n.toFixed(1).replace('.',',');
const stars=n=>'★'.repeat(Math.round(n))+'☆'.repeat(5-Math.round(n));
const cut=(s,n)=>s.length>n?s.slice(0,n).trimEnd()+'…':s;
export function buildSlides({films,reviews,profiles,mins,me}){
 const seen=films.filter(f=>f.status==='seen');
 if(!seen.length)return [];
 const byId=Object.fromEntries(films.map(f=>[f.tmdb_id,f]));
 const prof=Object.fromEntries(profiles.map(p=>[norm(p.name),p]));
 const av=name=>{const p=prof[norm(name)];return {emoji:p?.emoji||'🎬',color:p?.color||'#a3243f',name:p?.name||String(name).trim()}};
 const S=[];
 S.push({c:'La Tana Movies · Wrapped',t:`${seen.length} film`,s:'visti insieme. Vediamo com\'è andata.'});
 if(mins>0){const h=Math.floor(mins/60),m=mins%60;
  S.push({c:'Tempo di cinema',t:`${h} ore`,s:`e ${m} minuti davanti allo schermo: ${it(mins/1440)} giorni di fila, senza dormire.`})}
 const per={};
 reviews.forEach(r=>{if(byId[r.tmdb_id]?.status==='seen')(per[r.tmdb_id]??=[]).push(r.rating)});
 const rated=Object.entries(per).map(([id,a])=>({f:byId[id],a,avg:avg(a),n:a.length,spread:Math.max(...a)-Math.min(...a)}));
 const pool=rated.filter(x=>x.n>=2).length?rated.filter(x=>x.n>=2):rated;
 const top=[...pool].sort((x,y)=>y.avg-x.avg||y.n-x.n)[0];
 if(top)S.push({c:'Il film più amato',t:top.f.title,s:`${stars(top.avg)}  ${it(top.avg)} su ${top.n} ${top.n===1?'voto':'voti'}`,p:top.f.poster});
 const div=rated.filter(x=>x.n>=2&&x.spread>=2).sort((x,y)=>y.spread-x.spread||y.n-x.n)[0];
 if(div)S.push({c:'Il più divisivo',t:div.f.title,s:`Voti da ${Math.min(...div.a)} a ${Math.max(...div.a)} stelle: non vi siete messi d'accordo.`,p:div.f.poster});
 const dc={};seen.forEach(f=>{if(f.director)(dc[f.director]??=[]).push(f.title)});
 const [dn,dt]=Object.entries(dc).sort((a,b)=>b[1].length-a[1].length)[0]||[];
 if(dt&&dt.length>=2)S.push({c:'Il regista più visto',t:dn,s:`${dt.length} film: ${dt.slice(0,4).join(', ')}${dt.length>4?'…':''}`});
 const ba={};reviews.forEach(r=>{(ba[norm(r.author)]??={name:r.author,a:[]}).a.push(r.rating)});
 let au=Object.values(ba);const el=au.filter(x=>x.a.length>=2);if(el.length>=2)au=el;
 if(au.length>=2){au=au.map(x=>({...x,avg:avg(x.a)})).sort((x,y)=>x.avg-y.avg);
  const lo=au[0],hi=au[au.length-1];
  if(hi.avg>lo.avg){
   S.push({c:'Il recensore più severo',av:av(lo.name),t:`Media ${it(lo.avg)}`,s:`su ${lo.a.length} ${lo.a.length===1?'recensione':'recensioni'}`});
   S.push({c:'Il recensore più generoso',av:av(hi.name),t:`Media ${it(hi.avg)}`,s:`su ${hi.a.length} ${hi.a.length===1?'recensione':'recensioni'}`})}}
 const lr=[...reviews].sort((a,b)=>b.comment.length-a.comment.length)[0];
 if(lr)S.push({c:'La recensione più lunga',t:byId[lr.tmdb_id]?.title||'Un film',q:cut(lr.comment,260),s:`di ${av(lr.author).name}`,av:av(lr.author)});
 if(me){const mine=reviews.filter(r=>norm(r.author)===norm(me.name));
  if(mine.length){const best=[...mine].sort((a,b)=>b.rating-a.rating)[0];
   S.push({c:'Il tuo Wrapped',av:{emoji:me.emoji,color:me.color,name:me.name},t:`${mine.length} ${mine.length===1?'recensione':'recensioni'}`,
    s:`Voto medio ${it(avg(mine.map(r=>r.rating)))}. Il tuo preferito: ${byId[best.tmdb_id]?.title||'un film'}.`})}}
 S.push({c:'Fine',t:'Alla prossima proiezione',s:'Il Wrapped si aggiorna ogni volta che guardate e recensite un film.'});
 return S;
}
