import { useEffect, useState } from "react";

export default function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [time, setTime] = useState(new Date());
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  /* ✅ DRAG STATE ADDED */
  const [dragIndex, setDragIndex] = useState(null);

  /* ================= THEME ================= */
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  /* ================= STORAGE ================= */
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  /* ================= CLOCK ================= */
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  /* ================= FUNCTIONS ================= */

  const addTodo = () => {
    if (!task.trim()) return;
    setTodos([
      ...todos,
      { id: Date.now(), text: task.trim(), completed: false },
    ]);
    setTask("");
  };

  const toggleTodo = (index) => {
    const updated = [...todos];
    updated[index].completed = !updated[index].completed;
    setTodos(updated);
  };

  const deleteTodo = (index) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  const deleteAll = () => {
    setTodos([]);
  };

  const clearCompleted = () => {
    setTodos(todos.filter((t) => !t.completed));
  };

  const startEdit = (index, text) => {
    setEditIndex(index);
    setEditText(text);
  };

  const saveEdit = () => {
    const updated = [...todos];
    updated[editIndex].text = editText;
    setTodos(updated);
    setEditIndex(null);
    setEditText("");
  };

  /* ✅ DRAG FUNCTIONS ADDED */

  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  const handleDrop = (index) => {
    if (dragIndex === null || dragIndex === index) return;

    const updated = [...todos];
    const draggedItem = updated[dragIndex];

    updated.splice(dragIndex, 1);
    updated.splice(index, 0, draggedItem);

    setTodos(updated);
    setDragIndex(null);
  };

  const filteredTodos = todos
    .filter((todo) => {
      if (filter === "completed") return todo.completed;
      if (filter === "pending") return !todo.completed;
      return true;
    })
    .filter((todo) =>
      todo.text.toLowerCase().includes(search.toLowerCase())
    );

  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const pending = total - completed;

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 text-slate-800 dark:text-slate-100 transition-colors duration-300">

      {/* NAVBAR */}
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm px-4 sm:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
        <h1 className="text-2xl font-semibold text-indigo-600">Todos</h1>

        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-sm">
          <span className="text-slate-600 dark:text-slate-300 text-center">
            {time.toLocaleDateString()} | {time.toLocaleTimeString()}
          </span>

          <button
            onClick={() => setDark(!dark)}
            className="px-3 py-1 rounded-lg bg-indigo-100 dark:bg-slate-700 hover:scale-105 transition"
          >
            {dark ? "☀ Light" : "🌙 Dark"}
          </button>
        </div>
      </nav>

      {/* MAIN */}
      <div className="flex justify-center mt-8 sm:mt-12 px-4">
        <div className="w-full max-w-2xl bg-white dark:bg-slate-900 shadow-xl rounded-3xl p-6 sm:p-8">

          {/* INPUT */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
              placeholder="Add a new task..."
              className="flex-1 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 bg-transparent"
            />
            <button
              onClick={addTodo}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl transition"
            >
              Add
            </button>
          </div>

          {/* SEARCH + FILTER */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1 text-sm bg-transparent"
            />

            <div className="flex gap-2 flex-wrap">
              {["all", "completed", "pending"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-3 py-1 rounded-lg text-sm capitalize ${
                    filter === type
                      ? "bg-indigo-600 text-white"
                      : "bg-indigo-100 dark:bg-slate-700"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* STATS */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 text-sm mb-4 text-slate-500 dark:text-slate-300">
            <div>
              Total: {total} | Completed: {completed} | Pending: {pending}
            </div>

            <div className="flex gap-4 flex-wrap">
              {completed > 0 && (
                <button
                  onClick={clearCompleted}
                  className="text-indigo-500 hover:underline"
                >
                  Clear completed
                </button>
              )}
              {total > 0 && (
                <button
                  onClick={deleteAll}
                  className="text-red-500 hover:underline"
                >
                  Delete all
                </button>
              )}
            </div>
          </div>

          {/* LIST */}
          <ul className="space-y-3">
            {filteredTodos.map((todo, index) => (
              <li
                key={todo.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(index)}
                className="flex items-start justify-between gap-3 bg-slate-100 dark:bg-slate-800 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-[1.01]"
              >
                {/* LEFT SIDE */}
                <div className="flex gap-3 flex-1 min-w-0">
                  <span className="text-indigo-500 font-medium shrink-0">
                    {index + 1}.
                  </span>

                  <div className="flex-1 min-w-0">
                    {editIndex === index ? (
                      <input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit();
                          if (e.key === "Escape") {
                            setEditIndex(null);
                            setEditText("");
                          }
                        }}
                        className="w-full bg-transparent border-b border-indigo-500 focus:outline-none"
                      />
                    ) : (
                      <span
                        onClick={() => toggleTodo(index)}
                        className={`block break-words whitespace-pre-wrap ${
                          todo.completed
                            ? "line-through text-slate-400"
                            : ""
                        }`}
                      >
                        {todo.text}
                      </span>
                    )}
                  </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex gap-3 text-sm shrink-0 items-start">
                  {editIndex === index ? (
                    <button onClick={saveEdit} className="text-green-500">
                      ✔
                    </button>
                  ) : (
                    <button
                      onClick={() => startEdit(index, todo.text)}
                      className="text-indigo-500"
                    >
                      ✎
                    </button>
                  )}
                  <button
                    onClick={() => deleteTodo(index)}
                    className="text-red-500"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>

        </div>
      </div>
    </div>
  );
}
