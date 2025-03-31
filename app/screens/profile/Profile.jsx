"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  Building,
  Shield,
  Bell,
  Lock,
  ExternalLink,
  Camera,
  LogOut,
  Banknote,
  Badge,
} from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = () => {
    // Here you would typically call an API to update the user profile
    toast("Your profile information has been updated successfully.");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.first_name || "",
      lastName: user?.last_name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
    setIsEditing(false);
  };

  // Function to get user's initials for avatar fallback
  const getInitials = () => {
    if (!user?.first_name && !user?.last_name) return "U";
    return `${user?.first_name?.[0] || ""}${user?.last_name?.[0] || ""}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 w-full">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-20 w-20 border-4 border-white shadow-md">
              <AvatarImage src="/placeholder-user.jpg" alt="User avatar" />
              <AvatarFallback className="text-lg bg-primary text-white">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full shadow-md">
              <Camera size={16} />
            </button>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {user?.first_name} {user?.last_name}
            </h1>
            <div className="flex items-center text-gray-600 mt-1">
              <Shield className="h-4 w-4 mr-1" />
              <span>
                {user?.role?.name
                  ?.toLowerCase()
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (char) => char.toUpperCase())}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={logout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile Information</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Personal Info Card */}
            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details here
                  </CardDescription>
                </div>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>Edit</Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveChanges}>Save</Button>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-500 mr-2" />
                      {isEditing ? (
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <span>{user?.first_name}</span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-500 mr-2" />
                      {isEditing ? (
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <span>{user?.last_name}</span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-500 mr-2" />
                      {isEditing ? (
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <span>{user?.email}</span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-500 mr-2" />
                      {isEditing ? (
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <span>{user?.phone || "Not provided"}</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Organization Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
                <CardDescription>Your organizational details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {user?.entity && (
                  <div className="space-y-2">
                    <Label>Entity</Label>
                    <div className="flex items-center">
                      <Building className="h-4 w-4 text-gray-500 mr-2" />
                      <span>{user.entity.name}</span>
                    </div>
                  </div>
                )}
                {user?.bank && (
                  <div className="space-y-2">
                    <Label>Bank</Label>
                    <div className="flex items-center">
                      <Banknote className="h-4 w-4 text-gray-500 mr-2" />
                      <span>{user.bank.bank_name}</span>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Role</Label>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 text-gray-500 mr-2" />
                    <span>
                      {user?.role?.name
                        ?.toLowerCase()
                        .replace(/-/g, " ")
                        .replace(/\b\w/g, (char) => char.toUpperCase())}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <Button variant="outline" size="sm">
                      Change Password
                    </Button>
                  </div>
                  <div className="flex items-center">
                    <Lock className="h-4 w-4 text-gray-500 mr-2" />
                    <Input
                      id="password"
                      type="password"
                      value="••••••••••"
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Enable 2FA</div>
                      <div className="text-sm text-gray-500">
                        Add an extra layer of security to your account
                      </div>
                    </div>
                    <Switch />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Sessions</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Current Session</div>
                        <div className="text-sm text-gray-500">
                          Started: Today at {new Date().toLocaleTimeString()}
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border-0">
                        Active
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    Log Out All Other Devices
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Delete Account</div>
                    <div className="text-sm text-gray-500">
                      Permanently delete your account
                    </div>
                  </div>
                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Export Data</div>
                    <div className="text-sm text-gray-500">
                      Download your account data
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how and when you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Email Notifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Incident Updates</div>
                      <div className="text-sm text-gray-500">
                        Get notified when incidents are updated
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">New Assignments</div>
                      <div className="text-sm text-gray-500">
                        Get notified when you're assigned to a new incident
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">System Updates</div>
                      <div className="text-sm text-gray-500">
                        Receive updates about system changes
                      </div>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Monthly Reports</div>
                      <div className="text-sm text-gray-500">
                        Receive monthly summary reports
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">In-App Notifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Comments</div>
                      <div className="text-sm text-gray-500">
                        Get notified when someone comments on your incidents
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium">Mentions</div>
                      <div className="text-sm text-gray-500">
                        Get notified when someone mentions you
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full sm:w-auto">Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
