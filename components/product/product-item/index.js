import { formatCurrency } from 'lib/utils';
import { getStatusProduct } from 'lib/utils/index';
import Link from 'next/link';

const ProductItem = ({ product }) => {
  const { name, price_from, image, status, slug } = product;
  const statusName = getStatusProduct(status);


  return (
    <Link href={`/san-pham/${slug}`}>
      <div className="product-item">
        <div className='product-image'>
          <a> <img src={`${process.env.NEXT_PUBLIC_REACT_APP_API}/uploads/product/` + image} alt="product" />  </a>

          {status !== 'InSell' && <div className={`product-status ${status === 'OutOfStock' ? 'out-of-stock' : ''} ${status === 'OnSale' ? 'on-sale' : ''}`}>
            {statusName}
          </div>}
        </div>

        <div className="product-description">
          <p className='product-name'>{name}</p>

          <div className='product-price' >
            {formatCurrency.format(price_from)}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductItem
