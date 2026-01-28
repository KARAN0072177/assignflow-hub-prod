import { Link, useLocation } from "react-router-dom";

const ROUTE_LABELS: Record<string, string> = {
  classrooms: "Classrooms",
  my: "My Classrooms",
  join: "Join Classroom",
  create: "Create Classroom",
  grades: "My Grades",
};

const CLICKABLE_SEGMENTS = new Set([
  "dashboard",
  "my",
  "join",
  "create",
  "grades",
]);

const Breadcrumbs = () => {
  const location = useLocation();

  const pathnames = location.pathname
    .split("/")
    .filter((x) => x && x !== "dashboard");

  return (
    <nav className="text-sm text-gray-600 mb-4">
      <Link to="/dashboard" className="hover:underline">
        Dashboard
      </Link>

      {pathnames.map((value, index) => {
        const to = `/dashboard/${pathnames
          .slice(0, index + 1)
          .join("/")}`;

        const isLast = index === pathnames.length - 1;
        const label = ROUTE_LABELS[value] || decodeURIComponent(value);
        const isClickable = CLICKABLE_SEGMENTS.has(value) && !isLast;

        return (
          <span key={to}>
            {" > "}
            {isClickable ? (
              <Link to={to} className="hover:underline text-gray-600">
                {label}
              </Link>
            ) : (
              <span className="text-gray-900">
                {label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;