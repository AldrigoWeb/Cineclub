import {NextResponse} from 'next/server';
export async function POST(req){
 const pw=(await req.formData()).get('pw');
 if(!process.env.SITE_PASSWORD||pw!==process.env.SITE_PASSWORD)return NextResponse.redirect(new URL('/login?e=1',req.url),303);
 const res=NextResponse.redirect(new URL('/',req.url),303);
 res.cookies.set('cc',pw,{httpOnly:true,secure:true,sameSite:'lax',maxAge:31536000,path:'/'});
 return res;
}
