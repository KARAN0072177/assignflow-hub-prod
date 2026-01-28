import { Link } from "react-router-dom";

const Sidebar = () => {
  const role = localStorage.getItem("userRole");

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white p-4">
      <h2 className="text-xl font-semibold mb-6">AssignFlow Hub</h2>

      {role === "TEACHER" && (
        <nav className="space-y-3">
          <p className="text-gray-400 text-sm">Teacher</p>

          <Link to="/dashboard" className="block hover:text-gray-300">
            Dashboard
          </Link>

          <Link
            to="/dashboard/classrooms/create"
            className="block hover:text-gray-300"
          >
            Create Classroom
          </Link>

          <Link
            to="/dashboard/classrooms/my"
            className="block hover:text-gray-300"
          >
            My Classrooms
          </Link>
        </nav>
      )}

      {role === "STUDENT" && (
        <nav className="space-y-3">
          <p className="text-gray-400 text-sm">Student</p>

          <Link to="/dashboard" className="block hover:text-gray-300">
            Dashboard
          </Link>

          <Link
            to="/dashboard/classrooms/join"
            className="block hover:text-gray-300"
          >
            Join Classroom
          </Link>

          <Link
            to="/dashboard/classrooms/my"
            className="block hover:text-gray-300"
          >
            My Classrooms
          </Link>

          <Link
            to="/dashboard/grades"
            className="block hover:text-gray-300"
          >
            My Grades
          </Link>
        </nav>
      )}
    </aside>
  );
};

export default Sidebar;