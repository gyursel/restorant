'use client';
import {useState} from 'react';
import '../panel.css';
export default function LoginForm(){
 const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[pending,setPending]=useState(false),[error,setError]=useState('');
 async function submit(e:React.FormEvent){e.preventDefault();setPending(true);setError('');try{
  const r=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
  const data=await r.json();if(!r.ok)throw new Error(data.error||'Неуспешен вход.');
  location.assign('/admin');
 }catch(e:any){setError(e.message)}finally{setPending(false)}}
 return <main className="cms-loading" style={{minHeight:'100vh',display:'grid',placeItems:'center',background:'#101113'}}>
  <form onSubmit={submit} style={{width:'min(92vw,430px)',background:'#1c1e20',padding:35,border:'1px solid #343638',borderRadius:18,display:'grid',gap:16}}>
  <a href="/" style={{color:'#fff',fontWeight:800,textDecoration:'none'}}>APEX <span style={{color:'#f44736'}}>DRIVE</span></a>
  <h1 style={{color:'#fff',fontSize:24,margin:0}}>Административен вход</h1>
  <label style={{display:'grid',gap:7,color:'#fff'}}>Имейл<input required type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} style={{padding:12,borderRadius:8,color:'#111'}}/></label>
  <label style={{display:'grid',gap:7,color:'#fff'}}>Парола<input required type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} style={{padding:12,borderRadius:8,color:'#111'}}/></label>
  {error&&<p role="alert" style={{color:'#ff8d86',fontSize:14}}>{error}</p>}
  <button disabled={pending} className="cms-btn primary" style={{justifyContent:'center',padding:14}} type="submit">{pending?'Проверка…':'Влез в панела'}</button>
  <a href="/" style={{color:'#aaa',textAlign:'center'}}>Към сайта</a>
  </form></main>;
}
