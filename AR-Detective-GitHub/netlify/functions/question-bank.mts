import { getUser } from '@netlify/identity';
import { getStore } from '@netlify/blobs';
import defaults from './_shared/default-bank.json' with { type: 'json' };
import { cleanBank } from './_shared/validation.mjs';
import { createBankHandler } from './_shared/handler.mjs';
export default createBankHandler({getUser,getStore:()=>getStore({name:'ar-detective-questions',consistency:'strong'}),validate:cleanBank,defaults});
export const config={path:'/api/question-bank'};
