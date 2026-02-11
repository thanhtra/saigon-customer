'use client';

import { Controller } from 'react-hook-form';
import { Editor } from '@tinymce/tinymce-react';

export default function FormTinyMCE({
    name,
    control,
    label,
    height = 350,
    required = false,
    className = '',
}) {
    return (
        <Controller
            name={name}
            control={control}
            rules={
                required
                    ? {
                        validate: (value) =>
                            value &&
                                value
                                    .replace(/<[^>]*>/g, '')
                                    .trim().length > 0
                                ? true
                                : 'Vui lòng nhập mô tả',
                    }
                    : {}
            }
            render={({ field, fieldState }) => (
                <div className={`form-tinymce ${className}`}>
                    {label && (
                        <label className="form-label">
                            {label}
                            {required && <span className="required">*</span>}
                        </label>
                    )}

                    <Editor
                        apiKey={'f9ktuir6ojue58jjipwb83a997lszn3ut2ppmdg4zve0fcpk'}
                        value={field.value || ''}
                        onEditorChange={(content) =>
                            field.onChange(content)
                        }
                        init={{
                            height,
                            menubar: false,
                            branding: false,
                            plugins: [
                                'advlist',
                                'autolink',
                                'lists',
                                'link',
                                'image',
                                'media',
                                'table',
                                'code',
                                'fullscreen',
                                'wordcount',
                            ],
                            toolbar:
                                'undo redo | formatselect | ' +
                                'bold italic underline | forecolor | ' +
                                'alignleft aligncenter alignright | ' +
                                'bullist numlist | link image media | ' +
                                'removeformat | code fullscreen',
                            content_style:
                                'body { font-family: Arial; font-size: 14px }',
                        }}
                    />

                    {fieldState.error && (
                        <p className="message message-error">
                            {fieldState.error.message}
                        </p>
                    )}
                </div>
            )}
        />
    );
}
