import { useState } from "react";
import { deleteReview } from "../../services/adminService";

function DeleteReviewPage() {
  const [reviewId, setReviewId] = useState("");
  const [message, setMessage] = useState("");

  const handleDelete = async () => {
    try {
      await deleteReview(reviewId);
      setMessage("Reseña eliminada correctamente");
      setReviewId("");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div>
      <h1>Eliminar reseña específica</h1>

      <input
        value={reviewId}
        onChange={(e) => setReviewId(e.target.value)}
        placeholder="ID de la reseña"
        style={{ display: "block", marginBottom: "0.75rem", padding: "0.75rem", width: "360px" }}
      />

      <button onClick={handleDelete}>Eliminar</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default DeleteReviewPage;