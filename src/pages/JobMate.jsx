import React from 'react';
// Import icons cho phần Giá trị Cốt lõi
import { FaGlobe, FaShieldAlt, FaHandshake, FaBullseye, FaRocket } from 'react-icons/fa';

// Import các components cơ bản (giả định)
import Header from '../components/Header';
import Footer from '../components/Footer';

const JobMate = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            {/* Header */}
            <Header />

            <main className="pt-16 pb-12">
                {/* 1. Phần Tiêu đề Chính (Hero Header) */}
                <section className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-b-2xl shadow-lg mx-4 lg:mx-auto max-w-7xl">
                    <div className="max-w-4xl mx-auto px-6">
                        {/* Tiêu đề Lớn */}
                        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
                            <span className="text-jm-primary">JobMate:</span> Xây dựng tương lai công việc <br />
                            <span className="text-jm-accent">phi tập trung.</span>
                        </h1>
                        {/* Slogan - ĐÃ SỬA LỖI MARKDOWN */}
                        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mt-6 mb-8">
                            Nền tảng kết nối Freelancer và Client dựa trên <strong className="font-bold">Blockchain</strong> – nơi độ tin cậy được mã hóa.
                        </p>

                        {/* ⭐ NỘI DUNG BỔ SUNG MỚI ⭐ */}
                        <div className="max-w-3xl mx-auto border-t pt-8 border-gray-300 dark:border-gray-700">
                            <p className="text-lg text-gray-700 dark:text-gray-300 italic">
                                Chúng tôi thành lập JobMate để giải quyết vấn đề thiếu minh bạch và tranh chấp thanh toán trong thế giới công việc tự do truyền thống. Bằng cách áp dụng **Hợp đồng thông minh (Smart Contracts)**, chúng tôi tạo ra một môi trường làm việc không cần bên thứ ba, nơi mọi giao dịch đều **an toàn tuyệt đối** và **công bằng tuyệt đối** cho cả hai bên.
                            </p>
                        </div>
                        {/* KẾT THÚC NỘI DUNG BỔ SUNG MỚI */}

                    </div>
                </section>
                {/* 2. Phần Sứ mệnh & Tầm nhìn (Mission & Vision) */}
                <section className="py-20 px-6 max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                        {/* Sứ mệnh - ĐÃ SỬA LỖI MARKDOWN */}
                        <div className="p-6 border-l-4 border-jm-primary shadow-xl rounded-lg bg-white dark:bg-gray-800">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                                <FaBullseye className="text-jm-primary mr-3" /> Sứ mệnh của chúng tôi
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 space-y-4">
                                Chúng tôi tin rằng công việc tự do (freelancing) cần phải
                                <strong className="font-bold"> minh bạch</strong>,
                                <strong className="font-bold"> an toàn</strong> và
                                <strong className="font-bold"> công bằng</strong> hơn. Sứ mệnh của JobMate là phá vỡ những rào cản truyền thống bằng cách tận dụng công nghệ Blockchain. Chúng tôi trao quyền cho Freelancer toàn quyền sở hữu hồ sơ chuyên môn và đảm bảo rằng Client luôn nhận được chất lượng công việc xứng đáng.
                            </p>
                        </div>

                        {/* Tầm nhìn */}
                        <div className="p-6 border-l-4 border-jm-accent shadow-xl rounded-lg bg-white dark:bg-gray-800">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                                <FaGlobe className="text-jm-accent mr-3" /> Tầm nhìn
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300">
                                Trở thành nền tảng Freelancer Web3 hàng đầu thế giới, là tiêu chuẩn mới cho việc làm từ xa, nơi niềm tin không còn là lời hứa mà là một đoạn mã (code) được mã hóa.
                            </p>
                        </div>

                    </div>
                </section>

                {/* 3. Phần Giá trị Cốt lõi (The Blockchain Difference) */}
                <section className="py-20 px-6 bg-gray-50 dark:bg-gray-800">
                    <div className="max-w-6xl mx-auto text-center">
                        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-12">
                            3 Trụ cột tạo nên sự khác biệt của JobMate
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                            {/* Trụ cột 1: Hợp đồng Thông minh */}
                            <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-2xl hover:shadow-jm-primary/50 transition duration-300">
                                <FaHandshake className="text-5xl text-jm-primary mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Hợp đồng Thông minh</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Loại bỏ tranh chấp thanh toán. Tiền được giữ trong Escrow phi tập trung và giải ngân tự động khi hoàn thành công việc.
                                </p>
                            </div>

                            {/* Trụ cột 2: Hồ sơ Phi tập trung */}
                            <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-2xl hover:shadow-jm-accent/50 transition duration-300">
                                <FaShieldAlt className="text-5xl text-jm-accent mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Hồ sơ D-ID</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Mọi đánh giá và kinh nghiệm được ghi lại trên chuỗi khối, không thể giả mạo, giúp xây dựng danh tiếng vững chắc.
                                </p>
                            </div>

                            {/* Trụ cột 3: Thanh toán Tốc độ */}
                            <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-2xl hover:shadow-jm-primary/50 transition duration-300">
                                <FaRocket className="text-5xl text-jm-primary mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Thanh toán Tốc độ</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Giảm thiểu chi phí trung gian và tốc độ thanh toán gần như tức thì trên toàn cầu, tối ưu hóa dòng tiền cho Freelancer.
                                </p>
                            </div>

                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default JobMate;