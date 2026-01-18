import { memo } from 'react';
import { useController } from 'react-hook-form';

const CardSelectField = ({
    label,
    name,
    control,
    options = [],
    disabled = false,
    required = false,
    rules = {},
}) => {
    const {
        field,
        fieldState: { error },
    } = useController({
        name,
        control,
        rules: {
            ...(required && { required: 'Vui lòng chọn' }),
            ...rules,
        },
    });

    const handleSelect = (value) => {
        if (disabled) return;
        field.onChange(value);
    };

    return (
        <div className="form-group">
            {/* {label && (
                <label className="form-label">
                    {label}
                    {required && <span className="required">*</span>}
                </label>
            )} */}

            <div className={`card-select ${error ? 'has-error' : ''}`}>
                {options.map((opt, index) => {
                    const isActive = field.value === opt.value;

                    return (
                        <div
                            key={`${name}-${opt.value}-${index}`}
                            className={`card-option ${isActive ? 'active' : ''} ${disabled ? 'disabled' : ''
                                }`}
                            onClick={() => handleSelect(opt.value)}
                        >
                            {opt.icon && (
                                <div className="card-icon">{opt.icon}</div>
                            )}
                            <p className="card-label">{opt.label}</p>
                        </div>
                    );
                })}
            </div>

            {error && (
                <p className="message message-error">{error.message}</p>
            )}
        </div>
    );
};

export default memo(CardSelectField);
