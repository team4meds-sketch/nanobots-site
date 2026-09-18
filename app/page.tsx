import type {Entry} from "@/lib/content";import HomeClient from "./home-client";import {listPublic} from "@/lib/server";
export const dynamic="force-dynamic";
export default async function Home(){let entries:Entry[]=[];let unavailable=false;try{entries=await listPublic()}catch(e){console.error("public content unavailable",e);unavailable=true}return <HomeClient entries={entries} unavailable={unavailable}/>}
