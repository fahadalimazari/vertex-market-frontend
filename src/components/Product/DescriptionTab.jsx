import { memo } from 'react'

const DescriptionTab = ({ description }) => {
  if (!description) return <div className="text-gray-500">No description available.</div>
  
  return (
    <div 
      className="prose prose-sm max-w-none text-gray-700 prose-headings:text-gray-900 prose-a:text-[#ff6a00]"
      dangerouslySetInnerHTML={{ __html: description }}
    />
  )
}

export default memo(DescriptionTab)
