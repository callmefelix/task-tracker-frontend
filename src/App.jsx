import { useEffect, useState, useCallback } from "react";
import { taskService } from "./api"; // Import your task API service
import { useAuth } from './AuthContext'; // Import useAuth

const STATUS_OPTIONS = ["TODO", "IN_PROGRESS", "DONE"];

function App() {
    const { logout } = useAuth(); // Get logout function from context
    const [tasks, setTasks] = useState([]);
    const [newTitle, setNewTitle] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [loadingTasks, setLoadingTasks] = useState(true);
    const [error, setError] = useState(null);

    const [filterStatus, setFilterStatus] = useState("ALL");
    const [filterQuery, setFilterQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");

    // Debounce the search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(filterQuery);
        }, 500); // Wait 500ms after user stops typing

        return () => clearTimeout(timer);
    }, [filterQuery]);

    const fetchTasks = useCallback(async () => {
        setLoadingTasks(true);
        setError(null);
        try {
            const data = await taskService.getTasks(filterStatus, debouncedQuery);
            setTasks(data);
        } catch (err) {
            setError("Failed to fetch tasks. Please try again.");
            console.error("Error fetching tasks:", err);
            // If it's an auth error, AuthContext might have already handled redirect
        } finally {
            setLoadingTasks(false);
        }
    }, [filterStatus, debouncedQuery]); // Re-fetch when filters change

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]); // Initial fetch and re-fetch on filter changes

    // Auto-dismiss error after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    // No longer need `useMemo` for filtering as backend does it
    const filtered = tasks; // Now `tasks` already contains the filtered data from the API

    async function createTask(e) {
        e.preventDefault();
        const title = newTitle.trim();
        const description = newDesc.trim();

        if (!title) {
            setError("Title is required");
            return;
        }

        setError(null); // Clear any previous errors
        try {
            const newTask = await taskService.createTask({ title, description, status: "TODO" });
            setTasks((prev) => [newTask, ...prev]); // Add new task to the local state
            setNewTitle("");
            setNewDesc("");
        } catch (err) {
            setError(err.message || "Failed to create task. Please try again.");
            console.error("Error creating task:", err);
        }
    }

    async function updateTask(id, patch) {
        setError(null); // Clear any previous errors
        try {
            const updatedTask = await taskService.updateTask(id, patch);
            setTasks((prev) =>
                prev.map((t) => {
                    if (t.id !== id) return t;
                    return updatedTask; // Use the updated task from the API response
                })
            );
        } catch (err) {
            setError(err.message || "Failed to update task. Please try again.");
            console.error("Error updating task:", err);
        }
    }

    async function deleteTask(id) {
        const ok = confirm("Delete this task?");
        if (!ok) return;

        setError(null); // Clear any previous errors
        try {
            await taskService.deleteTask(id); // API call to delete
            setTasks((prev) => prev.filter((t) => t.id !== id)); // Remove from local state
        } catch (err) {
            setError(err.message || "Failed to delete task. Please try again.");
            console.error("Error deleting task:", err);
        }
    }

    if (loadingTasks) {
        return <div style={{ textAlign: 'center', marginTop: 50 }}>Loading tasks...</div>;
    }

    return (
        <div
            style={{
                maxWidth: 920,
                margin: "0 auto",
                padding: "24px 24px",
                fontFamily: "system-ui, -apple-system, sans-serif",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minHeight: "100vh",
                boxSizing: "border-box",
            }}
        >
            {/* Error Alert */}
            {error && (
                <div style={{
                    width: '100%',
                    padding: 12,
                    marginBottom: 16,
                    backgroundColor: '#f8d7da',
                    border: '1px solid #f5c6cb',
                    borderRadius: 8,
                    color: '#721c24',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxSizing: 'border-box'
                }}>
                    <span>{error}</span>
                    <button
                        onClick={() => setError(null)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#721c24',
                            fontSize: 20,
                            cursor: 'pointer',
                            padding: '0 8px',
                            lineHeight: 1
                        }}
                    >
                        ×
                    </button>
                </div>
            )}

            <header
                style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between", // Changed for logout button
                    gap: 12,
                    marginBottom: 16,
                    width: "100%",
                }}
            >
                <div style={{display: 'flex', alignItems: 'baseline', gap: 12}}>
                    <h1 style={{ margin: 0 }}>Personal Task Tracker</h1>
                    <span style={{ color: "#666" }}>
                        ({filtered.length} / {tasks.length})
                    </span>
                </div>
                <button
                    onClick={logout}
                    style={{
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: "1px solid #dc3545",
                        background: "#dc3545",
                        color: "white",
                        cursor: "pointer",
                    }}
                >
                    Logout
                </button>
            </header>

            {/* Create */}
            <section
                style={{
                    width: "100%",
                    border: "1px solid #ddd",
                    borderRadius: 10,
                    padding: 16,
                    marginBottom: 16,
                    boxSizing: "border-box",
                }}
            >
                <h2 style={{ marginTop: 0, fontSize: 18 }}>Create a task</h2>
                <form onSubmit={createTask} style={{ display: "grid", gap: 10 }}>
                    <input
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Title (required)"
                        style={{
                            padding: 10,
                            borderRadius: 8,
                            border: "1px solid #ccc",
                            width: "100%",
                            boxSizing: "border-box",
                        }}
                    />
                    <textarea
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        placeholder="Description (optional)"
                        rows={3}
                        style={{
                            padding: 10,
                            borderRadius: 8,
                            border: "1px solid #ccc",
                            resize: "vertical",
                            width: "100%",
                            boxSizing: "border-box",
                        }}
                    />
                    <div style={{ display: "flex", gap: 10 }}>
                        <button
                            type="submit"
                            style={{
                                padding: "10px 14px",
                                borderRadius: 8,
                                border: "1px solid #333",
                                background: "#333",
                                color: "white",
                                cursor: "pointer",
                            }}
                        >
                            Add
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setNewTitle("");
                                setNewDesc("");
                            }}
                            style={{
                                padding: "10px 14px",
                                borderRadius: 8,
                                border: "1px solid #ccc",
                                background: "white",
                                cursor: "pointer",
                            }}
                        >
                            Clear
                        </button>
                    </div>
                </form>
            </section>

            {/* Filters */}
            <section
                style={{
                    width: "100%",
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    marginBottom: 16,
                    boxSizing: "border-box",
                }}
            >
                <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ color: "#333" }}>Status</span>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        style={{ padding: 8, borderRadius: 8, border: "1px solid #ccc" }}
                    >
                        <option value="ALL">ALL</option>
                        {STATUS_OPTIONS.map((s) => (
                            <option value={s} key={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </label>

                <input
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    placeholder="Search in title/description..."
                    style={{
                        flex: 1,
                        padding: 10,
                        borderRadius: 8,
                        border: "1px solid #ccc",
                        minWidth: 220,
                        boxSizing: "border-box",
                    }}
                />

                <button
                    type="button"
                    onClick={() => {
                        setFilterStatus("ALL");
                        setFilterQuery("");
                    }}
                    style={{
                        padding: "10px 14px",
                        borderRadius: 8,
                        border: "1px solid #ccc",
                        background: "white",
                        cursor: "pointer",
                    }}
                >
                    Reset
                </button>
            </section>

            {/* List */}
            <section style={{ width: "100%", display: "grid", gap: 12 }}>
                {filtered.length === 0 ? (
                    <div style={{ color: "#666", padding: 12 }}>
                        No tasks match current filters.
                    </div>
                ) : (
                    filtered.map((t) => (
                        <TaskCard
                            key={t.id}
                            task={t}
                            onUpdate={(patch) => updateTask(t.id, patch)}
                            onDelete={() => deleteTask(t.id)}
                        />
                    ))
                )}
            </section>

            <footer style={{ marginTop: 22, color: "#777", fontSize: 12, width: "100%", textAlign: "center" }}>
                Data is now powered by the Kotlin backend API.
            </footer>
        </div>
    );
}

// TaskCard component remains largely the same, but it will receive `task.id` which is a UUID from backend
// Ensure `task.id` is correctly used.
function TaskCard({ task, onUpdate, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(task.title || "");
    const [description, setDescription] = useState(task.description || "");

    useEffect(() => {
        setTitle(task.title || "");
        setDescription(task.description || "");
    }, [task.title, task.description]);

    function save() {
        const nextTitle = title.trim();
        if (!nextTitle) {
            alert("Title is required");
            return;
        }
        onUpdate({ title: nextTitle, description: description.trim() });
        setIsEditing(false);
    }

    const statusBadge =
        {
            TODO: "🟡 TODO",
            IN_PROGRESS: "🔵 IN_PROGRESS",
            DONE: "🟢 DONE",
        }[task.status] || task.status;

    return (
        <div
            style={{
                border: "1px solid #ddd",
                borderRadius: 10,
                padding: 14,
                boxSizing: "border-box",
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <strong style={{ fontSize: 16 }}>{statusBadge}</strong>
                        <span style={{ color: "#888", fontSize: 12 }}>id: {task.id}</span>
                    </div>

                    {!isEditing ? (
                        <>
                            <div style={{ marginTop: 8, fontSize: 16 }}>{task.title}</div>
                            {task.description ? (
                                <div
                                    style={{
                                        marginTop: 6,
                                        color: "#555",
                                        whiteSpace: "pre-wrap",
                                    }}
                                >
                                    {task.description}
                                </div>
                            ) : (
                                <div style={{ marginTop: 6, color: "#999" }}>
                                    (no description)
                                </div>
                            )}
                        </>
                    ) : (
                        <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                style={{
                                    padding: 10,
                                    borderRadius: 8,
                                    border: "1px solid #ccc",
                                    width: "100%",
                                    boxSizing: "border-box",
                                }}
                            />
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                style={{
                                    padding: 10,
                                    borderRadius: 8,
                                    border: "1px solid #ccc",
                                    resize: "vertical",
                                    width: "100%",
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>
                    )}
                </div>

                <div style={{ display: "grid", gap: 8, minWidth: 180 }}>
                    <select
                        value={task.status}
                        onChange={(e) => onUpdate({ status: e.target.value })}
                        style={{ padding: 8, borderRadius: 8, border: "1px solid #ccc" }}
                    >
                        {STATUS_OPTIONS.map((s) => (
                            <option value={s} key={s}>
                                {s}
                            </option>
                        ))}
                    </select>

                    {!isEditing ? (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            style={{
                                padding: "10px 12px",
                                borderRadius: 8,
                                border: "1px solid #ccc",
                                background: "white",
                                cursor: "pointer",
                            }}
                        >
                            Edit
                        </button>
                    ) : (
                        <div style={{ display: "flex", gap: 8 }}>
                            <button
                                type="button"
                                onClick={save}
                                style={{
                                    flex: 1,
                                    padding: "10px 12px",
                                    borderRadius: 8,
                                    border: "1px solid #333",
                                    background: "#333",
                                    color: "white",
                                    cursor: "pointer",
                                }}
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setTitle(task.title || "");
                                    setDescription(task.description || "");
                                    setIsEditing(false);
                                }}
                                style={{
                                    flex: 1,
                                    padding: "10px 12px",
                                    borderRadius: 8,
                                    border: "1px solid #ccc",
                                    background: "white",
                                    cursor: "pointer",
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={onDelete}
                        style={{
                            padding: "10px 12px",
                            borderRadius: 8,
                            border: "1px solid #c00",
                            background: "white",
                            color: "#c00",
                            cursor: "pointer",
                        }}
                    >
                        Delete
                    </button>

                    <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>
                        created: {new Date(task.createdAt).toLocaleString()} <br />
                        updated: {new Date(task.updatedAt).toLocaleString()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;