'use client';
import { useState } from 'react';
import type { ProjectComment } from '@/types/project';
import { addComment, deleteComment } from '@/lib/firebase/projects';

interface Props {
  projectId: string;
  comments: ProjectComment[];
  currentUserId?: string;
}

export function CommentsPanel({ projectId, comments, currentUserId }: Props) {
  const [body, setBody] = useState('');
  const [posting, setPosting] = useState(false);

  async function handlePost() {
    if (!body.trim()) return;
    setPosting(true);
    await addComment(projectId, {
      authorId: currentUserId ?? 'unknown',
      body: body.trim(),
    });
    setBody('');
    setPosting(false);
  }

  async function handleDelete(commentId: string) {
    await deleteComment(projectId, commentId);
  }

  return (
    <div className="prj-comments">
      {/* Compose */}
      <div className="prj-comments__compose">
        <textarea
          className="prj-comments__textarea"
          rows={3}
          placeholder="Add a comment…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handlePost();
          }}
        />
        <div className="prj-comments__compose-footer">
          <span className="prj-comments__hint">⌘↵ to post</span>
          <button
            className="prj-comments__post-btn"
            onClick={handlePost}
            disabled={posting || !body.trim()}
          >
            {posting ? 'Posting…' : 'Post'}
          </button>
        </div>
      </div>

      {/* Thread */}
      <div className="prj-comments__thread">
        {comments.length === 0 && (
          <div className="prj-comments__empty">
            No comments yet. Be the first to add one.
          </div>
        )}
        {comments.map((c) => (
          <div key={c.id} className="prj-comments__item">
            <div className="prj-comments__avatar">
              {(c.authorId ?? '?')[0].toUpperCase()}
            </div>
            <div className="prj-comments__body">
              <div className="prj-comments__meta">
                <span className="prj-comments__author">{c.authorId}</span>
                <span className="prj-comments__time">
                  {new Date(c.createdAt).toLocaleString('en-GB', {
                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="prj-comments__text">{c.body}</p>
            </div>
            {currentUserId === c.authorId && (
              <button
                className="prj-comments__delete"
                onClick={() => handleDelete(c.id)}
                aria-label="Delete comment"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
