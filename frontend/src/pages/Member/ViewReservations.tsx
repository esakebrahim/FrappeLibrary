import React, { useEffect, useState } from "react";
import axios from "axios";

interface Reservation {
  name: string;
  book: string;
  book_title: string;
  reservation_date: string;
  status: string;
}

interface ReservationResponse {
  message: {
    reservations: Reservation[];
  };
}

const ViewMyReservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await axios.get<ReservationResponse>(
          "http://library.local:8000/api/method/library_app.library_app.api.member.get_my_reservations",
          {
            withCredentials: true,
          }
        );

        setReservations(res.data.message.reservations || []);
      } catch (err: any) {
        const msg =
          err.response?.data?.message ||
          err.response?.data?.exception ||
          err.message ||
          "Failed to fetch reservations.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">My Reservations</h2>

      {loading && <p>Loading reservations...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && reservations.length === 0 && (
        <p className="text-gray-600">You have no reservations.</p>
      )}

      {!loading && !error && reservations.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Book Title</th>
                <th className="border p-2">Reservation Date</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.name} className="text-center hover:bg-gray-50">
                  <td className="border p-2">{r.book_title}</td>
                  <td className="border p-2">
                    {new Date(r.reservation_date).toLocaleDateString()}
                  </td>
                  <td className="border p-2">{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewMyReservations;
