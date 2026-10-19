import {useEffect,useState} from 'react';
import {Link,useLocation} from 'react-router-dom';
import {CheckCircle2,Clock3,Home,ShieldCheck,AlertTriangle} from 'lucide-react';
import {useCart} from '@/context/CartContext';
import {eur} from '@/lib/api';

const fulfillmentLabels={new:'Получена · очаква приемане',accepted:'Приета',preparing:'Приготвя се',ready:'Готова за вземане',handed_over:'Предадена',cancel_requested:'Отказана — свържи се с ресторанта'};

export function OrderSuccessPage() {
  const {search}=useLocation();
  const {clear}=useCart();
  const id=new URLSearchParams(search).get('order_id')||'';
  const [order,setOrder]=useState(null);
  const [error,setError]=useState('');

  useEffect(()=>{
    if (!/^[0-9a-f-]{36}$/i.test(id)) {setError('Невалиден номер на поръчка.');return;}
    let active=true;
    let attempts=0;
    let timer;
    const poll=async()=>{
      try {
        const response=await fetch('/api/orders/'+encodeURIComponent(id),{cache:'no-store'});
        const result=await response.json();
        if (!response.ok)throw new Error(result.error||'Проверяването не е успешно.');
        if (!active)return;
        setOrder(result);
        if(result.status==='paid') {
          clear();
          if(!['handed_over','cancel_requested'].includes(result.fulfillmentStatus) && attempts++<90)
            timer=setTimeout(poll,12000);
          return;
        }
        if(['failed','expired'].includes(result.status))return;
        if(attempts++<12)timer=setTimeout(poll,3000);
      } catch(err) {
        if(!active)return;
        setError(err.message||'Неуспешна проверка.');
      }
    };
    poll();
    return()=>{active=false;clearTimeout(timer);};
  },[id,clear]);

  const paid=order?.status==='paid';
  const notPaid=order?.status==='failed'||order?.status==='expired';
  return <section className="premium-order-status" data-testid="order-success-page">
    <div className="premium-order-status-card">
      {paid?<CheckCircle2 className="premium-order-state-icon is-paid" size={52}/>:
        notPaid?<AlertTriangle className="premium-order-state-icon" size={52}/>:
          <Clock3 className="premium-order-state-icon" size={52}/>}
      <p className="eyebrow">LILY DRIVE · ОНЛАЙН ПОРЪЧКА</p>
      <h1>{paid?'Плащането е потвърдено.':notPaid?'Плащането не е завършено.':'Проверяваме плащането…'}</h1>
      <p>{paid?'Благодарим! Поръчката е платена. Запази номера за справка и изчакай потвърждение от ресторанта.':
        notPaid?'Поръчката не е платена. Можеш да опиташ отново.':
          'Stripe обработва транзакцията. Не затваряй страницата, ако току-що плати.'}</p>
      {order&&<div className="premium-order-receipt">
        <div><span>Номер</span><strong>{String(order.id).slice(0,8).toUpperCase()}</strong></div>
        <div><span>Сума</span><strong>{eur(order.amountCents/100)}</strong></div>
        <div><span>Плащане</span><strong>{paid?'Платена':notPaid?'Неплатена':'Очаква потвърждение'}</strong></div>
        {paid&&<div><span>Подготовка</span><strong>{fulfillmentLabels[order.fulfillmentStatus]||'Приемане'}</strong></div>}
      </div>}
      {error&&<p className="premium-checkout-error" role="alert">{error}</p>}
      <p className="premium-checkout-security"><ShieldCheck size={15}/> Статусът се потвърждава от Stripe, не от пренасочването на браузъра.</p>
      <div className="premium-order-actions">
        <Link to="/" className="btn-primary"><Home size={17}/> Начало</Link>
        <Link to="/menu" className="btn-cream">Виж менюто</Link>
      </div>
    </div>
  </section>;
}
