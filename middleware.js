import {NextResponse} from 'next/server';
export function middleware(req){
 const p=req.nextUrl.pathname;
 if(p==='/login'||p==='/api/login')return;
 if(req.cookies.get('cc')?.value!==process.env.SITE_PASSWORD)return NextResponse.redirect(new URL('/login',req.url));
}
export const config={matcher:['/((?!_next|favicon.ico).*)']};
