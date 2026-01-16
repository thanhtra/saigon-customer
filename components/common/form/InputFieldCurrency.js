import { memo, useEffect, useState } from 'react';
import { useController } from 'react-hook-form';
import { formatNumber, parseNumber } from 'lib/utils';

const InputFieldCurrency = ({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  control,
  rules,
  disabled = false,
  rows = 4,
  inputProps = {},
}) => {
  const { field, fieldState } = useController({
    name,
    control,
    rules,
  });

  const errorMessage = fieldState?.error?.message;
  const isTextarea = type === 'textarea';
  const isNumber = type === 'number';

  const [displayValue, setDisplayValue] = useState('');

  /* ===== Sync value từ RHF → UI ===== */
  useEffect(() => {
    if (!isNumber) return;

    if (field.value === null || field.value === undefined) {
      setDisplayValue('');
    } else {
      setDisplayValue(formatNumber(field.value));
    }
  }, [field.value, isNumber]);

  return (
    <div className="form-group">
      <div className={`form-input has-label ${errorMessage ? 'has-error' : ''}`}>
        <label htmlFor={name}>
          {label}
          {required && <span className="required">*</span>}
        </label>

        {isTextarea ? (
          <textarea
            id={name}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            {...field}
          />
        ) : (
          <input
            id={name}
            type={isNumber ? 'text' : type}
            placeholder={placeholder}
            autoComplete="off"
            disabled={disabled}
            {...inputProps}
            value={isNumber ? displayValue : field.value ?? ''}
            onChange={(e) => {
              if (!isNumber) {
                field.onChange(e);
                return;
              }

              // Chỉ cho phép số
              const rawValue = e.target.value.replace(/[^\d]/g, '');

              // 👇 Xoá hết → NULL (không hiện 0)
              if (!rawValue) {
                setDisplayValue('');
                field.onChange(null);
                return;
              }

              setDisplayValue(rawValue);
              field.onChange(parseNumber(rawValue));
            }}
            onBlur={() => {
              if (!isNumber) return;

              // NULL = miễn phí → giữ trống
              if (field.value === null) {
                setDisplayValue('');
                return;
              }

              setDisplayValue(formatNumber(field.value));
            }}
          />
        )}
      </div>

      {errorMessage && (
        <p className="message message-error">{errorMessage}</p>
      )}
    </div>
  );
};

export default memo(InputFieldCurrency);
