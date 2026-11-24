import React from 'react';
import { readLocal, writeLocal, request, withFallback } from './api';

// Mock API + hook for a workflow's documentation link (PoC): at most one per workflow,
// { workflowId, url, title, author: { id, name }, createdAt }. Backed by the dev server's
// /__dev/workflow-docs (craco.config.js), falling back to localStorage like comments do.

const BASE_URL = '/__dev/workflow-docs';
const STORAGE_KEY = 'workflowDocs';

// A single http(s) URL and nothing else (surrounding whitespace aside) — what makes a comment
// eligible to become the documentation link.
export const parseDocumentationUrl = (text) => {
  const value = String(text || '').trim();
  if (!value || /\s/.test(value)) return null;
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
  } catch (error) {
    return null;
  }
};

const localApi = {
  get: async (workflowId) => readLocal(STORAGE_KEY)[workflowId] || null,
  attach: async (workflowId, { url, title, author }) => {
    const data = readLocal(STORAGE_KEY);
    if (data[workflowId]) {
      const error = new Error('This workflow already has a documentation link');
      error.status = 409;
      throw error;
    }
    const href = parseDocumentationUrl(url);
    if (!href) throw new Error('A valid http(s) URL is required');
    // No server here to read the page's <title>: the hostname stands in.
    const doc = {
      workflowId,
      url: href,
      title: (title && title.trim()) || new URL(href).hostname,
      author: author || null,
      createdAt: new Date().toISOString()
    };
    data[workflowId] = doc;
    writeLocal(data, STORAGE_KEY);
    return doc;
  },
  remove: async (workflowId) => {
    const data = readLocal(STORAGE_KEY);
    delete data[workflowId];
    writeLocal(data, STORAGE_KEY);
  }
};

const remoteApi = {
  get: (workflowId) => request(`${BASE_URL}/${encodeURIComponent(workflowId)}`),
  attach: (workflowId, doc) =>
    request(`${BASE_URL}/${encodeURIComponent(workflowId)}`, {
      method: 'PUT',
      body: JSON.stringify(doc)
    }),
  remove: (workflowId) =>
    request(`${BASE_URL}/${encodeURIComponent(workflowId)}`, { method: 'DELETE' })
};

export const documentationApi = {
  get: withFallback(remoteApi.get, localApi.get),
  attach: withFallback(remoteApi.attach, localApi.attach),
  remove: withFallback(remoteApi.remove, localApi.remove)
};

// The current user as stored on a comment / documentation link.
export const toAuthor = (info) => {
  if (!info) return null;
  const name =
    info.name ||
    [info.last_name, info.first_name].filter(Boolean).join(' ') ||
    info.email ||
    null;
  return { id: info.userId || info.id || null, name };
};

export const useWorkflowDocumentation = (workflowId, { enabled = true } = {}) => {
  const [doc, setDoc] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (!enabled || !workflowId) return undefined;
    let cancelled = false;
    setLoading(true);
    documentationApi
      .get(workflowId)
      .then((result) => !cancelled && setDoc(result))
      .catch((e) => !cancelled && setError(e))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [workflowId, enabled]);

  const attach = React.useCallback(
    async (payload) => {
      setError(null);
      try {
        const created = await documentationApi.attach(workflowId, payload);
        setDoc(created);
        return created;
      } catch (e) {
        setError(e);
        return null;
      }
    },
    [workflowId]
  );

  const remove = React.useCallback(async () => {
    setError(null);
    try {
      await documentationApi.remove(workflowId);
      setDoc(null);
    } catch (e) {
      setError(e);
    }
  }, [workflowId]);

  return { doc, loading, error, attach, remove };
};
