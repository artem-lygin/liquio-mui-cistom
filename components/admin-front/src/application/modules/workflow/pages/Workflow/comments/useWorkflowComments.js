import React from 'react';
import commentsApi from './api';

const useWorkflowComments = (workflowId) => {
  const [comments, setComments] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    commentsApi
      .list(workflowId)
      .then((list) => !cancelled && setComments(list))
      .catch((e) => !cancelled && setError(e))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [workflowId]);

  const addComment = React.useCallback(
    async (comment) => {
      setError(null);
      try {
        const created = await commentsApi.create(workflowId, comment);
        setComments((list) => [...list, created]);
        return created;
      } catch (e) {
        setError(e);
        return null;
      }
    },
    [workflowId]
  );

  const removeComment = React.useCallback(
    async (commentId) => {
      setError(null);
      try {
        await commentsApi.remove(workflowId, commentId);
        setComments((list) => list.filter(({ id }) => id !== commentId));
      } catch (e) {
        setError(e);
      }
    },
    [workflowId]
  );

  return { comments, loading, error, addComment, removeComment };
};

export default useWorkflowComments;
