// src/pages/JobDetail.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Dùng để lấy ID từ URL
import api from '../api/api'; // Đường dẫn đến file API đã cấu hình
import ReusableHeading from '../components/ReusableHeading';
// Giả định bạn đã cài đặt Font Awesome bằng NPM
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faDollarSign, faUserTie, faCalendarAlt, faCodeBranch, faTimesCircle, faCheckCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import MainLayout from '../layouts/MainLayout';

const JobDetail = () => {
    // Lấy ID công việc từ URL (ví dụ: /jobs/69305c94621258b88fcbfabb)
    const { id } = useParams();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Map trạng thái để hiển thị trực quan
    const statusConfig = {
        open: { label: 'Đang mở', icon: faCheckCircle, color: 'text-green-600 bg-green-100' },
        closed: { label: 'Đã đóng', icon: faTimesCircle, color: 'text-red-600 bg-red-100' },
        in_progress: { label: 'Đang tiến hành', icon: faSpinner, color: 'text-blue-600 bg-blue-100' },
        completed: { label: 'Hoàn thành', icon: faCheckCircle, color: 'text-purple-600 bg-purple-100' },
        // Thêm các trạng thái khác nếu cần
    };

    useEffect(() => {
        const fetchJobDetail = async () => {
            if (!id) {
                setError("Không tìm thấy ID công việc trong URL.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await api.get(`/jobs/${id}`); // Gọi API theo ID
                setJob(response.data);
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
    }, [id]); // Chạy lại khi ID thay đổi

    // --- RENDERING UI ---

    if (loading) {
        return (
            <div className="text-center py-20 text-lg font-medium text-blue-600">
                <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-blue-500 rounded-full" role="status"></div>
                <span className="ml-3">Đang tải chi tiết công việc...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center text-red-600 bg-red-50 border border-red-300 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Lỗi Tải Dữ Liệu</h2>
                <p>{error}</p>
            </div>
        );
    }

    if (!job) {
        // Trường hợp không có lỗi nhưng job vẫn null (hiếm khi xảy ra nếu logic lỗi đúng)
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-600 bg-gray-50 border border-gray-300 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Không tìm thấy Công việc</h2>
                <p>Vui lòng kiểm tra lại đường dẫn.</p>
            </div>
        );
    }

    // Lấy config trạng thái hiện tại
    const currentStatus = statusConfig[job.status] || { label: 'Không xác định', icon: faTag, color: 'text-gray-600 bg-gray-100' };

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
                            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {job.description}
                            </div>
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

                    {/* Cột 3: Thông tin tóm tắt & Client */}
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

                                {/* Thêm Category nếu bạn đã populate nó ở BE, nếu không hãy bỏ qua */}
                                {job.category && (
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