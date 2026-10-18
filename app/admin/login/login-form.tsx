'use client';
import {useState} from 'react';
import {ArrowRight,Eye,EyeOff,LockKeyhole,Mail,ShieldCheck} from 'lucide-react';
import './login-luxury.css';
export default function LoginForm(){
 const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[show,setShow]=useState(false),[pending,setPending]=useState(false),[error,setError]=useState('');
 async function submit(e:React.FormEvent){e.preventDefault();setPending(true);setError('');try{
  const r=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
  const data=await r.json();if(!r.ok)throw new Error(data.error||'Неуспешен вход.');
  location.assign('/admin');
 }catch(e:any){setError(e.message)}finally{setPending(false)}}
 return <main className="lux-login">
  <aside className="lux-scene">
   <a href="/" className="lux-brand"><span className="lux-mark">◇</span><span>APEX <em>DRIVE</em></span></a>
   <div className="lux-welcome"><h2>Welcome<br/>Back</h2><p>Радваме се да те видим отново.<br/>Твоят ресторант те очаква.</p></div>
   <span className="lux-copyright">© {new Date().getFullYear()} APEX DRIVE. All rights reserved.</span>
  </aside>
  <section className="lux-main">
   <form className="lux-card" onSubmit={submit}>
    <div className="lux-emblem" aria-hidden="true">◇</div>
    <h1>Login</h1><p className="lux-subtitle">Login to your account to continue</p>
    <div className="lux-fields">
     <label htmlFor="lux-email">Email Address</label>
     <div className="lux-input"><Mail size={19}/><input id="lux-email" type="email" required autoComplete="username" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/></div>
     <label htmlFor="lux-password">Password</label>
     <div className="lux-input"><LockKeyhole size={19}/><input id="lux-password" type={show?'text':'password'} required autoComplete="current-password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)}/><button className="lux-eye" type="button" onClick={()=>setShow(v=>!v)} aria-label={show?'Скрий паролата':'Покажи паролата'}>{show?<EyeOff size={19}/>:<Eye size={19}/>}</button></div>
    </div>
    {error&&<p className="lux-error" role="alert">{error}</p>}
    <button className="lux-submit" disabled={pending} type="submit"><span>{pending?'Проверка…':'Login'}</span><ArrowRight size={21}/></button>
    <a className="lux-return" href="/">← Към сайта</a>
   </form>
   <p className="lux-security"><ShieldCheck size={16}/> Your data is secure with us</p>
  </section>
 </main>;
}