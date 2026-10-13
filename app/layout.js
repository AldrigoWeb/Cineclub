import './globals.css';import Link from 'next/link';import Search from './search';import Logo from './logo';
export const metadata={title:'La Tana Movies',description:'I film che guardiamo insieme'};
export default function Root({children}){
 return <html lang="it"><body><div className="wrap">
  <header><Link href="/"><h1><Logo/><span className="sr">La Tana Movies</span></h1></Link><Link href="/sfida" className="btn">Sfida</Link><Search/></header>
  <main>{children}</main>
  <footer>Dati e immagini da TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.</footer>
 </div></body></html>;
}
