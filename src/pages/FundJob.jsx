import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import WalletConnect from '../components/WalletConnect';
import blockchainService from '../contracts/blockchainService';
import { JobStatus, JobStatusNames } from '../contracts/config';
import api from '../api/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLock,
  faCheckCircle,
  faExclamationTriangle,
  faDollarSign,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';

const FundJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [funding, setFunding] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [escrowAddress, setEscrowAddress] = useState('');
  const [salary, setSalary] = useState('');
  const [blockchainStatus, setBlockchainStatus] = useState(null);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const response = await api.get(`/jobs/${id}`);
      setJob(response.data);

      // Check if job has escrow address
      if (response.data.escrowAddress) {
        setEscrowAddress(response.data.escrowAddress);
        await checkBlockchainStatus(response.data.escrowAddress);
      }

      // Don't auto-fill from budget (budget is in USD, we need ETH)
      // User should manually enter ETH amount
      if (response.data.budget) {
        // Show budget in USD as reference, but don't set as salary
        // Suggest a conversion: 1 ETH ≈ $3000 (approximate)
        const estimatedEth = (response.data.budget / 3000).toFixed(4);
        setSalary(estimatedEth);
      }
    } catch (err) {
      setError('Không thể tải thông tin công việc');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkBlockchainStatus = async (address) => {
    try {
      const details = await blockchainService.getJobDetails(address);
      setBlockchainStatus(details);
    } catch (err) {
      console.error('Error checking blockchain status:', err);
    }
  };

  const handleCreateAndFund = async () => {
    if (!walletAddress) {
      setError('Vui lòng kết nối ví trước');
      return;
    }

    if (!salary || parseFloat(salary) <= 0) {
      setError('Vui lòng nhập số tiền hợp lệ');
      return;
    }

    setFunding(true);
    setError('');
    setSuccess('');

    try {
      // Step 1: Create job on blockchain if not exists
      let currentEscrowAddress = escrowAddress;

      if (!currentEscrowAddress) {
        setSuccess('Đang tạo smart contract...');
        currentEscrowAddress = await blockchainService.createJob(
          id,
          job.title
        );

        if (!currentEscrowAddress) {
          throw new Error('Không thể tạo smart contract');
        }

        // Update job with escrow address in backend
        await api.patch(`/jobs/${id}`, {
          escrowAddress: currentEscrowAddress
        });

        setEscrowAddress(currentEscrowAddress);
        setSuccess('Smart contract đã được tạo. Đang ký quỹ...');
      }

      // Step 2: Fund the escrow
      const totalAmount = blockchainService.calculateTotalAmount(salary);

      await blockchainService.fundEscrow(currentEscrowAddress, totalAmount);

      // Update job status in backend
      await api.patch(`/jobs/${id}`, {
        blockchainStatus: 'funded',
        fundedAmount: totalAmount
      });

      setSuccess('Ký quỹ thành công! Công việc đã sẵn sàng.');

      // Refresh blockchain status
      await checkBlockchainStatus(currentEscrowAddress);

      setTimeout(() => {
        navigate(`/jobs/${id}`);
      }, 2000);

    } catch (err) {
      console.error('Funding error:', err);
      setError(err.message || 'Có lỗi xảy ra khi ký quỹ');
    } finally {
      setFunding(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto p-8 text-center">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-purple-600" />
          <p className="mt-4">Đang tải...</p>
        </div>
      </MainLayout>
    );
  }

  if (!job) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto p-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Không tìm thấy công việc
          </div>
        </div>
      </MainLayout>
    );
  }

  const totalAmount = salary ? blockchainService.calculateTotalAmount(salary) : '0';

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-purple-700 mb-6 flex items-center">
          <FontAwesomeIcon icon={faLock} className="mr-3" />
          Ký quỹ Blockchain
        </h1>

        {/* Wallet Connection */}
        <div className="mb-6">
          <WalletConnect onWalletConnected={setWalletAddress} />
        </div>

        {/* Job Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">{job.title}</h2>
          <div className="space-y-2 text-gray-700">
            <p><strong>Mô tả:</strong> {job.description?.substring(0, 150)}...</p>
            <p><strong>Danh mục:</strong> {job.category?.name}</p>
            {job.budget && (
              <p><strong>Ngân sách gốc:</strong> ${job.budget} USD
                <span className="text-xs text-gray-500 ml-2">
                  (≈ {(job.budget / 3000).toFixed(4)} ETH)
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Blockchain Status */}
        {blockchainStatus && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3 text-blue-800">Trạng thái Blockchain</h3>
            <div className="space-y-2">
              <p><strong>Contract Address:</strong>
                <span className="font-mono text-sm ml-2">{escrowAddress}</span>
              </p>
              <p><strong>Trạng thái:</strong>
                <span className="ml-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                  {JobStatusNames[blockchainStatus.status]}
                </span>
              </p>
              {blockchainStatus.amount !== '0.0' && (
                <>
                  <p><strong>Số tiền ký quỹ:</strong> {blockchainStatus.amount} ETH</p>
                  <p><strong>Phí dịch vụ:</strong> {blockchainStatus.platformFee} ETH</p>
                  <p><strong>Freelancer nhận:</strong> {blockchainStatus.freelancerAmount} ETH</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Funding Form */}
        {(!blockchainStatus || blockchainStatus.status === JobStatus.CREATED) && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Thông tin ký quỹ</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số tiền lương cho Freelancer (ETH)
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Nhập số ETH bạn muốn trả cho freelancer (trên Sepolia testnet)
                </p>
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faDollarSign}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="number"
                    step="0.0001"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    className="border border-gray-300 p-3 pl-10 w-full rounded-lg"
                    placeholder="0.001"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Ví dụ: 0.001 ETH hoặc 0.01 ETH (test)
                </p>
              </div>

              {salary && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Phí nền tảng (5%):</strong> {(parseFloat(salary) * 0.05).toFixed(4)} ETH
                  </p>
                  <p className="text-lg font-bold text-purple-700 mt-2">
                    <strong>Tổng cần ký quỹ:</strong> {totalAmount} ETH
                  </p>
                </div>
              )}

              <button
                onClick={handleCreateAndFund}
                disabled={funding || !walletAddress || !salary}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {funding ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faLock} />
                    <span>Ký quỹ và Tạo Escrow</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Messages */}
        {error && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center">
            <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
            {success}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">Lưu ý:</h4>
          <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
            <li>Số tiền sẽ được giữ an toàn trong smart contract</li>
            <li>Chỉ được giải ngân khi bạn phê duyệt công việc hoàn thành</li>
            <li>Phí nền tảng 5% sẽ được tự động tính vào tổng số tiền</li>
            <li>Giao dịch trên Sepolia testnet - không sử dụng ETH thật</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
};

export default FundJob;
