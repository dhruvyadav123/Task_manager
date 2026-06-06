import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  ClipboardList,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Target,
  TimerReset,
  TrendingUp,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";

import { getApiError, http } from "../api/http";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import { useAuth } from "../context/AuthContext";

const TASK_LIMIT = 8;

const STATUS_OPTIONS = [
  { value: "all", label: "All tasks" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
];

export default function DashboardPage() {
  const { user, logout } = useAuth();

  const [tasks, setTasks] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: TASK_LIMIT,
  });

  const [query, setQuery] = useState({
    search: "",
    status: "all",
    page: 1,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [modal, setModal] = useState({
    open: false,
    task: null,
  });

  const [submitting, setSubmitting] = useState(false);

  const loadTasks = useCallback(
    async ({ showRefreshLoader = false } = {}) => {
      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const params = {
          page: query.page,
          limit: TASK_LIMIT,
        };

        const searchValue = query.search.trim();

        if (searchValue) {
          params.search = searchValue;
        }

        if (query.status !== "all") {
          params.status = query.status;
        }

        const { data } = await http.get("/tasks", {
          params,
        });

        setTasks(
          Array.isArray(data?.tasks)
            ? data.tasks
            : [],
        );

        setStats({
          total: Number(data?.stats?.total) || 0,
          pending: Number(data?.stats?.pending) || 0,
          completed:
            Number(data?.stats?.completed) || 0,
        });

        setPagination({
          page:
            Number(data?.pagination?.page) || 1,
          pages:
            Number(data?.pagination?.pages) || 1,
          total:
            Number(data?.pagination?.total) ||
            Number(data?.stats?.total) ||
            0,
          limit:
            Number(data?.pagination?.limit) ||
            TASK_LIMIT,
        });
      } catch (error) {
        toast.error(
          getApiError(
            error,
            "Unable to load tasks",
          ),
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [query],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadTasks();
    }, 350);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadTasks]);

  const saveTask = async (values) => {
    setSubmitting(true);

    try {
      if (modal.task?._id) {
        await http.patch(
          `/tasks/${modal.task._id}`,
          values,
        );

        toast.success(
          "Task updated successfully",
        );
      } else {
        await http.post("/tasks", values);

        toast.success(
          "Task created successfully",
        );
      }

      setModal({
        open: false,
        task: null,
      });

      await loadTasks();
    } catch (error) {
      toast.error(
        getApiError(
          error,
          "Unable to save task",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTask = async (task) => {
    try {
      await http.patch(
        `/tasks/${task._id}/toggle`,
      );

      toast.success(
        task.status === "completed"
          ? "Task moved to pending"
          : "Task marked as completed",
      );

      await loadTasks();
    } catch (error) {
      toast.error(
        getApiError(
          error,
          "Unable to update task",
        ),
      );
    }
  };

  const deleteTask = async (task) => {
    const shouldDelete = window.confirm(
      `Delete "${task.title}"?`,
    );

    if (!shouldDelete) {
      return;
    }

    try {
      await http.delete(
        `/tasks/${task._id}`,
      );

      toast.success("Task deleted");

      if (
        tasks.length === 1 &&
        query.page > 1
      ) {
        setQuery((currentQuery) => ({
          ...currentQuery,
          page: currentQuery.page - 1,
        }));

        return;
      }

      await loadTasks();
    } catch (error) {
      toast.error(
        getApiError(
          error,
          "Unable to delete task",
        ),
      );
    }
  };

  const handleRefresh = async () => {
    await loadTasks({
      showRefreshLoader: true,
    });

    toast.success("Tasks refreshed");
  };

  const clearFilters = () => {
    setQuery({
      search: "",
      status: "all",
      page: 1,
    });
  };

  const openCreateModal = () => {
    setModal({
      open: true,
      task: null,
    });
  };

  const openEditModal = (task) => {
    setModal({
      open: true,
      task,
    });
  };

  const closeModal = () => {
    if (!submitting) {
      setModal({
        open: false,
        task: null,
      });
    }
  };

  const handleSearchChange = (event) => {
    setQuery((currentQuery) => ({
      ...currentQuery,
      search: event.target.value,
      page: 1,
    }));
  };

  const handleStatusChange = (event) => {
    setQuery((currentQuery) => ({
      ...currentQuery,
      status: event.target.value,
      page: 1,
    }));
  };

  const goToPreviousPage = () => {
    setQuery((currentQuery) => ({
      ...currentQuery,
      page: Math.max(
        1,
        currentQuery.page - 1,
      ),
    }));
  };

  const goToNextPage = () => {
    setQuery((currentQuery) => ({
      ...currentQuery,
      page: Math.min(
        pagination.pages,
        currentQuery.page + 1,
      ),
    }));
  };

  const userFirstName =
    user?.name?.trim()?.split(/\s+/)?.[0] ||
    "there";

  const userInitials = useMemo(() => {
    if (!user?.name) {
      return "U";
    }

    return user.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) =>
        word.charAt(0).toUpperCase(),
      )
      .join("");
  }, [user?.name]);

  const completionPercentage = useMemo(() => {
    if (!stats.total) {
      return 0;
    }

    return Math.round(
      (stats.completed / stats.total) * 100,
    );
  }, [stats.completed, stats.total]);

  const hasFilters =
    query.search.trim().length > 0 ||
    query.status !== "all";

  const statCards = [
    {
      label: "Total Tasks",
      value: stats.total,
      sub: "In your workspace",
      icon: ClipboardList,
      iconClass:
        "border-[#d7e2ca] bg-blue-100 text-[#2f6b3e]",
      cardClass:
        "border-[#d7e2ca] bg-gradient-to-br from-white to-blue-50/80",
      badgeClass:
        "border-[#d7e2ca] bg-[#edf4dc] text-[#2f6b3e]",
    },
    {
      label: "Pending",
      value: stats.pending,
      sub: "Awaiting action",
      icon: TimerReset,
      iconClass:
        "border-amber-100 bg-amber-100 text-amber-700",
      cardClass:
        "border-amber-100 bg-gradient-to-br from-white to-amber-50/70",
      badgeClass:
        "border-amber-100 bg-amber-50 text-amber-700",
    },
    {
      label: "Completed",
      value: stats.completed,
      sub: "Successfully done",
      icon: CheckCircle2,
      iconClass:
        "border-emerald-100 bg-emerald-100 text-emerald-700",
      cardClass:
        "border-emerald-100 bg-gradient-to-br from-white to-emerald-50/70",
      badgeClass:
        "border-emerald-100 bg-emerald-50 text-emerald-700",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#edf4dc] text-slate-900">
      {/* Soft page background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#edf4dc_0%,#e6efcf_48%,#edf4dc_100%)]" />
        <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-[#dce9bd]/70 blur-3xl" />
        <div className="absolute -right-40 top-1/4 h-[26rem] w-[26rem] rounded-full bg-[#d7e9a8]/55 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[22rem] w-[22rem] rounded-full bg-[#eef4d8]/80 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#d7e2ca] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[72px] max-w-[1320px] items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1f5f36] via-[#276c3d] to-[#347e49] text-white shadow-lg shadow-[#2f6b3e]/20">
              <CheckSquare size={19} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-base font-black tracking-tight text-slate-950">
                TaskFlow
              </p>

              <p className="hidden text-xs font-medium text-slate-500 sm:block">
                Smart task management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="hidden h-10 items-center gap-2 rounded-xl border border-[#d7e2ca] bg-[#f2f7e7] px-4 text-sm font-bold text-[#246b3b] transition hover:border-[#b7cba8] hover:bg-[#e7f0dc] disabled:cursor-not-allowed disabled:opacity-50 sm:flex"
            >
              <RefreshCw
                size={15}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              {refreshing
                ? "Refreshing..."
                : "Refresh"}
            </button>

            <div className="flex items-center gap-2 rounded-2xl border border-[#d7e2ca] bg-white p-1.5 shadow-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1f5f36] to-[#347e49] text-xs font-black text-white shadow-md shadow-[#2f6b3e]/20">
                {userInitials}
              </div>

              <div className="hidden min-w-0 px-1 md:block">
                <p className="max-w-36 truncate text-sm font-bold leading-none text-slate-900">
                  {user?.name || "User"}
                </p>

                <p className="mt-1 max-w-40 truncate text-[11px] text-slate-500">
                  {user?.email || ""}
                </p>
              </div>

              <button
                type="button"
                onClick={logout}
                aria-label="Logout"
                title="Logout"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-[1320px] px-4 pb-12 pt-5 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-[1.65rem] border border-[#c9da8e] bg-gradient-to-br from-[#e9f69f] via-[#e4f19a] to-[#eef7bd] px-5 py-5 text-[#173c23] shadow-[0_22px_55px_-38px_rgba(47,107,62,0.38)] sm:px-7 sm:py-6 lg:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.78),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.46),_transparent_42%)]" />

          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-[#95b45a]/20" />

          <div className="absolute -right-4 -top-4 h-36 w-36 rounded-full border border-[#95b45a]/20" />

          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#c0d58f] bg-white/65 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#315b30] backdrop-blur">
                <Sparkles size={12} />
                Productivity Dashboard
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl lg:text-[2.65rem]">
                Welcome back,{" "}
                <span className="text-[#416b32]">
                  {userFirstName}
                </span>
              </h1>

              <p className="mt-3 max-w-lg text-sm font-medium leading-6 text-[#55704b] sm:text-[15px]">
                Track your work, manage your priorities and
                complete every important task from one clean
                workspace.
              </p>

              <div className="mt-5 flex flex-col gap-2.5 min-[420px]:flex-row min-[420px]:items-center">
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#246b3b] px-5 text-sm font-black text-white shadow-lg shadow-[#246b3b]/20 transition hover:-translate-y-0.5 hover:bg-[#1f5d34] focus:outline-none focus:ring-4 focus:ring-[#cfe3c4]"
                >
                  <Plus size={17} />
                  New Task
                </button>

                <div className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#bfd18f] bg-white/55 px-4 text-sm font-bold text-[#315b30] backdrop-blur">
                  <Target size={16} />

                  {stats.pending > 0
                    ? `${stats.pending} pending`
                    : "All done!"}
                </div>
              </div>
            </div>

            {/* Progress card */}
            <div className="w-full lg:max-w-[290px]">
              <div className="rounded-[1.35rem] border border-[#bfd18f] bg-white/62 p-4 shadow-lg backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-[#5d784f]">
                      Overall progress
                    </p>

                    <p className="mt-1 text-3xl font-black text-[#173c23]">
                      {completionPercentage}
                      <span className="ml-0.5 text-lg text-[#5d784f]">
                        %
                      </span>
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#c5d79f] bg-[#246b3b] text-white shadow-sm">
                    <TrendingUp size={19} />
                  </div>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#cbdc9e]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#2f6b3e] to-[#7ba34f] transition-all duration-700"
                    style={{
                      width: `${completionPercentage}%`,
                    }}
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  <div className="rounded-xl border border-[#cbdba5] bg-white/55 px-3 py-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#5d784f]">
                      Pending
                    </p>

                    <p className="mt-1 text-lg font-black text-[#173c23]">
                      {stats.pending}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#cbdba5] bg-white/55 px-3 py-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#5d784f]">
                      Completed
                    </p>

                    <p className="mt-1 text-lg font-black text-[#173c23]">
                      {stats.completed}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-4 grid gap-3 sm:grid-cols-3">
          {statCards.map(
            ({
              label,
              value,
              sub,
              icon: Icon,
              iconClass,
              cardClass,
              badgeClass,
            }) => (
              <article
                key={label}
                className={`group rounded-[1.25rem] border p-4 shadow-[0_16px_40px_-32px_rgba(47,107,62,0.28)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_48px_-34px_rgba(47,107,62,0.34)] ${cardClass}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border ${iconClass}`}
                  >
                    <Icon size={20} />
                  </div>

                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${badgeClass}`}
                  >
                    Live
                  </span>
                </div>

                <p className="mt-3 text-2xl font-black tracking-tight text-slate-950">
                  {value}
                </p>

                <p className="mt-1 text-[13px] font-black text-slate-800">
                  {label}
                </p>

                <p className="mt-1 text-xs font-medium text-slate-500">
                  {sub}
                </p>
              </article>
            ),
          )}
        </section>

        {/* Task section */}
        <section className="mt-5 overflow-hidden rounded-[1.5rem] border border-[#d7e2ca] bg-white shadow-[0_22px_58px_-44px_rgba(47,107,62,0.34)]">
          <div className="border-b border-[#d7e2ca] bg-white px-4 py-4 sm:px-5 lg:px-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#d7e2ca] bg-[#edf4dc] text-[#2f6b3e]">
                  <LayoutDashboard size={18} />
                </div>

                <div>
                  <h2 className="text-lg font-black text-slate-950 sm:text-xl">
                    Your Tasks
                  </h2>

                  <p className="text-xs font-medium text-slate-500 sm:text-sm">
                    Search, filter and manage your work
                  </p>
                </div>
              </div>

              <div className="grid w-full gap-3 sm:grid-cols-2 xl:flex xl:w-auto">
                <div className="group relative sm:col-span-2 xl:w-72">
                  <Search
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-[#2f6b3e]"
                  />

                  <input
                    type="search"
                    value={query.search}
                    onChange={handleSearchChange}
                    placeholder="Search tasks..."
                    className="h-11 w-full rounded-xl border border-[#d7e2ca] bg-[#f3f7e9] pl-10 pr-9 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-[#bdcea9] focus:border-[#78a25a] focus:bg-white focus:ring-4 focus:ring-[#dfeacb]"
                  />

                  {query.search && (
                    <button
                      type="button"
                      onClick={() =>
                        setQuery((currentQuery) => ({
                          ...currentQuery,
                          search: "",
                          page: 1,
                        }))
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#2f6b3e]"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="relative">
                  <SlidersHorizontal
                    size={15}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    value={query.status}
                    onChange={handleStatusChange}
                    className="h-11 w-full appearance-none rounded-xl border border-[#d7e2ca] bg-[#f3f7e9] pl-10 pr-8 text-sm font-bold text-slate-700 outline-none transition hover:border-[#bdcea9] focus:border-[#78a25a] focus:bg-white focus:ring-4 focus:ring-[#dfeacb] xl:w-40"
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>

                <button
                  type="button"
                  onClick={openCreateModal}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#246b3b] px-5 text-sm font-black text-white shadow-lg shadow-[#246b3b]/20 transition hover:-translate-y-0.5 hover:bg-[#1f5d34] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#cfe3c4]"
                >
                  <Plus size={16} />
                  Add Task
                </button>
              </div>
            </div>

            {hasFilters && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Active filters:
                </span>

                {query.search.trim() && (
                  <span className="rounded-full border border-[#d7e2ca] bg-[#edf4dc] px-3 py-1.5 text-xs font-bold text-[#2f6b3e]">
                    “{query.search.trim()}”
                  </span>
                )}

                {query.status !== "all" && (
                  <span className="rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1.5 text-xs font-bold capitalize text-cyan-700">
                    {query.status}
                  </span>
                )}

                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-bold text-slate-500 transition hover:text-rose-600"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          <div className="min-h-[360px] bg-gradient-to-b from-[#f3f7e9] to-white p-4 sm:p-5 lg:p-6">
            {loading ? (
              <TaskGridSkeleton />
            ) : tasks.length > 0 ? (
              <>
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onToggle={toggleTask}
                      onEdit={openEditModal}
                      onDelete={deleteTask}
                    />
                  ))}
                </div>

                <div className="mt-5 flex flex-col items-center justify-between gap-4 border-t border-[#d7e2ca] pt-5 sm:flex-row">
                  <p className="text-sm font-medium text-slate-500">
                    Page{" "}
                    <span className="font-black text-[#173c23]">
                      {pagination.page}
                    </span>{" "}
                    of{" "}
                    <span className="font-black text-[#173c23]">
                      {pagination.pages}
                    </span>
                  </p>

                  {pagination.pages > 1 && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={goToPreviousPage}
                        disabled={
                          pagination.page <= 1
                        }
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#d7e2ca] bg-white px-4 text-sm font-bold text-[#214f2f] shadow-sm transition hover:bg-[#edf4dc] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ArrowLeft size={15} />
                        Prev
                      </button>

                      <div className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-[#246b3b] px-3 text-sm font-black text-white shadow-md shadow-[#246b3b]/20">
                        {pagination.page}
                      </div>

                      <button
                        type="button"
                        onClick={goToNextPage}
                        disabled={
                          pagination.page >=
                          pagination.pages
                        }
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#d7e2ca] bg-white px-4 text-sm font-bold text-[#214f2f] shadow-sm transition hover:bg-[#edf4dc] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Next
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <EmptyState
                hasFilters={hasFilters}
                onClearFilters={clearFilters}
                onCreateTask={openCreateModal}
              />
            )}
          </div>
        </section>
      </main>

      <TaskModal
        open={modal.open}
        task={modal.task}
        submitting={submitting}
        onClose={closeModal}
        onSubmit={saveTask}
      />
    </div>
  );
}

function TaskGridSkeleton() {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map(
        (_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-[1.25rem] border border-[#d7e2ca] bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="h-10 w-10 rounded-xl bg-blue-100" />

              <div className="h-5 w-16 rounded-full bg-[#edf4dc]" />
            </div>

            <div className="mt-4 h-4 w-3/4 rounded bg-blue-100" />

            <div className="mt-3 h-3 w-full rounded bg-slate-100" />

            <div className="mt-2 h-3 w-5/6 rounded bg-slate-100" />

            <div className="mt-5 flex items-center justify-between border-t border-blue-50 pt-4">
              <div className="h-8 w-24 rounded-xl bg-[#edf4dc]" />

              <div className="h-8 w-20 rounded-xl bg-[#edf4dc]" />
            </div>
          </div>
        ),
      )}
    </div>
  );
}

function EmptyState({
  hasFilters,
  onClearFilters,
  onCreateTask,
}) {
  return (
    <div className="flex min-h-[320px] items-center justify-center rounded-[1.25rem] border border-dashed border-[#cbd9b8] bg-white px-5 py-8">
      <div className="max-w-sm text-center">
        <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#d7e2ca] bg-[#edf4dc] text-[#2f6b3e]">
          {hasFilters ? (
            <Search size={26} />
          ) : (
            <ListTodo size={27} />
          )}

          <span className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white">
            {hasFilters ? (
              <X size={10} />
            ) : (
              <Plus size={10} />
            )}
          </span>
        </div>

        <h3 className="mt-5 text-lg font-black text-slate-950">
          {hasFilters
            ? "No results found"
            : "Your workspace is empty"}
        </h3>

        <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
          {hasFilters
            ? "Try another search term or clear the selected filters."
            : "Create your first task and start managing your work."}
        </p>

        <div className="mt-6 flex flex-col justify-center gap-3 min-[400px]:flex-row">
          {hasFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-[#d7e2ca] bg-white px-4 text-sm font-bold text-[#214f2f] transition hover:bg-[#edf4dc]"
            >
              Clear filters
            </button>
          )}

          <button
            type="button"
            onClick={onCreateTask}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#246b3b] px-4 text-sm font-black text-white shadow-lg shadow-[#246b3b]/20 transition hover:-translate-y-0.5 hover:bg-[#1f5d34] focus:outline-none focus:ring-4 focus:ring-[#cfe3c4]"
          >
            <Plus size={15} />
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
}