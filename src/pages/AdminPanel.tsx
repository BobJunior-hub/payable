import React, { useState, useEffect } from 'react';
import { approveUserRequest, rejectUserRequest, userRequests, loadInitialData } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { UserRequest, UserRole } from '../types';
import { CheckCircle, XCircle, Clock, Users, Shield } from 'lucide-react';
import { setupStorageSync } from '../utils/dataSync';

const AdminPanel: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [requests, setRequests] = useState<UserRequest[]>(userRequests);
  const [selectedRole, setSelectedRole] = useState<Record<string, UserRole>>({});

  useEffect(() => {
    // Load initial data from API
    loadInitialData().then(() => {
      setRequests([...userRequests]);
    });

    // Setup sync to detect changes from other devices
    const cleanup = setupStorageSync(() => {
      setRequests([...userRequests]);
    });
    return cleanup;
  }, []);

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const approvedRequests = requests.filter(r => r.status === 'approved');
  const rejectedRequests = requests.filter(r => r.status === 'rejected');

  const handleApprove = async (requestId: string) => {
    const role = selectedRole[requestId] || 'viewer';
    if (user) {
      try {
        const newUser = await approveUserRequest(requestId, role, user.id);
        if (newUser) {
          setRequests([...userRequests]);
          await refreshUser();
          alert(`User approved with ${role} role!`);
        }
      } catch (error) {
        alert('Error approving user request. Please try again.');
        console.error('Error approving request:', error);
      }
    }
  };

  const handleReject = async (requestId: string) => {
    if (window.confirm('Are you sure you want to reject this request?')) {
      try {
        await rejectUserRequest(requestId);
        setRequests([...userRequests]);
      } catch (error) {
        alert('Error rejecting user request. Please try again.');
        console.error('Error rejecting request:', error);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'approved':
        return (
          <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            <CheckCircle className="w-3 h-3" />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Admin Panel
          </h2>
          <p className="text-gray-600 mt-1">Manage user access requests</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pending Requests</p>
              <p className="text-3xl font-bold text-gray-900">{pendingRequests.length}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Approved</p>
              <p className="text-3xl font-bold text-gray-900">{approvedRequests.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Rejected</p>
              <p className="text-3xl font-bold text-gray-900">{rejectedRequests.length}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Pending Requests ({pendingRequests.length})
          </h3>
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{request.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{request.email}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Requested: {new Date(request.requestedAt).toLocaleString()}
                    </p>
                  </div>
                  {getStatusBadge(request.status)}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Assign Role:
                    </label>
                    <select
                      value={selectedRole[request.id] || 'viewer'}
                      onChange={(e) =>
                        setSelectedRole({
                          ...selectedRole,
                          [request.id]: e.target.value as UserRole,
                        })
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="creator">Creator</option>
                      <option value="payer">Payer</option>
                    </select>
                  </div>
                  <div className="flex gap-2 pt-6">
                    <button
                      onClick={() => handleApprove(request.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved Requests */}
      {approvedRequests.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Approved Requests</h3>
          <div className="space-y-3">
            {approvedRequests.map((request) => (
              <div
                key={request.id}
                className="p-4 bg-green-50 rounded-lg border border-green-200 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-semibold text-gray-900">{request.name}</h4>
                  <p className="text-sm text-gray-600">{request.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Approved as: <span className="font-medium">{request.role}</span> on{' '}
                    {request.approvedAt
                      ? new Date(request.approvedAt).toLocaleString()
                      : 'N/A'}
                  </p>
                </div>
                {getStatusBadge(request.status)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rejected Requests */}
      {rejectedRequests.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rejected Requests</h3>
          <div className="space-y-3">
            {rejectedRequests.map((request) => (
              <div
                key={request.id}
                className="p-4 bg-red-50 rounded-lg border border-red-200 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-semibold text-gray-900">{request.name}</h4>
                  <p className="text-sm text-gray-600">{request.email}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Requested: {new Date(request.requestedAt).toLocaleString()}
                  </p>
                </div>
                {getStatusBadge(request.status)}
              </div>
            ))}
          </div>
        </div>
      )}

      {requests.length === 0 && (
        <div className="card text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No user requests yet.</p>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

