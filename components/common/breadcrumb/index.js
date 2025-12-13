import Link from 'next/link'
import { PageUrl } from 'lib/constants/constant';

const Breadcrumb = ({ menu = '', title }) => (
  <section className="breadcrumb">
    <ul className="breadcrumb-list">
      <Link href="/">
        <a href="#"><i className="icon-home"></i></a>
      </Link>
      {menu && <li className='b-menu'>
        {menu === PageUrl.Products && <Link href={PageUrl.Products}>
          <a href="#">Sản phẩm</a>
        </Link>}
        {menu === PageUrl.Discoveries && <Link href={PageUrl.Discoveries}>
          <a href="#">Khám phá</a>
        </Link>}
        {menu === PageUrl.Lands && <Link href={PageUrl.Lands}>
          <a href="#">Bất động sản</a>
        </Link>}
        {menu === PageUrl.Profile && <Link href={PageUrl.Profile}>
          <a href="#">Tài khoản</a>
        </Link>}
      </li>}
      <li><span>{title}</span></li>
    </ul>
  </section>
)

export default Breadcrumb