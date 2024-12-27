import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtering, setFiltering] = useState('');
  const [sorting, setSorting] = useState([]);
  const [sortOption, setSortOption] = useState('');

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {

    axios
      .get('http://localhost:4000/auth/admin')
      .then((response) => {
        if (Array.isArray(response.data.users)) {
          const updatedUsers = response.data.users.map((user) => ({
            ...user,
            age: calculateAge(user.dob), 
            status:
              user.username &&
              user.email &&
              user.dob &&
              user.gender &&
              user.phone &&
              user.city
                ? 'Submitted'
                : 'Pending',
            isVerified: false, 
          }));
          setUsers(updatedUsers);
        } else {
          throw new Error('Invalid data format received from the server');
        }
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleVerify = (userId) => {
    const user = users.find((u) => u.id === userId);
    if (user && user.status === 'Pending') {
      toast.error(`${user.username}'s details are still pending!`);
      return;
    }

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? { ...user, status: 'Verified', isVerified: true }
          : user
      )
    );

    if (user) {
      toast.success(`${user.username} is Verified!`);
      axios
        .post('http://localhost:4000/auth/admin/verify', { userId })
        .then((response) => {
          console.log(response.data.message);
         
           setUsers([...users]); 
        })
        .catch((err) => {
          console.error('Error verifying user:', err);
          
        });
    }
  };
  
  

  const handleReject = (userId) => {
    
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, status: 'Rejected', isVerified: false } : user
      )
    );
  
    
    const user = users.find((u) => u.id === userId);
  
    if (user) {
     
      toast.error(`${user.username}'s data is deleted in the database!`);
  
     
      axios
        .post('http://localhost:4000/auth/admin/reject', { userId }) 
        .then((response) => {
          console.log(response.data.message);
          
        })
        .catch((err) => {
          console.error('Error rejecting user:', err);
          
        });
    }
  };
  
  const handleSort = (option) => {
    setSortOption(option);
    let sortedUsers;

    switch (option) {
      case 'age':
        sortedUsers = [...users].sort((a, b) => a.age - b.age);
        break;
      case 'gender':
        sortedUsers = [...users].sort((a, b) => a.gender.localeCompare(b.gender));
        break;
      case 'a-z':
        sortedUsers = [...users].sort((a, b) => a.username.localeCompare(b.username));
        break;
      case 'newest':
        sortedUsers = [...users].sort((a, b) => b.id - a.id);
        break;
      default:
        sortedUsers = users;
    }

    setUsers(sortedUsers);
  };

  const columns = React.useMemo(
    () => [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'username', header: 'Name' },
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'dob', header: 'DOB' },
      { accessorKey: 'age', header: 'Age' }, // Add Age column
      { accessorKey: 'gender', header: 'Gender' },
      { accessorKey: 'phone', header: 'Phone' },
      { accessorKey: 'city', header: 'City' },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 rounded-full text-white ${
              row.original.status === 'Pending'
                ? 'bg-orange-300'
                : row.original.status === 'Submitted'
                ? 'bg-green-500'
                : row.original.status === 'verified'? 'bg-blue-500' : row.original.status === 'Rejected' ? 'bg-red-500' : 'bg-blue-500'
            }`}
          >
            {row.original.status}
          </span>
        ),
      },
      {
        id: 'verify',
        header: 'Verification',
        cell: ({ row }) => (
          <button
            onClick={() => handleVerify(row.original.id)}
            disabled={row.original.isVerified}
            className={`px-4 py-2 rounded-lg ${
              row.original.isVerified
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {row.original.isVerified ? 'Verified' : 'Verify'}
          </button>
        ),
      },
      {
        id: 'reject',
        header: 'Rejection',
        cell: ({ row }) => (
          <button
            onClick={() => handleReject(row.original.id)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Reject
          </button>
        ),
      },
    ],
    [users]
  );

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter: filtering,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 my-7 bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

     
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={filtering}
          onChange={(e) => setFiltering(e.target.value)}
          className="w-1/2 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={sortOption}
          onChange={(e) => handleSort(e.target.value)}
          className="w-1/3 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sort by...</option>
          <option value="age">Age</option>
          <option value="gender">Gender</option>
          <option value="a-z">A-Z</option>
          <option value="newest">Newest to Oldest</option>
        </select>
      </div>

      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 bg-white shadow-md rounded-lg">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-200">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-4 py-2 text-left cursor-pointer hover:bg-gray-300"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {header.column.getIsSorted() === 'asc' ? ' 🔼' : ''}
                    {header.column.getIsSorted() === 'desc' ? ' 🔽' : ''}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-100 border-b border-gray-200"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      <div className="flex items-center justify-between mt-4">
        <div>
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
          >
            First
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
          >
            Previous
          </button>
        </div>
        <div>
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </div>
        <div>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
          >
            Next
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
          >
            Last
          </button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Admin;
