import {db} from '../../lib/db';import {getMe} from '../../lib/me';import {runtimes,sum} from '../../lib/stats';import {buildSlides} from '../../lib/wrapped';import Wrapped from './wrapped';
export const dynamic='force-dynamic';
export default async function Page(){
 const [{data:f},{data:r},{data:p},me]=await Promise.all([
  db.from('library').select('*'),db.from('reviews').select('*'),db.from('profiles').select('*'),getMe()]);
 const films=f||[],reviews=r||[],profiles=p||[];
 const mins=sum(await runtimes(films.filter(x=>x.status==='seen')));
 const slides=buildSlides({films,reviews,profiles,mins,me});
 if(!slides.length)return <div className="empty">Segna qualche film come visto: il Wrapped si costruisce da lì.</div>;
 return <Wrapped slides={slides}/>;
}
