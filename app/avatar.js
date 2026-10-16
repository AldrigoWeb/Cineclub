// Avatar del profilo: se il valore inizia con "/" è un'immagine (cartella public/avatars), altrimenti è un'emoji
export const isImg=v=>typeof v==='string'&&v.startsWith('/');
export function Avatar({v,color,className='av'}){
 return <span className={className} style={{background:color}}>{isImg(v)?<img src={v} alt=""/>:v}</span>;
}
