// Filmografia di una persona da TMDB (movie_credits): solo film usciti, con locandina, senza doppioni
// strict = true  -> per la ruota: attori solo con ruoli di rilievo (niente camei)
export function filmsOf(c,role,strict=true){
 const seen=new Set(),oggi=new Date().toISOString().slice(0,10);
 const src=role==='actor'
  ?(c.cast||[]).filter(x=>!/\b(self|himself|herself|themselves)\b/i.test(x.character||'')&&!(x.genre_ids||[]).includes(99)&&(!strict||x.order==null||x.order<10))
  :(c.crew||[]).filter(x=>x.job==='Director');
 return src.filter(x=>x.poster_path&&x.release_date&&x.release_date<=oggi&&!x.video&&!seen.has(x.id)&&seen.add(x.id))
  .sort((a,b)=>(b.vote_count||0)-(a.vote_count||0))
  .map(x=>({tmdb_id:x.id,title:x.title,year:+x.release_date.slice(0,4)||null,poster:x.poster_path,role:role==='actor'?(x.character||null):null}));
}
