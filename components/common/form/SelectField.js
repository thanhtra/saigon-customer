import { memo } from 'react';
import { useController } from 'react-hook-form';

const SelectField = ({
    label,
    name,
    control,
    options = [],
    disabled = false,
    required = false,
    rules,
    className = '',
    lbl = '-- Chọn --',
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

    return (
        <div className="form-group">
            <div className={`form-select ${className} ${hasLabel ? 'has-label' : ''} ${error ? 'has-error' : ''}`}>
                <label htmlFor={name}>
                    {label}
                    {required && <span className="required">*</span>}
                </label>

                <select
                    id={name}
                    {...field}
                    value={String(field.value ?? '')}
                    disabled={disabled}
                >
                    <option value="">{lbl}</option>

                    {options.map((opt, index) => (
                        <option
                            key={`${name}-${opt?.value}-${index}`}
                            value={String(opt?.value ?? '')}
                        >
                            {opt?.label}
                        </option>
                    ))}
                </select>
            </div>

            {error && (
                <p className="message message-error">{error.message}</p>
            )}
        </div>
    );
};

export default memo(SelectField);
