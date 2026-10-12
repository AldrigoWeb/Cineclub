export default async function Login({searchParams}){
 const e=(await searchParams).e;
 return <form method="POST" action="/api/login" className="login"><h2>Entra nel Cineclub</h2>
  <input name="pw" type="password" placeholder="Password del gruppo" required autoFocus/>
  {e&&<p className="err">Password sbagliata, riprova.</p>}<button className="btn p">Entra</button></form>;
}
