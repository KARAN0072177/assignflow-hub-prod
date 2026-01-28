import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const role = localStorage.getItem("userRole");

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-2 py-1 rounded ${
      isActive ? "bg-gray-800 text-white" : "hover:text-gray-300"
    }`;

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white p-4">
      <h2 className="text-xl font-semibold mb-6">AssignFlow Hub</h2>

      {role === "TEACHER" && (
        <nav className="space-y-2">
          <p className="text-gray-400 text-sm">Teacher</p>

          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/dashboard/classrooms/create" className={linkClass}>
            Create Classroom
          </NavLink>

          <NavLink to="/dashboard/classrooms/my" className={linkClass}>
            My Classrooms
          </NavLink>
        </nav>
      )}

      {role === "STUDENT" && (
        <nav className="space-y-2">
          <p className="text-gray-400 text-sm">Student</p>

          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/dashboard/classrooms/join" className={linkClass}>
            Join Classroom
          </NavLink>

          <NavLink to="/dashboard/classrooms/my" className={linkClass}>
            My Classrooms
          </NavLink>

          <NavLink to="/dashboard/grades" className={linkClass}>
            My Grades
          </NavLink>
        </nav>
      )}
    </aside>
  );
};

export default Sidebar;