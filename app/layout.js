import './globals.css';import './sfondo.css';import './novita.css';import Link from 'next/link';import Search from './search';import Logo from './logo';import {getMe} from '../lib/me';
export const metadata={title:'La Tana Movies',description:'I film che guardiamo insieme'};
export default async function Root({children}){
 const me=await getMe();
 return <html lang="it"><body><div className="wrap">
  <header><Link href="/"><h1><Logo/><span className="sr">La Tana Movies</span></h1></Link><Search/><nav className="nav"><Link href="/wrapped" className="btn">Wrapped</Link><Link href="/sfida" className="btn fufu">UwUFUFU</Link></nav>{me&&<form method="POST" action="/api/profile"><input type="hidden" name="act" value="exit"/><button className="me" title="Cambia profilo"><span className="av" style={{background:me.color}}>{me.emoji}</span>{me.name}</button></form>}</header>
  <main>{children}</main>
  <footer>Dati e immagini da TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.</footer>
 </div></body></html>;
}
