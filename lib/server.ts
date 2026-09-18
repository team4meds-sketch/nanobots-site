import {env} from "cloudflare:workers";import {getChatGPTUser} from "@/app/chatgpt-auth";import type {Entry} from "./content";
type Bindings={DB?:D1Database;BUCKET?:R2Bucket;ADMIN_EMAILS?:string};
export function bindings(){return env as unknown as Bindings}
export function database(){const db=bindings().DB;if(!db)throw new Error("Database unavailable");return db}
export async function listPublic(){return(await database().prepare("SELECT * FROM entries WHERE published = 1 ORDER BY date DESC,id DESC").all<Entry>()).results}
export async function isEditor(){const u=await getChatGPTUser();const emails=(bindings().ADMIN_EMAILS||"").split(",").map(s=>s.trim().toLowerCase()).filter(Boolean);return !!u&&emails.includes(u.email.toLowerCase())}
export async function guard(request:Request){if(!await isEditor())return Response.json({error:"Нет доступа к редактированию."},{status:403});const origin=request.headers.get("origin");if(origin!==new URL(request.url).origin)return Response.json({error:"Недопустимый источник запроса."},{status:403});return null}
