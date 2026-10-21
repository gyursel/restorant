'use client';

import {useCallback,useEffect,useRef,useState} from 'react';
import './orders.css';
import {AlertCircle,ArrowRight,Bell,BellOff,Check,CheckCircle2,Clock3,
  CreditCard,RefreshCw,ShoppingBag,Volume2,VolumeX,XCircle} from 'lucide-react';

type Status='new'|'accepted'|'preparing'|'ready'|'handed_over'|'cancel_requested';
type Order={
  id:string; status:'paid'|'pending'|'failed'|'expired'|'refunded';
  fulfillment_status:Status;
  amount_cents:number;currency:string; customer_name:string;phone:string;
  note:string; handler_note:string;items:{slug:string;name:string;quantity:number;unitCents:number}[];
  created_at:string;paid_at:string|null;fulfillment_updated_at:string|null;
};
const labels:Record<Status,string>={
  new:'Нова',accepted:'Приета',preparing:'Приготвя се',ready:'Готова',
  handed_over:'Предадена',cancel_requested:'Отказ / за връщане',
};
const advance:Partial<Record<Status,{to:Status;label:string}>>={
  new:{to:'accepted',label:'Приеми поръчката'},
  accepted:{to:'preparing',label:'Започни приготвяне'},
  preparing:{to:'ready',label:'Маркирай готова'},
  ready:{to:'handed_over',label:'Предадена на клиента'},
};
const money=(cents:number)=>new Intl.NumberFormat('bg-BG',{style:'currency',currency:'EUR'}).format(cents/100);
const clock=(v:string)=>new Date(v).toLocaleString('bg-BG',{timeZone:'Europe/Sofia',dateStyle:'short',timeStyle:'short'});

