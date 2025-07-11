function Input({
  label,
  type = 'text',
  id,
  name,
  value,
  onChange,
  placeholder = '',
  error = '',
  className = '',
  required = false,
  icon = null
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-purple-300 mb-1">
          {label} {required && <span className="text-purple-400">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-60">
            {icon}
          </div>
        )}
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`
            w-full px-3 py-2 bg-gray-800/80 border rounded-lg focus:ring-2
            ${icon ? 'pl-10' : ''}
            placeholder-gray-400 text-white
            transition-all duration-200
            ${error ? 'border-red-500 focus:ring-red-500/50' : 'border-purple-500/30 focus:border-purple-500 focus:ring-purple-500/50'}
          `}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
}

export default Input;
