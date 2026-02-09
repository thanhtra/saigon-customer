
import { LandStatusLabelsCustomer, LandStatus } from 'lib/constants/data';
import { buildSelectOptions } from 'lib/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';

const LandStatusModal = ({
    open,
    currentStatus,
    onClose,
    onConfirm,
    title,
    address,
}) => {
    const [status, setStatus] = useState(currentStatus);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setStatus(currentStatus);
        }
    }, [open, currentStatus]);

    const handleConfirm = useCallback(async () => {
        if (!status || status === currentStatus) {
            onClose();
            return;
        }

        try {
            setLoading(true);
            await onConfirm(status);
            onClose();
        } finally {
            setLoading(false);
        }
    }, [status, currentStatus, onConfirm, onClose]);

    if (!open) return null;

    const statusOptions = useMemo(
        () =>
            buildSelectOptions(
                LandStatusLabelsCustomer,
                '-- Chọn trạng thái --'
            ).filter(opt => opt.value),
        []
    );

    return (
        <div
            className="land-status-overlay"
            onClick={onClose}
        >
            <div
                className="land-status-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h3>Cập nhật trạng thái phòng</h3>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                {(title || address) && (
                    <div className="land-info">
                        {title && (
                            <div className="land-title">
                                {title}
                            </div>
                        )}
                        {address && (
                            <div className="land-address">
                                {address}
                            </div>
                        )}
                    </div>
                )}

                <div className="current-status">
                    <span className="label">
                        Trạng thái hiện tại
                    </span>
                    <span
                        className={`status-chip ${currentStatus}`}
                    >
                        {LandStatusLabelsCustomer[currentStatus]}
                    </span>
                </div>

                <div className="form">
                    <div className="form-label">
                        Trạng thái mới
                    </div>

                    <div className="status-options">
                        {statusOptions.map(opt => {
                            const isDisabled =
                                opt.value === currentStatus ||
                                opt.value === LandStatus.PENDING_APPROVAL;

                            const isActive = status === opt.value;

                            return (
                                <label
                                    key={opt.value}
                                    className={`status-option
                ${isActive ? 'active' : ''}
                ${isDisabled ? 'disabled' : ''}
            `}
                                >
                                    <input
                                        type="radio"
                                        name="land-status"
                                        value={opt.value}
                                        checked={isActive}
                                        disabled={isDisabled}
                                        onChange={() => {
                                            if (!isDisabled) {
                                                setStatus(opt.value);
                                            }
                                        }}
                                    />

                                    <span className="dot" />
                                    <span className="text">
                                        {opt.label}

                                        {opt.value === currentStatus && (
                                            <span className="current-tag">
                                                (hiện tại)
                                            </span>
                                        )}

                                        {opt.value === LandStatus.PENDING_APPROVAL && (
                                            <span className="current-tag">
                                                (không thể chọn)
                                            </span>
                                        )}
                                    </span>
                                </label>
                            );
                        })}
                    </div>

                </div>

                <div className="modal-actions">
                    <button
                        type="button"
                        className="btn btn-border"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Huỷ
                    </button>

                    <button
                        type="button"
                        className="btn"
                        disabled={
                            loading ||
                            !status ||
                            status === currentStatus
                        }
                        onClick={handleConfirm}
                    >
                        {loading
                            ? 'Đang cập nhật...'
                            : 'Xác nhận'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LandStatusModal;
