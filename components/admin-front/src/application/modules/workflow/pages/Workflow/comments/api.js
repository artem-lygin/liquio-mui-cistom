// Mock workflow-comments API (PoC). There is no comments endpoint in the real backend yet, so
// this talks to the dev server's /__dev/workflow-comments (see craco.config.js), which keeps
// them in a JSON file — shared by everyone using that dev server. If that endpoint isn't
// reachable (production build, other host), it falls back to this browser's localStorage.
//
// Comment shape:
// {
//   id, workflowId, text, createdAt (ISO string),
//   author: { id, name } | null,
//   anchor: null                                    — a comment on the workflow itself
//         | { elementId, elementType, elementName } — pinned to a BPMN element
// }

const BASE_URL = '/__dev/workflow-comments';
const STORAGE_KEY = 'workflowComments';

let useLocalFallback = false;

const readLocal = () => {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
  } catch (error) {
    return {};
  }
};

const writeLocal = (data) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    // storage unavailable — comments just won't survive a reload
  }
};

const localApi = {
  list: async (workflowId) => readLocal()[workflowId] || [],
  create: async (workflowId, { text, author, anchor }) => {
    const data = readLocal();
    const comment = {
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      workflowId,
      text: text.trim(),
      author: author || null,
      createdAt: new Date().toISOString(),
      anchor: anchor || null
    };
    data[workflowId] = [...(data[workflowId] || []), comment];
    writeLocal(data);
    return comment;
  },
  remove: async (workflowId, commentId) => {
    const data = readLocal();
    data[workflowId] = (data[workflowId] || []).filter(({ id }) => id !== commentId);
    writeLocal(data);
  }
};

const request = async (url, options) => {
  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json' }
  });
  const isJson = (response.headers.get('Content-Type') || '').includes('application/json');

  // The dev server answers unknown paths with index.html (200, text/html) — treat that the
  // same as a missing endpoint.
  if (!isJson) {
    const error = new Error('Comments endpoint unavailable');
    error.unavailable = true;
    throw error;
  }

  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || response.statusText);
  return payload;
};

const withFallback =
  (remote, local) =>
  async (...args) => {
    if (useLocalFallback) return local(...args);
    try {
      return await remote(...args);
    } catch (error) {
      if (!error.unavailable && !(error instanceof TypeError)) throw error;
      useLocalFallback = true;
      return local(...args);
    }
  };

const remoteApi = {
  list: (workflowId) => request(`${BASE_URL}/${encodeURIComponent(workflowId)}`),
  create: (workflowId, comment) =>
    request(`${BASE_URL}/${encodeURIComponent(workflowId)}`, {
      method: 'POST',
      body: JSON.stringify(comment)
    }),
  remove: (workflowId, commentId) =>
    request(
      `${BASE_URL}/${encodeURIComponent(workflowId)}/${encodeURIComponent(commentId)}`,
      { method: 'DELETE' }
    )
};

const commentsApi = {
  list: withFallback(remoteApi.list, localApi.list),
  create: withFallback(remoteApi.create, localApi.create),
  remove: withFallback(remoteApi.remove, localApi.remove)
};

export default commentsApi;
