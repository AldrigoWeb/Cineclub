import Logo from '../logo';
export default async function Login({searchParams}){
 const e=(await searchParams).e;
 return <form method="POST" action="/api/login" className="login"><Logo big/><h2>Entra nella Tana</h2>
  <input name="pw" type="password" placeholder="Password del gruppo" required autoFocus/>
  {e&&<p className="err">Password sbagliata, riprova.</p>}<button className="btn p">Entra</button></form>;
}
