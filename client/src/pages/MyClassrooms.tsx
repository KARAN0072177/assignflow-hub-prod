import { useEffect, useState } from "react";
import { getMyClassrooms } from "../services/classroom.api";
import { Link } from "react-router-dom";

const MyClassrooms = () => {
    const [classrooms, setClassrooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const role = localStorage.getItem("userRole");

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

    if (loading) return <p>Loading classrooms...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div style={{ maxWidth: 600, margin: "40px auto" }}>
            <h2>
                {role === "TEACHER" ? "My Created Classrooms" : "My Joined Classrooms"}
            </h2>

            {classrooms.length === 0 ? (
                <p>
                    {role === "TEACHER"
                        ? "You have not created any classrooms yet."
                        : "You have not joined any classrooms yet."}
                </p>
            ) : (
                <ul>
                    {classrooms.map((c) => (
                        <li key={c.id} style={{ marginBottom: 12 }}>
                            <Link to={`/dashboard/classrooms/${c.id}`}>
                                <strong>{c.name}</strong>
                            </Link>
                            {c.description && <p>{c.description}</p>}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyClassrooms;