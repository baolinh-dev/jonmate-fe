import {
	faCheckCircle,
	faExclamationTriangle,
	faGavel,
	faInfoCircle,
	faSpinner,
	faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import blockchainService from "../contracts/blockchainService";
import { JobStatus, JobStatusNames } from "../contracts/config";
import WalletConnect from "./WalletConnect";

const ArbitratorPanel = ({ job }) => {
	const [walletAddress, setWalletAddress] = useState(null);
	const [blockchainStatus, setBlockchainStatus] = useState(null);
	const [isArbitrator, setIsArbitrator] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	useEffect(() => {
		if (job.escrowAddress) {
			loadBlockchainStatus();
		}
	}, [job.escrowAddress]);

	useEffect(() => {
		if (job.escrowAddress && walletAddress) {
			checkArbitratorStatus();
		}
	}, [job.escrowAddress, walletAddress]);

	const loadBlockchainStatus = async () => {
		try {
			const details = await blockchainService.getJobDetails(job.escrowAddress);
			setBlockchainStatus(details);
		} catch (err) {
			console.error("Error loading blockchain status:", err);
		}
	};

	const checkArbitratorStatus = async () => {
		try {
			const result = await blockchainService.isArbitrator(job.escrowAddress);
			setIsArbitrator(result);
		} catch (err) {
			console.error("Error checking arbitrator status:", err);
		}
	};

	const handleReleaseFundsToFreelancer = async () => {
		if (
			!window.confirm(
				"⚖️ XÁC NHẬN PHÁN QUYẾT\n\n" +
					"Bạn đang phán quyết GIẢI NGÂN cho Freelancer.\n\n" +
					"✅ Freelancer sẽ nhận: " +
					blockchainStatus.freelancerAmount +
					" ETH\n" +
					"💰 Platform phí: " +
					blockchainStatus.platformFee +
					" ETH\n\n" +
					"Hành động này KHÔNG THỂ HOÀN TÁC!\n\n" +
					"Xác nhận phán quyết?",
			)
		) {
			return;
		}

		setLoading(true);
		setError("");
		setSuccess("");

		try {
			await blockchainService.releaseFundsToFreelancer(job.escrowAddress);
			setSuccess(
				"✅ Đã phán quyết thành công! Tiền đã được chuyển cho Freelancer.",
			);
			await loadBlockchainStatus();

			// Reload after 3 seconds
			setTimeout(() => {
				window.location.reload();
			}, 3000);
		} catch (err) {
			const errorMessage = err.message || "";
			if (errorMessage.includes("Only arbitrator")) {
				setError("Chỉ trọng tài mới có thể thực hiện hành động này.");
			} else if (errorMessage.includes("Invalid status")) {
				setError(
					"Trạng thái công việc không hợp lệ. Chỉ có thể phán quyết khi job đang trong trạng thái DISPUTED.",
				);
			} else {
				setError(errorMessage || "Có lỗi khi phán quyết");
			}
		} finally {
			setLoading(false);
		}
	};

	const handleRefundToClient = async () => {
		if (
			!window.confirm(
				"⚖️ XÁC NHẬN PHÁN QUYẾT\n\n" +
					"Bạn đang phán quyết HOÀN TIỀN cho Client.\n\n" +
					"💸 Client sẽ nhận lại: " +
					blockchainStatus.amount +
					" ETH\n" +
					"❌ Freelancer sẽ KHÔNG nhận được tiền\n\n" +
					"Hành động này KHÔNG THỂ HOÀN TÁC!\n\n" +
					"Xác nhận phán quyết?",
			)
		) {
			return;
		}

		setLoading(true);
		setError("");
		setSuccess("");

		try {
			await blockchainService.refundToClient(job.escrowAddress);
			setSuccess(
				"✅ Đã phán quyết thành công! Tiền đã được hoàn trả cho Client.",
			);
			await loadBlockchainStatus();

			// Reload after 3 seconds
			setTimeout(() => {
				window.location.reload();
			}, 3000);
		} catch (err) {
			const errorMessage = err.message || "";
			if (errorMessage.includes("Only arbitrator")) {
				setError("Chỉ trọng tài mới có thể thực hiện hành động này.");
			} else if (errorMessage.includes("Invalid status")) {
				setError(
					"Trạng thái công việc không hợp lệ. Chỉ có thể phán quyết khi job đang trong trạng thái DISPUTED.",
				);
			} else {
				setError(errorMessage || "Có lỗi khi phán quyết");
			}
		} finally {
			setLoading(false);
		}
	};

	// Only show panel if job has escrow and is in dispute
	if (!job.escrowAddress || !blockchainStatus) {
		return null;
	}

	// Only show if in DISPUTED status
	if (blockchainStatus.status !== JobStatus.DISPUTED) {
		return null;
	}

	return (
		<div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300 rounded-lg p-6 mt-6">
			<div className="flex items-center mb-4">
				<FontAwesomeIcon
					icon={faGavel}
					className="text-3xl text-red-700 mr-3"
				/>
				<div>
					<h3 className="text-xl font-bold text-red-800">Panel Trọng Tài</h3>
					<p className="text-sm text-red-600">
						Công việc đang trong trạng thái tranh chấp
					</p>
				</div>
			</div>

			{/* Wallet Connection */}
			<div className="mb-4">
				<WalletConnect onWalletConnected={setWalletAddress} />
			</div>

			{/* Arbitrator Check */}
			{walletAddress && (
				<>
					{isArbitrator ? (
						<div className="bg-green-50 border border-green-300 rounded-lg p-4 mb-4">
							<FontAwesomeIcon
								icon={faCheckCircle}
								className="text-green-700 mr-2"
							/>
							<strong className="text-green-800">Xác nhận:</strong>
							<span className="text-green-700 ml-2">
								Bạn là Trọng tài của công việc này
							</span>
						</div>
					) : (
						<div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-4">
							<FontAwesomeIcon
								icon={faExclamationTriangle}
								className="text-yellow-700 mr-2"
							/>
							<strong className="text-yellow-800">Cảnh báo:</strong>
							<span className="text-yellow-700 ml-2">
								Bạn không phải là Trọng tài được chỉ định cho công việc này
							</span>
						</div>
					)}
				</>
			)}

			{/* Job Details */}
			{blockchainStatus && (
				<div className="bg-white rounded-lg p-4 mb-4 space-y-2 text-sm border border-gray-200">
					<div className="flex justify-between items-center pb-2 border-b">
						<span className="font-semibold text-gray-700">
							Thông tin tranh chấp:
						</span>
						<span className="px-3 py-1 rounded-full bg-red-100 text-red-800 font-bold text-xs">
							{JobStatusNames[blockchainStatus.status]}
						</span>
					</div>

					<div className="flex justify-between">
						<span className="text-gray-600">Số tiền ký quỹ:</span>
						<span className="font-bold text-gray-900">
							{blockchainStatus.amount} ETH
						</span>
					</div>

					<div className="flex justify-between">
						<span className="text-gray-600">
							Freelancer sẽ nhận (nếu thắng):
						</span>
						<span className="font-bold text-green-600">
							{blockchainStatus.freelancerAmount} ETH
						</span>
					</div>

					<div className="flex justify-between">
						<span className="text-gray-600">Platform phí:</span>
						<span className="font-bold text-blue-600">
							{blockchainStatus.platformFee} ETH
						</span>
					</div>

					<div className="flex justify-between">
						<span className="text-gray-600">Client sẽ nhận (nếu thắng):</span>
						<span className="font-bold text-orange-600">
							{blockchainStatus.amount} ETH
						</span>
					</div>

					<div className="pt-2 border-t">
						<div className="text-xs text-gray-600 mb-1">Client:</div>
						<div className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
							{blockchainStatus.client}
						</div>
					</div>

					<div>
						<div className="text-xs text-gray-600 mb-1">Freelancer:</div>
						<div className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
							{blockchainStatus.freelancer}
						</div>
					</div>
				</div>
			)}

			{/* Action Buttons */}
			{isArbitrator && (
				<div className="space-y-3">
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
						<FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
						<strong>Hướng dẫn:</strong> Hãy xem xét kỹ lưỡng công việc và bằng
						chứng từ cả hai bên trước khi đưa ra phán quyết. Quyết định của bạn
						là cuối cùng và không thể thay đổi.
					</div>

					<button
						onClick={handleReleaseFundsToFreelancer}
						disabled={loading}
						className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
					>
						<FontAwesomeIcon
							icon={loading ? faSpinner : faCheckCircle}
							className={`mr-2 ${loading ? "animate-spin" : ""}`}
						/>
						{loading ? "Đang xử lý..." : "Giải ngân cho Freelancer"}
					</button>

					<button
						onClick={handleRefundToClient}
						disabled={loading}
						className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
					>
						<FontAwesomeIcon
							icon={loading ? faSpinner : faTimesCircle}
							className={`mr-2 ${loading ? "animate-spin" : ""}`}
						/>
						{loading ? "Đang xử lý..." : "Hoàn tiền cho Client"}
					</button>
				</div>
			)}

			{/* Messages */}
			{error && (
				<div className="mt-4 bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded-lg text-sm font-semibold">
					<FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
					{error}
				</div>
			)}

			{success && (
				<div className="mt-4 bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-lg text-sm font-semibold">
					<FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
					{success}
				</div>
			)}
		</div>
	);
};

export default ArbitratorPanel;
