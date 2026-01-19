'use client';

import SelectField from 'components/common/form/SelectField';
import Pagination from 'components/common/pagination';
import BookingItem from 'components/room/booking-item';
import { getMyBooking } from 'lib/api/booking.api';
import {
    BookingStatusLabels,
} from 'lib/constants/data';
import { buildSelectOptions } from 'lib/utils';
import NProgress from 'nprogress';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';

const ManageBoooking = () => {
    const [bookings, setBookings] = useState([]);
    const [meta, setMeta] = useState(null);
    const [page, setPage] = useState(1);

    const { control } = useForm({
        defaultValues: {
            status: '',
        },
    });

    const status = useWatch({
        control,
        name: 'status',
    });

    const getOrders = async ({ sts, pg }) => {
        try {
            NProgress.start();
            const s = sts || status;

            const payload = {
                size: 10,
                is_pagin: true,
                page: pg || page,
                ...(s && { status: s })
            };

            const res = await getMyBooking(payload);
            if (res?.success) {
                const { data, meta } = res.result;
                setBookings(data);
                setMeta(meta);
            } else {
                toast.error('Có lỗi xảy ra');
            }
        } catch (err) {
            toast.error('Có lỗi xảy ra');
        } finally {
            NProgress.done();
        }
    };

    useEffect(() => {
        getOrders({
            sts: undefined,
            pg: page
        });
    }, [page]);

    useEffect(() => {
        getOrders({
            sts: status,
            pg: 1
        });
    }, [status]);


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
                {bookings?.length > 0 && (
                    bookings.map(item => (
                        <BookingItem
                            key={item.id}
                            booking={item}
                        />
                    ))
                )}
            </div>

            {meta?.itemCount > 0 && (
                <Pagination
                    className="pagination-bar"
                    currentPage={meta.page}
                    totalCount={meta.itemCount}
                    pageSize={meta.size}
                    onPageChange={setPage}
                />
            )}
        </section>
    );
};

export default ManageBoooking;
