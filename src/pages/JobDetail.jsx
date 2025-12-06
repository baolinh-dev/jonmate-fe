// src/pages/JobDetail.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import ReusableHeading from '../components/ReusableHeading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faDollarSign, faUserTie, faCalendarAlt, faCodeBranch, faTimesCircle, faCheckCircle, faSpinner, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import MainLayout from '../layouts/MainLayout';
// 💡 SỬ DỤNG HOOK AUTH THỰC TẾ
import { useAuth } from '../context/AuthContext'; 

const JobDetail = () => {
    // 💡 Lấy state user và loading từ Auth Context
    const { user, loading: loadingAuth } = useAuth(); 
    
    // Khai báo các biến từ Auth Context
    const isAuthenticated = !!user; // Kiểm tra user có tồn tại không
    const userRole = user ? user.role : null; // Giả định role nằm trong object user
    const userId = user ? user._id : null; // Giả định ID nằm trong object user
    
    const { id } = useParams();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // --- STATE CHO CHỨC NĂNG APPLY JOB ---
    const [coverLetter, setCoverLetter] = useState('');
    const [isApplying, setIsApplying] = useState(false);
    const [applyError, setApplyError] = useState(null);
    const [applicationStatus, setApplicationStatus] = useState({ 
        isApplied: false, 
        message: null 
    });
    // --- END STATE APPLY JOB ---

    const statusConfig = {
        open: { label: 'Đang mở', icon: faCheckCircle, color: 'text-green-600 bg-green-100' },
        closed: { label: 'Đã đóng', icon: faTimesCircle, color: 'text-red-600 bg-red-100' },
        in_progress: { label: 'Đang tiến hành', icon: faSpinner, color: 'text-blue-600 bg-blue-100' },
        completed: { label: 'Hoàn thành', icon: faCheckCircle, color: 'text-purple-600 bg-purple-100' },
    };

    // --- LOGIC GỌI API LẤY CHI TIẾT CÔNG VIỆC ---
    useEffect(() => {
        // Chờ Auth status tải xong trước khi fetch Job
        if (loadingAuth) return;

        const fetchJobDetail = async () => {
            if (!id) {
                setError("Không tìm thấy ID công việc trong URL.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                // Ta giả định API GET /jobs/:id có thể trả về thông tin ứng tuyển của user
                const response = await api.get(`/jobs/${id}`); 
                setJob(response.data);
                
                // Kiểm tra nếu server trả về trạng thái đã ứng tuyển
                if (response.data.applicationStatus) {
                    setApplicationStatus({
                        isApplied: true,
                        message: `Bạn đã ứng tuyển công việc này. Trạng thái: ${response.data.applicationStatus}.`
                    });
                }

            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setError("Công việc này không tồn tại hoặc đã bị xóa.");
                } else {
                    setError("Đã xảy ra lỗi khi tải chi tiết công việc.");
                }
                console.error('Fetch Job Detail Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetail();
    }, [id, loadingAuth]); // Thêm loadingAuth vào dependencies

    // --- LOGIC ỨNG TUYỂN CÔNG VIỆC ---
    const handleApplyJob = async (e) => {
        e.preventDefault();
        
        if (userRole !== 'freelancer' || !isAuthenticated) {
            setApplyError('Bạn cần đăng nhập với vai trò Freelancer để ứng tuyển.');
            return;
        }

        const isClientJob = job.client?._id === userId;
        if (isClientJob) {
             setApplyError('Bạn là chủ dự án này. Bạn không thể tự ứng tuyển.');
             return;
        }
        
        if (!coverLetter.trim()) {
            setApplyError('Vui lòng nhập thư xin việc (cover letter).');
            return;
        }

        setIsApplying(true);
        setApplyError(null);
        setApplicationStatus({ isApplied: false, message: null });

        try {
            // Endpoint POST /applications/apply
            const response = await api.post(`/applications/apply`, {
                jobId: id,
                coverLetter: coverLetter.trim()
            });

            if (response.status === 201) {
                setApplicationStatus({ 
                    isApplied: true, 
                    message: 'Ứng tuyển thành công! Vui lòng chờ Client duyệt hồ sơ.' 
                });
                setCoverLetter(''); 
            }
        } catch (err) {
            if (err.response) {
                if (err.response.status === 400 && err.response.data.message.includes('already applied')) {
                    setApplicationStatus({ 
                        isApplied: true, 
                        message: 'Bạn đã ứng tuyển công việc này trước đó.' 
                    });
                } else {
                    setApplyError(err.response.data.message || 'Lỗi không xác định khi ứng tuyển.');
                }
            } else {
                setApplyError('Không thể kết nối đến máy chủ.');
            }
            console.error('Apply Job Error:', err);
        } finally {
            setIsApplying(false);
        }
    };
    // --- END LOGIC ỨNG TUYỂN ---

    // --- RENDERING UI ---

    // Xử lý trạng thái Loading tổng thể (Auth + Data)
    if (loadingAuth || loading) {
        return (
            <MainLayout>
                <div className="text-center py-20 text-lg font-medium text-blue-600">
                    <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-blue-500 rounded-full" role="status"></div>
                    <span className="ml-3">Đang tải chi tiết công việc...</span>
                </div>
            </MainLayout>
        );
    }
    
    // ... (Phần Error và Job Not Found giữ nguyên) ...

    if (error) {
        return (
            <MainLayout>
                <div className="max-w-4xl mx-auto px-4 py-20 text-center text-red-600 bg-red-50 border border-red-300 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Lỗi Tải Dữ Liệu</h2>
                    <p>{error}</p>
                </div>
            </MainLayout>
        );
    }

    if (!job) {
        return (
            <MainLayout>
                <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-600 bg-gray-50 border border-gray-300 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Không tìm thấy Công việc</h2>
                    <p>Vui lòng kiểm tra lại đường dẫn.</p>
                </div>
            </MainLayout>
        );
    }

    const currentStatus = statusConfig[job.status] || { label: 'Không xác định', icon: faTag, color: 'text-gray-600 bg-gray-100' };

    // Điều kiện hiển thị form:
    const isClientJob = job.client?._id === userId;
    const canApply = job.status === 'open' && userRole === 'freelancer' && !applicationStatus.isApplied && !isClientJob;
    const isJobOpen = job.status === 'open';

    return (
        <MainLayout>
            <div className="max-w-5xl mx-auto">

                <ReusableHeading title={job.title} className="text-4xl text-blue-800 border-b pb-3 mb-6" />

                <div className="grid md:grid-cols-3 gap-8">

                    {/* Cột 1 & 2: Mô tả & Kỹ năng */}
                    <div className="md:col-span-2">
                        {/* Mô tả Công việc */}
                        <section className="bg-white p-6 rounded-xl shadow-lg mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Mô Tả Chi Tiết</h2>
                            <div 
                                className="text-gray-700 leading-relaxed prose max-w-none" 
                                dangerouslySetInnerHTML={{ __html: job.description }} 
                            />
                        </section>

                        {/* Kỹ năng Yêu cầu */}
                        <section className="bg-white p-6 rounded-xl shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                                <FontAwesomeIcon icon={faCodeBranch} className="mr-3 text-blue-600" />
                                Kỹ Năng Cần Thiết
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {job.skillsRequired && job.skillsRequired.length > 0 ? (
                                    job.skillsRequired.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full border border-indigo-200"
                                        >
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-gray-500">Không có yêu cầu kỹ năng cụ thể nào được liệt kê.</p>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Cột 3: Thông tin tóm tắt & Client & APPLY FORM */}
                    <div className="md:col-span-1 space-y-6">

                        {/* Thông tin Tóm tắt */}
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
                               <h2 className="text-xl font-bold text-blue-700 mb-4 border-b pb-2">Thông Tin Chung</h2>
                            <div className="space-y-3 text-gray-700">
                                <p className="flex justify-between items-center text-lg font-extrabold text-green-700 border-b pb-2">
                                    <FontAwesomeIcon icon={faDollarSign} className="mr-3 text-green-500" />
                                    Ngân sách:
                                    <span>
                                        {job.budget ? `$${job.budget.toLocaleString('en-US')}` : 'Thỏa thuận'}
                                    </span>
                                </p>
                                <p className="flex items-center">
                                    <FontAwesomeIcon icon={currentStatus.icon} className={`mr-3 ${currentStatus.color}`} />
                                    Trạng thái:
                                    <span className={`ml-auto font-semibold ${currentStatus.color} px-2 py-0.5 rounded-lg`}>
                                        {currentStatus.label}
                                    </span>
                                </p>
                                <p className="flex items-center">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-3 text-gray-500" />
                                    Ngày đăng:
                                    <span className="ml-auto font-semibold">
                                        {new Date(job.createdAt).toLocaleDateString("vi-VN")}
                                    </span>
                                </p>
                                {job.category && job.category.name && (
                                    <p className="flex items-center">
                                        <FontAwesomeIcon icon={faTag} className="mr-3 text-purple-500" />
                                        Danh mục:
                                        <span className="ml-auto font-semibold text-purple-600">
                                            {job.category.name}
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>


                        {/* 💡 FORM ỨNG TUYỂN CÔNG VIỆC */}
                        {isJobOpen && (
                            <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-200">
                                <h2 className="text-xl font-bold text-indigo-700 mb-4 border-b pb-2">
                                    <FontAwesomeIcon icon={faPaperPlane} className="mr-3 text-indigo-500" />
                                    Gửi Hồ Sơ Ứng Tuyển
                                </h2>

                                {/* Thông báo lỗi/thành công */}
                                {applyError && (
                                    <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                                        {applyError}
                                    </div>
                                )}
                                {applicationStatus.message && (
                                    <div className={`p-3 mb-4 text-sm rounded-lg ${applicationStatus.isApplied ? 'text-green-700 bg-green-100' : 'text-blue-700 bg-blue-100'}`}>
                                        {applicationStatus.message}
                                    </div>
                                )}

                                {canApply ? (
                                    <form onSubmit={handleApplyJob}>
                                        <div className="mb-4">
                                            <label htmlFor="coverLetter" className="block text-gray-700 text-sm font-bold mb-2">Thư xin việc (Cover Letter):</label>
                                            <textarea
                                                id="coverLetter"
                                                rows="5"
                                                value={coverLetter}
                                                onChange={(e) => setCoverLetter(e.target.value)}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                placeholder="Nêu kinh nghiệm của bạn và tại sao bạn phù hợp với công việc này..."
                                                required
                                                disabled={isApplying}
                                            ></textarea>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isApplying || applicationStatus.isApplied}
                                            className={`w-full text-white font-bold py-2 px-4 rounded-lg transition duration-200 ${
                                                isApplying || applicationStatus.isApplied 
                                                    ? 'bg-gray-400 cursor-not-allowed' 
                                                    : 'bg-indigo-600 hover:bg-indigo-700'
                                            }`}
                                        >
                                            {isApplying ? (
                                                <span className="flex items-center justify-center">
                                                    <div className="animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent text-white rounded-full mr-2"></div>
                                                    Đang gửi...
                                                </span>
                                            ) : (
                                                'Gửi Ứng Tuyển Ngay'
                                            )}
                                        </button>
                                    </form>
                                ) : (
                                    // Hiển thị thông báo nếu không thể ứng tuyển
                                    <p className="text-center text-sm text-gray-500 p-2 bg-gray-50 rounded">
                                        {job.status !== 'open' 
                                            ? 'Công việc này hiện không mở để ứng tuyển.' 
                                            : (isClientJob
                                                ? 'Bạn là chủ dự án này. Bạn không thể tự ứng tuyển.' 
                                                : (!isAuthenticated 
                                                    ? 'Vui lòng đăng nhập với vai trò Freelancer để ứng tuyển.' 
                                                    : applicationStatus.message || 'Bạn đã ứng tuyển.'))} 
                                    </p>
                                )}
                            </div>
                        )}
                        {/* 💡 KẾT THÚC FORM ỨNG TUYỂN */}

                        {/* Thông tin Client */}
                        {job.client && (
                            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                                <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">
                                    <FontAwesomeIcon icon={faUserTie} className="mr-3 text-blue-500" />
                                    Thông tin Khách hàng
                                </h2>
                                <p className="text-gray-700">
                                    <span className="font-semibold block">{job.client.name}</span>
                                    <span className="text-sm text-gray-500">{job.client.email}</span>
                                </p>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default JobDetail;