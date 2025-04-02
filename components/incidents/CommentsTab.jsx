import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  addComment,
  fetchIncidentComments,
} from "@/app/services/incidentService";
import { useSelector } from "react-redux";

import { useState, useEffect } from "react";
import Loading from "../Loading";

export const CommentsTab = () => {
  const [comment, setComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [error, setError] = useState(null);

  const incidentId = useSelector((state) => state.incidents.selectedIncidentId);
  const authToken = useSelector((state) => state.auth.token);
  const fromReports = useSelector((state) => state.fromReports.fromReports);

  // Fetch comments when the component mounts or incidentId changes
  useEffect(() => {
    const getComments = async () => {
      try {
        setLoadingComments(true);
        const response = await fetchIncidentComments(authToken, incidentId);
        setComments(response.data);
        setError(null);
      } catch (error) {
        toast.error("Error fetching comments");
        setError("Failed to load comments. Please try again later.");
      } finally {
        setLoadingComments(false);
      }
    };

    if (incidentId) {
      getComments();
    }
  }, [incidentId, authToken]);

  // Handle adding a new comment
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
      setError(null);

      setTimeout(() => {
        const commentsContainer = document.getElementById("comments-container");
        if (commentsContainer) {
          commentsContainer.scrollTop = commentsContainer.scrollHeight;
        }
      }, 100);
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Failed to post comment. Please try again.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
      {!fromReports && (
        <>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Add Comment
          </h3>
          <div className="mb-6">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Type your comment here..."
              className="min-h-24 resize-none"
              maxLength={500}
            />
            <div className="mt-2 flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {comment.length}/500 characters
              </span>
              <Button
                onClick={handleAddComment}
                disabled={!comment.trim() || submittingComment}
                className="w-32"
              >
                {submittingComment ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </div>
        </>
      )}

      <h3 className="text-lg font-medium text-gray-900 mt-8 mb-4">
        Comment History
      </h3>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div
        id="comments-container"
        className="space-y-4 max-h-96 overflow-y-auto"
      >
        {loadingComments ? (
          <Loading />
        ) : comments.length > 0 ? (
          comments.map((item) => (
            <div
              key={item?.id}
              className="bg-white p-4 rounded-md border border-gray-200"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-medium text-gray-900">
                    {item?.senderable?.first_name} {item?.senderable?.last_name}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    {item?.senderable?.role?.name &&
                      `(${item.senderable.role.name})`}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {item?.created_at && formatTimestamp(item.created_at)}
                </span>
              </div>
              <p className="text-gray-700">{item?.comment}</p>
              {/* Display replies if available */}
              {item?.replies?.length > 0 && (
                <div className="mt-4 pl-4 border-l-2 border-gray-200">
                  {item.replies.map((reply) => (
                    <div key={reply?.id} className="mt-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium text-gray-900">
                            {reply?.senderable?.first_name}{" "}
                            {reply?.senderable?.last_name}
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
                            {reply?.senderable?.role?.name &&
                              `(${reply.senderable.role.name})`}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {reply?.created_at &&
                            formatTimestamp(reply.created_at)}
                        </span>
                      </div>
                      <p className="text-gray-700">{reply?.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white p-6 rounded-md border border-gray-200 text-center">
            <p className="text-gray-600">No comments yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
