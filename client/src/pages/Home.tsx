const Home = () => {
  const role = localStorage.getItem("userRole");

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h1>Welcome to AssignFlow Hub</h1>

      <p>
        You are logged in as: <strong>{role}</strong>
      </p>

      <p>
        This is the basic home page. From here, you will be able to access
        classrooms, assignments, and other features.
      </p>
    </div>
  );
};

export default Home;