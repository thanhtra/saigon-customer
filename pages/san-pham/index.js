import Breadcrumb from 'components/common/breadcrumb';
import ProductsContent from 'components/product/products-content';
import ProductsFilter from 'components/product/products-filter';
import { getProducts } from 'lib/api/product-service';
import { PageUrl } from 'lib/constants/tech';
import { COMMON_URL_REDIRECT_LOGIN } from 'lib/store/type/common-type';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { useDispatch } from 'react-redux';

export async function getServerSideProps({ query }) {
  const payload = Object.keys(query) !== 0 ? query : {
    page: 0,
    size: 12
  };
  const res = await getProducts(payload);

  return {
    props: {
      products: res?.data || [],
      meta: res?.meta || {}
    },
  }
}

const Products = ({ products, meta }) => {
  const router = useRouter();
  const dispatch = useDispatch()
  const [query, setQuery] = useState({});
  const [searchOpen, setSearchOpen] = useState(false);
  const { register, handleSubmit, errors, reset, getValues } = useForm();

  useEffect(() => {
    if (router.query.keySearch && router.query.keySearch.length) {
      setSearchOpen(true);
    }
    reset({ key_search: router.query.keySearch });
  }, [router.query.keySearch]);

  const searchProductsHandle = (payload) => {
    const newQuery = { ...payload, page: 0 };

    setQuery(newQuery);
    router.query = newQuery;
    router.push(router);
  }

  const changePageHandle = (pageNumber) => {
    const page = pageNumber < 0 ? 0 : pageNumber;
    const newQuery = { ...query, page: page };
    setQuery(newQuery);
    router.query = newQuery;
    router.push(router);
  }

  const onSubmit = (data) => {
    const { key_search } = data;

    const newQuery = { ...query, keySearch: key_search };
    setQuery(newQuery);
    router.query = newQuery;
    router.push(router);
  }

  const removeSearch = () => {
    setSearchOpen(false);

    const newQuery = { ...query, keySearch: '' };
    setQuery(newQuery);
    router.query = newQuery;
    router.push(router);
  }

  const search = () => {
    const a = getValues('key_search');

    const newQuery = { ...query, keySearch: a || '' };
    setQuery(newQuery);
    router.query = newQuery;
    router.push(router);
  }

  const postProduct = () => {
    dispatch({
      type: COMMON_URL_REDIRECT_LOGIN,
      payload: PageUrl.PostProduct
    })
  };


  return (
    <>
      <section className="container products-page">
        <Breadcrumb title={`Tất cả ${meta?.itemCount} sản phẩm`} />

        <div className='products-main'>
          <div className='section-filter'>
            <ProductsFilter searchProducts={searchProductsHandle} query={router.query} />
          </div>
          <div className='btn-add'>
            <Link href={PageUrl.PostProduct}>
              <button type='button' className="btn" onClick={postProduct}>
                Đăng tin miễn phí
              </button>
            </Link>
          </div>
          <div className='section-content'>

            {searchOpen && <div className='search-area'>
              <p className='txt-result'>{meta?.itemCount} kết quả cho "{router.query?.keySearch}"</p>

              <div className='search-form'>
                <form className='form' onSubmit={handleSubmit(onSubmit)} autoComplete="off">

                  <input type="text"
                    name="key_search"
                    autoComplete="off"
                    placeholder="Tìm kiếm"
                    {...register('key_search')}
                  />
                  <i className="icon-search" onClick={search}></i>
                </form>

              </div>

              <i className="icon-cancel" onClick={removeSearch}></i>
            </div>}
            <ProductsContent products={products} meta={meta} changePage={changePageHandle} />
          </div>
        </div>
      </section>
    </>
  )
}

export default Products
