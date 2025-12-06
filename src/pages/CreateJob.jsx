import React, { useState, useEffect, useRef } from 'react'; // 💡 Thêm useRef
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faDollarSign, faCodeBranch, faBriefcase, faSave } from '@fortawesome/free-solid-svg-icons';

// 💡 IMPORT TINYMCE EDITOR
import { Editor } from '@tinymce/tinymce-react'; 

const CreateJob = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    // 💡 REF DÙNG ĐỂ TRUY CẬP NỘI DUNG EDITOR KHI SUBMIT
    const editorRef = useRef(null); 

    // --- State cho Form ---
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState(''); // Lưu trữ nội dung HTML
    const [category, setCategory] = useState(''); 
    const [skills, setSkills] = useState('');
    const [budget, setBudget] = useState('');
    
    // --- State cho UI & Data ---
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false); 
    const [loadingCategories, setLoadingCategories] = useState(true); 
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // --- Cấu hình TinyMCE ---
    // Đây là cấu hình editor cho thanh công cụ và giao diện
    const editorConfig = {
        height: 350,
        menubar: false,
        plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
        ],
        toolbar: 'undo redo | formatselect | ' +
                 'bold italic backcolor | alignleft aligncenter ' +
                 'alignright alignjustify | bullist numlist outdent indent | ' +
                 'removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
    };


    // --- 1. Fetch Categories (Giữ nguyên) ---
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await api.get('/categories');
                if (res.data && res.data.length > 0) {
                    setCategories(res.data);
                    setCategory(res.data[0]._id); 
                }
            } catch (error) {
                console.error('Category load error:', error);
                setError('Không thể tải danh sách danh mục.');
            } finally {
                setLoadingCategories(false);
            }
        };
        loadCategories();
    }, []);

    // --- 2. Xử lý Submit Form (Cập nhật logic Description) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        
        // 💡 Lấy nội dung Description từ editorRef
        const editorContent = editorRef.current ? editorRef.current.getContent() : '';
        
        // 💡 Kiểm tra nội dung rỗng: nội dung TinyMCE rỗng thường là '<p></p>' hoặc chỉ chứa khoảng trắng
        const isDescriptionEmpty = !editorContent || editorContent.replace(/<[^>]*>/g, '').trim() === '';

        if (!title || isDescriptionEmpty || !category) {
            setError('Tiêu đề, mô tả và danh mục là bắt buộc.');
            return;
        }

        setLoading(true);

        try {
            const skillsArray = skills
                .split(',')
                .map((s) => s.trim())
                .filter((s) => s);

            const jobData = {
                title,
                // 💡 GỬI NỘI DUNG HTML ĐÃ LẤY TỪ EDITOR
                description: editorContent, 
                category, 
                skillsRequired: skillsArray,
                budget: budget ? Number(budget) : undefined,
            };

            const res = await api.post('/jobs', jobData);

            setSuccessMessage(`Đã tạo công việc thành công: ${res.data.title}`);
            
            setTimeout(() => {
                navigate('/jobs/' + res.data._id); 
            }, 1500);

        } catch (err) {
            console.error('Create Job Error:', err);
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi tạo công việc.');
        } finally {
            setLoading(false);
        }
    };

    // --- 3. Guard Clause: Kiểm tra quyền (Giữ nguyên) ---
    if (user.role !== 'client') {
        // ... (Return Guard UI) ...
        return (
            <MainLayout>
                <div className="max-w-xl mx-auto p-8 bg-red-100 border border-red-400 rounded-xl text-center mt-10">
                    <h2 className="text-2xl font-bold text-red-700">Truy cập bị từ chối</h2>
                    <p className="text-red-600 mt-2">Chức năng này chỉ dành cho tài khoản Client.</p>
                    <button 
                        onClick={() => navigate('/home')}
                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    >
                        Quay lại Trang chủ
                    </button>
                </div>
            </MainLayout>
        );
    }
    
    // --- 4. Render UI chính (Thay thế textarea bằng Editor) ---
    return (
        <MainLayout>
            <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
                <h2 className="text-3xl font-extrabold text-purple-700 mb-6 border-b pb-2 flex items-center">
                    <FontAwesomeIcon icon={faBriefcase} className="mr-3 text-purple-500" />
                    Đăng Tin Tuyển Dụng Mới
                </h2>

                {/* Thông báo lỗi và thành công */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{successMessage}</span>
                    </div>
                )}
                
                {/* Form Đăng Tuyển */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Tiêu đề Công việc */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Tiêu đề Công việc <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="title"
                            type="text"
                            placeholder="Ví dụ: Front-end Developer (React) cần kinh nghiệm 3 năm"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="border border-gray-300 p-3 w-full rounded-lg focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                            required
                        />
                    </div>
                    
                    {/* 💡 Mô tả Công việc (TinyMCE Editor) */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Mô tả Chi tiết <span className="text-red-500">*</span>
                        </label>
                        <Editor
                            apiKey="hojy9attao9p9qo6xk2uncs96g1bf6de6ja32z883tmq9kkr" // 💡 BẠN CẦN THAY THẾ KEY NÀY BẰNG API KEY CỦA MÌNH
                            onInit={(evt, editor) => editorRef.current = editor}
                            initialValue={description} // Sử dụng state description
                            init={editorConfig}
                            // Không cần onChange, vì chúng ta sẽ lấy nội dung bằng editorRef.current.getContent() khi submit
                        />
                    </div>
                    {/* 💡 KẾT THÚC EDITOR */}

                    {/* Hàng 2: Category và Budget (Giữ nguyên) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Danh mục (Category) */}
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                Danh mục <span className="text-red-500">*</span>
                            </label>
                            {loadingCategories ? (
                                <p className="p-3 text-gray-500 border border-gray-300 rounded-lg bg-gray-50">Đang tải danh mục...</p>
                            ) : (
                                <div className="relative">
                                    <FontAwesomeIcon icon={faTag} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400" />
                                    <select
                                        id="category"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="border border-gray-300 p-3 pl-10 w-full rounded-lg bg-white shadow-sm focus:ring-purple-500 focus:border-purple-500 appearance-none"
                                        required
                                    >
                                        {categories.map((c) => (
                                            <option key={c._id} value={c._id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                    <svg className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                </div>
                            )}
                        </div>

                        {/* Ngân sách (Budget) */}
                        <div>
                            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                                Ngân sách (USD)
                            </label>
                            <div className="relative">
                                <FontAwesomeIcon icon={faDollarSign} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
                                <input
                                    id="budget"
                                    type="number"
                                    placeholder="Ví dụ: 500"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    className="border border-gray-300 p-3 pl-10 w-full rounded-lg focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Kỹ năng Yêu cầu (Giữ nguyên) */}
                    <div>
                        <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                            Kỹ năng Yêu cầu
                        </label>
                        <div className="relative">
                            <FontAwesomeIcon icon={faCodeBranch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                            <input
                                id="skills"
                                type="text"
                                placeholder="Ví dụ: React, Node.js, MongoDB (phân cách bằng dấu phẩy)"
                                value={skills}
                                onChange={(e) => setSkills(e.target.value)}
                                className="border border-gray-300 p-3 pl-10 w-full rounded-lg focus:ring-purple-500 focus:border-purple-500 shadow-sm"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Các kỹ năng phải được phân tách bằng dấu phẩy (,)</p>
                    </div>

                    {/* Nút Submit (Giữ nguyên) */}
                    <button
                        type="submit"
                        className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl w-full text-lg font-semibold transition-all duration-200 ${
                            loading 
                                ? 'bg-purple-300 cursor-not-allowed' 
                                : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg'
                        }`}
                        disabled={loading || loadingCategories}
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin inline-block w-5 h-5 border-[3px] border-current border-t-transparent rounded-full" role="status"></div>
                                <span>Đang đăng tuyển...</span>
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faSave} className="mr-2" />
                                <span>Đăng Tin Tuyển Dụng</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </MainLayout>
    );
};

export default CreateJob;