import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { FaThumbsUp, FaTrashAlt, FaStar, FaRegStar, FaStarHalfAlt, FaPen } from 'react-icons/fa';
import styles from './CommentSection.module.css';

const CommentSection = ({ recipeId, authToken, ratings }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [image, setImage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editComment, setEditComment] = useState('');
  const [commentBeingEdited, setCommentBeingEdited] = useState(null);

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
      const updatedComments = response.data.map((comment) => {
        const userRating = ratings.find((rating) => rating.userId === comment.userId);
        return { ...comment, rating: userRating ? userRating.rating : null };
      });
      setComments(updatedComments);
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
      setCommentToDelete(null);
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleEditCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://chef-server-dusky.vercel.app/api/recipes/${recipeId}/comments/${commentBeingEdited}`,
        { comment: editComment },
        { headers: { 'x-auth-token': authToken } }
      );
      setEditMode(false);
      setEditComment('');
      setCommentBeingEdited(null);
      fetchComments();
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const renderRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return (
      <>
        {[...Array(fullStars)].map((_, index) => (
          <FaStar key={`full-${index}`} style={{ color: 'gold', marginRight: '2px' }} />
        ))}
        {halfStar === 1 && <FaStarHalfAlt style={{ color: 'gold', marginRight: '2px' }} />}
        {[...Array(emptyStars)].map((_, index) => (
          <FaRegStar key={`empty-${index}`} style={{ color: 'gray', marginRight: '2px' }} />
        ))}
      </>
    );
  };

  return (
    <div>
      <h3>Comments</h3>

      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment._id}>
            <div className={styles.comment}>
              <div className={styles.commentUsername}>
                <p><strong>{comment.username}</strong></p>
              </div>
              <div className={styles.commentDetails}>
                {comment.rating !== null && <div>{renderRatingStars(comment.rating)}</div>}
                {comment.timeAgo}
              </div>
              {comment.userId === userId && editMode && commentBeingEdited === comment._id ? (
                <form onSubmit={handleEditCommentSubmit}>
                  <textarea className={styles.editCommentForm}
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    required
                    rows="4"
                    style={{ width: '100%' }}
                  />
                  <div className={styles.editButtons}>
                    <button type="submit">Update Comment</button>
                    <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
                  </div>
                </form>
              ) : (
                <div className={styles.commentComment}>
                  <p>{comment.comment}</p>
                </div>
              )}
              <div className={styles.likes_delete}>
                <FaThumbsUp
                  onClick={() => handleLike(comment._id)}
                  style={{ cursor: 'pointer', color: 'grey' }}
                />
                &nbsp;{`${comment.likedBy.length}`}
                {comment.userId === userId && (
                  <>
                    <FaPen 
                      onClick={() => {
                        setEditMode(true);
                        setEditComment(comment.comment);
                        setCommentBeingEdited(comment._id);
                      }}
                      style={{ cursor: 'pointer', marginLeft: '10px', color: 'grey' }}
                    />
                    <FaTrashAlt
                      onClick={() => setCommentToDelete(comment._id)}
                      style={{ cursor: 'pointer', marginLeft: '10px', color: 'red' }}
                    />
                  </>
                )}
              </div>
              {comment.image && <img src={comment.image} alt="comment" style={{ maxWidth: '200px' }} />}
            </div>

            {comment.userId === userId && commentToDelete === comment._id && (
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
  ratings: PropTypes.array.isRequired
};

export default CommentSection;
