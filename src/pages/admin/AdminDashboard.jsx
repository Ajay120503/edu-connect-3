import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Ban,
  BarChart3,
  CheckCircle,
  Clock,
  RefreshCw,
  Search,
  Settings,
  Shield,
  UserCheck,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import useAuthStore from "../../store/authStore";
import API from "../../utils/axios";
import { getUserRoleLabel, isAdminUser } from "../../utils/badgeUtils";
import QueueItem from "../../components/admin/QueueItem";
import UserRow from "../../components/admin/UserRow";

const tabs = [
  { value: "overview", label: "Overview", icon: BarChart3 },
  { value: "users", label: "Users", icon: Users },
  { value: "moderation", label: "Moderation", icon: CheckCircle },
];

const statTones = {
  primary: {
    icon: "bg-primary/10 text-primary",
    value: "text-primary",
  },
  warning: {
    icon: "bg-warning/10 text-warning",
    value: "text-warning",
  },
  success: {
    icon: "bg-success/10 text-success",
    value: "text-success",
  },
  info: {
    icon: "bg-info/10 text-info",
    value: "text-info",
  },
};

const StatTile = ({ icon: Icon, label, value, tone = "primary" }) => (
  <div className="rounded-lg bg-base-100 border border-base-300/70 shadow-sm p-4">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold text-base-content/45 uppercase">
          {label}
        </p>
        <p className={`mt-2 text-3xl font-bold ${statTones[tone].value}`}>
          {value}
        </p>
      </div>
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${statTones[tone].icon}`}
      >
        <Icon className="w-5 h-5" />
      </div>
    </div>
  </div>
);

const TabButton = ({ tab, activeTab, onSelect }) => {
  const Icon = tab.icon;
  return (
    <button
      type="button"
      onClick={() => onSelect(tab.value)}
      className={`inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition-colors ${
        activeTab === tab.value
          ? "bg-primary text-primary-content shadow-sm"
          : "text-base-content/60 hover:bg-base-200 hover:text-base-content"
      }`}
    >
      <Icon className="w-4 h-4" />
      {tab.label}
    </button>
  );
};

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [queueItems, setQueueItems] = useState([]);
  const [queueType, setQueueType] = useState("post");
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingQueue, setLoadingQueue] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const { data } = await API.get("/admin/users");
      setUsers(data.users || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  const fetchQueue = useCallback(async (type = queueType) => {
    setLoadingQueue(true);
    try {
      const { data } = await API.get(`/admin/queue?type=${type}`);
      setQueueItems(data.items || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch queue");
    } finally {
      setLoadingQueue(false);
    }
  }, [queueType]);

  useEffect(() => {
    fetchUsers();
    fetchQueue("post");
  }, [fetchUsers, fetchQueue]);

  useEffect(() => {
    fetchQueue(queueType);
  }, [queueType, fetchQueue]);

  const stats = useMemo(
    () => ({
      totalUsers: users.length,
      blockedUsers: users.filter((item) => item.isBlocked).length,
      verifiedUsers: users.filter((item) => item.isVerified).length,
      pendingQueue: queueItems.length,
    }),
    [users, queueItems],
  );

  const filteredUsers = users.filter((item) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;
    return (
      item.name?.toLowerCase().includes(query) ||
      item.email?.toLowerCase().includes(query) ||
      getUserRoleLabel(item).toLowerCase().includes(query)
    );
  });

  const recentUsers = users.slice(0, 5);

  if (!isAuthenticated || !isAdminUser(user)) {
    navigate("/feed");
    return null;
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="rounded-xl bg-base-100 border border-base-300/70 shadow-sm p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-heading">
                Admin Dashboard
              </h1>
              <p className="text-sm text-base-content/50">
                Users, moderation queue, and platform controls
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
            <button
              type="button"
              onClick={() => {
                fetchUsers();
                fetchQueue(queueType);
              }}
              className="btn btn-ghost btn-sm gap-2"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="sm:hidden">Refresh</span>
            </button>
            <Link
              to="/admin/settings"
              className="btn btn-outline btn-primary btn-sm gap-2"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-1 rounded-lg bg-base-200/70 p-1 sm:flex sm:overflow-x-auto">
          {tabs.map((tab) => (
            <TabButton
              key={tab.value}
              tab={tab}
              activeTab={activeTab}
              onSelect={setActiveTab}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatTile icon={Users} label="Total Users" value={stats.totalUsers} />
        <StatTile
          icon={Ban}
          label="Blocked Users"
          value={stats.blockedUsers}
          tone="warning"
        />
        <StatTile
          icon={UserCheck}
          label="Verified Users"
          value={stats.verifiedUsers}
          tone="success"
        />
        <StatTile
          icon={Clock}
          label={`Pending ${queueType}`}
          value={stats.pendingQueue}
          tone="info"
        />
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_420px] gap-6">
          <section className="bg-base-100 border border-base-300/70 rounded-lg shadow-sm max-h-150 overflow-scroll">
            <div className="px-4 py-3 border-b border-base-300/60 flex items-center justify-between bg-base-200/40">
              <h2 className="font-semibold">Recent Users</h2>
              <Link to="/admin/users" className="btn btn-ghost btn-xs">
                View All
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingUsers ? (
                    <tr>
                      <td colSpan="4" className="text-center py-10">
                        <span className="loading loading-spinner loading-md text-primary"></span>
                      </td>
                    </tr>
                  ) : (
                    recentUsers.map((item) => (
                      <tr key={item._id}>
                        <td>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-base-content/50">
                            {item.email}
                          </div>
                        </td>
                        <td className="text-sm">{getUserRoleLabel(item)}</td>
                        <td>
                          <span
                            className={`badge badge-sm ${
                              item.isBlocked ? "badge-error" : "badge-success"
                            }`}
                          >
                            {item.isBlocked ? "Blocked" : "Active"}
                          </span>
                        </td>
                        <td className="text-sm text-base-content/50">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-base-100 border border-base-300/70 rounded-lg shadow-sm max-h-150 overflow-scroll">
            <div className="px-4 py-3 border-b border-base-300/60 flex items-center justify-between bg-base-200/40">
              <h2 className="font-semibold">Moderation Queue</h2>
              <Link to="/admin/queue" className="btn btn-ghost btn-xs">
                Open Queue
              </Link>
            </div>
            <div className="p-4 space-y-3">
              {loadingQueue ? (
                <div className="h-24 skeleton rounded-lg"></div>
              ) : queueItems.length === 0 ? (
                <div className="text-center py-10 text-sm text-base-content/40">
                  No pending {queueType} items.
                </div>
              ) : (
                queueItems
                  .slice(0, 2)
                  .map((item) => (
                    <QueueItem
                      key={item._id}
                      item={item}
                      type={queueType}
                      onUpdate={() => fetchQueue(queueType)}
                    />
                  ))
              )}
            </div>
          </section>
        </div>
      )}

      {activeTab === "users" && (
        <section className="bg-base-100 border border-base-300/70 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-base-300/60 bg-base-200/40 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative md:max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
              <input
                type="text"
                placeholder="Search users..."
                className="input input-bordered input-sm w-full pl-9"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <Link to="/admin/users" className="btn btn-outline btn-sm">
              Full User Management
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Badges</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loadingUsers ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10">
                      <span className="loading loading-spinner loading-md text-primary"></span>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-10 text-base-content/40"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((item) => (
                    <UserRow key={item._id} user={item} onUpdate={fetchUsers} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === "moderation" && (
        <section className="space-y-4">
          <div className="rounded-lg bg-base-100 border border-base-300/70 shadow-sm p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="join">
              {["post", "job", "story"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setQueueType(type)}
                  className={`btn btn-sm join-item capitalize ${
                    queueType === type ? "btn-primary" : "btn-ghost"
                  }`}
                >
                  {type}s
                </button>
              ))}
            </div>
            <Link to="/admin/queue" className="btn btn-outline btn-sm">
              Dedicated Queue
            </Link>
          </div>

          {loadingQueue ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-36 skeleton rounded-lg"></div>
              ))}
            </div>
          ) : queueItems.length === 0 ? (
            <div className="bg-base-100 border border-base-300/70 rounded-lg text-center py-16 text-base-content/40 shadow-sm">
              <Clock className="w-10 h-10 mx-auto mb-3 opacity-40" />
              No pending {queueType} items in the moderation queue.
            </div>
          ) : (
            <div className="space-y-3">
              {queueItems.map((item) => (
                <QueueItem
                  key={item._id}
                  item={item}
                  type={queueType}
                  onUpdate={() => fetchQueue(queueType)}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default AdminDashboard;
