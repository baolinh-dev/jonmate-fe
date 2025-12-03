import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/api';
import JobCard from '../components/JobCard';
import ReactPaginate from 'react-paginate';
import '../../src/styles/pagination.css'; 
import ReusableHeading from '../components/ReusableHeading';

// Cài đặt default PAGE_SIZE
const PAGE_SIZE = 5; 

// Component JobList sẽ không nhận props 'jobs' nữa
const JobPage = () => { 
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Trạng thái tìm kiếm và lọc
    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState(''); 
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    // Trạng thái phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalJobs, setTotalJobs] = useState(0);

    // --- HÀM 1: Fetch Categories cho Dropdown ---
    const fetchCategories = useCallback(async () => {
        setLoadingCategories(true);
        try {
            const res = await api.get('/categories');
            // Thêm option "Tất cả"
            setCategories([{ _id: '', name: 'Tất cả Danh mục' }, ...res.data]); 
        } catch (err) {
            console.error('Error fetching categories:', err);
            setCategories([]);
        } finally {
            setLoadingCategories(false);
        }
    }, []);

    // --- HÀM 2: Fetch Jobs (Đã cập nhật để bao gồm Tìm kiếm/Lọc) ---
    const fetchJobs = useCallback(async (page = 1, searchKeyword = '', filterCategory = '') => {
        setLoading(true);
        try {
            const params = { 
                page: page,
                limit: PAGE_SIZE,
                keyword: searchKeyword || undefined,
                category: filterCategory || undefined,
            };

            // Lọc bỏ các tham số null/undefined để API không bị lỗi
            const validParams = Object.fromEntries(
                Object.entries(params).filter(([_, v]) => v !== undefined && v !== '')
            );

            const res = await api.get('/jobs/search', { // Giả định API tìm kiếm là /jobs/search
                params: validParams
            });

            const body = res?.data ?? null;
            let jobsFromApi = [];
            
            if (body && body.jobs && Array.isArray(body.jobs)) {
                jobsFromApi = body.jobs;
                setCurrentPage(body.page || 1); 
                setTotalPages(body.totalPages || 1);
                setTotalJobs(body.total || 0);
            } else {
                jobsFromApi = Array.isArray(body) ? body : [];
                setCurrentPage(1);
                setTotalPages(1);
                setTotalJobs(jobsFromApi.length); 
            }

            setJobs(jobsFromApi);
        } catch (err) {
            console.error('Fetch jobs error:', err);
            setJobs([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, []);

    // --- Xử lý Tìm kiếm/Lọc: Luôn gọi lại API từ trang 1 ---
    const handleSearch = (e) => {
        e.preventDefault();
        // Reset page về 1 khi tìm kiếm mới
        setCurrentPage(1); 
        fetchJobs(1, keyword, category);
    };

    // --- Xử lý Chuyển Trang ---
    const handlePageClick = (data) => {
        const newPage = data.selected + 1; 
        
        if (newPage !== currentPage) {
            setCurrentPage(newPage);
            // Gọi lại fetchJobs với tham số tìm kiếm/lọc hiện tại
            fetchJobs(newPage, keyword, category); 
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // --- useEffects ---
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        // Load Jobs lần đầu tiên khi component mount
        fetchJobs(1, keyword, category); 
    }, [fetchJobs]); // Chú ý: fetchJobs không phụ thuộc vào keyword/category trong useEffect này để chỉ fetch data một lần

    if (loading) return <div className="text-center py-10">Đang tải công việc...</div>;

    return (
        <div className="flex flex-col gap-4"> 
            <ReusableHeading 
                title="Khám phá Cơ hội Công việc" 
            />
            {/* --- Search & Filter UI --- */}
            <form 
                onSubmit={handleSearch} 
                className="flex flex-col md:flex-row gap-4 items-center p-4 bg-gray-50 rounded-xl shadow-inner"
            >
                
                {/* Input Keywords */}
                <input
                    type="text"
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    placeholder="Tìm kiếm theo từ khóa (chức danh...)"
                    className="border border-gray-300 p-3 rounded-lg w-full md:flex-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                />

                {/* DROPDOWN CATEGORY */}
                <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="border border-gray-300 p-3 rounded-lg w-full md:w-auto shadow-sm bg-white text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loadingCategories} 
                >
                    {loadingCategories ? (
                         <option value="">Đang tải danh mục...</option>
                    ) : (
                        categories.map((cat) => (
                            <option key={cat._id || 'all'} value={cat._id}>
                                {cat.name}
                            </option>
                        ))
                    )}
                </select>
                
                {/* Nút Search */}
                <button
                    type="submit"
                    className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200 w-full md:w-auto shadow-md"
                >
                    Tìm Kiếm
                </button>
            </form>
            
            {/* Thông báo tổng số công việc */}
            {totalJobs > 0 && (
                <p className="text-sm text-gray-500 mb-2">
                    Hiển thị công việc trang {currentPage} / {totalPages} (Tổng cộng: {totalJobs} công việc)
                </p>
            )}

            {jobs.length === 0 ? (
                <p className="text-center text-gray-500 text-lg py-10">
                    Không tìm thấy công việc nào phù hợp.
                </p>
            ) : (
                jobs.map((job) => <JobCard key={job._id} job={job} />)
            )}

            {/* Sử dụng ReactPaginate */}
            {totalPages > 1 && (
                <ReactPaginate
                    previousLabel={'← Trang Trước'}
                    nextLabel={'Trang Sau →'}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={totalPages}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageClick}
                    forcePage={currentPage - 1} 
                    
                    containerClassName={'flex justify-center items-center space-x-2 mt-8'}
                    pageLinkClassName={'px-3 py-1 text-sm font-semibold rounded-lg bg-white text-gray-700 border border-gray-300 hover:bg-blue-50 hover:border-blue-500 transition'}
                    previousLinkClassName={'px-4 py-2 text-sm font-semibold rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition'}
                    nextLinkClassName={'px-4 py-2 text-sm font-semibold rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition'}
                    activeLinkClassName={'bg-blue-600 text-white border-blue-600'}
                />
            )}
        </div>
    );
};

export default JobPage;