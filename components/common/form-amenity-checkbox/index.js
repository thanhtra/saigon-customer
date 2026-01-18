import { useController } from 'react-hook-form';
import { RentalAmenityOptions, RentalAmenity } from 'lib/constants/data';

const FormAmenityCheckbox = ({
    label = 'Tiện ích',
    name,
    control,
    rules,
    inline = false,
    required = false,
}) => {
    const {
        field: { value = [], onChange, onBlur, ref },
        fieldState: { error },
    } = useController({
        name,
        control,
        rules,
        defaultValue: [],
    });

    const handleToggle = (amenity) => {
        if (value.includes(amenity)) {
            onChange(value.filter((v) => v !== amenity));
        } else {
            onChange([...value, amenity]);
        }
    };

    return (
        <div className="form-group height-auto">
            <div className={`form-input has-label ${error ? 'has-error' : ''}`}>
                {label && (
                    <label>
                        {label}
                        {required && <span className="required">*</span>}
                    </label>
                )}

                <div className={`checkbox-wrapper checkbox-grid ${inline ? 'inline' : ''}`}>
                    {Object.values(RentalAmenity).map((amenity) => (
                        <label key={amenity} className="checkbox">
                            <input
                                type="checkbox"
                                name={name}
                                value={amenity}
                                checked={value.includes(amenity)}
                                onChange={() => handleToggle(amenity)}
                                onBlur={onBlur}
                                ref={ref}
                            />

                            <span className="checkbox-check" />
                            <p>{RentalAmenityOptions[amenity]}</p>
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

export default FormAmenityCheckbox;
