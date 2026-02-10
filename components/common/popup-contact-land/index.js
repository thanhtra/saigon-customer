
import Portal from 'components/common/portal';
import { CustomerTypeOptions, FieldCooperationLabels } from 'lib/constants/data';


export default function PopupContact({ isShow, hideModal, contact }) {
    if (!isShow) return null;

    const phone = contact?.phone || '';
    const zaloLink = phone ? `https://zalo.me/${phone}` : '';

    const collaboratorTypeText = CustomerTypeOptions[contact?.type] || (contact?.type ? String(contact.type) : '---');

    const fieldText = FieldCooperationLabels[contact?.field_cooperation] ||
        (contact?.field_cooperation ? String(contact.field_cooperation) : '---');

    const isCollabActive = contact?.collaborator_active === true;
    const isUserActive = contact?.user_active === true;
    const isBlacklisted = contact?.collaborator_is_blacklisted === true;

    return (
        <Portal>
            <div className="contact-modal-overlay" onClick={hideModal}>
                <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
                    {/* HEADER */}
                    <div className="contact-modal-header">
                        <div className="header-left">
                            <div className="avatar">
                                {(contact?.name?.[0] || 'U').toUpperCase()}
                            </div>

                            <div className="header-info">
                                <div className="title">Thông tin chủ nhà</div>
                                <div className="name">{contact?.name || '---'}</div>

                                <div className="badges">
                                    <span className={`badge ${isCollabActive ? 'success' : 'muted'}`}>
                                        {isCollabActive ? 'Đang hoạt động' : 'Tạm ngưng'}
                                    </span>

                                    <span className={`badge ${isUserActive ? 'info' : 'muted'}`}>
                                        {isUserActive ? 'User Active' : 'User Disabled'}
                                    </span>

                                    {isBlacklisted && <span className="badge danger">Blacklist</span>}
                                </div>
                            </div>
                        </div>

                        <button className="btn-close" onClick={hideModal} type="button">
                            ✕
                        </button>
                    </div>

                    {/* BODY */}
                    <div className="contact-modal-body">
                        <div className="contact-grid">
                            <div className="contact-row">
                                <span className="label">👤 Người đăng</span>
                                <span className="value">{contact?.name || '---'}</span>
                            </div>

                            <div className="contact-row">
                                <span className="label">📞 Số điện thoại</span>
                                <span className="value">{phone || '---'}</span>
                            </div>

                            {!!contact?.email && (
                                <div className="contact-row">
                                    <span className="label">📧 Email</span>
                                    <span className="value">{contact.email}</span>
                                </div>
                            )}

                            {!!contact?.address_detail && (
                                <div className="contact-row full">
                                    <span className="label">📍 Địa chỉ thực tế</span>
                                    <span className="value">{contact.address_detail}</span>
                                </div>
                            )}

                            {!!contact?.address_detail_display && (
                                <div className="contact-row full">
                                    <span className="label">📍 Địa chỉ hiển thị</span>
                                    <span className="value">{contact.address_detail_display}</span>
                                </div>
                            )}

                            <div className="contact-row">
                                <span className="label">🏷 Loại</span>
                                <span className="value">{collaboratorTypeText}</span>
                            </div>

                            <div className="contact-row">
                                <span className="label">🤝 Lĩnh vực</span>
                                <span className="value">{fieldText}</span>
                            </div>

                            <div className="contact-row full note">
                                <span className="label">📝 Ghi chú hợp tác</span>
                                <span className="value">{contact.user_note} - {contact.collaborator_note}</span>
                            </div>

                            <div className="contact-row full note">
                                <span className="label">📝 Ghi chú bất động sản</span>
                                <div className="value" dangerouslySetInnerHTML={{ __html: contact.land_private_note }} />
                            </div>

                            {!!contact.land_daitheky_link && (
                                <div className="contact-row full">
                                    <a
                                        className="link"
                                        href={contact.land_daitheky_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        🌐 Daitheky
                                    </a>
                                </div>
                            )}

                            <div className="contact-row full note">
                                <span className="label">📝 Hoa hồng</span>
                                <span className="value">{contact.commission || "-"}</span>
                            </div>
                        </div>

                        <div className="contact-actions">
                            <a
                                className={`btn-action call ${phone ? '' : 'disabled'}`}
                                href={phone ? `tel:${phone}` : '#'}
                                onClick={(e) => {
                                    if (!phone) e.preventDefault();
                                }}
                            >
                                📞 Gọi ngay
                            </a>

                            <a
                                className={`btn-action zalo ${phone ? '' : 'disabled'}`}
                                href={phone ? zaloLink : '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => {
                                    if (!phone) e.preventDefault();
                                }}
                            >
                                💬 Zalo
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </Portal>
    );
}
