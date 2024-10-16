import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import './DynamicForm.css'; 

const createValidationSchema = (formConfig) => {
  const schema = {};
  formConfig.forEach((field) => {
    if (field.validations) {
      let fieldSchema = yup.string();
      field.validations.forEach((validation) => {
        switch (validation.type) {
          case 'required':
            fieldSchema = fieldSchema.required('This field is required.');
            break;
          case 'minLength':
            fieldSchema = fieldSchema.min(validation.value, `Must be at least ${validation.value} characters long.`);
            break;
          case 'maxLength':
            fieldSchema = fieldSchema.max(validation.value, `Must be at most ${validation.value} characters long.`);
            break;
          case 'email':
            fieldSchema = fieldSchema.email('Invalid email address.');
            break;
          default:
            break;
        }
      });
      schema[field.name] = fieldSchema;
    }
  });
  return yup.object().shape(schema);
};

const renderField = (field, control, errors) => {
  const { name, type, gridLayout, label, options } = field;
  const error = errors[name]?.message;

  switch (type) {
    case 'text':
    case 'number':
      return (
        <div className={`mb-3 ${gridLayout}`} key={name}>
          <label htmlFor={name} className="form-label">{label}</label>
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <input
                type={type}
                id={name}
                {...field}
                className={`form-control ${error ? 'is-invalid' : ''}`}
              />
            )}
          />
          {error && <div className="invalid-feedback">{error}</div>}
        </div>
      );
    case 'select':
      return (
        <div className={`mb-3 ${gridLayout}`} key={name}>
          <label htmlFor={name} className="form-label">{label}</label>
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <select id={name} {...field} className={`form-select ${error ? 'is-invalid' : ''}`}>
                {options.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          />
          {error && <div className="invalid-feedback">{error}</div>}
        </div>
      );
    case 'radio':
      return (
        <div className={`mb-3 ${gridLayout}`} key={name}>
          <label className="form-label">{label}</label>
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <div>
                {options.map(option => (
                  <div key={option.value} className="form-check">
                    <input
                      type="radio"
                      value={option.value}
                      {...field}
                      className="form-check-input"
                      id={`${name}-${option.value}`}
                    />
                    <label className="form-check-label" htmlFor={`${name}-${option.value}`}>
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            )}
          />
          {error && <div className="invalid-feedback">{error}</div>}
        </div>
      );
    case 'checkbox':
      return (
        <div className={`mb-3 ${gridLayout}`} key={name}>
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <div className="form-check">
                <input
                  type="checkbox"
                  {...field}
                  className="form-check-input"
                  id={name}
                />
                <label className="form-check-label" htmlFor={name}>
                  {label}
                </label>
              </div>
            )}
          />
          {error && <div className="invalid-feedback">{error}</div>}
        </div>
      );
    case 'file':
      return (
        <div className={`mb-3 ${gridLayout}`} key={name}>
          <label htmlFor={name} className="form-label">{label}</label>
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <input
                type="file"
                id={name}
                {...field}
                className={`form-control ${error ? 'is-invalid' : ''}`}
              />
            )}
          />
          {error && <div className="invalid-feedback">{error}</div>}
        </div>
      );
    case 'slider':
      return (
        <div className={`mb-3 ${gridLayout}`} key={name}>
          <label htmlFor={name} className="form-label">{label}</label>
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <input
                type="range"
                id={name}
                {...field}
                className={`form-range ${error ? 'is-invalid' : ''}`}
              />
            )}
          />
          {error && <div className="invalid-feedback">{error}</div>}
        </div>
      );
    default:
      return null;
  }
};

const DynamicForm = ({ formConfig, onSubmit }) => {
  const schema = createValidationSchema(formConfig);
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit(onSubmit)} className="needs-validation" noValidate>
        {formConfig.map((field) => renderField(field, control, errors))}
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default DynamicForm;
