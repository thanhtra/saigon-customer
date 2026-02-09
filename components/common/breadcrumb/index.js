import Link from 'next/link';
import { PageUrl } from 'lib/constants/tech';

/**
 * Map menu -> breadcrumb level 2
 */
const MENU_MAP = {
  [PageUrl.Products]: {
    href: PageUrl.Products,
    label: 'Sản phẩm',
  },
  [PageUrl.Rental]: {
    href: PageUrl.Rental,
    label: 'Nhà ở cho thuê',
  },
  [PageUrl.Land]: {
    href: PageUrl.Land,
    label: 'Bất động sản',
  },
  [PageUrl.Profile]: {
    href: PageUrl.Profile,
    label: 'Tài khoản',
  },
};

const Breadcrumb = ({ menu, title }) => {
  const menuItem = menu ? MENU_MAP[menu] : null;

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {/* ===== HOME (luôn có) ===== */}
        <li>
          <Link href="/" aria-label="Trang chủ" className="breadcrumb-home">
            <i className="icon-home" />
          </Link>
        </li>

        {/* ===== MENU LEVEL (Danh sách) ===== */}
        {menuItem && (
          <li className="b-menu">
            <Link href={menuItem.href}>
              {menuItem.label}
            </Link>
          </li>
        )}

        {/* ===== CURRENT PAGE ===== */}
        {title && (
          <li className="active" aria-current="page">
            <span>{title}</span>
          </li>
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
