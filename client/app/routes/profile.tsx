import { Edit3, Save, Mail, User, Phone, EyeOff, Eye, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Deleteuser from "~/components/delete-user";
import Updateuser from "~/components/update-user";
import coustomFetch from "~/utils/api";
import { getUserID, isAdmin } from "~/utils/auth";

export interface user {
  _id?: any;
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
  notification?: notifications[];
  createdAt?: string;
}

interface changepassword {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface notifications {
  id?: number;
  message?: string;
}

function profile() {
  const [profileData, setProfileData] = useState<user>({});
  const [profileDataErrors, setProfileDataErrors] = useState<user>({});
  const [users, setUsers] = useState<user[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState<changepassword>({});
  // const [passwordDataErrors, setPasswordDataErrors] = useState<changepassword>(
  //   {}
  // );
  const isAuthenticatedAdmin = isAdmin();
  const userID = getUserID();

  // Notifications popover state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<notifications[]>([]);

  const fetchProfiles = async () => {
    try {
      const response = await coustomFetch(
        `${process.env.VITE_API_URL}users/getall/${userID}`,
        {
          method: "GET",
        }
      );
      const result = await response.json();
      setUsers(result);
    } catch (error) {
      toast.error("Error fetching profile!", {
        duration: 4000,
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await coustomFetch(
          `${process.env.VITE_API_URL}users/${userID}`,
          {
            method: "GET",
          }
        );
        const result = await response.json();
        setProfileData(result);
        setNotifications(result.notification);
      } catch (error) {
        toast.error("Error fetching profile!");
      }
    };

    if (isAuthenticatedAdmin) {
      fetchProfiles();
    }
    fetchProfile();
  }, [isAuthenticatedAdmin]);

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateUserForm = () => {
    const newErrors: user = {};

    if (!profileData.firstname) {
      newErrors.firstname = "first name is required";
    }

    if (!profileData.lastname) {
      newErrors.lastname = "last name is required";
    }

    if (!profileData.email) {
      newErrors.email = "email name is required";
    }

    return newErrors;
  };

  const handlePasswordChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePasswordForm = () => {
    const newErrors: changepassword = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "current password is required";
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "new password is required";
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "passwords must match";
    }
    return newErrors;
  };

  const handleRead = async (id: number) => {
    await coustomFetch(`${process.env.VITE_API_URL}users/notify/${profileData._id}`, {
      method: 'DELETE',
      body: JSON.stringify({
        notification: profileData.notification?.filter(x => x.id != id),
      })
    })

    setNotifications(profileData.notification?.filter(x => x.id != id) ?? [])
  }

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const profileErrors = validateUserForm();
      if (Object.keys(profileDataErrors).length > 0) {
        setProfileDataErrors(profileErrors);
        setIsSaving(false);
        return;
      }

      if (Object.keys(passwordData).length === 3) {
        console.log(passwordData);
        const passwordResponse = await coustomFetch(
          `${process.env.VITE_API_URL}users/changepassword/`,
          {
            method: "PATCH",
            body: JSON.stringify({
              email: profileData.email,
              password: passwordData.currentPassword,
              newpassword: passwordData.confirmPassword,
            }),
          }
        );

        const result = await passwordResponse.json();

        if (passwordResponse.status >= 400) {
          toast.error(result.message, {
            duration: 4000,
            position: "top-right",
          });
          return
        } 

        toast.success(result.message, {
          duration: 4000,
          position: "top-right",
        });
      }

      try {
        const response = await coustomFetch(
          `${process.env.VITE_API_URL}users/`,
          {
            method: "PATCH",
            body: JSON.stringify(profileData),
          }
        );

        const result = await response.json();

        toast.success(result.message, {
          duration: 4000,
          position: "top-right",
        });
        setIsEditing(false);
      } catch (error) {
        toast.error(`Error updating profile!`, {
          duration: 4000,
          position: "top-right",
        });
        setIsSaving(false);
        return;
      }
    } catch (error) {
      toast.error(`Error changing password`, {
        duration: 4000,
        position: "top-right",
      });
      setIsSaving(false);
      return;
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const [search, setSearch] = useState("");
  const [reset, setReset] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (search) {
      setUsers(
        users.filter(
          (item) => item.email?.toLowerCase() == search.toLowerCase()
        )
      );
      setReset(true);
    }
  };

  const handleReset = () => {
    setReset(false);
    fetchProfiles();
    setSearch("");
  };

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Notifications Button and Popover */}
        <div className="fixed right-4 top-5">
          <div className="relative">
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="flex flex-row space-x-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition focus:outline-none"
              aria-label="Show notifications"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {notifications?.length > 0 && <>{notifications?.length} Unread</>}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-4 border-b font-semibold text-gray-700">
                  Notifications
                </div>
                <ul className="max-h-60 overflow-y-auto">
                  {notifications?.length === 0 ? (
                    <li className="p-4 text-gray-500">No notifications</li>
                  ) : (
                    notifications?.map((n) => (
                      <li
                        key={n.id}
                        className="p-4 border-b last:border-b-0 text-gray-800 text-sm flex flex-row justify-between"
                      >
                        {n.message}
                        <button
                          onClick={() => handleRead(n.id as number)}
                        >
                          <X className="inline-block w-5 h-5 text-red-500" />
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:gap-8">
          {/* Profile Image & Basic Info */}
          <div className="w-full">
            <div className="bg-white rounded-xl shadow-2xl p-6">
              <div className="text-center">
                <div className="flex space-x-3">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center px-4 py-2 mx-auto bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="mx-auto">
                      <div className="flex space-x-3">
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={isSaving}
                          className={`inline-flex items-center px-4 py-2 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                            isSaving
                              ? "bg-gray-400 text-white cursor-not-allowed"
                              : "bg-green-600 text-white hover:bg-green-700"
                          }`}
                        >
                          {isSaving ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {profileData.firstname} {profileData.lastname}
                  </h2>
                </div>

                <div className="mt-6 space-y-3 text-sm text-gray-600">
                  <div className="flex items-center justify-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {profileData.email}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="w-full space-y-6">
            <div className="bg-white rounded-xl shadow-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <div className="sm:relative max-sm:flex max-sm:flex-row max-sm:items-center max-sm:space-x-2">
                    <User className="sm:absolute sm:left-3 sm:top-1/2 sm:transform sm:-translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="firstName"
                      value={profileData.firstname}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full sm:pl-10 pl-5 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                        !isEditing
                          ? "bg-gray-50 text-gray-600"
                          : "bg-white text-gray-900 border-gray-300"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <div className="sm:relative max-sm:flex max-sm:flex-row max-sm:items-center max-sm:space-x-2">
                    <User className="sm:absolute sm:left-3 sm:top-1/2 sm:transform sm:-translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="lastName"
                      value={profileData.lastname}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full sm:pl-10 pl-5 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                        !isEditing
                          ? "bg-gray-50 text-gray-600"
                          : "bg-white text-gray-900 border-gray-300"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="sm:relative max-sm:flex max-sm:flex-row max-sm:items-center max-sm:space-x-2">
                    <Mail className="sm:absolute sm:left-3 sm:top-1/2 sm:transform sm:-translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full sm:pl-10 pl-5 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                        !isEditing
                          ? "bg-gray-50 text-gray-600"
                          : "bg-white text-gray-900 border-gray-300"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <div className="sm:relative max-sm:flex max-sm:flex-row max-sm:items-center max-sm:space-x-2">
                    <Phone className="sm:absolute sm:left-3 sm:top-1/2 sm:transform sm:-translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full sm:pl-10 pl-5 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                        !isEditing
                          ? "bg-gray-50 text-gray-600"
                          : "bg-white text-gray-900 border-gray-300"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Password Change (only when editing) */}
            {isEditing && (
              <div className="bg-white rounded-xl shadow-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Change Password
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="sm:relative max-sm:flex max-sm:flex-row max-sm:items-center max-sm:space-x-2">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="sm:absolute sm:right-3 sm:top-1/2 sm:transform sm:-translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                        placeholder="Enter new password"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isAuthenticatedAdmin && (
              <div className="bg-white rounded-xl shadow-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  User Previlages
                </h3>

                <div className="space-y-4">
                  {/* Search Bar */}
                  <form
                    onSubmit={handleSearch}
                    className="space-x-2 w-full mt-4 mb-2"
                  >
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search Email..."
                      className="flex-1 px-3 py-2 border text-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-black"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Search
                    </button>
                    <button
                      type="button"
                      className={`px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition ${!reset && "hidden"}`}
                      onClick={handleReset}
                    >
                      reset
                    </button>
                  </form>

                  {/*Users table filtered*/}
                  {users.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead>
                          <tr>
                            <th className="px-4 py-2 border-b">Email</th>
                            <th className="px-4 py-2 border-b">Phone</th>
                            <th className="px-4 py-2 border-b">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((u, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-4 py-2 border-b">{u.email}</td>
                              <td className="px-4 py-2 border-b">{u.phone}</td>
                              <td className="px-4 py-2 border-b space-x-2">
                                <Updateuser {...u} />
                                <Deleteuser id={u._id} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default profile;
