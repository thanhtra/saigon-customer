import NProgress from 'nprogress';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import InputField from 'components/common/form/InputField';
import SelectField from 'components/common/form/SelectField';
import Pagination from 'components/common/pagination';
import CustomerItem from 'components/profile/customer-item';

import { getMyCustomers } from 'lib/api/booking.api';
import { BookingStatusLabels } from 'lib/constants/data';
import { buildSelectOptions } from 'lib/utils';

const PAGE_SIZE = 10;

const COMMISSION_OPTIONS = [
    { label: 'Tất cả hoa hồng', value: '' },
    { label: 'Chưa chi', value: 'false' },
    { label: 'Đã chi', value: 'true' },
];

const ManageCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [meta, setMeta] = useState(null);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState(null);

    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            key_search: '',
            status: '',
            is_paid_commission: '',
        },
    });

    const statusOptions = useMemo(
        () =>
            buildSelectOptions(
                BookingStatusLabels,
                'Tất cả trạng thái',
            ),
        [],
    );

    const buildPayload = useCallback(
        (currentPage, data) => ({
            page: currentPage,
            size: PAGE_SIZE,
            is_pagin: true,
            ...(data.key_search && { key_search: data.key_search }),
            ...(data.status && { status: data.status }),
            ...(data.is_paid_commission !== undefined && data.is_paid_commission !== '' && { is_paid_commission: data.is_paid_commission === 'true' }),
        }),
        [],
    );

    const fetchCustomers = useCallback(
        async (currentPage, data) => {
            try {
                NProgress.start();
                const res = await getMyCustomers(
                    buildPayload(currentPage, data),
                );

                if (!res?.success) {
                    toast.error(
                        'Không thể tải danh sách khách hàng',
                    );
                    return;
                }

                setCustomers(res.result.data);
                setMeta(res.result.meta);
            } catch {
                toast.error('Có lỗi xảy ra');
            } finally {
                NProgress.done();
            }
        },
        [buildPayload],
    );

    const onSearch = (data) => {
        setPage(1);
        setFilters(data);
        fetchCustomers(1, data);
    };

    const onReset = () => {
        reset();
        setPage(1);
        setFilters(null);
        fetchCustomers(1, {});
    };

    useEffect(() => {
        if (filters) {
            fetchCustomers(page, filters);
        }
    }, [page]);

    useEffect(() => {
        fetchCustomers(1, {});
    }, []);

    return (
        <section className="manage-customer">
            <header className="p-header">
                <p className="p-title">Khách hàng của tôi</p>
                <div className='p-filter'>
                    <form className="form filters" onSubmit={handleSubmit(onSearch)}>
                        <InputField
                            name="key_search"
                            hasLabel={false}
                            control={control}
                            placeholder="Tên hoặc số điện thoại"
                        />

                        <div className='two-col'>
                            <SelectField
                                name="status"
                                control={control}
                                options={statusOptions}
                                lbl='Trạng thái'
                                hasLabel={false}
                            />

                            <SelectField
                                name="is_paid_commission"
                                control={control}
                                options={COMMISSION_OPTIONS}
                                lbl='Hoa hồng'
                                hasLabel={false}
                            />
                        </div>

                        <div className="button-group">
                            <button type="button" className="btn btn-border" onClick={onReset}>
                                Đặt lại
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Tìm kiếm
                            </button>
                        </div>
                    </form>
                </div>
            </header>

            <div className="list">
                {customers.length > 0 ? (
                    customers.map((customer) => (
                        <CustomerItem
                            key={customer.id}
                            customer={customer}
                        />
                    ))
                ) : (
                    <p className="empty-text">
                        Không có khách hàng
                    </p>
                )}
            </div>

            {meta && (
                <Pagination
                    currentPage={meta.page - 1}
                    totalCount={meta.itemCount}
                    pageSize={meta.size}
                    onPageChange={(pageIndex) =>
                        setPage(pageIndex + 1)
                    }
                />
            )}
        </section>
    );
};

export default ManageCustomers;
