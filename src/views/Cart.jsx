import {CmsImage} from '@/components/site/CmsImage';
import {ConfigurableButton} from "@/components/site/ConfigurableButton";
import {useEffect,useState} from 'react';
import {Link,useLocation} from 'react-router-dom';
import {ArrowLeft,ArrowRight,CheckCircle2,Minus,Plus,ShieldCheck,ShoppingBag,Trash2,Truck} from 'lucide-react';
import {useCart} from '@/context/CartContext';
import {eur} from '@/lib/api';
import {mediaSrc} from '@/lib/media';
import {getContent} from '@/components/site/public-copy';

export function CartPage() {
  const {items,cart,total,itemCount,remove,setQuantity}=useCart();
  const {search}=useLocation();
  const [customer,setCustomer]=useState({name:'',phone:'',note:''});
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [config,setConfig]=useState(null);

  useEffect(()=>{
    let active=true;
    fetch('/api/checkout/config',{cache:'no-store'}).then(r=>r.json())
      .then(d=>{if(active)setConfig(d)}).catch(()=>{if(active)setConfig({enabled:false})});
    return()=>{active=false};
  },[]);

  const pickupAddress=getContent()?.settings?.address;
  const pendingItems=items.map(({slug,quantity})=>({slug,quantity}));
  const checkout=async e=>{
    e.preventDefault();
    if (!pendingItems.length || busy || !config?.enabled) return;
    setBusy(true);setError('');
    try {
      const response=await fetch('/api/checkout/session',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({items:pendingItems,customer}),
      });
      const data=await response.json();
      if (!response.ok || !data.url) throw new Error(data.error||'Плащането не може да стартира.');
      window.location.assign(data.url);
    } catch(err) {
      setError(err.message||'Възникна грешка. Опитай отново.');
      setBusy(false);
    }
  };

  return <section className="premium-cart-page" data-testid="cart-page">
    <div className="premium-cart-container">
      <Link to="/menu" className="premium-back-link"><ArrowLeft size={16}/> Обратно към менюто</Link>
      <div className="premium-cart-heading">
        <p className="eyebrow">ТВОЯТ ИЗБОР · LILY DRIVE</p>
        <h1>Твоята <em>поръчка.</em></h1>
        <p>Поръчай онлайн и вземи от място. Плащането се извършва сигурно през Stripe.</p>
      </div>
      {new URLSearchParams(search).has('canceled') && <div className="premium-payment-message">
        Плащането е прекъснато. Количката ти е запазена — можеш да опиташ отново.
      </div>}
      {!items.length ? <div className="premium-cart-empty">
        <ShoppingBag size={40} strokeWidth={1.3}/>
        <h2>Количката е празна</h2>
        <p>Добави любимите си продукти от менюто.</p>
        <Link className="btn-primary" to="/menu">Разгледай менюто <ArrowRight size={16}/></Link>
      </div> :
      <div className="premium-cart-layout">
        <div className="premium-cart-list">
          <div className="premium-cart-section-title"><ShoppingBag size={18}/><h2>Продукти</h2><span>{itemCount} бр.</span></div>
          {items.map(({product,slug,quantity})=><article key={slug} className="premium-cart-product">
            <CmsImage src={mediaSrc(product.image)} alt="" width="120" height="120" loading="lazy" decoding="async" />
            <div className="premium-cart-product-info">
              <Link to={'/product/'+slug} className="premium-cart-product-name">{product.name}</Link>
              <p>{eur(product.price)} / бр.</p>
              <div className="premium-cart-quantity">
                <button type="button" aria-label={'Намали '+product.name} onClick={()=>setQuantity(slug,quantity-1)}><Minus size={16}/></button>
                <span aria-live="polite">{quantity}</span>
                <button type="button" disabled={quantity>=10} aria-label={'Добави '+product.name} onClick={()=>setQuantity(slug,quantity+1)}><Plus size={16}/></button>
              </div>
            </div>
            <div className="premium-cart-product-end">
              <strong>{eur(product.price*quantity)}</strong>
              <button type="button" aria-label={'Премахни '+product.name} onClick={()=>remove(slug)}><Trash2 size={17}/></button>
            </div>
          </article>)}
          {items.length!==cart.length&&<p className="premium-payment-message">Някои продукти вече не са налични и не са включени в сумата.</p>}
        </div>
        <form className="premium-checkout-form" onSubmit={checkout}>
          <div className="premium-cart-section-title"><CheckCircle2 size={18}/><h2>Завърши поръчката</h2></div>
          <div className="premium-checkout-field">
            <label htmlFor="pickup-name">Име за поръчката *</label>
            <input id="pickup-name" required autoComplete="name" maxLength={90} minLength={2} value={customer.name}
              onChange={e=>setCustomer(v=>({...v,name:e.target.value}))} placeholder="Име и фамилия" />
          </div>
          <div className="premium-checkout-field">
            <label htmlFor="pickup-phone">Телефон за връзка *</label>
            <input id="pickup-phone" type="tel" required autoComplete="tel" maxLength={22} minLength={7}
              value={customer.phone} onChange={e=>setCustomer(v=>({...v,phone:e.target.value}))} placeholder="+359 8..." />
          </div>
          <div className="premium-checkout-field">
            <label htmlFor="pickup-note">Бележка (по желание)</label>
            <textarea id="pickup-note" rows={3} maxLength={300} value={customer.note}
              onChange={e=>setCustomer(v=>({...v,note:e.target.value}))} placeholder="Допълнителна информация за вземането" />
          </div>
          <div className="premium-pickup-box">
            <Truck size={20} />
            <span><strong>Вземане от място</strong>{pickupAddress&&<small>{pickupAddress}</small>}</span>
          </div>
          <div className="premium-cart-totals">
            <div><span>Продукти</span><span>{eur(total)}</span></div>
            <div><span>Доставка</span><span>Няма — вземане на място</span></div>
            <div className="premium-total"><strong>Общо за плащане</strong><strong>{eur(total)}</strong></div>
          </div>
          <ConfigurableButton slot="checkout-submit" type="submit" className="premium-pay-button" disabled={busy||!config?.enabled}>
            <ShieldCheck size={19}/>{busy?'Подготвяме защитеното плащане…':
            config?.enabled?'Плати с карта · '+eur(total):'Онлайн плащанията са в настройка'}<ArrowRight size={17}/>
          </ConfigurableButton>
          {config?.mode==='test'&&<p className="premium-checkout-test">Тестова версия: картите не се таксуват реално.</p>}
          {config&&!config.enabled&&<p className="premium-checkout-test">{config.configured && !config.databaseReady
            ? 'Онлайн поръчките временно не са достъпни. Моля, опитайте по-късно.'
            : !config.webhookConfigured && config.configured
            ? 'Потвърждаването на плащанията още се настройва.'
            : 'Необходимо е да свържем тестовия Stripe акаунт и базата за поръчки.'}</p>}
          {error&&<p role="alert" className="premium-checkout-error">{error}</p>}
          <p className="premium-checkout-security"><ShieldCheck size={14}/> Данните на картата се въвеждат само в защитената страница на Stripe.</p>
        </form>
      </div>}
    </div>
  </section>;
}
