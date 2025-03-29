import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const CommentSection = ({ recipeId, authToken }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [image, setImage] = useState(null);

  // Fetch comments when the component mounts
  useEffect(() => {
    fetchComments();
  }, [recipeId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`https://chef-server-ab7f1dad1bb4.herokuapp.com/api/recipes/${recipeId}/comments`);
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
      await axios.post(`https://chef-server-ab7f1dad1bb4.herokuapp.com/api/recipes/${recipeId}/comment`, formData, {
        headers: {
          'x-auth-token': authToken,
          'Content-Type': 'multipart/form-data'
        }
      });
      setNewComment('');
      setImage(null);
      fetchComments(); // Refresh comments after posting
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <div>
      <h3>Comments</h3>

      {/* Display existing comments */}
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <p><strong>{comment.userId.username}:</strong> {comment.comment}</p>
            {comment.image && <img src={comment.image} alt="comment" style={{ maxWidth: '200px' }} />}
          </div>
        ))
      ) : (
        <p>No comments yet. Be the first to comment!</p>
      )}

      {/* Add new comment */}
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
