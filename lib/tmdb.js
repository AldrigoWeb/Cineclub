export const t=(p,q={})=>fetch(`https://api.themoviedb.org/3${p}?`+new URLSearchParams({language:'it-IT',...q}),
 {headers:{Authorization:`Bearer ${process.env.TMDB_TOKEN}`},next:{revalidate:86400}}).then(r=>r.json());
