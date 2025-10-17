export function StatCard({ title, value, iconBg, iconColor, changeText, changeColor, direction, iconPath }) {
  const arrowIcon =
    direction === "up" ? (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
          clipRule="evenodd"
        />
      </svg>
    ) : (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 112 0v7.586l2.293-2.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    )

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col justify-between h-40">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-3xl font-extrabold text-gray-900">{value}</p>
        </div>
        <div className={`w-10 h-10 ${iconBg} rounded-full flex items-center justify-center shadow-md`}>
          <svg className={`w-6 h-6 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPath} />
          </svg>
        </div>
      </div>
      <p className={`mt-4 flex items-center text-sm font-medium ${changeColor}`}>
        {arrowIcon}
        <span className="ml-1">{changeText}</span>
      </p>
    </div>
  )
}
