import { getUser } from '@netlify/identity';
export default async()=>{
  const user=await getUser();
  return Response.json({authenticated:!!user,teacher:!!user?.roles?.includes('teacher'),email:user?.email||null},{headers:{'Cache-Control':'no-store','Netlify-CDN-Cache-Control':'no-store'}});
};
export const config={path:'/api/teacher-session',method:'GET'};
