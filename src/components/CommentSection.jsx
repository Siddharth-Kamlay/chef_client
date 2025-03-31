import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { FaThumbsUp } from 'react-icons/fa'; // Import the thumbs up icon

const CommentSection = ({ recipeId, authToken }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [recipeId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/recipes/${recipeId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('comment', newComment);
    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.post(`http://localhost:5000/api/recipes/${recipeId}/comment`, formData, {
        headers: {
          'x-auth-token': authToken,
          'Content-Type': 'multipart/form-data'
        }
      });
      setNewComment('');
      setImage(null);
      fetchComments();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  // ✅ Handle Like Functionality
  const handleLike = async (commentId, recipeId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/comments/${commentId}/like`,
        { recipeId },
        {
          headers: { 'x-auth-token': authToken },
        }
      );
      fetchComments(); // Refresh comments to show updated like count
    } catch (error) {
      console.error('Error liking comment:', error);
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
            {console.log(comment)}
            {/* Thumbs up icon instead of button */}
            <FaThumbsUp
              onClick={() => handleLike(comment._id, recipeId)} 
              style={{ cursor: 'pointer', color: comment.liked ? 'blue' : 'gray' }}
            />
            <span>{` (${comment.likedBy.length})`}</span>
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
