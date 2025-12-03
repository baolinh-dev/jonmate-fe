import React from 'react';



const JobCard = ({ job }) => {

  const clientName = job.client?.name || 'Client Ẩn Danh';



  return (

    // Card container: Bố cục hàng ngang (row)

    <div

      className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 transition duration-300 ease-in-out transform hover:shadow-xl hover:border-blue-300 cursor-pointer"

    >

      {/* Container chính: Chia thành LEFT SIDE và RIGHT SIDE */}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">



        {/* LEFT SIDE: (Title + Client) và Description - Chiếm phần lớn không gian */}

        <div className="flex-1 min-w-0 pr-4 mb-3 md:mb-0">

          

          {/* Bố cục NGANG: Chia LEFT SIDE thành hai cột con (Title/Client & Description) */}

          <div className="flex flex-col md:flex-row gap-4 items-start">

            

            {/* Cột 1: Title và Client Name (chiếm khoảng 50% LEFT SIDE) */}

            <div className="flex-1 min-w-0"> 

              {/* Title (Kích thước lớn) */}

              <h3 className="text-xl font-bold text-gray-900 leading-snug truncate">

                {job.title}

              </h3>



              {/* Client Name: Thông tin người đăng */}

              <div className="flex items-center text-sm text-gray-500 mt-1 mb-2">

                <i className="fas fa-user-tie mr-2 text-blue-500"></i>

                <span className="font-semibold">{clientName}</span>

              </div>

            </div>



            {/* Cột 2: Description (chiếm khoảng 50% LEFT SIDE) */}

            <div className="flex-1 min-w-0 text-sm text-gray-600 pt-1">

              {/* Description (Mô tả ngắn gọn) */}

              <p className="overflow-hidden text-ellipsis whitespace-nowrap">

                {job.description}

              </p>

            </div>

          </div>

        </div>



        {/* RIGHT SIDE: Category, Budget và CTA (Giữ nguyên) */}

        <div className="flex flex-col md:flex-row items-start md:items-center md:space-x-6 space-y-2 md:space-y-0 text-right">



          {/* Category Tag */}

          <div className="flex items-center space-x-2">

            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md whitespace-nowrap">

              {job.category.name}

            </span>

          </div>



          {/* Budget Tag (Nổi bật) */}

          <span className="bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap">

            ${job.budget}

          </span>



          {/* Call to Action */}

          <button

            className="text-blue-600 hover:text-blue-800 text-sm font-semibold transition duration-150 whitespace-nowrap"

            onClick={() => console.log('View Job:', job._id)}

          >

            Xem chi tiết &rarr;

          </button>

        </div>

      </div>

    </div>

  );

};



export default JobCard;