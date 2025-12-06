// src/pages/JobPage.js

import React, { useEffect, useState } from 'react';
import api from '../api/api'; 
import JobCard from '../components/JobCard'; 
import ReactPaginate from 'react-paginate'; 
import useDebounce from '../hooks/useDebounce'; 
import '../../src/styles/pagination.css'; 
import ReusableHeading from '../components/ReusableHeading'; 
// 💡 Import icon Font Awesome cho nút Reset (Giả định bạn đã cài đặt NPM)
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateLeft } from '@fortawesome/free-solid-svg-icons';

// --- KHAI BÁO Hằng SỐ VÀ MẶC ĐỊNH ---
const PAGE_SIZE = 5;
const DEBOUNCE_DELAY = 400;

// 💡 ĐỊNH NGHĨA GIÁ TRỊ MẶC ĐỊNH CỦA BỘ LỌC
const DEFAULT_FILTERS = {
    keyword: '',
    category: '',
    skills: '',
    minBudget: '',
    maxBudget: '',
    status: '', 
    clientId: '', 
    sort: 'newest',
    page: 1,
};

const JobPage = () => {
    const [jobs, setJobs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);

    // Sử dụng DEFAULT_FILTERS khi khởi tạo state
    const [filters, setFilters] = useState(DEFAULT_FILTERS); 

    const [totalPages, setTotalPages] = useState(1);
    const [totalJobs, setTotalJobs] = useState(0);

    // Áp dụng Debounce
    const debouncedKeyword = useDebounce(filters.keyword, DEBOUNCE_DELAY);
    const debouncedSkills = useDebounce(filters.skills, DEBOUNCE_DELAY);
    const debouncedMinBudget = useDebounce(filters.minBudget, DEBOUNCE_DELAY);
    const debouncedMaxBudget = useDebounce(filters.maxBudget, DEBOUNCE_DELAY);
    
    // --- 1. FETCH CATEGORIES --- (Giữ nguyên)
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await api.get('/categories');
                setCategories([{ _id: '', name: 'Tất cả Danh mục' }, ...res.data]);
            } catch (error) {
                console.error('Category load error:', error);
            }
        };
        loadCategories();
    }, []); 

    // --- 2. MAIN: FETCH JOBS --- (Giữ nguyên)
    useEffect(() => {
        const loadJobs = async () => {
            setLoading(true);

            const params = {
                page: filters.page,
                limit: PAGE_SIZE,
                sort: filters.sort,
                
                keyword: debouncedKeyword,
                skills: debouncedSkills,
                minBudget: debouncedMinBudget,
                maxBudget: debouncedMaxBudget,

                category: filters.category,
                status: filters.status,
                clientId: filters.clientId, 
            };
            
            Object.keys(params).forEach(key => 
                (params[key] === undefined || params[key] === null || params[key] === '') && delete params[key]
            );

            try {
                const res = await api.get('/jobs/search', { params });

                const body = res.data;
                setJobs(body.jobs || []);
                setTotalPages(body.totalPages || 1);
                setTotalJobs(body.total || 0);
                
                if (!hasLoadedInitialData) {
                    setHasLoadedInitialData(true);
                }
                
            } catch (error) {
                console.error('Job load error:', error);
                setJobs([]);
            } finally {
                setLoading(false);
            }
        };

        loadJobs();
        
    }, [
        filters.category,
        filters.sort,
        filters.status,
        filters.clientId,
        filters.page,
        
        debouncedKeyword,
        debouncedSkills,
        debouncedMinBudget,
        debouncedMaxBudget
    ]);

    // --- 3. EVENTS & HANDLERS ---
    const handleFilterChange = (field, value) => {
        // Luôn reset page về 1 khi bất kỳ filter nào (trừ page) thay đổi
        setFilters((prev) => ({ 
            ...prev, 
            [field]: value, 
            page: (field !== 'page' ? 1 : value)
        }));
    };

    const handlePageClick = (data) => {
        handleFilterChange('page', data.selected + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // 💡 HÀM RESET MỚI
    const handleResetFilters = () => {
        // Thiết lập lại toàn bộ filters về giá trị mặc định
        setFilters(DEFAULT_FILTERS);
    };
    
    // Tùy chọn Sắp xếp & Status
    const sortOptions = [
        { value: 'newest', label: 'Mới nhất' },
        { value: 'highestBudget', label: 'Lương cao nhất' },
        { value: 'lowestBudget', label: 'Lương thấp nhất' },
        { value: 'oldest', label: 'Cũ nhất' },
    ];
    const statusOptions = [
        { value: '', label: 'Tất cả Trạng thái' },
        { value: 'open', label: 'Đang mở' },
        { value: 'completed', label: 'Đã hoàn thành' },
        { value: 'in_progress', label: 'Đang tiến hành' },
    ];

    // --- 4. RENDER UI ---
    return (
        <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4">
            <ReusableHeading title="Khám phá Cơ hội Công việc" />

            {/* TỔNG HỢP CÁC BỘ LỌC */}
            <div className="p-4 bg-white rounded-xl shadow-xl border border-gray-100">
                <h3 className="text-xl font-bold mb-4 text-blue-800 border-b pb-2">Bộ Lọc Công Việc Chi Tiết</h3>
                
                {/* Hàng 1: Keyword, Category, Status, Sort */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    {/* Keyword */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700 block mb-1">Từ khóa (Tiêu đề, Mô tả)</label>
                        <input
                            type="text"
                            placeholder="VD: Frontend Developer, React..."
                            value={filters.keyword}
                            onChange={(e) => handleFilterChange('keyword', e.target.value)}
                            className="border border-gray-300 p-3 rounded-lg w-full shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    
                    {/* Category */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Danh mục</label>
                        <select
                            value={filters.category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            className="border border-gray-300 p-3 rounded-lg bg-white shadow-sm w-full focus:ring-blue-500 focus:border-blue-500"
                        >
                            {categories.map((c) => (
                                <option key={c._id || 'all'} value={c._id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    {/* Status */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Trạng thái</label>
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="border border-gray-300 p-3 rounded-lg bg-white shadow-sm w-full focus:ring-blue-500 focus:border-blue-500"
                        >
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Hàng 2: Skills, Budget Range, Sort */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Skills Required */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700 block mb-1">Kỹ năng (cần chứa tất cả)</label>
                        <input
                            type="text"
                            placeholder="VD: React, Node.js (cách nhau bởi dấu phẩy)"
                            value={filters.skills}
                            onChange={(e) => handleFilterChange('skills', e.target.value)}
                            className="border border-gray-300 p-3 rounded-lg w-full shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Min Budget */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Ngân sách Tối thiểu</label>
                        <input
                            type="number"
                            placeholder="Tối thiểu"
                            value={filters.minBudget}
                            onChange={(e) => handleFilterChange('minBudget', e.target.value)}
                            className="border border-gray-300 p-3 rounded-lg w-full shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Max Budget */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Ngân sách Tối đa</label>
                        <input
                            type="number"
                            placeholder="Tối đa"
                            value={filters.maxBudget}
                            onChange={(e) => handleFilterChange('maxBudget', e.target.value)}
                            className="border border-gray-300 p-3 rounded-lg w-full shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    
                    {/* Sort */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Sắp xếp</label>
                        <select
                            value={filters.sort}
                            onChange={(e) => handleFilterChange('sort', e.target.value)}
                            className="border border-gray-300 p-3 rounded-lg bg-white shadow-sm w-full focus:ring-blue-500 focus:border-blue-500"
                        >
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 💡 NÚT RESET */}
                <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
                    <button
                        onClick={handleResetFilters}
                        className="flex items-center text-sm font-bold text-gray-600 hover:text-red-600 transition-colors duration-150 p-2 rounded-lg bg-gray-50 hover:bg-red-50"
                    >
                        <FontAwesomeIcon icon={faRotateLeft} className="mr-2" />
                        Xóa Bộ Lọc
                    </button>
                </div>
            </div>
            
            {/* Stats */}
            {totalJobs > 0 && (
                <p className="text-md font-semibold text-gray-700">
                    Tìm thấy **{totalJobs}** công việc phù hợp. (Trang {filters.page}/{totalPages})
                </p>
            )}

            {/* Job List */}
            {loading ? (
                <div className="text-center py-10 text-lg font-medium text-blue-600">
                    <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-500 rounded-full" role="status"></div>
                    <span className="ml-3">Đang tải công việc...</span>
                </div>
            ) : jobs.length === 0 ? (
                <div className="text-center py-10 text-gray-500 border border-dashed border-gray-300 p-6 rounded-xl bg-white">
                    <p className="text-xl font-semibold mb-2">Không tìm thấy công việc</p>
                    <p>Vui lòng thử thay đổi các tiêu chí tìm kiếm của bạn.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {jobs.map((job) => <JobCard key={job._id} job={job} />)}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <ReactPaginate
                    previousLabel={'← Trước'}
                    nextLabel={'Sau →'}
                    pageCount={totalPages}
                    onPageChange={handlePageClick}
                    forcePage={filters.page - 1}
                    containerClassName={'flex justify-center items-center gap-2 mt-8'}
                    pageLinkClassName={'px-4 py-2 rounded-xl bg-white border border-gray-300 hover:bg-blue-100 transition-colors duration-150 text-gray-700'}
                    activeLinkClassName={'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'}
                    previousLinkClassName={'p-2 text-blue-600 hover:text-blue-800'}
                    nextLinkClassName={'p-2 text-blue-600 hover:text-blue-800'}
                    disabledLinkClassName={'text-gray-400 cursor-not-allowed'}
                />
            )}
        </div>
    );
};

export default JobPage;