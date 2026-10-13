import './logo.css';
export default function Logo({big}){
 return <img className={big?'logo-big':'logo-sm'} src={big?'/logo.webp':'/logo-sm.webp'} alt="La Tana Movies" width={big?320:84} height={big?320:84}/>;
}
