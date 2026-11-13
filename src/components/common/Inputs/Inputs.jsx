import { useId } from "react";
import "./Inputs.css";

const Label = ({ id, text, required }) =>
  text ? (
    <label htmlFor={id}>
      {text}
      {required && " *"}
    </label>
  ) : null;

// Props extras (disabled, required, autoComplete, maxLength...) vão direto para o campo

const Input = ({ labelText, classNameIn = "", id, children, ...inputProps }) => {
  const autoId = useId();
  const fieldId = id ?? autoId;

  return (
    <div className={`field ${classNameIn}`}>
      <Label id={fieldId} text={labelText} required={inputProps.required} />
      {children ? (
        <div className="field-with-action">
          <input id={fieldId} {...inputProps} />
          {children}
        </div>
      ) : (
        <input id={fieldId} {...inputProps} />
      )}
    </div>
  );
};

export const Select = ({
  labelText,
  classNameIn = "",
  id,
  options = [],
  placeholder,
  ...selectProps
}) => {
  const autoId = useId();
  const fieldId = id ?? autoId;

  return (
    <div className={`field ${classNameIn}`}>
      <Label id={fieldId} text={labelText} required={selectProps.required} />
      <select id={fieldId} {...selectProps}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => {
          const { value, label } =
            typeof option === "string" ? { value: option, label: option } : option;
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export const Textarea = ({ labelText, classNameIn = "", id, ...textareaProps }) => {
  const autoId = useId();
  const fieldId = id ?? autoId;

  return (
    <div className={`field ${classNameIn}`}>
      <Label id={fieldId} text={labelText} required={textareaProps.required} />
      <textarea id={fieldId} {...textareaProps} />
    </div>
  );
};

// Grupo de radios: options = ["Macho", "Fêmea"] ou [{ value, label }]
export const RadioGroup = ({
  labelText,
  name,
  options = [],
  value,
  onChange,
  required,
  column = false,
}) => (
  <fieldset className="field" style={{ border: 0, margin: 0, padding: 0 }}>
    {labelText && (
      <legend className="field-label" style={{ padding: 0, marginBottom: 5 }}>
        {labelText}
        {required && " *"}
      </legend>
    )}
    <div className={column ? "choice-group choice-group--column" : "choice-group"}>
      {options.map((option) => {
        const { value: optionValue, label } =
          typeof option === "string" ? { value: option, label: option } : option;
        return (
          <label key={optionValue} className="choice">
            <input
              type="radio"
              name={name}
              value={optionValue}
              checked={value === optionValue}
              onChange={() => onChange(optionValue)}
            />
            {label}
          </label>
        );
      })}
    </div>
  </fieldset>
);

export const Checkbox = ({ labelText, checked, onChange, ...props }) => (
  <label className="choice">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      {...props}
    />
    {labelText}
  </label>
);

export default Input;
