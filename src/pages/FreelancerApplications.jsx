// src/pages/FreelancerApplications.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import MainLayout from '../layouts/MainLayout';
import ReusableHeading from '../components/ReusableHeading';
import { useAuth } from '../context/AuthContext'; // Dùng Auth Context để lấy userId
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faDollarSign, faCalendarAlt, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const ApplicationStatus = ({ status }) => {
    let style = "px-3 py-1 rounded-full text-xs font-semibold";
    let text = "";

    switch (status) {
        case 'pending':
            style += " bg-yellow-100 text-yellow-800";
            text = "Đang chờ";
            break;
        case 'accepted':
            style += " bg-green-100 text-green-800";
            text = "Được duyệt";
            break;
        case 'rejected':
            style += " bg-red-100 text-red-800";
            text = "Từ chối";
            break;
        case 'withdrawn':
            style += " bg-gray-100 text-gray-800";
            text = "Đã rút hồ sơ";
            break;
        default:
            style += " bg-blue-100 text-blue-800";
            text = "Mới ứng tuyển";
    }

    return <span className={style}>{text}</span>;
};

const FreelancerApplications = () => {
    const { user, loading: loadingAuth } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Kiểm tra vai trò người dùng (Chỉ Freelancer mới được xem)
    useEffect(() => {
        if (!loadingAuth && user && user.role !== 'freelancer') {
            setError("Bạn không có quyền truy cập trang này. Chỉ Freelancer mới được xem hồ sơ ứng tuyển.");
            setLoading(false);
        }
    }, [user, loadingAuth]);

    useEffect(() => {
        if (loadingAuth || !user || user.role !== 'freelancer') return;
        
        const fetchApplications = async () => {
            setLoading(true);
            setError(null);
            
            try {
                // Endpoint giả định: GET /applications/freelancer-applications
                // Backend của bạn dùng req.user.id nên không cần truyền id vào URL
                const response = await api.get('/applications/freelancer/applications'); 
                setApplications(response.data.applications);
            } catch (err) {
                console.error("Lỗi khi tải ứng tuyển:", err);
                setError(err.response?.data?.message || "Không thể tải danh sách ứng tuyển.");
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [user, loadingAuth]);

    if (loadingAuth || loading) {
        return (
            <MainLayout>
                <div className="text-center py-20 text-lg font-medium text-indigo-600">
                    <FontAwesomeIcon icon={faSpinner} spin className="mr-3" />
                    Đang tải danh sách ứng tuyển...
                </div>
            </MainLayout>
        );
    }
    
    if (error) {
         return (
            <MainLayout>
                <div className="max-w-4xl mx-auto px-4 py-12 text-center text-red-600 bg-red-50 border border-red-300 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Lỗi Truy Cập</h2>
                    <p>{error}</p>
                    {(!user || user.role !== 'freelancer') && (
                        <p className="mt-4 text-sm text-gray-600">Vui lòng đăng nhập với tài khoản Freelancer.</p>
                    )}
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="max-w-6xl mx-auto">
                <ReusableHeading 
                    title="Hồ Sơ Ứng Tuyển Của Tôi" 
                    icon={faPaperPlane}
                    className="text-3xl text-indigo-700 border-b pb-3 mb-8"
                />

                {applications.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-700">Chưa có hồ sơ ứng tuyển nào.</h3>
                        <p className="mt-2 text-gray-500">Hãy tìm kiếm và ứng tuyển những công việc thú vị ngay bây giờ!</p>
                        <Link 
                            to="/jobs" 
                            className="mt-4 inline-block bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
                        >
                            Duyệt các Công việc
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {applications.map((app) => (
                            <div 
                                key={app._id} 
                                className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500 hover:shadow-xl transition duration-300"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-2xl font-bold text-gray-800 hover:text-indigo-600 transition duration-150">
                                        {/* Link tới chi tiết công việc */}
                                        <Link to={`/jobs/${app.job._id}`}>{app.job.title}</Link>
                                    </h3>
                                    {/* Hiển thị trạng thái ứng tuyển */}
                                    <ApplicationStatus status={app.status} />
                                </div>

                                <p className="text-sm text-gray-500 mb-4">
                                    Ứng tuyển vào: {new Date(app.createdAt).toLocaleDateString('vi-VN')}
                                </p>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700 border-t pt-4">
                                    <div>
                                        <p className="font-semibold text-indigo-600 mb-1">Client:</p>
                                        <p>{app.job.client?.name || 'Client Ẩn danh'}</p>
                                        <p className="text-xs text-gray-500">{app.job.client?.email}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-indigo-600 mb-1">Ngân sách:</p>
                                        <p className="text-green-600 font-bold">
                                            <FontAwesomeIcon icon={faDollarSign} className="mr-1" />
                                            {app.job.budget ? app.job.budget.toLocaleString('vi-VN') + ' VND' : 'Thỏa thuận'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-indigo-600 mb-1">Danh mục:</p>
                                        <p>{app.job.category?.name || 'Chưa phân loại'}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-indigo-600 mb-1">Ngày đăng Job:</p>
                                        <p><FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />{new Date(app.job.createdAt).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                </div>
                                
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="font-semibold text-gray-800 mb-1">Thư xin việc (Tóm tắt):</p>
                                    {/* Hiển thị một phần Cover Letter */}
                                    <blockquote className="text-gray-600 italic border-l-4 border-gray-200 pl-4 py-1 bg-gray-50 rounded-r-md">
                                        {app.coverLetter.substring(0, 150)}... 
                                        {/* Bạn có thể thêm nút "Xem chi tiết" để hiển thị toàn bộ */}
                                    </blockquote>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default FreelancerApplications;