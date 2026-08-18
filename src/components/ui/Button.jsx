const Button = ({ children, className = '', ...props }) => {
  return (
    <button
      type="button"
      className={`rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-500 hover:text-blue-600 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
