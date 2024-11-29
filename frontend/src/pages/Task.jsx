import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Textarea } from "../components/utils/Input";
import Loader from "../components/utils/Loader";
import useFetch from "../hooks/useFetch";
import MainLayout from "../layouts/MainLayout";
import validateManyFields from "../validations";

const Task = () => {
  const authState = useSelector((state) => state.authReducer);
  const navigate = useNavigate();
  const [fetchData, { loading }] = useFetch();
  const { taskId } = useParams();

  const mode = taskId === undefined ? "add" : "update";
  const [task, setTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Pending",
    dueDate: "",
    priority: "Low",
  });
  const [formErrors, setFormErrors] = useState({});

  const statusOptions = ["Pending", "In Progress", "Completed"];
  const priorityOptions = ["Low", "Medium", "High"];

  useEffect(() => {
    document.title = mode === "add" ? "Add Task" : "Update Task";
  }, [mode]);

  useEffect(() => {
    if (mode === "update") {
      const config = { url: `/tasks/${taskId}`, method: "get", headers: { Authorization: authState.token } };
      fetchData(config, { showSuccessToast: false }).then((data) => {
        setTask(data.task);
        setFormData({
          title: data.task.title,
          description: data.task.description,
          status: data.task.status,
          dueDate: data.task.dueDate,
          priority: data.task.priority
        });
      });
    }
  }, [mode, authState, taskId, fetchData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleReset = (e) => {
    e.preventDefault();
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        dueDate: task.dueDate,
        priority: task.priority
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateManyFields("task", formData);
    setFormErrors({});

    if (errors.length > 0) {
      setFormErrors(errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {}));
      return;
    }

    if (mode === "add") {
      const config = { url: "/tasks", method: "post", data: formData, headers: { Authorization: authState.token } };
      fetchData(config).then(() => {
        navigate("/");
      });
    } else {
      const config = { url: `/tasks/${taskId}`, method: "put", data: formData, headers: { Authorization: authState.token } };
      fetchData(config).then(() => {
        navigate("/");
      });
    }
  };

  const fieldError = (field) => (
    <p className={`mt-1 text-pink-600 text-sm ${formErrors[field] ? "block" : "hidden"}`}>
      <i className="mr-2 fa-solid fa-circle-exclamation"></i>
      {formErrors[field]}
    </p>
  );

  return (
    <MainLayout>
      <form
        className="m-auto my-16 max-w-[1000px] bg-white p-8 border-2 shadow-md rounded-md"
        onSubmit={handleSubmit}
      >
        {loading ? (
          <Loader />
        ) : (
          <>
            <h2 className="text-center mb-4">{mode === "add" ? "Add New Task" : "Edit Task"}</h2>

            {/* Title Input Field */}
            <div className="mb-4">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                placeholder="Task Title"
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {fieldError("title")}
            </div>

            {/* Description Input Field */}
            <div className="mb-4">
              <label htmlFor="description">Description</label>
              <Textarea
                name="description"
                id="description"
                value={formData.description}
                placeholder="Write here..."
                onChange={handleChange}
              />
              {fieldError("description")}
            </div>

            {/* Due Date Input Field */}
            <div className="mb-4">
              <label htmlFor="dueDate">Due Date</label>
              <input
                type="date"
                name="dueDate"
                id="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {fieldError("dueDate")}
            </div>

            {/* Status Dropdown */}
            <div className="mb-4">
              <label htmlFor="status">Status</label>
              <select
                name="status"
                id="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {statusOptions.map((status, index) => (
                  <option key={index} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Dropdown */}

            <div className="mb-4">
              <label htmlFor="Priority">Priority</label>
              <select
                name="priority" // Matches formData field
                id="Priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {priorityOptions.map((priority, index) => (
                  <option key={index} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
              {fieldError("priority")}
            </div>


            {/* Submit and Control Buttons */}
            <button
              className="bg-primary text-white px-4 py-2 font-medium hover:bg-primary-dark"
              type="submit"
            >
              {mode === "add" ? "Add Task" : "Update Task"}
            </button>
            <button
              className="ml-4 bg-red-500 text-white px-4 py-2 font-medium"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
            {mode === "update" && (
              <button
                className="ml-4 bg-blue-500 text-white px-4 py-2 font-medium hover:bg-blue-600"
                onClick={handleReset}
              >
                Reset
              </button>
            )}
          </>
        )}
      </form>
    </MainLayout>
  );
};

export default Task;

