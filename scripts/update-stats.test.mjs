import test from 'node:test';
import assert from 'node:assert/strict';
import {refreshStats} from './update-stats.mjs';
const old={version:1,releasedVideos:30,updatedAt:'2026-09-01T00:00:00Z',platforms:{youtube:{views:12,subscribers:4,updatedAt:'2026-09-01T00:00:00Z'},vk:null}};
const ok=data=>({ok:true,json:async()=>data});
test('missing credentials preserve last successful data without network calls',async()=>{
 const r=await refreshStats(old,{},()=>{throw Error('must not call')});assert.deepEqual(r.data,old);
});
test('VK succeeds while YouTube fails: preserve YouTube and its timestamp',async()=>{
 const r=await refreshStats(old,{YOUTUBE_API_KEY:'test',VK_ACCESS_TOKEN:'test'},async(url)=>{
  if(String(url).includes('googleapis'))throw Error('offline');
  return ok({response:{groups:[{screen_name:'nanobotsmult',members_count:42}]}});
 },new Date('2026-09-19T12:00:00Z'));
 assert.deepEqual(r.data.platforms.youtube,old.platforms.youtube);assert.equal(r.data.platforms.vk.subscribers,42);assert.equal(r.outcomes.youtube,'unavailable');assert.deepEqual(old.platforms.vk,null);
});
test('hidden YouTube subscribers are unknown, not zero; real zero views are valid',async()=>{
 const r=await refreshStats(old,{YOUTUBE_API_KEY:'test'},async()=>ok({items:[{statistics:{viewCount:'0',hiddenSubscriberCount:true}}]}));
 assert.equal(r.data.platforms.youtube.views,0);assert.equal(r.data.platforms.youtube.subscribers,null);
});
test('malformed counts do not replace verified statistics',async()=>{
 for(const value of [null,'',-1,'oops',1.5]){
  const r=await refreshStats(old,{YOUTUBE_API_KEY:'test'},async()=>ok({items:[{statistics:{viewCount:value,subscriberCount:'1'}}]}));assert.deepEqual(r.data,old);
 }
});
