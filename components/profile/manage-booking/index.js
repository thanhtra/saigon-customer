
import SelectField from 'components/common/form/SelectField';
import Pagination from 'components/common/pagination';
import BookingItem from 'components/room/booking-item';
import { getMyBooking } from 'lib/api/booking.api';
import { BookingStatusLabels } from 'lib/constants/data';
import { buildSelectOptions } from 'lib/utils';
import NProgress from 'nprogress';
import { useEffect, useState, useCallback } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';

const ManageBoooking = () => {
    const [bookings, setBookings] = useState([]);
    const [meta, setMeta] = useState(null);
    const [page, setPage] = useState(1); // 1-based (API)

    const { control } = useForm({
        defaultValues: {
            status: '',
        },
    });

    const status = useWatch({
        control,
        name: 'status',
    });

    /* ===============================
     * FETCH DATA
     * =============================== */
    const getOrders = useCallback(
        async ({ sts, pg } = {}) => {
            try {
                NProgress.start();

                const s = sts ?? status;
                const currentPage = pg ?? page;

                const payload = {
                    size: 10,
                    is_pagin: true,
                    page: currentPage,
                    ...(s && { status: s }),
                };

                const res = await getMyBooking(payload);
                if (res?.success) {
                    const { data, meta } = res.result;
                    setBookings(data);
                    setMeta(meta);
                } else {
                    toast.error('Có lỗi xảy ra');
                }
            } catch {
                toast.error('Có lỗi xảy ra');
            } finally {
                NProgress.done();
            }
        },
        [status, page]
    );

    /* ===============================
     * EFFECTS
     * =============================== */
    useEffect(() => {
        getOrders({ pg: page });
    }, [page, getOrders]);

    useEffect(() => {
        setPage(1); // reset page khi đổi filter
        getOrders({ sts: status, pg: 1 });
    }, [status, getOrders]);

    /* ===============================
     * PAGINATION HANDLER
     * =============================== */
    const changePage = useCallback((nextPage) => {
        // nextPage là 1-based
        setPage(prev => (prev === nextPage ? prev : nextPage));
    }, []);

    const statusOptions = buildSelectOptions(
        BookingStatusLabels,
        '-- Tất cả trạng thái --'
    );

    return (
        <section className="manage-booking">
            <div className="p-header">
                <p className="p-title">Lịch xem nhà của tôi</p>

                <div className="form">
                    <div className="form-row inline">
                        <SelectField
                            name="status"
                            control={control}
                            options={statusOptions}
                            className="select-tiny"
                        />
                    </div>
                </div>
            </div>

            <div className="m-o-content">
                {bookings?.length > 0 ? (
                    bookings.map(item => (
                        <BookingItem
                            key={item.id}
                            booking={item}
                        />
                    ))
                ) : (
                    <p className="empty-text">Không có lịch xem nào</p>
                )}
            </div>

            {meta && (
                <Pagination
                    currentPage={meta.page - 1}              // 0-based cho UI
                    totalCount={meta.itemCount}
                    pageSize={meta.size}
                    onPageChange={(pageIndex) =>
                        changePage(pageIndex + 1)             // trả về 1-based cho API
                    }
                />
            )}
        </section>
    );
};

export default ManageBoooking;
