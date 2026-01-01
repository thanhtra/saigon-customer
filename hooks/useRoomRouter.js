import { useRouter } from 'next/router';
import { useCallback } from 'react';
import isEqual from 'lodash/isEqual';

export const useRoomRouter = () => {
    const router = useRouter();

    const cleanQuery = query => {
        const cleaned = {};

        Object.entries(query).forEach(([key, value]) => {
            if (
                value !== '' &&
                value !== undefined &&
                value !== null
            ) {
                cleaned[key] = value;
            }
        });

        return cleaned;
    };

    const search = useCallback(
        params => {
            const nextQuery = cleanQuery({
                ...router.query,
                ...params,
                page: 1,
            });

            const currentQuery = cleanQuery(router.query);

            // 🚨 QUAN TRỌNG: nếu không đổi thì KHÔNG push
            if (isEqual(currentQuery, nextQuery)) return;

            router.push(
                {
                    pathname: router.pathname,
                    query: nextQuery,
                },
                undefined,
                { shallow: false }
            );
        },
        [router]
    );

    const paginate = useCallback(
        page => {
            const nextQuery = {
                ...router.query,
                page,
            };

            router.push({
                pathname: router.pathname,
                query: nextQuery,
            });
        },
        [router]
    );

    return {
        query: router.query,
        search,
        paginate,
    };
};
