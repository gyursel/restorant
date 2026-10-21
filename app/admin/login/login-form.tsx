'use client';
import {useState} from 'react';
import {ArrowRight,Eye,EyeOff,LockKeyhole,Mail,ShieldCheck} from 'lucide-react';
import './login-luxury.css';
export default function LoginForm(){
 const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[show,setShow]=useState(false),[pending,setPending]=useState(false),[error,setError]=useState('');
 async function submit(e:React.FormEvent){e.preventDefault();if(pending)return;if(!email.includes('@')||!password){setError('Въведи валиден имейл и парола.');return}setPending(true);setError('');try{
  const r=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
  const data=await r.json();if(!r.ok)throw new Error(data.error||'Неуспешен вход.');
  location.assign('/admin');
 }catch(e:any){setError(e.message)}finally{setPending(false)}}
 return <main className="lux-login">
  <aside className="lux-scene">
   <a href="/" className="lux-brand"><span className="lux-mark">◇</span><span>LILY <em>DRIVE</em></span></a>
   <div className="lux-welcome"><h2>Добре<br/>дошъл</h2><p>Радваме се да те видим отново.<br/>Твоят ресторант те очаква.</p></div>
   <span className="lux-copyright">© {new Date().getFullYear()} LILY DRIVE. Всички права запазени.</span>
  </aside>
  <section className="lux-main">
   <form noValidate className="lux-card" onSubmit={submit}>
    <div className="lux-emblem" aria-hidden="true">◇</div>
    <h1>Вход</h1><p className="lux-subtitle">Влез в управлението на LILY DRIVE</p>
    <div className="lux-fields">
     <label htmlFor="lux-email">Имейл</label>
     <div className="lux-input"><Mail size={19}/><input id="lux-email" type="email" required autoComplete="username" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)}/></div>
     <label htmlFor="lux-password">Парола</label>
     <div className="lux-input"><LockKeyhole size={19}/><input id="lux-password" type={show?'text':'password'} required autoComplete="current-password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)}/><button className="lux-eye" type="button" onClick={()=>setShow(v=>!v)} aria-label={show?'Скрий паролата':'Покажи паролата'}>{show?<EyeOff size={19}/>:<Eye size={19}/>}</button></div>
    </div>
    {error&&<p className="lux-error" role="alert">{error}</p>}
    <button className="lux-submit" disabled={pending} type="submit"><span>{pending?'Проверка…':'Влез'}</span><ArrowRight size={21}/></button>
    <a className="lux-return" href="/">← Към сайта</a>
   </form>
   <p className="lux-security"><ShieldCheck size={16}/> Защитен достъп до управлението</p>
  </section>
 </main>;
}