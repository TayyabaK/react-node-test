import UserSidebar from '../pages/UserPages/UserSidebar';

const NotAuthenticated = () => {
  return (
    <div className='flex min-h-screen bg-gray-100'>
      <UserSidebar />
      <div className='flex-1 flex justify-center items-center'>
        <div className='text-center bg-white/80 p-10 rounded-xl shadow-md backdrop-blur-sm border border-gray-300'>
          <h1 className='text-3xl font-bold text-red-600 mb-4'>
            Access Restricted
          </h1>
          <p className='text-lg text-gray-700'>
            You are not logged in. Please log in to access the dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotAuthenticated;
