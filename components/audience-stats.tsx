"use client";
import {useEffect,useState} from 'react';
type Snapshot={subscribers:number|null;subscribersApproximate?:boolean;views?:number;updatedAt:string};
type Stats={version:number;releasedVideos:number;updatedAt:string|null;platforms:{youtube:Snapshot|null;vk:Snapshot|null}};
const remote='https://raw.githubusercontent.com/team4meds-sketch/nanobots-site/main/public/content/stats.json';
const local='./content/stats.json';
const format=new Intl.NumberFormat('ru-RU');
const validCount=(n:unknown):n is number=>typeof n==='number'&&Number.isSafeInteger(n)&&n>=0;
function validSnapshot(value:unknown):value is Snapshot{
 if(!value||typeof value!=='object')return false;
 const s=value as Snapshot;const time=Date.parse(s.updatedAt);
 return Number.isFinite(time)&&time<=Date.now()+300000&&Date.now()-time<30*86400000&&(s.subscribers===null||validCount(s.subscribers))&&(s.views===undefined||validCount(s.views));
}
function dateLabel(date:string){return new Date(date).toLocaleString('ru-RU',{day:'numeric',month:'long',hour:'2-digit',minute:'2-digit',timeZone:'Europe/Moscow'})+' МСК';}
export default function AudienceStats(){
 const[data,setData]=useState<Stats|null>(null);
 useEffect(()=>{
  let disposed=false;const controller=new AbortController();
  async function update(){
   const results=await Promise.allSettled([remote,local].map(async url=>{
    const response=await fetch(url,{cache:'no-cache',signal:AbortSignal.any([controller.signal,AbortSignal.timeout(12000)])});
    if(!response.ok)throw Error('Unavailable');const body=await response.json();
    if(body.version!==1||!body.platforms||!validCount(body.releasedVideos)||(body.updatedAt!==null&&!Number.isFinite(Date.parse(body.updatedAt))))throw Error('Invalid statistics');return body as Stats;
   }));
   const available=results.flatMap(r=>r.status==='fulfilled'?[r.value]:[]);
   if(!disposed&&available.length){available.sort((a,b)=>(Date.parse(b.updatedAt||'')||0)-(Date.parse(a.updatedAt||'')||0));setData(current=>(Date.parse(current?.updatedAt||'')||0)>(Date.parse(available[0].updatedAt||'')||0)?current:available[0]);}
  }
  void update();const timer=setInterval(()=>{if(document.visibilityState==='visible')void update();},300000);
  return()=>{disposed=true;controller.abort();clearInterval(timer);};
 },[]);
 if(!data)return null;
 const youtube=validSnapshot(data.platforms.youtube)?data.platforms.youtube:null;
 const vk=validSnapshot(data.platforms.vk)?data.platforms.vk:null;
 const sources=[{name:'YouTube',url:'https://youtube.com/@nanobots_mult',snapshot:youtube},{name:'VK',url:'https://vk.ru/nanobotsmult',snapshot:vk}].filter(s=>s.snapshot);
 // No placeholder metrics or historical promo numbers before an API succeeds.
 if(!sources.length)return null;
 const subscribers=sources.filter(s=>s.snapshot!.subscribers!==null);
 const sum=subscribers.reduce((total,s)=>total+s.snapshot!.subscribers!,0);
 const approximate=subscribers.some(s=>s.snapshot!.subscribersApproximate);
 return <section className="audience-section" aria-labelledby="audience-title"><div className="section-heading"><div><span className="eyebrow">НАШИ ИСТОРИИ НАХОДЯТ СВОИХ ЗРИТЕЛЕЙ</span><h2 id="audience-title">«Наноботы» в цифрах</h2></div></div><div className="audience-grid"><article><strong>{format.format(data.releasedVideos)}</strong><h3>выпущенных роликов</h3><p>Уникальные выпуски проекта</p></article>{subscribers.length>0&&<article><strong>{approximate?'≈ ':''}{format.format(sum)}</strong><h3>подписок на каналы</h3><p>{subscribers.map(s=>s.name).join(' + ')} · не уникальные зрители</p></article>}{youtube?.views!==undefined&&<article><strong>{format.format(youtube.views)}</strong><h3>просмотров на YouTube</h3><p>Все форматы видео канала</p></article>}</div><details className="audience-sources"><summary>Источники и время обновления</summary>{sources.map(s=><p key={s.name}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.name}</a>: {s.snapshot!.subscribers===null?'число подписчиков скрыто':`${s.snapshot!.subscribersApproximate?'≈ ':''}${format.format(s.snapshot!.subscribers!)} подписчиков`}. Обновлено {dateLabel(s.snapshot!.updatedAt)}{Date.now()-Date.parse(s.snapshot!.updatedAt)>86400000?' · данные пока не обновились':''}.</p>)}<p>Плановое обновление — раз в час. YouTube округляет число подписчиков. Просмотры VK и других площадок в показателе YouTube не учитываются.</p></details></section>;
}
