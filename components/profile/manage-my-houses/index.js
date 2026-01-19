'use client';

import SelectField from 'components/common/form/SelectField';
import Pagination from 'components/common/pagination';
import MyHouseItem from 'components/profile/my-house-item';
import { getMyRooms } from 'lib/api/room.api';
import { RoomStatusLabels } from 'lib/constants/data';
import { buildSelectOptions } from 'lib/utils';
import NProgress from 'nprogress';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';

const ManageMyHouses = () => {
    const [houses, setHouses] = useState([]);
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

    const getHouses = async ({ sts, pg }) => {
        try {
            NProgress.start();

            const s = sts ?? status;
            const payload = {
                size: 10,
                is_pagin: true,
                page: pg ?? page,
                ...(s && { status: s }),
            };

            const res = await getMyRooms(payload);
            if (res?.success) {
                const { data, meta } = res.result;
                setHouses(data);
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
        getHouses({
            sts: undefined,
            pg: page,
        });
    }, [page]);

    useEffect(() => {
        getHouses({
            sts: status,
            pg: 1,
        });
        setPage(1);
    }, [status]);

    const statusOptions = buildSelectOptions(
        RoomStatusLabels,
        '-- Tất cả trạng thái --'
    );

    return (
        <section className="manage-house">
            <div className="p-header">
                <p className="p-title">Danh sách nhà của tôi</p>

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

            <div className="m-h-content">
                {houses?.length > 0 && (
                    houses.map(item => (
                        <MyHouseItem
                            key={item.id}
                            house={item}
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

export default ManageMyHouses;
