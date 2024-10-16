// src/App.js
import React, { useState } from 'react';
import DynamicForm from './DynamicForm';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [formConfig, setFormConfig] = useState([
    {
      type: 'text',
      name: 'firstName',
      label: 'First Name',
      gridLayout: 'grid-1',
      validations: [
        { type: 'required' },
        { type: 'minLength', value: 2 }
      ]
    },
    {
      type: 'text',
      name: 'lastName',
      label: 'Last Name',
      gridLayout: 'grid-2',
      validations: [
        { type: 'required' },
      ]
    },
    {
      type: 'number',
      name: 'age',
      label: 'Age',
      gridLayout: 'grid-2',
      validations: [
        { type: 'required' },
        { type: 'minLength', value: 1 }
      ]
    },
    {
      type: 'select',
      name: 'gender',
      label: 'Gender',
      gridLayout: 'grid-2',
      options: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
      ],
      validations: [
        { type: 'required' },
      ]
    },
    {
      type: 'radio',
      name: 'newsletter',
      label: 'Subscribe to Newsletter',
      gridLayout: 'grid-1',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ]
    },
    {
      type: 'checkbox',
      name: 'terms',
      label: 'I agree to the terms and conditions',
      gridLayout: 'grid-1',
      validations: [
        { type: 'required' },
      ]
    },
    {
      type: 'file',
      name: 'resume',
      label: 'Upload Resume',
      gridLayout: 'grid-2'
    },
    {
      type: 'slider',
      name: 'experienceLevel',
      label: 'Experience Level',
      gridLayout: 'grid-2'
    }
  ]);

  const [newFieldType, setNewFieldType] = useState('');
  const [newFieldName, setNewFieldName] = useState('');
  const [selectedValidations, setSelectedValidations] = useState([]);
  const [validationValue, setValidationValue] = useState('');
  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState('');

  const handleAddField = () => {
    if (!newFieldType || !newFieldName) return;

    const newField = {
      type: newFieldType,
      name: newFieldName,
      label: `${newFieldName.charAt(0).toUpperCase() + newFieldName.slice(1)} Field`,
      gridLayout: 'grid-2',
      validations: selectedValidations.map(validation => ({
        ...validation,
        value: (validation.type === 'minLength' || validation.type === 'maxLength') ? validationValue : undefined
      }))
    };

    if (newFieldType === 'radio') {
      newField.options = [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ];
    } else if (newFieldType === 'select') {
      newField.options = options;
    }

    if (newFieldType === 'email') {
      newField.validations.push({ type: 'email' }); // Add email validation for email fields
    }

    setFormConfig((prevConfig) => [...prevConfig, newField]);
    setNewFieldType('');
    setNewFieldName('');
    setSelectedValidations([]);
    setValidationValue('');
    setOptions([]);
    setNewOption('');
  };

  const handleFieldTypeChange = (event) => {
    setNewFieldType(event.target.value);
    if (event.target.value === 'select') {
      setOptions([]);
    }
  };

  const handleFieldNameChange = (event) => {
    setNewFieldName(event.target.value);
  };

  const handleValidationChange = (event) => {
    const { value, checked } = event.target;

    if (checked) {
      setSelectedValidations((prev) => [...prev, { type: value }]);
    } else {
      setSelectedValidations((prev) => prev.filter(v => v.type !== value));
    }
  };

  const handleValidationValueChange = (event) => {
    setValidationValue(event.target.value);
  };

  const handleOptionChange = (event) => {
    setNewOption(event.target.value);
  };

  const handleAddOption = () => {
    if (newOption) {
      setOptions((prev) => [...prev, { value: newOption, label: newOption }]);
      setNewOption('');
    }
  };

  const handleSubmit = (formData) => {
    console.log('Form Data:', formData);
    const jsonData = JSON.stringify(formData);
    console.log('Form Submitted:', jsonData);
    alert('Form submitted successfully!');
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Dynamic Form</h1>
      <div className="mb-4">
        <label htmlFor="fieldName" className="form-label">Field Name:</label>
        <input
          type="text"
          id="fieldName"
          value={newFieldName}
          onChange={handleFieldNameChange}
          className="form-control"
          placeholder="Enter field name"
        />

        <label htmlFor="fieldType" className="form-label mt-3">Select Field Type to Add:</label>
        <select id="fieldType" value={newFieldType} onChange={handleFieldTypeChange} className="form-select">
          <option value="">Select Field Type</option>
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="slider">Slider</option>
          <option value="radio">Radio</option>
          <option value="checkbox">Checkbox</option>
          <option value="select">Select</option>
          <option value="email">Email</option>
        </select>

        <div className="mt-4">
          <h5>Validations:</h5>
          <div className="d-flex flex-column">
            <label className="form-check">
              <input type="checkbox" value="required" onChange={handleValidationChange} className="form-check-input" /> 
              <span className="form-check-label">Required</span>
            </label>
            <label className="form-check">
              <input type="checkbox" value="minLength" onChange={handleValidationChange} className="form-check-input" /> 
              <span className="form-check-label">Minimum Length</span>
            </label>
            <label className="form-check">
              <input type="checkbox" value="maxLength" onChange={handleValidationChange} className="form-check-input" /> 
              <span className="form-check-label">Maximum Length</span>
            </label>
            <label className="form-check">
              <input type="checkbox" value="email" onChange={handleValidationChange} className="form-check-input" /> 
              <span className="form-check-label">Email</span>
            </label>
          </div>

          {(selectedValidations.some(v => v.type === 'minLength') || selectedValidations.some(v => v.type === 'maxLength')) && (
            <div className="mt-2">
              <label htmlFor="validationValue" className="form-label">Length Value:</label>
              <input
                type="number"
                id="validationValue"
                value={validationValue}
                onChange={handleValidationValueChange}
                className="form-control"
                placeholder="Enter length value"
              />
            </div>
          )}
        </div>

        {newFieldType === 'select' && (
          <div className="mt-4">
            <h5>Add Options:</h5>
            <input
              type="text"
              value={newOption}
              onChange={handleOptionChange}
              className="form-control"
              placeholder="Enter option"
            />
            <button type="button" className="btn btn-secondary mt-2" onClick={handleAddOption}>
              Add Option
            </button>
            <div className="mt-2">
              <strong>Current Options:</strong>
              <ul className="list-unstyled">
                {options.map((opt, index) => (
                  <li key={index}>{opt.label}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <button onClick={handleAddField} className="btn btn-secondary mt-2">Add Field</button>
      </div>
      <DynamicForm formConfig={formConfig} onSubmit={handleSubmit} />
      </div>
  );
};

export default App;