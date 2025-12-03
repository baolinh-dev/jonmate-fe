import React, { useState, useEffect } from 'react';
import api from '../api/api'; // Giả định file api.js nằm ở thư mục cha của component này
import ReusableHeading from './ReusableHeading';

// Cấu trúc của một Category
// Nếu bạn dùng TypeScript, bạn nên định nghĩa nó bằng interface/type.
// const CategoryType = { _id: string, name: string };

const CategorySection = () => {
  // 1. Khai báo trạng thái (State)
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Hàm gọi API
  const fetchCategories = async () => {
    try {
      // Đặt trạng thái loading = true khi bắt đầu gọi
      setLoading(true);
      setError(null);

      const response = await api.get('/categories');
      
      // Axios trả về dữ liệu trong response.data
      setCategories(response.data); 
      
    } catch (err) {
      console.error("Lỗi khi fetch categories:", err);
      // Đặt thông báo lỗi
      setError("Không thể tải danh mục. Vui lòng thử lại sau.");
      // Đảm bảo categories là mảng rỗng nếu có lỗi
      setCategories([]); 
      
    } finally {
      // Đặt trạng thái loading = false khi quá trình kết thúc (thành công hoặc thất bại)
      setLoading(false);
    }
  };

  // 3. Hook useEffect: Chỉ gọi hàm fetchCategories một lần khi component mount
  useEffect(() => {
    fetchCategories();
  }, []); // Mảng dependency rỗng đảm bảo nó chỉ chạy 1 lần

  // 4. Trình bày UI dựa trên trạng thái (Conditional Rendering)

  if (loading) {
    return (
      <div className="text-center py-10">
        <p className="text-xl font-medium text-blue-500">Đang tải danh mục...</p>
        {/* Có thể thêm spinner/loading animation ở đây */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-xl font-medium text-red-500">{error}</p>
      </div>
    );
  }

  // 5. Trình bày danh sách Categories (Sử dụng Tailwind CSS)
  return (
    <section className="container mx-auto px-4 py-12">
        <ReusableHeading title="Danh mục công việc phổ biến" />
      
      {/* Grid Layout của Tailwind */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          // Card cho từng Category
          <div 
            key={category._id} 
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 cursor-pointer border-t-4 border-blue-500"
          >
            {/* Đây là nơi bạn có thể đặt icon cho mỗi danh mục */}
            <div className="text-3xl text-blue-600 mb-3">
              {/* Ví dụ icon placeholder */}
              <i className="fas fa-briefcase"></i> 
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900">
              {category.name}
            </h3>
            
            {/* Ví dụ thêm thông tin khác */}
            <p className="text-sm text-gray-500 mt-2">
              Xem các công việc liên quan
            </p>
          </div>
        ))}
      </div>
      
      {categories.length === 0 && (
        <p className="text-center text-gray-500 mt-8">Chưa có danh mục nào được tìm thấy.</p>
      )}
    </section>
  );
};

export default CategorySection;