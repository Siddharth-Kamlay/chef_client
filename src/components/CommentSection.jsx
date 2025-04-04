import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { FaThumbsUp, FaTrashAlt } from 'react-icons/fa';

const CommentSection = ({ recipeId, authToken }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [image, setImage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [commentToDelete, setCommentToDelete] = useState(null); // Track the comment to delete

  useEffect(() => {
    fetchComments();
    fetchUserId();
  }, [recipeId]);

  const fetchUserId = async () => {
    try {
      const response = await axios.get('https://chef-server-dusky.vercel.app/api/get-user-id', {
        headers: { 'x-auth-token': authToken },
      });
      setUserId(response.data.userId);
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`https://chef-server-dusky.vercel.app/api/recipes/${recipeId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('comment', newComment);
    if (image) formData.append('image', image);

    try {
      await axios.post(`https://chef-server-dusky.vercel.app/api/recipes/${recipeId}/comment`, formData, {
        headers: { 'x-auth-token': authToken, 'Content-Type': 'multipart/form-data' },
      });
      setNewComment('');
      setImage(null);
      fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleLike = async (commentId) => {
    try {
      await axios.post(
        `https://chef-server-dusky.vercel.app/api/comments/${commentId}/like`,
        { recipeId },
        { headers: { 'x-auth-token': authToken } }
      );
      fetchComments();
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(
        `https://chef-server-dusky.vercel.app/api/recipes/${recipeId}/comments/${commentId}`,
        { headers: { 'x-auth-token': authToken } }
      );
      setCommentToDelete(null); // Reset deletion state
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div>
      <h3>Comments</h3>

      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <p><strong>{comment.username}:</strong> {comment.comment}</p>
            {comment.image && <img src={comment.image} alt="comment" style={{ maxWidth: '200px' }} />}

            <FaThumbsUp
              onClick={() => handleLike(comment._id)}
              style={{ cursor: 'pointer', color: comment.liked ? 'blue' : 'gray' }}
            />
            <span>{` (${comment.likedBy.length})`}</span>

            {comment.userId === userId && (
              <>
                <FaTrashAlt
                  onClick={() => setCommentToDelete(comment._id)} // Set comment ID for deletion
                  style={{ cursor: 'pointer', marginLeft: '10px', color: 'red' }}
                />
                {commentToDelete === comment._id && (
                  <div
                    style={{
                      position: 'absolute',
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      padding: '20px',
                      borderRadius: '5px',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 1000,
                    }}
                  >
                    <p>Are you sure you want to delete this comment?</p>
                    <button onClick={() => handleDeleteComment(comment._id)} style={{ marginRight: '10px' }}>
                      Yes
                    </button>
                    <button onClick={() => setCommentToDelete(null)}>No</button>
                  </div>
                )}
              </>
            )}
          </div>
        ))
      ) : (
        <p>No comments yet. Be the first to comment!</p>
      )}

      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write your comment..."
          required
          rows="4"
          style={{ width: '100%' }}
        ></textarea>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} accept="image/*" />
        <button type="submit">Post Comment</button>
      </form>
    </div>
  );
};

CommentSection.propTypes = {
  recipeId: PropTypes.string.isRequired,
  authToken: PropTypes.string.isRequired,
};

export default CommentSection;
