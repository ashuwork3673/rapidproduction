import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const EditBlog = () => {
  const { query } = useRouter();
  const { slug } = query; // Extract slug from the URL
  const [blog, setBlog] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch the blog by its slug
  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/blogs/${slug}`);
        if (!res.ok) throw new Error('Failed to fetch blog');
        const data = await res.json();
        setBlog(data);
        setTitle(data.title);
        setContent(data.content);
      } catch (err) {
        setError('Failed to load blog');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedBlog = { title, content };

    try {
      const res = await fetch(`http://localhost:5000/api/blogs/${slug}`, {
        method: 'PUT',
        body: JSON.stringify(updatedBlog),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error('Failed to update blog');

      const data = await res.json();
      router.push(`/blogs/${data.slug}`); // Redirect to the updated blog
    } catch (err) {
      setError('Error saving the blog');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Edit Blog</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditBlog;
