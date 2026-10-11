// Wraps one form control with its label, optional hint, and error message.
// The control itself (input or select) is passed in as `children`.
function FormField({ name, label, required = false, hint, error, children }) {
  return (
    <div className={`form-field${error ? " form-field--invalid" : ""}`}>
      <label htmlFor={`booking-${name}`}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>

      {children}

      {hint && (
        <p id={`booking-${name}-hint`} className="form-field__hint">
          {hint}
        </p>
      )}

      {error && (
        <p id={`booking-${name}-error`} className="form-field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default FormField;
