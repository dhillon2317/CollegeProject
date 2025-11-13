import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { currentUser } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {currentUser ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Email: {currentUser.email}</h3>
                <p className="text-sm text-gray-500">User ID: {currentUser.uid}</p>
              </div>
              <Button variant="outline">Edit Profile</Button>
            </div>
          ) : (
            <p>Please sign in to view your profile</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
