export const CONTRACTS = {
	SEPOLIA: {
		chainId: 11155111,
		chainName: "Sepolia Testnet",
		rpcUrl: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
		blockExplorer: "https://sepolia.etherscan.io",
		jobFactory: "0xb318328d5e52bB83d9AA0DFbDAc127c4A0bD6b68",
		platformFeePercent: 5,
	},
};

export const CURRENT_NETWORK = CONTRACTS.SEPOLIA;

export const JobStatus = {
	CREATED: 0,
	FUNDED: 1,
	IN_PROGRESS: 2,
	SUBMITTED: 3,
	COMPLETED: 4,
	DISPUTED: 5,
	REFUNDED: 6,
};

export const JobStatusNames = {
	0: "Created",
	1: "Funded",
	2: "In Progress",
	3: "Work Submitted",
	4: "Completed",
	5: "Disputed",
	6: "Refunded",
};
