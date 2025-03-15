import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { addComment } from "@/app/services/incidentService";
import { useSelector } from "react-redux";

export const CommentsTab = () => {
  const [comment, setComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [comments, setComments] = useState([]);
  const incidentId = useSelector((state) => state.incidents.selectedIncidentId);
  const authToken = useSelector((state) => state.auth.token);

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    setSubmittingComment(true);
    try {
      const response = await addComment(authToken, {
        incident_id: incidentId,
        comment,
      });
      setComments([...comments, response.data]);
      setComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Add Comment</h3>
      <div className="mb-6">
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Type your comment here..."
          className="min-h-24 resize-none"
        />
        <div className="mt-2 flex justify-end">
          <Button
            onClick={handleAddComment}
            disabled={!comment.trim() || submittingComment}
            className="w-32"
          >
            {submittingComment ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </div>

      <h3 className="text-lg font-medium text-gray-900 mt-8 mb-4">
        Comments History
      </h3>
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-md border border-gray-200"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-medium text-gray-900">{item.user}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({item.role})
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(item.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-700">{item.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-md border border-gray-200 text-center">
          <p className="text-gray-600">No comments yet.</p>
        </div>
      )}
    </div>
  );
};
