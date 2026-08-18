import { memo } from 'react';
import { FiMessageSquare } from 'react-icons/fi';

const ReviewReply = memo(({ reply }) => {
  if (!reply) return null;

  return (
    <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-100 ml-4 border-l-4 border-l-[#ff6a00]">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-[#ff6a00]/10 flex items-center justify-center text-[#ff6a00]">
          <FiMessageSquare size={14} />
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">Response from {reply.sellerName}</p>
          <p className="text-xs text-gray-500">{new Date(reply.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      <p className="text-gray-700 text-sm leading-relaxed ml-10">
        {reply.text}
      </p>
    </div>
  );
});

ReviewReply.displayName = 'ReviewReply';
export default ReviewReply;
