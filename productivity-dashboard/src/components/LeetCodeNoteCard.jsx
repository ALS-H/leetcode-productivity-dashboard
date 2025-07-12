import React, { useState } from 'react';
import '../styles/LeetCodeNoteCard.css';

export default function LeetCodeNoteCard({ note, onDelete, expanded, onToggleExpand, onUpdate }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);
  const [editLink, setEditLink] = useState(note.link || '');
  const [editTags, setEditTags] = useState(note.tags ? note.tags.join(', ') : '');

  function openEditModal(e) {
    e.stopPropagation(); // Prevent toggling expand when clicking edit
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditLink(note.link || '');
    setEditTags(note.tags ? note.tags.join(', ') : '');
    setIsEditOpen(true);
  }

  function closeEditModal() {
    setIsEditOpen(false);
  }

  function handleSave() {
    // Prepare updated note data
    const updatedNote = {
      ...note,
      title: editTitle.trim(),
      content: editContent.trim(),
      link: editLink.trim(),
      tags: editTags.split(',').map(tag => tag.trim()).filter(Boolean),
    };

    onUpdate(updatedNote);
    setIsEditOpen(false);
  }

  return (
    <>
      <div
        className={`note-card${expanded ? ' expanded' : ''}`}
        onClick={onToggleExpand}
      >
        <div className="note-card-header">
          <h3 className="note-card-title">{note.title}</h3>
          <div>
            <button
              onClick={openEditModal}
              className="note-card-edit-btn"
              title="Edit Note"
              type="button"
              style={{ marginRight: '8px' }}
            >
              ✎
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent toggling expand when deleting
                onDelete(note._id);
              }}
              className="note-card-delete-btn"
              title="Delete Note"
              type="button"
            >
              ✕
            </button>
          </div>
        </div>

        {expanded && (
          <>
            <p className="note-card-content">{note.content}</p>

            {note.link && (
              <a id="link"
                href={note.link}
                target="_blank"
                rel="noopener noreferrer"
                className="note-card-link"
                onClick={(e) => e.stopPropagation()}
              >
                Open Link
              </a>
            )}

            <div className="note-card-tags">
              {note.tags?.map((tag) => (
                <span key={tag} className="note-card-tag">
                  {tag}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {isEditOpen && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Edit Note</h2>

            <label>
              Title:
              <input
                type="text"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                autoFocus
              />
            </label>

            <label>
              Content:
              <textarea
                rows={5}
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
              />
            </label>

            <label>
              Link:
              <input
                type="url"
                value={editLink}
                onChange={e => setEditLink(e.target.value)}
                placeholder="https://example.com"
              />
            </label>

            <label>
              Tags (comma separated):
              <input
                type="text"
                value={editTags}
                onChange={e => setEditTags(e.target.value)}
              />
            </label>

            <div className="modal-buttons">
              <button onClick={handleSave}>Save</button>
              <button onClick={closeEditModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
