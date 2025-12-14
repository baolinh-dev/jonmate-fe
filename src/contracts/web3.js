import { ethers } from "ethers";
import { CURRENT_NETWORK } from "./config";
import JobEscrowABI from "./JobEscrow.json";
import JobFactoryABI from "./JobFactory.json";

// Get provider
export const getProvider = () => {
	if (window.ethereum) {
		return new ethers.BrowserProvider(window.ethereum);
	}
	// Fallback to read-only provider
	return new ethers.JsonRpcProvider(CURRENT_NETWORK.rpcUrl);
};

// Get signer
export const getSigner = async () => {
	const provider = getProvider();
	return await provider.getSigner();
};

// Connect wallet
export const connectWallet = async () => {
	if (!window.ethereum) {
		throw new Error("Please install MetaMask or another Web3 wallet");
	}

	try {
		const accounts = await window.ethereum.request({
			method: "eth_requestAccounts",
		});

		// Check if on correct network
		const chainId = await window.ethereum.request({ method: "eth_chainId" });
		const currentChainId = parseInt(chainId, 16);

		if (currentChainId !== CURRENT_NETWORK.chainId) {
			await switchNetwork();
		}

		return accounts[0];
	} catch (error) {
		console.error("Error connecting wallet:", error);
		throw error;
	}
};

// Switch to Sepolia network
export const switchNetwork = async () => {
	try {
		await window.ethereum.request({
			method: "wallet_switchEthereumChain",
			params: [{ chainId: `0x${CURRENT_NETWORK.chainId.toString(16)}` }],
		});
	} catch (switchError) {
		// This error code indicates that the chain has not been added to MetaMask
		if (switchError.code === 4902) {
			try {
				await window.ethereum.request({
					method: "wallet_addEthereumChain",
					params: [
						{
							chainId: `0x${CURRENT_NETWORK.chainId.toString(16)}`,
							chainName: CURRENT_NETWORK.chainName,
							rpcUrls: [CURRENT_NETWORK.rpcUrl],
							blockExplorerUrls: [CURRENT_NETWORK.blockExplorer],
						},
					],
				});
			} catch (addError) {
				throw addError;
			}
		} else {
			throw switchError;
		}
	}
};

// Get JobFactory contract instance
export const getJobFactoryContract = async (needSigner = false) => {
	const address = CURRENT_NETWORK.jobFactory;
	if (needSigner) {
		const signer = await getSigner();
		return new ethers.Contract(address, JobFactoryABI.abi, signer);
	} else {
		const provider = getProvider();
		return new ethers.Contract(address, JobFactoryABI.abi, provider);
	}
};

// Get JobEscrow contract instance
export const getJobEscrowContract = async (
	escrowAddress,
	needSigner = false,
) => {
	if (needSigner) {
		const signer = await getSigner();
		return new ethers.Contract(escrowAddress, JobEscrowABI.abi, signer);
	} else {
		const provider = getProvider();
		return new ethers.Contract(escrowAddress, JobEscrowABI.abi, provider);
	}
};

// Format ETH amount
export const formatEther = (wei) => {
	return ethers.formatEther(wei);
};

// Parse ETH amount
export const parseEther = (eth) => {
	return ethers.parseEther(eth.toString());
};

// Get current wallet address
export const getCurrentAccount = async () => {
	if (!window.ethereum) return null;
	const accounts = await window.ethereum.request({ method: "eth_accounts" });
	return accounts[0] || null;
};

// Listen to account changes
export const onAccountsChanged = (callback) => {
	if (window.ethereum) {
		window.ethereum.on("accountsChanged", callback);
	}
};

// Listen to network changes
export const onChainChanged = (callback) => {
	if (window.ethereum) {
		window.ethereum.on("chainChanged", callback);
	}
};
