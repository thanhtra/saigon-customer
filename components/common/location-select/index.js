
import { useEffect, useRef, useState } from 'react';
import { useWatch } from 'react-hook-form';

import InputField from 'components/common/form/InputField';
import SelectField from 'components/common/form/SelectField';

import {
  getProvinceOptions,
  getDistrictOptions,
  getWardOptions,
  buildAddressDetail,
  getLocationsSync,
} from 'lib/locations/location.utils';

import {
  DEFAULT_PROVINCE_ID,
  DEFAULT_DISTRICT_ID,
} from 'lib/locations/const';

const LocationSelect = ({
  control,
  setValue,
  disabledProvince = true,
  disabledDistrict = true,
  required = true,
}) => {
  /* ================= WATCH ================= */
  const province = useWatch({ control, name: 'location.province' });
  const district = useWatch({ control, name: 'location.district' });
  const ward = useWatch({ control, name: 'location.ward' });
  const street = useWatch({ control, name: 'location.street' });
  const houseNumber = useWatch({ control, name: 'location.house_number' });

  /* ================= STATE ================= */
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const mountedRef = useRef(false);
  const initializedRef = useRef(false);

  /* ================= LOAD PROVINCES (ONCE) ================= */
  useEffect(() => {
    mountedRef.current = true;

    (async () => {
      try {
        await getLocationsSync();
        const provinceOptions = await getProvinceOptions();
        if (!mountedRef.current) return;

        setProvinces(provinceOptions);

        // set default province (only first time, if empty)
        if (!province) {
          setValue(
            'location.province',
            String(DEFAULT_PROVINCE_ID),
            { shouldDirty: false, shouldTouch: false }
          );
        }
      } catch (e) {
        // console.error('Load provinces failed', e);
      }
    })();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  /* ================= PROVINCE CHANGE ================= */
  useEffect(() => {
    if (!province) {
      setDistricts([]);
      setWards([]);
      return;
    }

    (async () => {
      const districtOptions = await getDistrictOptions(province);
      if (!mountedRef.current) return;

      setDistricts(districtOptions);
      setWards([]);

      if (!district) {
        setValue(
          'location.district',
          String(DEFAULT_DISTRICT_ID),
          { shouldDirty: false }
        );
      }
    })();
  }, [province, district, setValue]);


  /* ================= DISTRICT CHANGE ================= */
  useEffect(() => {
    if (!province || !district) {
      setWards([]);
      return;
    }

    (async () => {
      try {
        const wardOptions = await getWardOptions(province, district);
        if (!mountedRef.current) return;

        setWards(wardOptions);

        if (initializedRef.current) {
          setValue('location.ward', '');
        } else {
          // mark init done
          initializedRef.current = true;
        }
      } catch (e) {
        // console.error('Load wards failed', e);
      }
    })();
  }, [province, district, setValue]);

  /* ================= BUILD ADDRESS ================= */
  useEffect(() => {
    if (!province || !district) return;

    const address = buildAddressDetail({
      provinceId: province,
      districtId: district,
      wardId: ward,
      street,
      houseNumber,
    });

    setValue('location.address_detail', address, { shouldDirty: false });
    setValue('location.address_detail_display', address, { shouldDirty: false });
  }, [province, district, ward, street, houseNumber, setValue]);

  /* ================= RENDER ================= */
  return (
    <>
      <div className="form-row">
        <SelectField
          label="Tỉnh / Thành"
          name="location.province"
          control={control}
          options={provinces}
          disabled={disabledProvince}
          required={required}
        />

        <SelectField
          label="Quận / Huyện"
          name="location.district"
          control={control}
          options={districts}
          disabled={disabledDistrict || !province}
          required={required}
        />
      </div>

      <div className="form-row">
        <SelectField
          label="Phường / Xã"
          name="location.ward"
          control={control}
          options={wards}
          disabled={!district}
          required={required}
        />

        <InputField
          label="Tên đường"
          name="location.street"
          control={control}
          required={required}
        />
      </div>

      <div className="form-row">
        <InputField
          label="Số nhà"
          name="location.house_number"
          control={control}
          required={required}
        />

        <InputField
          label="Địa chỉ thực tế"
          name="location.address_detail"
          control={control}
          disabled
        />
      </div>

      <div className="form-row inline">
        <InputField
          label="Địa chỉ hiển thị (có thể chỉnh)"
          name="location.address_detail_display"
          control={control}
        />
      </div>
    </>
  );
};

export default LocationSelect;
