import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';

const root=fileURLToPath(new URL('../',import.meta.url));
function count(value){
 if(!['string','number'].includes(typeof value)||String(value).trim()==='')throw Error('Missing count');
 const n=Number(value);if(!Number.isSafeInteger(n)||n<0)throw Error('Invalid count');return n;
}
async function jsonRequest(url,options,fetcher){
 const response=await fetcher(url,{...options,signal:AbortSignal.timeout(20000)});
 if(!response.ok)throw Error('Provider unavailable');
 return response.json();
}
export async function refreshStats(previous,env,fetcher=fetch,now=new Date()){
 const result=structuredClone(previous);const outcomes={};let successes=0;
 for(const provider of ['youtube','vk']){
  const key=provider==='youtube'?env.YOUTUBE_API_KEY:env.VK_ACCESS_TOKEN;
  if(!key){outcomes[provider]='not_configured';continue;}
  try{
   let metrics;
   if(provider==='youtube'){
    const url=new URL('https://www.googleapis.com/youtube/v3/channels');
    url.search=new URLSearchParams({part:'statistics',forHandle:'nanobots_mult',key});
    const data=await jsonRequest(url,{},fetcher);
    const stats=data.items?.[0]?.statistics;if(!stats)throw Error('Missing channel');
    metrics={views:count(stats.viewCount),subscribers:stats.hiddenSubscriberCount===true?null:count(stats.subscriberCount),subscribersApproximate:true};
   }else{
    const data=await jsonRequest('https://api.vk.com/method/groups.getById',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({group_ids:'nanobotsmult',fields:'members_count',v:'5.199',access_token:key})},fetcher);
    if(data.error)throw Error('VK API error');
    const group=data.response?.groups?.[0];if(!group||group.screen_name?.toLowerCase()!=='nanobotsmult')throw Error('Unexpected community');
    metrics={subscribers:count(group.members_count),subscribersApproximate:false};
   }
   result.platforms[provider]={...metrics,updatedAt:now.toISOString()};successes++;outcomes[provider]='updated';
  }catch{outcomes[provider]='unavailable';} // Never print provider errors containing credentials.
 }
 if(successes)result.updatedAt=now.toISOString();
 return {data:result,outcomes};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const source=resolve(root,'public/content/stats.json');
 const previous=JSON.parse(await readFile(source,'utf8'));
 const {data,outcomes}=await refreshStats(previous,process.env);
 const serialized=JSON.stringify(data,null,2)+'\n';
 for(const dir of ['public/content','docs/content']){
  await mkdir(resolve(root,dir),{recursive:true});await writeFile(resolve(root,dir,'stats.json'),serialized);
 }
 console.log(JSON.stringify(outcomes));
 if(Object.values(outcomes).includes('unavailable'))process.exitCode=1;
}
