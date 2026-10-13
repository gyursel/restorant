import {CmsText} from "@/content/CmsText";
import { copy } from "@/content/repository";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mediaSrc } from "@/lib/media";
import { eur } from "@/lib/api";
export const ProductCard = ({
  product,
  featured = false
}) => {
  const prefix = featured ? "featured-" : "";
  const navigate = useNavigate();
  const off = !product.available;
  const quickAdd = e => {
    e.preventDefault();
    navigate(`/product/${product.slug}`);
  };
  return <article className={`food-card group ${featured ? "food-card-featured" : ""} ${off ? "opacity-60" : ""}`} data-testid={`${prefix}product-card-${product.slug}`}>
      <Link to={`/product/${product.slug}`} className="food-card-photo" data-testid={`${prefix}product-image-link-${product.slug}`}>
        <img src={mediaSrc(product.image)} alt={product.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </Link>
      <div className="food-card-content">
        {product.badge && <span className="food-card-badge" data-testid={`${prefix}product-badge-${product.slug}`}>{product.badge}</span>}
        {off && <span className="text-xs text-slate-400" data-testid={`${prefix}product-unavailable-${product.slug}`}><CmsText field="ProductCard_jsx_1"/></span>}
        <Link to={`/product/${product.slug}`} data-testid={`${prefix}product-name-link-${product.slug}`} className="hover:text-[#f05255] transition-colors"><h3 className="font-medium text-base sm:text-lg">{product.name}</h3></Link>
        <p className="mt-2 line-clamp-2 text-xs text-slate-400 leading-relaxed">{product.description}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-5">
          <span className="price text-base sm:text-lg" data-testid={`${prefix}product-price-${product.slug}`}>{eur(product.price)}</span>
          <button onClick={quickAdd} disabled={off} aria-label={product.name} data-testid={`${prefix}quick-add-${product.slug}`} className="food-add-button">
            <ArrowUpRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>;
};
