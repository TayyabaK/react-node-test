/**
 * UserLogPage Component
 *
 * An administrative component that displays user activity logs with comprehensive
 * information and management capabilities. Implements localStorage-based log storage
 * and retrieval with delete functionality for administrators.
 *
 * Features:
 * - Displays user logs with login time, logout time, JWT token, username, role, IP address
 * - Provides delete functionality for individual log entries
 * - Implements sorting and filtering capabilities
 * - Includes responsive design for all screen sizes
 * - Supports accessibility with proper ARIA attributes
 *
 * @author Senior Full-Stack Engineer
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import {
  FaTrash,
  FaSpinner,
  FaExclamationTriangle,
  FaUserShield,
  FaSort,
  FaFilter,
} from 'react-icons/fa';
import Sidebar from '../../components/admin/Sidebar';

const UserLogPage = () => {
  // State management with proper initialization
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: 'loginTime',
    direction: 'desc',
  });
  const [filters, setFilters] = useState({
    role: 'all',
    search: '',
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  /**
   * Load user logs from localStorage
   */
  useEffect(() => {
    const loadLogs = async () => {
      try {
        // Simulate network delay for realistic UX
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Get logs from localStorage or initialize with mock data
        const storedLogs = localStorage.getItem('userLogs');

        if (storedLogs) {
          const parsedLogs = JSON.parse(storedLogs);
          setLogs(parsedLogs);
          setFilteredLogs(parsedLogs);
        } else {
          // Initialize with mock data if no logs exist
          const mockLogs = [
            {
              id: '1',
              userId: 'admin-123',
              username: 'admin@example.com',
              role: 'admin',
              action: 'login',
              loginTime: new Date(Date.now() - 3600000).toISOString(),
              logoutTime: null,
              ipAddress: '192.168.1.1',
              tokenName: 'eyJhbGciOi...',
            },
            {
              id: '2',
              userId: 'user-456',
              username: 'user@example.com',
              role: 'user',
              action: 'login',
              loginTime: new Date(Date.now() - 7200000).toISOString(),
              logoutTime: new Date(Date.now() - 3600000).toISOString(),
              ipAddress: '192.168.1.2',
              tokenName: 'eyJhbGciOi...',
            },
            {
              id: '3',
              userId: 'user-789',
              username: 'test@example.com',
              role: 'user',
              action: 'login',
              loginTime: new Date(Date.now() - 86400000).toISOString(),
              logoutTime: new Date(Date.now() - 82800000).toISOString(),
              ipAddress: '192.168.1.3',
              tokenName: 'eyJhbGciOi...',
            },
          ];

          // Store mock logs in localStorage
          localStorage.setItem('userLogs', JSON.stringify(mockLogs));

          setLogs(mockLogs);
          setFilteredLogs(mockLogs);
        }

        setError(null);
      } catch (err) {
        console.error('Error loading user logs:', err);
        setError('Failed to load user logs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, []);

  /**
   * Apply sorting to logs
   *
   * @param {string} key - The property to sort by
   */
  const handleSort = (key) => {
    let direction = 'asc';

    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key, direction });

    const sortedLogs = [...filteredLogs].sort((a, b) => {
      if (a[key] === null) return 1;
      if (b[key] === null) return -1;

      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredLogs(sortedLogs);
  };

  /**
   * Apply filters to logs
   *
   * @param {Object} newFilters - Updated filter settings
   */
  const applyFilters = (newFilters) => {
    let result = [...logs];

    // Apply role filter
    if (newFilters.role !== 'all') {
      result = result.filter((log) => log.role === newFilters.role);
    }

    // Apply search filter
    if (newFilters.search.trim()) {
      const searchTerm = newFilters.search.toLowerCase().trim();
      result = result.filter(
        (log) =>
          log.username.toLowerCase().includes(searchTerm) ||
          log.userId.toLowerCase().includes(searchTerm) ||
          (log.ipAddress && log.ipAddress.includes(searchTerm))
      );
    }

    // Apply current sort
    result.sort((a, b) => {
      if (a[sortConfig.key] === null) return 1;
      if (b[sortConfig.key] === null) return -1;

      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredLogs(result);
  };

  /**
   * Handle filter changes
   *
   * @param {string} filterType - Type of filter to change
   * @param {string} value - New filter value
   */
  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value,
    };

    setFilters(newFilters);
    applyFilters(newFilters);
  };

  /**
   * Format date for display
   *
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date string
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    try {
      return new Date(dateString).toLocaleString();
    } catch (err) {
      console.error('Date formatting error:', err);
      return 'Invalid date';
    }
  };

  /**
   * Delete a log entry
   *
   * @param {string} logId - ID of the log to delete
   */
  const handleDelete = (logId) => {
    // If not confirming, show confirmation first
    if (deleteConfirm !== logId) {
      setDeleteConfirm(logId);
      return;
    }

    // User confirmed deletion
    const updatedLogs = logs.filter((log) => log.id !== logId);

    // Update state
    setLogs(updatedLogs);
    setFilteredLogs(filteredLogs.filter((log) => log.id !== logId));

    // Update localStorage
    localStorage.setItem('userLogs', JSON.stringify(updatedLogs));

    // Reset confirmation state
    setDeleteConfirm(null);
  };

  /**
   * Cancel delete confirmation
   */
  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  // Loading state
  if (loading) {
    return (
      <div
        className='p-6 flex justify-center items-center'
        aria-live='polite'
        role='status'>
        <FaSpinner
          className='animate-spin text-blue-500 text-2xl'
          aria-hidden='true'
        />
        <span className='ml-2'>Loading user logs...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className='p-6 text-red-500 flex items-center'
        aria-live='assertive'
        role='alert'>
        <FaExclamationTriangle className='mr-2' aria-hidden='true' />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen bg-gray-100'>
      <Sidebar />
      <div className='flex-1 p-6'>
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-2xl font-bold mb-6 text-gray-800 flex items-center'>
            <FaUserShield className='mr-2' /> User Activity Logs
          </h2>

          <div className='mb-6 grid md:grid-cols-2 gap-4'>
            <input
              type='text'
              placeholder='Search by username, user ID, or IP'
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className='border p-2 rounded w-full'
            />
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className='border p-2 rounded w-full'>
              <option value='all'>All Roles</option>
              <option value='admin'>Admin</option>
              <option value='user'>User</option>
            </select>
          </div>

          <div className='text-sm text-gray-500 mb-4'>
            Showing {filteredLogs.length} of {logs.length} logs
          </div>

          <div className='overflow-x-auto'>
            <table className='min-w-full table-auto border text-sm'>
              <thead className='bg-gray-50'>
                <tr>
                  <th
                    className='px-4 py-2 text-left cursor-pointer'
                    onClick={() => handleSort('username')}>
                    Username <FaSort className='inline ml-1' />
                  </th>
                  <th
                    className='px-4 py-2 text-left cursor-pointer'
                    onClick={() => handleSort('role')}>
                    Role <FaSort className='inline ml-1' />
                  </th>
                  <th
                    className='px-4 py-2 text-left cursor-pointer'
                    onClick={() => handleSort('loginTime')}>
                    Login Time <FaSort className='inline ml-1' />
                  </th>
                  <th
                    className='px-4 py-2 text-left cursor-pointer'
                    onClick={() => handleSort('logoutTime')}>
                    Logout Time <FaSort className='inline ml-1' />
                  </th>
                  <th className='px-4 py-2 text-left'>Token</th>
                  <th className='px-4 py-2 text-left'>IP</th>
                  <th className='px-4 py-2 text-right'>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td
                      colSpan='7'
                      className='px-4 py-3 text-center text-gray-500'>
                      No logs match your filters
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className='border-t'>
                      <td className='px-4 py-2'>
                        {log.username}
                        <br />
                        <span className='text-xs text-gray-500'>
                          {log.userId}
                        </span>
                      </td>
                      <td className='px-4 py-2'>{log.role}</td>
                      <td className='px-4 py-2'>{formatDate(log.loginTime)}</td>
                      <td className='px-4 py-2'>
                        {formatDate(log.logoutTime)}
                      </td>
                      <td className='px-4 py-2 truncate max-w-xs'>
                        {log.tokenName}
                      </td>
                      <td className='px-4 py-2'>{log.ipAddress}</td>
                      <td className='px-4 py-2 text-right'>
                        {deleteConfirm === log.id ? (
                          <>
                            <button
                              onClick={() => handleDelete(log.id)}
                              className='text-red-600 mr-2'>
                              Confirm
                            </button>
                            <button
                              onClick={cancelDelete}
                              className='text-gray-500'>
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleDelete(log.id)}
                            className='text-red-600'>
                            <FaTrash />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogPage;
