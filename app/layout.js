import './globals.css';import './sfondo.css';import './novita.css';import Link from 'next/link';import Search from './search';import Logo from './logo';import {getMe} from '../lib/me';import {Avatar} from './avatar';
export const metadata={title:'La Tana Movies',description:'I film che guardiamo insieme'};
export default async function Root({children}){
 const me=await getMe();
 return <html lang="it"><body><div className="wrap">
  <header><Link href="/"><h1><Logo/><span className="sr">La Tana Movies</span></h1></Link><Search/><nav className="nav"><Link href="/ruota" className="btn">Ruota</Link><Link href="/wrapped" className="btn">Wrapped</Link><Link href="/sfida" className="btn fufu">UwUFUFU</Link></nav>{me&&<div className="meb"><Link href="/profilo" className="btn ed" title="Modifica profilo" aria-label="Modifica profilo">✎</Link><form method="POST" action="/api/profile"><input type="hidden" name="act" value="exit"/><button className="me" title="Cambia profilo"><Avatar v={me.emoji} color={me.color}/>{me.name}</button></form></div>}</header>
  <main>{children}</main>
  <footer>Dati e immagini da TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.</footer>
 </div></body></html>;
}
