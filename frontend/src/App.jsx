import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [viewMode, setViewMode] = useState('list') // list, detail, create, edit
  const [posts, setPosts] = useState([])
  const [selectedPost, setSelectedPost] = useState(null)
  const API_URL = import.meta.env.VITE_API_URL

  // Fetch all posts
  const fetchPosts = () => {
    console.log(`[API CALL] GET ${API_URL}`);
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error('Error fetching posts:', err))
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleCreate = (postData) => {
    console.log(`[API CALL] POST ${API_URL}`, postData);
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    })
      .then((res) => res.json())
      .then(() => {
        fetchPosts()
        setViewMode('list')
      })
      .catch((err) => console.error('Error creating post:', err))
  }

  const handleUpdate = (id, postData) => {
    const url = `${API_URL}/${id}`;
    console.log(`[API CALL] PUT ${url}`, postData);
    fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    })
      .then((res) => res.json())
      .then(() => {
        fetchPosts()
        setViewMode('list')
      })
      .catch((err) => console.error('Error updating post:', err))
  }

  const handleDelete = (id) => {
    const url = `${API_URL}/${id}`;
    if (window.confirm('Are you sure you want to delete this post?')) {
      console.log(`[API CALL] DELETE ${url}`);
      fetch(url, { method: 'DELETE' })
        .then(() => {
          fetchPosts()
          setViewMode('list')
        })
        .catch((err) => console.error('Error deleting post:', err))
    }
  }

  return (
    <div className="board-app">
      <header className="board-header">
        <h1>Simple Board</h1>
        <p className="subtitle">React + Spring MVC (Layered Architecture)</p>
      </header>

      <main className="board-main">
        {viewMode === 'list' && (
          <PostList 
            posts={posts} 
            onSelect={(post) => { setSelectedPost(post); setViewMode('detail'); }}
            onCreateView={() => setViewMode('create')}
          />
        )}

        {viewMode === 'detail' && selectedPost && (
          <PostDetail 
            post={selectedPost} 
            onBack={() => setViewMode('list')}
            onEdit={() => setViewMode('edit')}
            onDelete={() => handleDelete(selectedPost.id)}
          />
        )}

        {(viewMode === 'create' || viewMode === 'edit') && (
          <PostForm 
            mode={viewMode}
            post={viewMode === 'edit' ? selectedPost : null}
            onSave={(data) => viewMode === 'create' ? handleCreate(data) : handleUpdate(selectedPost.id, data)}
            onCancel={() => setViewMode('list')}
          />
        )}
      </main>

      <footer className="board-footer">
        <p>&copy; 2026 Board Project. All rights reserved.</p>
      </footer>
    </div>
  )
}

function PostList({ posts, onSelect, onCreateView }) {
  return (
    <div className="post-list-container">
      <div className="list-toolbar">
        <h2>Post List</h2>
        <button onClick={onCreateView} className="btn btn-primary">Write Post</button>
      </div>
      <table className="post-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} onClick={() => onSelect(post)} className="clickable-row">
              <td>{post.id}</td>
              <td className="post-title-cell">{post.title}</td>
              <td>{post.author}</td>
              <td>{new Date(post.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
          {posts.length === 0 && (
            <tr>
              <td colSpan="4" className="empty-msg">No posts yet. Start by writing one!</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

function PostDetail({ post, onBack, onEdit, onDelete }) {
  return (
    <div className="post-detail-container">
      <div className="detail-card">
        <div className="detail-header">
          <h2>{post.title}</h2>
          <div className="post-meta">
            <span><strong>Author:</strong> {post.author}</span>
            <span><strong>Date:</strong> {new Date(post.createdAt).toLocaleString()}</span>
          </div>
        </div>
        <div className="post-body">
          {post.content}
        </div>
        <div className="detail-actions">
          <button onClick={onBack} className="btn">Back to List</button>
          <div className="admin-actions">
            <button onClick={onEdit} className="btn btn-secondary">Edit</button>
            <button onClick={onDelete} className="btn btn-danger">Delete</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PostForm({ mode, post, onSave, onCancel }) {
  const [title, setTitle] = useState(post ? post.title : '')
  const [author, setAuthor] = useState(post ? post.author : '')
  const [content, setContent] = useState(post ? post.content : '')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !author.trim() || !content.trim()) {
      alert('Please fill in all fields')
      return
    }
    onSave({ title, author, content })
  }

  return (
    <div className="post-form-container">
      <div className="form-card">
        <h2>{mode === 'create' ? 'New Post' : 'Edit Post'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Enter title"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Author</label>
            <input 
              type="text" 
              value={author} 
              onChange={(e) => setAuthor(e.target.value)} 
              placeholder="Enter your name"
              disabled={mode === 'edit'}
            />
          </div>
          <div className="form-group">
            <label>Content</label>
            <textarea 
              rows="12" 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              placeholder="Write your content here..."
            ></textarea>
          </div>
          <div className="form-footer">
            <button type="button" onClick={onCancel} className="btn">Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default App