import { useEffect, useRef, useState } from 'react';
import { useWatch } from 'react-hook-form';

import InputField from 'components/common/form/InputField';
import SelectField from 'components/common/form/SelectField';

import {
  buildAddressDetail,
  getDistrictOptions,
  getLocationsSync,
  getProvinceOptions,
  getWardOptions,
} from 'lib/locations/location.utils';

import {
  ALLOWED_DISTRICTS,
  DEFAULT_PROVINCE_ID
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

  /* ================= REFS ================= */
  const mountedRef = useRef(false);
  const prevProvinceRef = useRef(null);
  const prevDistrictRef = useRef(null);

  /* ================= LOAD PROVINCES (ONCE) ================= */
  useEffect(() => {
    mountedRef.current = true;

    (async () => {
      try {
        await getLocationsSync();

        const provinceOptions = await getProvinceOptions();
        if (!mountedRef.current) return;

        setProvinces(provinceOptions);

        // set default province only if empty
        if (!province) {
          setValue(
            'location.province',
            String(DEFAULT_PROVINCE_ID),
            { shouldDirty: false, shouldTouch: false }
          );
        }
      } catch {
        // silent fail (production safe)
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

      // setDistricts(districtOptions);

      const filteredDistricts = districtOptions.filter(d =>
        ALLOWED_DISTRICTS.includes(String(d.value))
      );

      if (!mountedRef.current) return;

      setDistricts(filteredDistricts);

      if (prevProvinceRef.current !== province) {
        setWards([]);
      }

      const provinceChanged =
        prevProvinceRef.current &&
        prevProvinceRef.current !== province;

      const invalidDistrict =
        district &&
        !ALLOWED_DISTRICTS.includes(String(district));

      if (provinceChanged || invalidDistrict) {
        setValue('location.district', '', { shouldDirty: false });
        setValue('location.ward', '', { shouldDirty: false });
      }

      prevProvinceRef.current = province;
    })();
  }, [province]);

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

        if (prevDistrictRef.current && prevDistrictRef.current !== district) {
          setValue('location.ward', '', { shouldDirty: false });
        }

        prevDistrictRef.current = district;
      } catch {
        // silent fail
      }
    })();
  }, [province, district]);

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
  }, [province, district, ward, street, houseNumber]);

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
          options={district ? wards : []}
          disabled={false} // ⚠️ tránh bug iOS
          required={required}
        />

        <InputField
          label="Tên đường"
          name="location.street"
          placeholder="Nhập tên đường"
          control={control}
          required={required}
        />
      </div>

      <div className="form-row">
        <InputField
          label="Số nhà"
          placeholder="Nhập số nhà"
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
          placeholder="Địa chỉ hiển thị trên website"
          name="location.address_detail_display"
          control={control}
        />
      </div>
    </>
  );
};

export default LocationSelect;
