
import SelectField from 'components/common/form/SelectField';
import Pagination from 'components/common/pagination';
import MyHouseItem from 'components/profile/my-house-item';
import { getMyRooms } from 'lib/api/room.api';
import { RoomStatusLabelsFilter } from 'lib/constants/data';
import { buildSelectOptions } from 'lib/utils';
import NProgress from 'nprogress';
import { useEffect, useState, useCallback } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'react-toastify';

const ManageMyHouses = () => {
    const [houses, setHouses] = useState([]);
    const [meta, setMeta] = useState({});
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


    const getHouses = useCallback(
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

                const res = await getMyRooms(payload);
                if (res?.success) {
                    setHouses(res.result.data);
                    setMeta(res.result.meta);
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

    const changePage = useCallback((nextPage) => {
        // nextPage là 1-based (đã convert từ Pagination)
        if (nextPage === page) return; // tránh re-render & call API dư

        setPage(nextPage);
    }, [page]);

    const statusOptions = buildSelectOptions(
        RoomStatusLabelsFilter,
        '-- Tất cả trạng thái --'
    );

    return (
        <section className="manage-house">
            <div className="p-header">
                <p className="p-title">Danh sách nhà của tôi</p>

                <div className='p-filter'>
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
            </div>

            <div className="m-h-content">
                {houses?.length > 0 && (
                    houses.map(item => (
                        <MyHouseItem
                            key={item.id}
                            house={item}
                            onStatusUpdated={() => {
                                getHouses({ pg: page });
                            }}
                        />
                    ))
                )}
            </div>

            <Pagination
                currentPage={meta.page - 1}          // 👈 convert 1-based → 0-based
                totalCount={meta.itemCount}
                pageSize={meta.size}
                onPageChange={(pageIndex) => changePage(pageIndex + 1)} // 👈 trả lại BE
            />
        </section>
    );
};

export default ManageMyHouses;
