import { CURRENT_NETWORK } from "./config";
import {
	connectWallet,
	formatEther,
	getCurrentAccount,
	getJobEscrowContract,
	getJobFactoryContract,
	parseEther,
} from "./web3";

// Blockchain Service for JobMate
export const blockchainService = {
	// Connect wallet and return address
	async connectWallet() {
		return await connectWallet();
	},

	// Get current connected account
	async getCurrentAccount() {
		return await getCurrentAccount();
	},

	// Create a new job on blockchain
	async createJob(jobId, jobTitle) {
		try {
			const contract = await getJobFactoryContract(true);
			const tx = await contract.createJob(jobId, jobTitle);
			const receipt = await tx.wait();

			// Get the escrow address from events
			const event = receipt.logs.find((log) => {
				try {
					return contract.interface.parseLog(log)?.name === "JobCreated";
				} catch {
					return false;
				}
			});

			if (event) {
				const parsedEvent = contract.interface.parseLog(event);
				return parsedEvent.args.escrowContract;
			}

			return null;
		} catch (error) {
			console.error("Error creating job:", error);
			throw error;
		}
	},

	// Fund the escrow contract
	async fundEscrow(escrowAddress, amount) {
		try {
			const contract = await getJobEscrowContract(escrowAddress, true);
			const value = parseEther(amount);
			const platformFeePercent = CURRENT_NETWORK.platformFeePercent;

			const tx = await contract.fundEscrow(platformFeePercent, { value });
			await tx.wait();

			return true;
		} catch (error) {
			console.error("Error funding escrow:", error);
			throw error;
		}
	},

	// Assign freelancer to job
	async assignFreelancer(escrowAddress, freelancerAddress) {
		try {
			const contract = await getJobEscrowContract(escrowAddress, true);
			const tx = await contract.assignFreelancer(freelancerAddress);
			await tx.wait();

			return true;
		} catch (error) {
			console.error("Error assigning freelancer:", error);
			throw error;
		}
	},

	// Submit work (freelancer)
	async submitWork(escrowAddress) {
		try {
			const contract = await getJobEscrowContract(escrowAddress, true);
			const tx = await contract.submitWork();
			await tx.wait();

			return true;
		} catch (error) {
			console.error("Error submitting work:", error);
			throw error;
		}
	},

	// Approve work and release payment (client)
	async approveWork(escrowAddress) {
		try {
			const contract = await getJobEscrowContract(escrowAddress, true);
			const tx = await contract.approveWork();
			await tx.wait();

			return true;
		} catch (error) {
			console.error("Error approving work:", error);
			throw error;
		}
	},

	// Initiate dispute (freelancer)
	async initiateDispute(escrowAddress) {
		try {
			const contract = await getJobEscrowContract(escrowAddress, true);
			const tx = await contract.initiateDispute();
			await tx.wait();

			return true;
		} catch (error) {
			console.error("Error initiating dispute:", error);
			throw error;
		}
	},

	// Get job details from escrow
	async getJobDetails(escrowAddress) {
		try {
			const contract = await getJobEscrowContract(escrowAddress, false);
			const details = await contract.getJobDetails();

			return {
				client: details[0],
				freelancer: details[1],
				amount: formatEther(details[2]),
				platformFee: formatEther(details[3]),
				freelancerAmount: formatEther(details[4]),
				status: Number(details[5]),
				jobId: details[6],
				jobTitle: details[7],
			};
		} catch (error) {
			console.error("Error getting job details:", error);
			throw error;
		}
	},

	// Get submission timestamp and check if dispute is available
	async getDisputeInfo(escrowAddress) {
		try {
			const contract = await getJobEscrowContract(escrowAddress, false);
			const workSubmittedAt = await contract.workSubmittedAt();
			const approvalTimeout = await contract.approvalTimeout();

			const submissionTimestamp = Number(workSubmittedAt);
			const timeoutSeconds = Number(approvalTimeout);
			const currentTime = Math.floor(Date.now() / 1000);

			const canDispute =
				submissionTimestamp > 0 &&
				currentTime >= submissionTimestamp + timeoutSeconds;
			const timeRemaining =
				submissionTimestamp > 0
					? Math.max(0, submissionTimestamp + timeoutSeconds - currentTime)
					: 0;

			return {
				submissionTime: submissionTimestamp,
				approvalTimeout: timeoutSeconds,
				canDispute,
				timeRemaining,
				canDisputeAt:
					submissionTimestamp > 0 ? submissionTimestamp + timeoutSeconds : 0,
			};
		} catch (error) {
			console.error("Error getting dispute info:", error);
			return null;
		}
	},

	// Get escrow balance
	async getEscrowBalance(escrowAddress) {
		try {
			const contract = await getJobEscrowContract(escrowAddress, false);
			const balance = await contract.getBalance();
			return formatEther(balance);
		} catch (error) {
			console.error("Error getting escrow balance:", error);
			throw error;
		}
	},

	// Get escrow address for a job
	async getJobContract(jobId) {
		try {
			const contract = await getJobFactoryContract(false);
			const address = await contract.getJobContract(jobId);
			return address;
		} catch (error) {
			console.error("Error getting job contract:", error);
			throw error;
		}
	},

	// Cancel job and refund (only if freelancer not assigned)
	async cancelAndRefund(escrowAddress) {
		try {
			const contract = await getJobEscrowContract(escrowAddress, true);
			const tx = await contract.cancelAndRefund();
			await tx.wait();

			return true;
		} catch (error) {
			console.error("Error cancelling and refunding:", error);
			throw error;
		}
	},

	// Calculate total amount including platform fee
	calculateTotalAmount(salary) {
		const platformFeePercent = CURRENT_NETWORK.platformFeePercent;
		const salaryNum = parseFloat(salary);
		const fee = (salaryNum * platformFeePercent) / 100;
		return (salaryNum + fee).toFixed(4);
	},

	// === ARBITRATOR FUNCTIONS ===

	// Arbitrator releases funds to freelancer
	async releaseFundsToFreelancer(escrowAddress) {
		try {
			const contract = await getJobEscrowContract(escrowAddress, true);
			const tx = await contract.releaseFundsToFreelancer();
			await tx.wait();

			return true;
		} catch (error) {
			console.error("Error releasing funds to freelancer:", error);
			throw error;
		}
	},

	// Arbitrator refunds to client
	async refundToClient(escrowAddress) {
		try {
			const contract = await getJobEscrowContract(escrowAddress, true);
			const tx = await contract.refundToClient();
			await tx.wait();

			return true;
		} catch (error) {
			console.error("Error refunding to client:", error);
			throw error;
		}
	},

	// Check if current account is arbitrator
	async isArbitrator(escrowAddress) {
		try {
			const contract = await getJobEscrowContract(escrowAddress, false);
			const arbitrator = await contract.arbitrator();
			const currentAccount = await getCurrentAccount();

			return (
				arbitrator.toLowerCase() === currentAccount?.toLowerCase()
			);
		} catch (error) {
			console.error("Error checking arbitrator:", error);
			return false;
		}
	},
};

export default blockchainService;
