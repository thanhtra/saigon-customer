import { memo } from 'react';
import { useController } from 'react-hook-form';

const InputField = ({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  control,
  rules,
  disabled = false,
  rows = 4,
  hasLabel = true
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules: {
      ...(required && { required: 'Trường này là bắt buộc' }),
      ...rules,
    },
  });

  const isTextarea = type === 'textarea';
  const errorMessage = error?.message;

  return (
    <div className="form-group">
      <div className={`form-input ${hasLabel ? 'has-label' : ''} ${errorMessage ? 'has-error' : ''}`}>
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
            value={field.value ?? ''}
            onChange={field.onChange}
            onBlur={field.onBlur}
            ref={field.ref}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
          />
        ) : (
          <input
            id={name}
            type={type}
            placeholder={placeholder}
            autoComplete="off"
            disabled={disabled}
            value={field.value ?? ''}
            min={type === 'number' ? 0 : undefined}
            step={
              type === 'number'
                ? 1000
                : type === 'datetime-local'
                  ? 60
                  : undefined
            }
            onChange={(e) => {
              if (type === 'number') {
                const v = e.target.value;
                field.onChange(v === '' ? null : Number(v));
              } else {
                field.onChange(e.target.value);
              }
            }}
            onBlur={field.onBlur}
            ref={field.ref}
          />

        )}
      </div>

      {errorMessage && (
        <p className="message message-error">{errorMessage}</p>
      )}
    </div>
  );
};

export default memo(InputField);

