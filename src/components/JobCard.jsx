import React from 'react';
// 💡 IMPORTS MỚI TỪ FONT AWESOME
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserTie,   // Icon cho Client
  faTags,      // Icon cho Category
  faMoneyBillWave, // Icon cho Budget
  faCodeBranch // Icon cho Skills (Sẽ thêm)
} from '@fortawesome/free-solid-svg-icons'; 


const JobCard = ({ job }) => {
  const clientName = job.client?.name || 'Client Ẩn Danh';

  // Map trạng thái cho màu sắc trực quan
  const statusColors = {
    open: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    in_progress: "bg-blue-100 text-blue-700 border border-blue-200",
    completed: "bg-green-100 text-green-700 border border-green-200",
    // Thêm status cho logic BE:
    closed: "bg-red-100 text-red-700 border border-red-200",
  };

  const statusLabel = {
    open: "Đang mở",
    in_progress: "Đang thực hiện",
    completed: "Hoàn thành",
    closed: "Đã đóng",
  };

  // Format ngày đăng
  const createdAt = new Date(job.createdAt).toLocaleDateString("vi-VN");

  // Giả định skillsRequired là một mảng string
  const skillsList = job.skillsRequired ? job.skillsRequired.slice(0, 3) : []; // Giới hạn 3 skills

  // Format Budget
  const formattedBudget = job.budget 
    ? `$${job.budget.toLocaleString('en-US')}` 
    : 'Thỏa thuận';
    
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition duration-300 ease-in-out transform hover:shadow-xl hover:border-blue-300 cursor-pointer">

      <div className="flex flex-col gap-4">

        {/* TOP ROW: TITLE, CLIENT, STATUS, DATE */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">

          {/* Title + Client */}
          <div className="flex-1 min-w-0 pr-4">
            <h3 className="text-2xl font-extrabold text-gray-900 leading-snug truncate hover:underline">
              {job.title}
            </h3>

            {/* Client & Status */}
            <div className="flex items-center gap-4 text-sm mt-2">
              {/* Client Name (Icon đã được sửa) */}
              <span className="flex items-center text-gray-600 font-semibold">
                <FontAwesomeIcon icon={faUserTie} className="mr-2 text-blue-500" />
                {clientName}
              </span>

              {/* Status */}
              <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${statusColors[job.status] || 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                {statusLabel[job.status] || 'Không rõ'}
              </span>
            </div>
          </div>
          
          {/* RIGHT SIDE (Budget & Category) */}
          <div className="flex flex-col items-end pt-2 md:pt-0">
            {/* Budget */}
            <span className="flex items-center text-xl font-extrabold text-green-700 bg-green-50 px-3 py-1 rounded-lg whitespace-nowrap mb-1">
              <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2 text-green-500 text-sm" />
              {formattedBudget}
            </span>
            
            {/* Category */}
            <span className="flex items-center text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md whitespace-nowrap">
              <FontAwesomeIcon icon={faTags} className="mr-1 text-blue-400" />
              {job.category?.name || 'Chưa phân loại'}
            </span>
          </div>

        </div>

        {/* MIDDLE ROW: SKILLS & DESCRIPTION */}
        <div className="flex flex-col gap-3 border-t border-b border-gray-100 py-3">
            
            {/* Skills */}
            {skillsList.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                    <FontAwesomeIcon icon={faCodeBranch} className="text-gray-500" />
                    <span className="font-semibold mr-2">Yêu cầu:</span>
                    <div className="flex flex-wrap gap-2">
                        {skillsList.map((skill, index) => (
                            <span 
                                key={index} 
                                className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full"
                            >
                                {skill.trim()}
                            </span>
                        ))}
                         {job.skillsRequired.length > 3 && (
                            <span className="text-xs text-gray-500 px-2 py-0.5">...</span>
                        )}
                    </div>
                </div>
            )}

            {/* Description (Đã giới hạn hiển thị) */}
            <p className="text-sm text-gray-600 line-clamp-2">
                {job.description}
            </p>
        </div>

        {/* BOTTOM ROW: DATE & CTA */}
        <div className="flex justify-between items-center pt-1">
            <span className="text-xs text-gray-400">
                Đăng vào: <strong className="text-gray-600">{createdAt}</strong>
            </span>
            
            <button
              className="text-blue-600 hover:text-blue-800 text-md font-bold transition duration-150 whitespace-nowrap"
              onClick={() => console.log('View Job:', job._id)}
            >
              Xem chi tiết →
            </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;