import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import Home from '../app/home-client';
import type {Entry} from '../lib/content';
import '../app/globals.css';
function App(){const [entries,setEntries]=useState<Entry[]>([]);const[unavailable,setUnavailable]=useState(false);useEffect(()=>{fetch('./content/entries.json').then(r=>{if(!r.ok)throw Error('Content unavailable');return r.json()}).then(data=>{if(!Array.isArray(data))throw Error('Invalid content');setEntries(data.filter(e=>e.published===1))}).catch(()=>setUnavailable(true));},[]);return <Home entries={entries} unavailable={unavailable}/>;}
createRoot(document.getElementById('root')!).render(<App/>);
