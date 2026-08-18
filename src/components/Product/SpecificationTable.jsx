import { memo } from 'react'

const SpecificationRow = ({ name, value }) => (
  <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
    <th className="py-3 px-4 font-bold text-gray-800 bg-gray-50/50 w-1/3">
      {name}
    </th>
    <td className="py-3 px-4 text-gray-600">
      {value}
    </td>
  </tr>
)

const SpecificationSection = ({ sectionName, specs }) => (
  <div className="mb-6 last:mb-0">
    <h3 className="text-[16px] font-bold text-gray-900 mb-3 px-1 border-l-4 border-[#ff6a00] pl-2">{sectionName}</h3>
    <div className="overflow-hidden border border-gray-200 rounded-xl">
      <table className="w-full text-left text-[14px]">
        <tbody>
          {specs.map((spec, index) => (
            <SpecificationRow key={index} name={spec.name || spec.label} value={spec.value} />
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

const SpecificationTable = ({ specifications }) => {
  if (!specifications || Object.keys(specifications).length === 0) {
    return <div className="text-gray-500">No specifications available.</div>
  }

  // If specifications is an array (legacy fallback)
  if (Array.isArray(specifications)) {
    return <SpecificationSection sectionName="General" specs={specifications} />
  }

  // If grouped specifications object
  return (
    <div className="flex flex-col gap-2">
      {Object.entries(specifications).map(([sectionName, specs]) => (
        <SpecificationSection key={sectionName} sectionName={sectionName} specs={specs} />
      ))}
    </div>
  )
}

export default memo(SpecificationTable)
