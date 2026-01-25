import { useCallback, useState } from 'react';
import { post } from './index';

const useUploadImages = () => {
    const [loading, setLoading] = useState(false);

    const uploadImages = useCallback(async (files, options) => {
        setLoading(true);

        try {
            if (!files || !files.length) {
                throw new Error('No files to upload');
            }

            if (!options?.domain) {
                throw new Error('Upload domain is required');
            }

            const formData = new FormData();

            /* ===== REQUIRED ===== */
            formData.append('domain', options.domain);

            /* ===== OPTIONAL IDS ===== */
            if (options.room_id) {
                formData.append('room_id', options.room_id);
            }

            if (options.real_estate_id) {
                formData.append('real_estate_id', options.real_estate_id);
            }

            if (options.contract_id) {
                formData.append('contract_id', options.contract_id);
            }

            /* ===== FILES + COVER FLAG ===== */
            files.forEach((item, index) => {
                // item = { file, is_cover }
                if (item?.file instanceof File) {
                    formData.append('files', item.file);
                    formData.append(`is_cover[${index}]`, String(!!item.is_cover));
                }
            });

            return await post('/uploads/multiple', formData);
        } finally {
            setLoading(false);
        }
    }, []);

    return { uploadImages, loading };
};

export default useUploadImages;
