import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "task_tracker_tasks_v1";
const STATUS_OPTIONS = ["TODO", "IN_PROGRESS", "DONE"];

function uuid() {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function App() {
    const [tasks, setTasks] = useState([]);
    const [newTitle, setNewTitle] = useState("");
    const [newDesc, setNewDesc] = useState("");

    const [filterStatus, setFilterStatus] = useState("ALL");
    const [filterQuery, setFilterQuery] = useState("");

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) setTasks(JSON.parse(raw));
        } catch (e) {
            console.error("Failed to load tasks from storage", e);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        } catch (e) {
            console.error("Failed to save tasks to storage", e);
        }
    }, [tasks]);

    const filtered = useMemo(() => {
        const q = filterQuery.trim().toLowerCase();
        return tasks.filter((t) => {
            const statusOk = filterStatus === "ALL" ? true : t.status === filterStatus;
            const queryOk =
                q.length === 0
                    ? true
                    : (t.title || "").toLowerCase().includes(q) ||
                    (t.description || "").toLowerCase().includes(q);
            return statusOk && queryOk;
        });
    }, [tasks, filterStatus, filterQuery]);

    function createTask(e) {
        e.preventDefault();
        const title = newTitle.trim();
        const description = newDesc.trim();

        if (!title) {
            alert("Title is required");
            return;
        }

        const now = new Date().toISOString();
        const task = {
            id: uuid(),
            title,
            description,
            status: "TODO",
            createdAt: now,
            updatedAt: now,
        };

        setTasks((prev) => [task, ...prev]);
        setNewTitle("");
        setNewDesc("");
    }

    function updateTask(id, patch) {
        setTasks((prev) =>
            prev.map((t) => {
                if (t.id !== id) return t;
                return {
                    ...t,
                    ...patch,
                    updatedAt: new Date().toISOString(),
                };
            })
        );
    }

    function deleteTask(id) {
        const ok = confirm("Delete this task?");
        if (!ok) return;
        setTasks((prev) => prev.filter((t) => t.id !== id));
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
            <header
                style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "center",
                    gap: 12,
                    marginBottom: 16,
                    width: "100%",
                }}
            >
                <h1 style={{ margin: 0 }}>Personal Task Tracker</h1>
                <span style={{ color: "#666" }}>
          ({filtered.length} / {tasks.length})
        </span>
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
                Data is stored in localStorage for now. We’ll switch to the Kotlin backend API later.
            </footer>
        </div>
    );
}

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
                        updated: {new Date(task.updatedAt).toLocaleString()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