export default function OrdersPanel() {
  const [orders,setOrders]=useState<Order[]>([]);
  const [configured,setConfigured]=useState<boolean|null>(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');
  const [success,setSuccess]=useState('');
  const [filter,setFilter]=useState('active');
  const [term,setTerm]=useState('');
  const [working,setWorking]=useState('');
  const [rejecting,setRejecting]=useState<string|null>(null);
  const [rejectReason,setRejectReason]=useState('');
  const [sound,setSound]=useState(false);
  const audio=useRef<AudioContext|null>(null);
  const known=useRef<Set<string>|null>(null);

  const play=useCallback(()=>{
    const ctx=audio.current;
    if(!ctx)return;
    try{
      if(ctx.state==='suspended') void ctx.resume();
      const oscillator=ctx.createOscillator();
      const volume=ctx.createGain();
      oscillator.type='sine';
      oscillator.frequency.setValueAtTime(740,ctx.currentTime);
      oscillator.frequency.setValueAtTime(960,ctx.currentTime+.13);
      volume.gain.setValueAtTime(.0001,ctx.currentTime);
      volume.gain.exponentialRampToValueAtTime(.10,ctx.currentTime+.02);
      volume.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.33);
      oscillator.connect(volume);volume.connect(ctx.destination);
      oscillator.start();oscillator.stop(ctx.currentTime+.35);
    }catch{/* Sound is optional; never interrupt order monitoring. */}
  },[]);

  const refresh=useCallback(async()=>{
    try {
      const res=await fetch('/api/admin/orders',{cache:'no-store',credentials:'same-origin'});
      const data=await res.json();
      if(!res.ok)throw new Error(data.error||'Неуспешно зареждане.');
      const list:Array<Order>=data.orders||[];
      const activePaid=new Set(list.filter(x=>x.status==='paid'&&x.fulfillment_status==='new').map(x=>x.id));
      if(known.current!==null && [...activePaid].some(id=>!known.current!.has(id)) && audio.current){
        play();
        setSuccess('Получена е нова платена поръчка!');
      }
      known.current=activePaid;
      setOrders(list);
      setConfigured(Boolean(data.configured));
      setError('');
    }catch(e:any){setError(e?.message||'Грешка при обновяване на поръчките.');}
    finally{setLoading(false);}
  },[play]);

  useEffect(()=>{
    void refresh();
    const timer=window.setInterval(()=>{if(!document.hidden)void refresh();},12000);
    const onVisible=()=>{if(!document.hidden)void refresh();};
    document.addEventListener('visibilitychange',onVisible);
    return()=>{window.clearInterval(timer);document.removeEventListener('visibilitychange',onVisible);void audio.current?.close();audio.current=null;};
  },[refresh]);

  const enableSound=async()=>{
    if(audio.current){await audio.current.close();audio.current=null;setSound(false);return;}
    try{
      audio.current=new AudioContext();
      await audio.current.resume();
      setSound(true);
      play();
    }catch{setError('Браузърът не разреши звуково известяване.');}
  };

  const change=async(order:Order,to:Status,note='')=>{
    if(to==='cancel_requested' && !window.confirm('Платена поръчка ще бъде отбелязана за отказ. Това НЕ връща парите автоматично. Продължаваме ли?'))return;
    setWorking(order.id);setError('');setSuccess('');
    try{
      const response=await fetch('/api/admin/orders',{
        method:'POST',credentials:'same-origin',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({orderId:order.id,expectedStatus:order.fulfillment_status,fulfillmentStatus:to,note}),
      });
      const data=await response.json();
      if(!response.ok)throw new Error(data.error||'Неуспешна промяна.');
      setRejecting(null);setRejectReason('');
      setSuccess(to==='cancel_requested'?'Отказът е записан. Провери възстановяването на сумата отделно в Stripe.':'Статусът е обновен.');
      await refresh();
    }catch(e:any){setError(e?.message||'Статусът не беше променен.');}
    finally{setWorking('');}
  };

  const paid=orders.filter(x=>x.status==='paid');
  const waiting=paid.filter(x=>x.fulfillment_status==='new').length;
  const active=paid.filter(x=>['new','accepted','preparing','ready'].includes(x.fulfillment_status)).length;
  const revenue=paid.reduce((sum,x)=>sum+x.amount_cents,0);
  const filtered=orders.filter(x=>{
    if(filter==='active' && !(x.status==='paid'&&['new','accepted','preparing','ready'].includes(x.fulfillment_status)))return false;
    if(filter==='new'&&!(x.status==='paid'&&x.fulfillment_status==='new'))return false;
    if(filter==='ready'&&!(x.status==='paid'&&x.fulfillment_status==='ready'))return false;
    if(filter==='completed'&&!['handed_over','cancel_requested'].includes(x.fulfillment_status))return false;
    if(term.trim()){
      const q=term.trim().toLocaleLowerCase('bg-BG');
      return [x.id,x.customer_name,x.phone].some(v=>String(v||'').toLocaleLowerCase('bg-BG').includes(q));
    }
    return true;
  });

  return <section className="apex-orders" aria-label="Управление на онлайн поръчки">
    <header className="apex-orders-head">
      <div><p className="cms-eyebrow">LIVE ORDER DESK · APEX DRIVE</p>
        <h2>Онлайн поръчки <span>и кухня.</span></h2>
        <p>Платени поръчки, изпълнение и предаване на място. Обновяване на всеки 12 секунди.</p>
      </div>
      <div className="apex-orders-tools">
        <button type="button" className="cms-btn" onClick={enableSound}>
          {sound?<Volume2 size={17}/>:<VolumeX size={17}/>}
          {sound?'Звукът е включен':'Включи звук'}
        </button>
        <button type="button" className="cms-btn" disabled={loading} onClick={()=>void refresh()}>
          <RefreshCw size={17}/> Обнови
        </button>
      </div>
    </header>

    {configured===false&&<div className="apex-orders-banner" role="status">
      <AlertCircle size={21}/>
      <div><strong>Поръчките още не са свързани с тази среда.</strong>
      <p>За официалния сайт е необходима отделна Production база за поръчки с миграциите
      <code> payments.sql </code> и <code>payments-order-management.sql</code>, както и
      <code> PAYMENT_DATABASE_URL </code> само за Production. Не използвай тестовата база.</p></div>
    </div>}
    {error&&<div className="cms-alert error" role="alert"><AlertCircle size={17}/>{error}</div>}
    {success&&<div className="cms-alert" role="status"><CheckCircle2 size={17}/>{success}</div>}

    <div className="apex-orders-stats">
      <div><Bell size={20}/><small>За приемане</small><strong>{waiting}</strong><span>нови платени</span></div>
      <div><ShoppingBag size={20}/><small>Активни</small><strong>{active}</strong><span>в кухнята и за вземане</span></div>
      <div><CheckCircle2 size={20}/><small>Платени</small><strong>{paid.length}</strong><span>общ брой</span></div>
      <div><CreditCard size={20}/><small>Сума на платените*</small><strong>{money(revenue)}</strong><span>*преди такси и възстановявания</span></div>
    </div>
    <div className="apex-orders-filters">
      <div role="group" aria-label="Филтри за поръчки">
        {([['active','Активни'],['new','Нови'],['ready','Готови'],['completed','Приключени'],['all','Всички']] as const)
          .map(([id,label])=><button key={id} type="button" className={filter===id?'selected':''}
          onClick={()=>setFilter(id)}>{label}{id==='new'&&waiting>0&&<b>{waiting}</b>}</button>)}
      </div>
      <input aria-label="Търси поръчка" placeholder="Поръчка, име или телефон…" value={term}
        onChange={e=>setTerm(e.target.value)} />
    </div>
    <div className="apex-orders-list">
      {loading&&<p className="apex-orders-empty">Зареждаме поръчките…</p>}
      {!loading&&configured!==false&&!filtered.length&&
        <p className="apex-orders-empty">Няма поръчки в избраната категория.</p>}
      {filtered.map(order=>{
        const step=order.status==='paid'?advance[order.fulfillment_status]:null;
        const cancellable=order.status==='paid'&&!['handed_over','cancel_requested'].includes(order.fulfillment_status);
        return <article key={order.id} className={'apex-order-card status-'+order.fulfillment_status}>
          <div className="apex-order-top">
            <div><small>ПОРЪЧКА #{order.id.slice(0,8).toUpperCase()}</small>
              <h3>{order.customer_name||'Клиент'}</h3>
              <time dateTime={order.created_at}>{clock(order.created_at)}</time></div>
            <div className="apex-order-badges">
              <span className={order.status==='paid'?'is-paid':'is-pending'}>
                {order.status==='paid'?<Check size={15}/>:<Clock3 size={15}/>}
                {order.status==='paid'?'Платена':order.status==='pending'?'Очаква плащане':order.status}
              </span>
              <span className={'fulfillment '+order.fulfillment_status}>{labels[order.fulfillment_status]||'Нова'}</span>
              <strong>{money(order.amount_cents)}</strong>
            </div>
          </div>
          <div className="apex-order-info">
            <a href={'tel:'+order.phone}>{order.phone}</a>
            <span>Вземане от място · {order.items?.reduce((s,x)=>s+x.quantity,0)||0} бр.</span>
          </div>
          <ul className="apex-order-items">{(order.items||[]).map((item,i)=>
            <li key={item.slug||i}><strong>{item.quantity}×</strong><span>{item.name}</span>
            <small>{money(item.unitCents*item.quantity)}</small></li>)}</ul>
          {order.note&&<p className="apex-order-note"><strong>Бележка от клиента:</strong> {order.note}</p>}
          {order.handler_note&&<p className="apex-order-note"><strong>Бележка от екипа:</strong> {order.handler_note}</p>}
          {order.fulfillment_status==='cancel_requested'&&
            <p className="apex-orders-refund-warning">Внимание: отказът не е автоматично възстановяване на парите.
            Провери и обработи сумата в Stripe Dashboard.</p>}
          {step&&<div className="apex-order-actions">
            <button type="button" className="cms-btn primary" disabled={Boolean(working)}
              onClick={()=>void change(order,step.to)}><ArrowRight size={16}/>{working===order.id?'Запазване…':step.label}</button>
            {cancellable&&<button type="button" className="cms-btn"
              disabled={Boolean(working)} onClick={()=>{setRejecting(rejecting===order.id?null:order.id);setRejectReason('')}}>
              <XCircle size={16}/> Откажи
            </button>}
          </div>}
          {rejecting===order.id&&<div className="apex-order-reject">
            <label>Причина за отказа (задължителна)
              <textarea className="resize-none" style={{resize:'none'}} rows={2} minLength={5} maxLength={500} value={rejectReason}
                onChange={e=>setRejectReason(e.target.value)}
                placeholder="Причина, която ще запазим в историята на поръчката…"/></label>
            <button type="button" className="cms-btn" disabled={working!==''||rejectReason.trim().length<5}
              onClick={()=>void change(order,'cancel_requested',rejectReason.trim())}>
              Потвърди отказа — изисква ръчно възстановяване
            </button>
          </div>}
        </article>;
      })}
    </div>
    {configured!==false&&<p className="apex-orders-bottom-note">
      <BellOff size={14}/> За звукови сигнали остави страницата отворена и натисни „Включи звук“.
      Само реално потвърдените от Stripe плащания могат да бъдат приети за изпълнение.</p>}
  </section>;
}
