import React from 'react';

const CustomerDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Customer Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Welcome to your dashboard! Here you can track your shipments and manage your account.
      </p>
    </div>
  );
};

export default CustomerDashboard;
