const CheckboxGroup = ({
  label,
  name,
  options,
  required = false,
  register,
  rules = {},
  error,
  inline = false,
}) => {
  return (
    <div className="form-col">
      {/* LABEL */}
      {label && (
        <label>
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}

      {/* CHECKBOX GROUP */}
      <div className={`checkbox-wrapper ${inline ? 'inline' : ''}`}>
        {Object.entries(options).map(([value, text]) => (
          <label key={value} className="checkbox">
            <input
              type="checkbox"
              value={value}
              {...register(name, rules)}
            />
            <span className="checkbox-check"></span>
            <p>{text}</p>
          </label>
        ))}
      </div>

      {/* ERROR */}
      {error && (
        <p className="message message-error">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default CheckboxGroup;
