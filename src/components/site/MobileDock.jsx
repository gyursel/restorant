import { useLocation, Link } from 'react-router-dom';
import { House, UtensilsCrossed, Tag, MapPin, ShoppingBag } from 'lucide-react';
import {useCart} from '@/context/CartContext';

// Lightweight thumb navigation. Uses normal React Router links so CMS sections
// continue to work after publish, including on iOS Safari.
const destinations = [
  { to: '/', title: 'Начало', Icon: House },
  { to: '/menu', title: 'Меню', Icon: UtensilsCrossed },
  { to: '/#offers', title: 'Оферти', Icon: Tag },
  { to: '/#location', title: 'Контакти', Icon: MapPin },
  { to: '/cart', title: 'Количка', Icon: ShoppingBag },
];

export default function MobileDock({ hidden = false }) {
  const { pathname, hash } = useLocation();
  const {itemCount}=useCart();
  return <nav
    className={'premium-mobile-dock' + (hidden ? ' is-hidden' : '')}
    aria-label="Бърза мобилна навигация"
    data-testid="mobile-bottom-navigation"
  >
    {destinations.map(({ to, title, Icon }) => {
      const active = to === '/'
        ? pathname === '/' && !hash
        : to === '/menu'
          ? pathname === '/menu'
          : to === '/cart' ? pathname === '/cart' : pathname === '/' && hash === to.slice(1);
      return <Link
        key={to}
        to={to}
        className={'premium-dock-item' + (active ? ' is-active' : '')}
        aria-current={active ? 'page' : undefined}
        data-testid={'mobile-dock-' + title.toLowerCase()}
      >
        <span className="premium-dock-icon"><Icon size={20} strokeWidth={active ? 2.4 : 1.75} aria-hidden="true" />{to==="/cart"&&itemCount>0&&<b aria-label={`${itemCount} продукта`}>{itemCount}</b>}</span>
        <span>{title}</span>
      </Link>;
    })}
  </nav>;
}
