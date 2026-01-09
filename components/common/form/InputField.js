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
}) => {
  const controller = useController({
    name,
    control,
    rules,
  });

  const field = controller?.field;
  const error = controller?.fieldState?.error;

  const isTextarea = type === 'textarea';
  const isDateTime = type === 'datetime-local';

  const errorMessage = error?.message;

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
            rows={4}
            {...field}
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
            {...field}
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
