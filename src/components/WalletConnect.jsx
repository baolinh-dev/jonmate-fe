import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import blockchainService from '../contracts/blockchainService';
import { onAccountsChanged, onChainChanged } from '../contracts/web3';
import { CURRENT_NETWORK } from '../contracts/config';
import api from '../api/api';

const WalletConnect = ({ onWalletConnected }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if wallet is already connected
    checkConnection();

    // Listen to account changes
    onAccountsChanged((accounts) => {
      if (accounts.length === 0) {
        setWalletAddress(null);
        if (onWalletConnected) onWalletConnected(null);
      } else {
        setWalletAddress(accounts[0]);
        if (onWalletConnected) onWalletConnected(accounts[0]);
      }
    });

    // Listen to network changes
    onChainChanged(() => {
      window.location.reload();
    });
  }, []);

  const saveWalletToBackend = async (address) => {
    try {
      await api.patch('/users/wallet', { walletAddress: address });
      console.log('Wallet address saved to backend');
    } catch (err) {
      console.warn('Failed to save wallet to backend:', err);
      // Don't show error to user, this is non-critical
    }
  };

  const checkConnection = async () => {
    try {
      const account = await blockchainService.getCurrentAccount();
      if (account) {
        setWalletAddress(account);
        if (onWalletConnected) onWalletConnected(account);
        // Save to backend
        await saveWalletToBackend(account);
      }
    } catch (err) {
      console.error('Error checking connection:', err);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    setError('');

    try {
      const address = await blockchainService.connectWallet();
      setWalletAddress(address);
      if (onWalletConnected) onWalletConnected(address);

      // Save wallet address to backend
      await saveWalletToBackend(address);
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError(err.message || 'Không thể kết nối ví');
    } finally {
      setIsConnecting(false);
    }
  };

  const shortenAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg shadow-md border border-purple-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FontAwesomeIcon icon={faWallet} className="text-purple-600 text-xl" />
          <span className="font-semibold text-gray-700">Ví Blockchain</span>
        </div>

        {walletAddress ? (
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
            <span className="text-sm font-mono bg-white px-3 py-1 rounded border border-purple-300">
              {shortenAddress(walletAddress)}
            </span>
          </div>
        ) : (
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <FontAwesomeIcon icon={faWallet} />
            <span>{isConnecting ? 'Đang kết nối...' : 'Kết nối ví'}</span>
          </button>
        )}
      </div>

      {error && (
        <div className="mt-3 flex items-center space-x-2 text-red-600 text-sm">
          <FontAwesomeIcon icon={faTimesCircle} />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-2 text-xs text-gray-500">
        Network: {CURRENT_NETWORK.chainName}
      </div>
    </div>
  );
};

export default WalletConnect;
