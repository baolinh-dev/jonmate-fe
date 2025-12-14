import {
	faCheckCircle,
	faExclamationTriangle,
	faHourglassHalf,
	faLock,
	faPaperPlane,
	faSpinner,
	faUserCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import blockchainService from "../contracts/blockchainService";
import { JobStatus, JobStatusNames } from "../contracts/config";
import ArbitratorPanel from "./ArbitratorPanel";
import WalletConnect from "./WalletConnect";

const BlockchainJobActions = ({ job, userRole, userId }) => {
	const navigate = useNavigate();
	const [walletAddress, setWalletAddress] = useState(null);
	const [blockchainStatus, setBlockchainStatus] = useState(null);
	const [disputeInfo, setDisputeInfo] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const isClient = userRole === "client" && job.client?._id === userId;

	// Check if current user is assigned freelancer
	// Check both from DB and from blockchain
	const isAssignedFreelancerFromDB =
		userRole === "freelancer" && job.assignedFreelancer?._id === userId;
	const isAssignedFreelancerFromBlockchain =
		userRole === "freelancer" &&
		blockchainStatus?.freelancer?.toLowerCase() ===
			walletAddress?.toLowerCase();
	const isAssignedFreelancer =
		isAssignedFreelancerFromDB || isAssignedFreelancerFromBlockchain;

	useEffect(() => {
		if (job.escrowAddress) {
			loadBlockchainStatus();
		}
	}, [job.escrowAddress]);

	const loadBlockchainStatus = async () => {
		try {
			const details = await blockchainService.getJobDetails(job.escrowAddress);
			setBlockchainStatus(details);

			// Load dispute info if work is submitted
			if (details.status === JobStatus.SUBMITTED) {
				const info = await blockchainService.getDisputeInfo(job.escrowAddress);
				setDisputeInfo(info);
			}
		} catch (err) {
			console.error("Error loading blockchain status:", err);
		}
	};

	const handleAssignFreelancer = async () => {
		if (!walletAddress) {
			setError("Vui lòng kết nối ví trước");
			return;
		}

		// Get wallet from assigned freelancer (from database)
		let freelancerWallet = job.assignedFreelancer?.walletAddress;

		// If not available, show helpful error message
		if (!freelancerWallet) {
			// Try to prompt as fallback
			const manualInput = window.confirm(
				"Freelancer được chấp nhận chưa cung cấp địa chỉ ví.\n\n" +
					"Bạn có muốn nhập địa chỉ ví thủ công không?\n" +
					"(Freelancer cần gửi địa chỉ từ MetaMask của họ)",
			);

			if (manualInput) {
				freelancerWallet = prompt(
					"Nhập địa chỉ ví MetaMask của freelancer:\n" +
						"(Format: 0x...)\n\n" +
						"Lưu ý: Đảm bảo địa chỉ chính xác!",
				);
			}
		}

		if (!freelancerWallet) {
			setError(
				"Không có địa chỉ ví. Vui lòng yêu cầu freelancer cập nhật địa chỉ ví trong profile hoặc nhập thủ công.",
			);
			return;
		}

		// Validate format
		if (!freelancerWallet.startsWith("0x") || freelancerWallet.length !== 42) {
			setError("Địa chỉ ví không hợp lệ. Phải có format 0x... và 42 ký tự");
			return;
		}

		setLoading(true);
		setError("");
		setSuccess("");

		try {
			// Step 1: Assign on blockchain
			await blockchainService.assignFreelancer(
				job.escrowAddress,
				freelancerWallet,
			);

			// Step 2: Update backend database with freelancer wallet address
			try {
				await api.patch(`/jobs/${job._id}`, {
					escrowAddress: job.escrowAddress,
					blockchainStatus: "in_progress",
					freelancerWalletAddress: freelancerWallet.toLowerCase(),
				});
			} catch (backendErr) {
				console.warn(
					"Backend update failed but blockchain succeeded:",
					backendErr,
				);
			}

			setSuccess("Đã chỉ định freelancer thành công!");
			await loadBlockchainStatus();

			// Reload page to refresh job data
			setTimeout(() => {
				window.location.reload();
			}, 2000);
		} catch (err) {
			setError(err.message || "Có lỗi khi chỉ định freelancer");
		} finally {
			setLoading(false);
		}
	};

	const handleSubmitWork = async () => {
		if (!walletAddress) {
			setError("Vui lòng kết nối ví trước");
			return;
		}

		setLoading(true);
		setError("");

		try {
			await blockchainService.submitWork(job.escrowAddress);
			setSuccess("Đã gửi công việc thành công! Chờ client phê duyệt.");
			await loadBlockchainStatus();
		} catch (err) {
			setError(err.message || "Có lỗi khi gửi công việc");
		} finally {
			setLoading(false);
		}
	};

	const handleApproveWork = async () => {
		if (!walletAddress) {
			setError("Vui lòng kết nối ví trước");
			return;
		}

		if (
			!window.confirm(
				"Xác nhận phê duyệt công việc? Tiền sẽ được tự động chuyển cho freelancer.",
			)
		) {
			return;
		}

		setLoading(true);
		setError("");

		try {
			await blockchainService.approveWork(job.escrowAddress);
			setSuccess("Đã phê duyệt và thanh toán thành công!");
			await loadBlockchainStatus();
		} catch (err) {
			setError(err.message || "Có lỗi khi phê duyệt công việc");
		} finally {
			setLoading(false);
		}
	};

	const handleInitiateDispute = async () => {
		if (!walletAddress) {
			setError("Vui lòng kết nối ví trước");
			return;
		}

		// Check if dispute is available
		if (disputeInfo && !disputeInfo.canDispute) {
			const hoursRemaining = Math.ceil(disputeInfo.timeRemaining / 3600);
			const minutesRemaining = Math.ceil(disputeInfo.timeRemaining / 60);
			const timeStr =
				hoursRemaining > 1
					? `${hoursRemaining} giờ`
					: `${minutesRemaining} phút`;
			setError(
				`Bạn chỉ có thể khiếu nại sau khi client không phê duyệt trong thời gian quy định. Vui lòng đợi thêm ${timeStr}.`,
			);
			return;
		}

		if (
			!window.confirm(
				"Bạn muốn khiếu nại công việc này? Điều này sẽ chuyển vụ việc sang trọng tài xử lý.",
			)
		) {
			return;
		}

		setLoading(true);
		setError("");

		try {
			await blockchainService.initiateDispute(job.escrowAddress);
			setSuccess("Đã gửi khiếu nại thành công. Đợi trọng tài xem xét.");
			await loadBlockchainStatus();
		} catch (err) {
			const errorMessage = err.message || "";
			if (errorMessage.includes("Approval timeout not reached")) {
				setError(
					"Chưa đến thời gian có thể khiếu nại. Vui lòng đợi client xem xét công việc trong thời gian quy định.",
				);
			} else if (
				errorMessage.includes("Only freelancer can initiate dispute")
			) {
				setError("Chỉ freelancer được giao việc mới có thể khiếu nại.");
			} else {
				setError(errorMessage || "Có lỗi khi khiếu nại");
			}
		} finally {
			setLoading(false);
		}
	};

	if (!job.escrowAddress) {
		// Show fund button for client
		if (isClient) {
			return (
				<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
					<h3 className="text-lg font-semibold text-yellow-800 mb-3">
						<FontAwesomeIcon icon={faLock} className="mr-2" />
						Cần ký quỹ Blockchain
					</h3>
					<p className="text-sm text-yellow-700 mb-4">
						Công việc này chưa được ký quỹ trên blockchain. Hãy ký quỹ để bảo vệ
						cả hai bên.
					</p>
					<button
						onClick={() => navigate(`/jobs/${job._id}/fund`)}
						className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg transition"
					>
						<FontAwesomeIcon icon={faLock} className="mr-2" />
						Ký quỹ ngay
					</button>
				</div>
			);
		}
		return null;
	}

	return (
		<div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 mt-6">
			<h3 className="text-lg font-semibold text-purple-800 mb-4">
				<FontAwesomeIcon icon={faLock} className="mr-2" />
				Trạng thái Blockchain
			</h3>

			{/* Wallet Connection */}
			<div className="mb-4">
				<WalletConnect onWalletConnected={setWalletAddress} />
			</div>

			{/* Blockchain Status Info */}
			{blockchainStatus && (
				<div className="bg-white rounded-lg p-4 mb-4 space-y-2 text-sm">
					<div className="flex justify-between items-center">
						<span className="text-gray-600">Trạng thái:</span>
						<span className="font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-800">
							{JobStatusNames[blockchainStatus.status]}
						</span>
					</div>

					{/* Info based on status */}
					{blockchainStatus.status === JobStatus.FUNDED && isClient && (
						<div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-xs text-yellow-800">
							<strong>Bước tiếp theo:</strong> Chỉ định freelancer trên
							blockchain để bắt đầu công việc.
						</div>
					)}

					{blockchainStatus.status === JobStatus.IN_PROGRESS &&
						isAssignedFreelancer && (
							<div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs text-blue-800">
								<strong>Nhiệm vụ của bạn:</strong> Hoàn thành công việc và click
								"Gửi công việc hoàn thành".
							</div>
						)}

					{blockchainStatus.status === JobStatus.SUBMITTED && isClient && (
						<div className="bg-green-50 border border-green-200 rounded p-2 text-xs text-green-800">
							<strong>Freelancer đã gửi công việc!</strong> Hãy kiểm tra và phê
							duyệt để thanh toán tự động.
						</div>
					)}

					{blockchainStatus.status === JobStatus.COMPLETED && (
						<div className="bg-purple-50 border border-purple-200 rounded p-2 text-xs text-purple-800">
							<strong>✅ Hoàn thành!</strong> Thanh toán đã được thực hiện tự
							động trên blockchain.
						</div>
					)}

					{blockchainStatus.amount !== "0.0" && (
						<>
							<div className="flex justify-between">
								<span className="text-gray-600">Số tiền ký quỹ:</span>
								<span className="font-semibold">
									{blockchainStatus.amount} ETH
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-600">Freelancer nhận:</span>
								<span className="font-semibold text-green-600">
									{blockchainStatus.freelancerAmount} ETH
								</span>
							</div>
						</>
					)}
					<div className="pt-2 border-t">
						<a
							href={`https://sepolia.etherscan.io/address/${job.escrowAddress}`}
							target="_blank"
							rel="noopener noreferrer"
							className="text-xs text-blue-600 hover:text-blue-800 break-all"
						>
							📄 Xem Contract: {job.escrowAddress}
						</a>
					</div>
				</div>
			)}

			{/* Actions based on role and status */}
			<div className="space-y-3">
				{/* Client Actions */}
				{isClient && blockchainStatus && (
					<>
						{blockchainStatus.status === JobStatus.FUNDED && (
							<div>
								{job.assignedFreelancer && (
									<div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
										<p className="text-xs font-semibold text-blue-800 mb-1">
											👤 Freelancer đã chấp nhận:
										</p>
										<p className="text-sm font-bold text-blue-900">
											{job.assignedFreelancer.name}
										</p>
										{job.assignedFreelancer.walletAddress ? (
											<code className="text-xs bg-blue-100 px-2 py-1 rounded mt-1 block">
												{job.assignedFreelancer.walletAddress}
											</code>
										) : (
											<p className="text-xs text-orange-600 mt-1">
												⚠️ Chưa có địa chỉ ví (cần nhập thủ công)
											</p>
										)}
									</div>
								)}
								<button
									onClick={handleAssignFreelancer}
									disabled={loading || !job.assignedFreelancer}
									className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<FontAwesomeIcon icon={faUserCheck} className="mr-2" />
									{loading
										? "Đang xử lý..."
										: job.assignedFreelancer
											? "Chỉ định trên Blockchain"
											: "Chưa chấp nhận freelancer nào"}
								</button>
								{!job.assignedFreelancer && (
									<p className="text-xs text-gray-600 mt-2 text-center">
										Hãy vào trang Ứng tuyển để chấp nhận một freelancer trước
									</p>
								)}
							</div>
						)}

						{blockchainStatus.status === JobStatus.SUBMITTED && (
							<button
								onClick={handleApproveWork}
								disabled={loading}
								className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
							>
								<FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
								{loading ? "Đang xử lý..." : "Phê duyệt & Thanh toán"}
							</button>
						)}
					</>
				)}

				{/* Freelancer Actions */}
				{isAssignedFreelancer && blockchainStatus && (
					<>
						{blockchainStatus.status === JobStatus.IN_PROGRESS && (
							<button
								onClick={handleSubmitWork}
								disabled={loading}
								className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50"
							>
								<FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
								{loading ? "Đang xử lý..." : "Gửi công việc hoàn thành"}
							</button>
						)}

						{blockchainStatus.status === JobStatus.SUBMITTED && (
							<div>
								{disputeInfo && !disputeInfo.canDispute && (
									<div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3 text-xs text-blue-800">
										<FontAwesomeIcon icon={faHourglassHalf} className="mr-2" />
										<strong>Thời gian chờ phê duyệt:</strong> Client có{" "}
										{Math.floor(disputeInfo.approvalTimeout / 3600)} giờ để xem
										xét.
										{disputeInfo.timeRemaining > 0 && (
											<div className="mt-1">
												Còn{" "}
												<strong>
													{Math.ceil(disputeInfo.timeRemaining / 60)}
												</strong>{" "}
												phút nữa bạn có thể khiếu nại nếu client không phê
												duyệt.
											</div>
										)}
									</div>
								)}
								{disputeInfo && disputeInfo.canDispute && (
									<div className="bg-orange-50 border border-orange-200 rounded p-3 mb-3 text-xs text-orange-800">
										<FontAwesomeIcon
											icon={faExclamationTriangle}
											className="mr-2"
										/>
										<strong>Thời gian phê duyệt đã hết!</strong> Client chưa phê
										duyệt công việc. Bạn có thể khiếu nại để yêu cầu trọng tài
										xử lý.
									</div>
								)}
								<button
									onClick={handleInitiateDispute}
									disabled={loading || (disputeInfo && !disputeInfo.canDispute)}
									className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<FontAwesomeIcon
										icon={faExclamationTriangle}
										className="mr-2"
									/>
									{loading
										? "Đang xử lý..."
										: disputeInfo && !disputeInfo.canDispute
											? "Chưa thể khiếu nại"
											: "Khiếu nại"}
								</button>
							</div>
						)}
					</>
				)}
			</div>

			{/* Messages */}
			{error && (
				<div className="mt-3 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
					{error}
				</div>
			)}

			{success && (
				<div className="mt-3 bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded text-sm">
					{success}
				</div>
			)}

			{/* Arbitrator Panel - Show if job is in dispute */}
			{blockchainStatus?.status === JobStatus.DISPUTED && (
				<div className="mt-4 p-4 bg-orange-50 border-2 border-orange-300 rounded-lg">
					<div className="text-sm text-orange-800 font-semibold mb-2">
						⚠️ Công việc đang trong tranh chấp
					</div>
					<p className="text-xs text-orange-700">
						Trọng tài sẽ xem xét và đưa ra phán quyết. Xem panel trọng tài bên
						dưới.
					</p>
				</div>
			)}
		</div>
	);
};

export default BlockchainJobActions;
