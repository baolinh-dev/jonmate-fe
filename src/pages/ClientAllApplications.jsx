import {
	faBriefcase,
	faCalendarAlt,
	faCheckCircle,
	faDollarSign,
	faEnvelope,
	faExternalLinkAlt,
	faFileAlt,
	faHourglassHalf,
	faLink,
	faPaperPlane,
	faSpinner,
	faThumbsDown,
	faThumbsUp,
	faTimesCircle,
	faUser,
	faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api"; // Đường dẫn đến file API đã cấu hình
import ReusableHeading from "../components/ReusableHeading";
import MainLayout from "../layouts/MainLayout";

// --- SUB-COMPONENT: HIỂN THỊ CHI TIẾT ĐƠN ỨNG TUYỂN ---
const ApplicationOverviewCard = ({ application, onStatusUpdate }) => {
	const navigate = useNavigate();
	const [isUpdating, setIsUpdating] = useState(false); // Trạng thái loading riêng cho từng thẻ

	// 💡 Cập nhật: Thay 'pending' bằng 'applied'
	const statusConfig = {
		applied: {
			label: "Đã ứng tuyển",
			color: "bg-yellow-100 text-yellow-700",
			icon: faPaperPlane,
		},
		accepted: {
			label: "Đã chấp nhận",
			color: "bg-green-100 text-green-700",
			icon: faCheckCircle,
		},
		rejected: {
			label: "Đã từ chối",
			color: "bg-red-100 text-red-700",
			icon: faTimesCircle,
		},
	};

	const currentStatus =
		statusConfig[application.status] || statusConfig.applied;
	const isApplied = application.status === "applied"; // Kiểm tra xem có phải trạng thái chưa xử lý không

	// Format Budget
	const formattedBudget = application.job?.budget
		? `$${application.job.budget.toLocaleString("en-US")}`
		: "Thỏa thuận";

	const handleAction = async (newStatus) => {
		setIsUpdating(true);
		// Gọi hàm từ component cha để xử lý API
		await onStatusUpdate(application._id, newStatus);
		setIsUpdating(false);
	};

	return (
		<div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl hover:border-indigo-300">
			<div className="flex justify-between items-start border-b pb-3 mb-3">
				{/* Thông tin Công việc và Ứng viên */}
				<div className="flex-1 min-w-0 pr-4">
					{/* Tên Công việc */}
					<h3 className="text-xl font-bold text-indigo-700 truncate mb-1 flex items-center">
						<FontAwesomeIcon
							icon={faBriefcase}
							className="mr-2 text-indigo-500"
						/>
						{application.job?.title || "Công việc đã xóa"}
					</h3>

					{/* Tên Freelancer */}
					<p className="text-sm text-gray-800 font-semibold flex items-center">
						<FontAwesomeIcon icon={faUser} className="mr-2 text-blue-500" />
						Ứng viên: {application.freelancer?.name || "Freelancer Ẩn Danh"}
					</p>
					<p className="text-xs text-gray-500 pl-4">
						{application.freelancer?.email || "Không có email"}
					</p>
				</div>

				{/* Trạng thái Hồ sơ */}
				<span
					className={`mt-2 md:mt-0 px-3 py-1 text-xs font-bold uppercase rounded-full ${currentStatus.color} flex items-center whitespace-nowrap`}
				>
					<FontAwesomeIcon icon={currentStatus.icon} className="mr-1" />
					{currentStatus.label}
				</span>
			</div>

			{/* Thông tin chi tiết */}
			<div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
				<p className="flex items-center">
					<FontAwesomeIcon
						icon={faDollarSign}
						className="mr-2 text-green-500"
					/>
					Ngân sách Job:{" "}
					<span className="font-bold text-green-700 ml-1">
						{formattedBudget}
					</span>
				</p>
				<p className="flex items-center">
					<FontAwesomeIcon
						icon={faCalendarAlt}
						className="mr-2 text-gray-500"
					/>
					Ứng tuyển vào:{" "}
					{new Date(
						application.submittedAt || application.createdAt,
					).toLocaleDateString("vi-VN")}
				</p>
			</div>

			{/* Thư xin việc (Tóm tắt) */}
			<h4 className="text-md font-semibold text-gray-700 mb-1 flex items-center">
				<FontAwesomeIcon icon={faFileAlt} className="mr-2 text-pink-500" />
				Thư xin việc (Tóm tắt):
			</h4>
			<blockquote className="text-sm text-gray-600 border-l-4 border-pink-300 pl-3 italic bg-pink-50 p-3 rounded-md line-clamp-2 mb-4">
				{application.coverLetter || "Không có thư xin việc."}
			</blockquote>

			{/* Wallet Address - Show if freelancer has wallet */}
			{application.freelancer?.walletAddress && (
				<div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
					<h4 className="text-sm font-semibold text-purple-700 mb-2 flex items-center">
						<FontAwesomeIcon icon={faWallet} className="mr-2" />
						Địa chỉ ví Blockchain:
					</h4>
					<code className="text-xs bg-purple-100 px-2 py-1 rounded font-mono text-purple-800 break-all">
						{application.freelancer.walletAddress}
					</code>
				</div>
			)}

			{/* 💡 NÚT HÀNH ĐỘNG CẬP NHẬT TRẠNG THÁI */}
			<div className="pt-2 border-t space-y-3">
				{isApplied ? ( // Hiển thị nút khi trạng thái là 'applied'
					<div className="flex justify-end space-x-3">
						<button
							onClick={() => handleAction("rejected")}
							disabled={isUpdating}
							className={`flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition duration-200 ${
								isUpdating
									? "bg-gray-400 text-white cursor-not-allowed"
									: "bg-red-500 hover:bg-red-600 text-white"
							}`}
						>
							{isUpdating ? (
								<FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
							) : (
								<FontAwesomeIcon icon={faThumbsDown} className="mr-2" />
							)}
							Từ chối
						</button>
						<button
							onClick={() => handleAction("accepted")}
							disabled={isUpdating}
							className={`flex items-center px-4 py-2 text-sm font-semibold rounded-lg transition duration-200 ${
								isUpdating
									? "bg-gray-400 text-white cursor-not-allowed"
									: "bg-green-500 hover:bg-green-600 text-white"
							}`}
						>
							{isUpdating ? (
								<FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
							) : (
								<FontAwesomeIcon icon={faThumbsUp} className="mr-2" />
							)}
							Chấp nhận
						</button>
					</div>
				) : application.status === "accepted" ? (
					<div>
						<div className="flex justify-between items-center mb-3">
							<span className="text-sm font-semibold text-green-700 flex items-center">
								<FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
								Đã chấp nhận ứng viên này
							</span>
						</div>

						{/* Go to Job Detail for blockchain assignment */}
						<button
							onClick={() => navigate(`/jobs/${application.job._id}`)}
							className="w-full flex items-center justify-center px-4 py-3 text-sm font-bold rounded-lg transition duration-200 bg-indigo-600 hover:bg-indigo-700 text-white"
						>
							<FontAwesomeIcon icon={faLink} className="mr-2" />
							Xem Job & Chỉ định trên Blockchain
							<FontAwesomeIcon
								icon={faExternalLinkAlt}
								className="ml-2 text-xs"
							/>
						</button>

						{!application.freelancer?.walletAddress && (
							<p className="text-xs text-orange-600 mt-2 text-center">
								⚠️ Freelancer chưa cung cấp địa chỉ ví
							</p>
						)}
					</div>
				) : (
					<span className="text-sm italic text-gray-500 block text-right">
						Đã xử lý hồ sơ này.
					</span>
				)}
			</div>
			{/* 💡 KẾT THÚC NÚT HÀNH ĐỘNG */}
		</div>
	);
};

// --- MAIN COMPONENT: HIỂN THỊ TẤT CẢ ỨNG TUYỂN ---
const ClientAllApplications = () => {
	const [applications, setApplications] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [statusMessage, setStatusMessage] = useState(null); // Thông báo hành động

	// --- HÀM XỬ LÝ GỌI API CẬP NHẬT TRẠNG THÁI (HOÀN THIỆN) ---
	const handleUpdateStatus = async (applicationId, newStatus) => {
		setStatusMessage(null); // Reset thông báo

		// Backend của bạn chỉ chấp nhận 'accepted' hoặc 'rejected'
		if (!["accepted", "rejected"].includes(newStatus)) {
			setStatusMessage("Trạng thái không hợp lệ.");
			return;
		}

		try {
			// GỌI API THỰC TẾ: PUT /api/applications/:applicationId/status
			const response = await api.put(`/applications/${applicationId}`, {
				status: newStatus,
			});

			const updatedApplication = response.data; // Backend trả về đối tượng application đã cập nhật

			const actionLabel = newStatus === "accepted" ? "chấp nhận" : "từ chối";
			setStatusMessage(`Thành công! Đã ${actionLabel} hồ sơ ứng tuyển.`);

			// Cập nhật trạng thái ứng dụng trong UI
			setApplications((prevApps) =>
				prevApps.map((app) =>
					// Cập nhật trường status bằng dữ liệu từ server
					app._id === applicationId
						? { ...app, status: updatedApplication.status }
						: app,
				),
			);
		} catch (err) {
			// Xử lý lỗi từ backend (403, 404, 400)
			const errMsg =
				err.response?.data?.message || "Đã xảy ra lỗi khi cập nhật trạng thái.";
			// Đảm bảo thông báo lỗi có tiền tố "Lỗi:"
			setStatusMessage(`Lỗi: ${errMsg}`);
			console.error("Update Status Error:", err);
		}
	};
	// --- KẾT THÚC XỬ LÝ CẬP NHẬT TRẠNG THÁI ---

	useEffect(() => {
		const fetchAllApplications = async () => {
			setLoading(true);
			setError(null);

			try {
				// Endpoint: /api/applications/client/all
				const response = await api.get("/applications/client/all");

				setApplications(response.data.applications || []);
			} catch (err) {
				if (err.response && err.response.status === 403) {
					setError(
						"Bạn không có quyền truy cập trang này. Vui lòng đăng nhập bằng tài khoản Client.",
					);
				} else {
					setError("Đã xảy ra lỗi khi tải danh sách ứng tuyển.");
				}
				console.error("Fetch All Applications Error:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchAllApplications();
	}, []);

	// --- RENDERING UI ---

	if (loading) {
		return (
			<MainLayout>
				<div className="text-center py-20 text-lg font-medium text-indigo-600">
					<div
						className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-indigo-500 rounded-full"
						role="status"
					></div>
					<span className="ml-3">Đang tải tất cả hồ sơ ứng tuyển...</span>
				</div>
			</MainLayout>
		);
	}

	if (error) {
		return (
			<MainLayout>
				<div className="max-w-5xl mx-auto px-4 py-20 text-center text-red-600 bg-red-50 border border-red-300 rounded-xl shadow-lg">
					<h2 className="text-2xl font-bold mb-4">Lỗi Truy Cập Dữ Liệu</h2>
					<p>{error}</p>
				</div>
			</MainLayout>
		);
	}

	const applicationCount = applications.length;
	// Xác định màu thông báo (xanh cho thành công, đỏ cho thất bại)
	const statusClass = statusMessage?.startsWith("Lỗi:")
		? "text-red-700 bg-red-100"
		: "text-blue-700 bg-blue-100";

	return (
		<MainLayout>
			<div className="max-w-5xl mx-auto">
				<ReusableHeading
					title="Các Hồ Sơ Ứng Tuyển Đã Nhận"
					className="text-3xl text-indigo-800 border-b pb-3 mb-6"
				/>

				<p className="text-lg font-medium mb-6 text-gray-700">
					<FontAwesomeIcon
						icon={faBriefcase}
						className="mr-2 text-indigo-500"
					/>
					Tổng số đơn ứng tuyển:{" "}
					<span className="font-extrabold text-indigo-600">
						{applicationCount}
					</span>
				</p>

				{/* Thông báo cập nhật trạng thái */}
				{statusMessage && (
					<div
						className={`p-4 mb-6 text-sm rounded-lg ${statusClass}`}
						role="alert"
					>
						{statusMessage}
					</div>
				)}

				<div className="space-y-6">
					{applicationCount > 0 ? (
						applications.map((app) => (
							<ApplicationOverviewCard
								key={app._id}
								application={app}
								onStatusUpdate={handleUpdateStatus}
							/>
						))
					) : (
						<div className="bg-gray-50 p-8 rounded-xl text-center border border-dashed border-gray-300">
							<h3 className="text-xl font-semibold text-gray-600">
								Bạn chưa nhận được đơn ứng tuyển nào.
							</h3>
							<p className="text-gray-500 mt-2">
								Hoặc bạn chưa đăng công việc nào.
							</p>
						</div>
					)}
				</div>
			</div>
		</MainLayout>
	);
};

export default ClientAllApplications;
