import { useController } from 'react-hook-form';

const RadioGroupCheckbox = ({
    label,
    name,
    options = [],
    control,
    rules,
    error,
    inline = false,
    required = false,
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
                {label && (
                    <label>
                        {label}
                        {required && <span className="required">*</span>}
                    </label>
                )}

                <div className={`radio-wrapper ${inline ? 'inline' : ''}`}>
                    {options.map((item) => (
                        <label key={item.value} className="radio">
                            <input
                                type="radio"
                                name={name}
                                value={item.value}
                                checked={value === item.value}
                                onChange={() => onChange(item.value)}
                                onBlur={onBlur}
                                ref={ref}
                            />

                            <span className="radio-check" />
                            <p>{item.label}</p>
                        </label>
                    ))}
                </div>
            </div>

            {error && (
                <p className="message message-error">
                    {error.message}
                </p>
            )}
        </div>
    );
};

export default RadioGroupCheckbox;
