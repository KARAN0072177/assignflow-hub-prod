import { BrowserRouter, Routes, Route} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CreateClassroom from "./pages/CreateClassroom";
import JoinClassroom from "./pages/JoinClassroom";
import MyClassrooms from "./pages/MyClassrooms";
import ClassroomDetail from "./pages/ClassroomDetail";
import MyGrades from "./pages/MyGrades";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/classrooms/create" element={<CreateClassroom />} />
        <Route path="/classrooms/join" element={<JoinClassroom />} />
        <Route path="/classrooms/my" element={<MyClassrooms />} />
        <Route path="/classrooms/:id" element={<ClassroomDetail />} />
        <Route path="/grades" element={<MyGrades />} />
        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;