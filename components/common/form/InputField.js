import { useController } from 'react-hook-form';

const InputField = ({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  control,
  rules = {},
  error,
}) => {
  const {
    field: { value, onChange, onBlur, ref },
  } = useController({
    name,
    control,
    rules,
  });

  return (
    <div className="form-col">
      <div className="form-input has-label">
        <label>
          {label}
          {required && <span className="required">*</span>}
        </label>

        <input
          type={type}
          placeholder={placeholder}
          autoComplete="off"
          value={value || ''}
          onChange={onChange}
          onBlur={onBlur}
          ref={ref}
        />
      </div>

      {error && (
        <p className="message message-error">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default InputField;
