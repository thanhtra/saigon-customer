// import { memo } from 'react';
// import { useController } from 'react-hook-form';

// const InputField = ({
//   label,
//   name,
//   type = 'text',
//   placeholder,
//   required = false,
//   control,
//   rules,
//   disabled = false,
//   rows = 4
// }) => {
//   const controller = useController({
//     name,
//     control,
//     rules,
//   });

//   const field = controller?.field;
//   const error = controller?.fieldState?.error;

//   const isTextarea = type === 'textarea';
//   const isDateTime = type === 'datetime-local';

//   const errorMessage = error?.message;

//   return (
//     <div className="form-group">
//       <div className={`form-input has-label ${errorMessage ? 'has-error' : ''}`}>
//         <label htmlFor={name}>
//           {label}
//           {required && <span className="required">*</span>}
//         </label>

//         {isTextarea ? (
//           <textarea
//             id={name}
//             placeholder={placeholder}
//             disabled={disabled}
//             rows={rows}
//             {...field}
//             onInput={(e) => {
//               e.target.style.height = 'auto';
//               e.target.style.height = `${e.target.scrollHeight}px`;
//             }}
//           />
//         ) : (
//           <input
//             id={name}
//             type={type}
//             placeholder={placeholder}
//             autoComplete="off"
//             disabled={disabled}
//             {...field}
//           />
//         )}
//       </div>

//       {errorMessage && (
//         <p className="message message-error">{errorMessage}</p>
//       )}
//     </div>
//   );
// };

// export default memo(InputField);

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
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
  });

  const isTextarea = type === 'textarea';
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
          // <input
          //   id={name}
          //   type={type}
          //   placeholder={placeholder}
          //   autoComplete="off"
          //   disabled={disabled}
          //   value={field.value ?? ''}
          //   min={0}
          //   step={1000}
          //   onChange={(e) => {
          //     if (type === 'number') {
          //       const v = e.target.value;
          //       field.onChange(v === '' ? null : Number(v));
          //     } else {
          //       field.onChange(e.target.value);
          //     }
          //   }}
          //   onBlur={field.onBlur}
          //   ref={field.ref}
          // />
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

