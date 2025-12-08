// src/pages/FreelancerApplications.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import MainLayout from '../layouts/MainLayout';
import ReusableHeading from '../components/ReusableHeading';
import { useAuth } from '../context/AuthContext'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faSpinner, 
    faDollarSign, 
    faCalendarAlt, 
    faPaperPlane, 
    faChartPie,
    faUser 
} from '@fortawesome/free-solid-svg-icons';


// STATUS Component
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



// MAIN PAGE
const FreelancerApplications = () => {
    const { user, loading: loadingAuth } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Tab dropdown
    const [activeTab, setActiveTab] = useState("applications");

    // Permissions
    useEffect(() => {
        if (!loadingAuth && user && user.role !== 'freelancer') {
            setError("Bạn không có quyền truy cập trang này. Chỉ Freelancer mới được xem hồ sơ ứng tuyển.");
            setLoading(false);
        }
    }, [user, loadingAuth]);


    // Fetch application list
    useEffect(() => {
        if (loadingAuth || !user || user.role !== 'freelancer') return;
        
        const fetchApplications = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const response = await api.get('/applications/freelancer/applications');
                setApplications(response.data.applications || []);
            } catch (err) {
                console.error("Lỗi khi tải ứng tuyển:", err);
                setError(err.response?.data?.message || "Không thể tải danh sách ứng tuyển.");
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [user, loadingAuth]);



    // Dashboard Stats
    const stats = {
        total: applications.length,
        accepted: applications.filter(a => a.status === "accepted").length,
        pending: applications.filter(a => a.status === "pending").length,
        rejected: applications.filter(a => a.status === "rejected").length
    };



    // Loading
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


    // Error
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

                {/* PAGE TITLE */}
                <ReusableHeading 
                    title="Hồ Sơ Ứng Tuyển Của Tôi" 
                    icon={faPaperPlane}
                    className="text-3xl text-indigo-700 border-b pb-3 mb-8"
                />

                {/* TABS */}
                <div className="flex gap-4 mb-8 border-b pb-2 text-lg font-semibold">
                    <button 
                        onClick={() => setActiveTab("applications")}
                        className={`${activeTab === "applications" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500"}`}
                    >
                        Ứng Tuyển
                    </button>

                    <button 
                        onClick={() => setActiveTab("dashboard")}
                        className={`${activeTab === "dashboard" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500"}`}
                    >
                        Dashboard
                    </button>

                    <button 
                        onClick={() => setActiveTab("profile")}
                        className={`${activeTab === "profile" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500"}`}
                    >
                        Hồ Sơ Cá Nhân
                    </button>
                </div>



                {/* TAB CONTENT */}
                <div className="mt-6">

                    {/* TAB 1: APPLICATION LIST */}
                    {activeTab === "applications" && (
                        <div>
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
                                    {applications.map(app => (
                                        <div 
                                            key={app._id} 
                                            className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500 hover:shadow-xl transition duration-300"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <h3 className="text-2xl font-bold text-gray-800 hover:text-indigo-600 transition duration-150">
                                                    <Link to={`/jobs/${app.job._id}`}>{app.job.title}</Link>
                                                </h3>
                                                <ApplicationStatus status={app.status} />
                                            </div>

                                            <p className="text-sm text-gray-500 mb-4">
                                                Ứng tuyển vào: {new Date(app.createdAt).toLocaleDateString('vi-VN')}
                                            </p>

                                            {/* Job Data */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700 border-t pt-4">
                                                <div>
                                                    <p className="font-semibold text-indigo-600 mb-1">Client:</p>
                                                    <p>{app.job.client?.name || 'Client Ẩn danh'}</p>
                                                </div>

                                                <div>
                                                    <p className="font-semibold text-indigo-600 mb-1">Ngân sách:</p>
                                                    <p className="text-green-600 font-bold">
                                                        <FontAwesomeIcon icon={faDollarSign} className="mr-1" />
                                                        {app.job.budget ? app.job.budget.toLocaleString() + ' VND' : 'Thỏa thuận'}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="font-semibold text-indigo-600 mb-1">Danh mục:</p>
                                                    <p>{app.job.category?.name || 'Chưa phân loại'}</p>
                                                </div>

                                                <div>
                                                    <p className="font-semibold text-indigo-600 mb-1">Ngày đăng:</p>
                                                    <p><FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />{new Date(app.job.createdAt).toLocaleDateString('vi-VN')}</p>
                                                </div>
                                            </div>

                                            {/* COVER LETTER */}
                                            <div className="mt-4 pt-4 border-t">
                                                <p className="font-semibold text-gray-800 mb-1">Thư xin việc (Tóm tắt):</p>
                                                <blockquote className="text-gray-600 italic border-l-4 border-gray-200 pl-4 py-1 bg-gray-50 rounded-r-md">
                                                    {app.coverLetter?.substring(0, 150)}...
                                                </blockquote>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}



                    {/* TAB 2: DASHBOARD */}
                    {activeTab === "dashboard" && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                            <div className="bg-indigo-50 p-6 rounded-xl shadow">
                                <FontAwesomeIcon icon={faChartPie} className="text-indigo-600 text-3xl mb-3" />
                                <h3 className="text-xl font-bold">Tổng ứng tuyển</h3>
                                <p className="text-3xl font-bold text-indigo-700 mt-2">{stats.total}</p>
                            </div>

                            <div className="bg-green-50 p-6 rounded-xl shadow">
                                <h3 className="text-xl font-bold text-green-700">Được duyệt</h3>
                                <p className="text-3xl font-bold mt-2">{stats.accepted}</p>
                            </div>

                            <div className="bg-yellow-50 p-6 rounded-xl shadow">
                                <h3 className="text-xl font-bold text-yellow-700">Đang chờ</h3>
                                <p className="text-3xl font-bold mt-2">{stats.pending}</p>
                            </div>

                            <div className="bg-red-50 p-6 rounded-xl shadow">
                                <h3 className="text-xl font-bold text-red-700">Từ chối</h3>
                                <p className="text-3xl font-bold mt-2">{stats.rejected}</p>
                            </div>

                        </div>
                    )}



                    {/* TAB 3: PROFILE */}
                    {activeTab === "profile" && (
                        <div className="py-10 text-center text-gray-600">
                            <FontAwesomeIcon icon={faUser} className="text-5xl mb-3 text-gray-400" />
                            <h3 className="text-xl font-semibold">Trang Hồ Sơ Cá Nhân</h3>
                            <p className="mt-2">Bạn có thể thêm nội dung hồ sơ freelancer sau.</p>
                        </div>
                    )}

                </div>

            </div>
        </MainLayout>
    );
};

export default FreelancerApplications;
