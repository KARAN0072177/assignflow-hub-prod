import { useEffect, useState } from "react";
import { getMyClassrooms } from "../services/classroom.api";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Users,
  Loader2,
  AlertCircle,
  PlusCircle,
  User,
  ChevronRight,
  Clock,
  Hash
} from "lucide-react";

const MyClassrooms = () => {
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const role = localStorage.getItem("userRole");
  const isTeacher = role === "TEACHER";

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const data = await getMyClassrooms();
        setClassrooms(data);
      } catch (err: any) {
        setError("Failed to load classrooms");
      } finally {
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center py-8">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-700">Loading classrooms...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center py-8">
        <div className="max-w-md mx-auto p-6">
          <div className="flex items-center gap-3 p-4 bg-red-100 border border-red-300 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 ${isTeacher ? 'bg-blue-100' : 'bg-emerald-100'} rounded-lg`}>
                <BookOpen className={`w-6 h-6 ${isTeacher ? 'text-blue-700' : 'text-emerald-700'}`} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  {isTeacher ? "My Classrooms" : "My Joined Classrooms"}
                </h1>
                <p className="text-slate-600 text-sm mt-1">
                  {isTeacher 
                    ? "Manage and organize your teaching spaces" 
                    : "Access your learning environments"}
                </p>
              </div>
            </div>
            
            {isTeacher && classrooms.length > 0 && (
              <Link
                to="/dashboard/classrooms/create"
                className={`inline-flex items-center gap-2 px-4 py-2.5 ${isTeacher ? 'bg-blue-700 hover:bg-blue-800' : 'bg-emerald-700 hover:bg-emerald-800'} text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isTeacher ? 'focus:ring-blue-600' : 'focus:ring-emerald-600'} active:scale-95`}
              >
                <PlusCircle className="w-5 h-5" />
                New Classroom
              </Link>
            )}
          </div>

          {/* Stats Bar */}
          {classrooms.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`inline-flex items-center gap-4 px-4 py-2.5 ${isTeacher ? 'bg-blue-50' : 'bg-emerald-50'} border ${isTeacher ? 'border-blue-200' : 'border-emerald-200'} rounded-lg`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className={`w-4 h-4 ${isTeacher ? 'text-blue-700' : 'text-emerald-700'}`} />
                <span className="text-sm font-medium text-slate-800">
                  {classrooms.length} classroom{classrooms.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="w-px h-4 bg-slate-300" />
              <div className="flex items-center gap-2">
                <Users className={`w-4 h-4 ${isTeacher ? 'text-blue-700' : 'text-emerald-700'}`} />
                <span className="text-sm text-slate-700">
                  {isTeacher ? 'Teaching' : 'Learning'} spaces
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Main Content */}
        <div className="space-y-6">
          <AnimatePresence>
            {classrooms.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-slate-150 border border-slate-300/50 rounded-xl p-8 sm:p-12 text-center shadow-sm"
              >
                <div className={`w-16 h-16 ${isTeacher ? 'bg-blue-100' : 'bg-emerald-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <BookOpen className={`w-8 h-8 ${isTeacher ? 'text-blue-600' : 'text-emerald-600'}`} />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  {isTeacher 
                    ? "No classrooms created yet" 
                    : "No classrooms joined yet"}
                </h3>
                <p className="text-slate-600 mb-6 max-w-sm mx-auto">
                  {isTeacher 
                    ? "Create your first classroom to start organizing your courses and students"
                    : "Join classrooms using codes provided by your teachers"}
                </p>
                {isTeacher && (
                  <Link
                    to="/dashboard/classrooms/create"
                    className={`inline-flex items-center gap-2 px-5 py-3 ${isTeacher ? 'bg-blue-700 hover:bg-blue-800' : 'bg-emerald-700 hover:bg-emerald-800'} text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isTeacher ? 'focus:ring-blue-600' : 'focus:ring-emerald-600'} active:scale-95`}
                  >
                    <PlusCircle className="w-5 h-5" />
                    Create First Classroom
                  </Link>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {classrooms.map((classroom, index) => (
                  <motion.div
                    key={classroom.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="group"
                  >
                    <Link
                      to={`/dashboard/classrooms/${classroom.id}`}
                      className={`block h-full bg-white border border-slate-300 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isTeacher ? 'focus:ring-blue-500 hover:border-blue-400' : 'focus:ring-emerald-500 hover:border-emerald-400'}`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 ${isTeacher ? 'bg-blue-50' : 'bg-emerald-50'} rounded-lg`}>
                            <BookOpen className={`w-5 h-5 ${isTeacher ? 'text-blue-700' : 'text-emerald-700'}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors line-clamp-1">
                              {classroom.name}
                            </h3>
                            {classroom.code && (
                              <div className="flex items-center gap-1 mt-1">
                                <Hash className="w-3 h-3 text-slate-500" />
                                <span className="text-xs font-mono text-slate-600">
                                  {classroom.code}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                      </div>

                      {classroom.description && (
                        <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                          {classroom.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                        <div className="flex items-center gap-4 text-xs text-slate-600">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{classroom.studentCount || 0} students</span>
                          </div>
                          {classroom.createdAt && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{formatDate(classroom.createdAt)}</span>
                            </div>
                          )}
                        </div>
                        
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${isTeacher ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {isTeacher ? 'Teacher' : 'Student'}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Note */}
        {classrooms.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <p className="text-xs text-slate-600">
              {isTeacher 
                ? "Click on any classroom to manage students, assignments, and settings"
                : "Click on any classroom to access course materials and assignments"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyClassrooms;