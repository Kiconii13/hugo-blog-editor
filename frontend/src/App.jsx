import React, { useState, useEffect } from "react";
import MetadataForm from "./components/MetadataForm";
import MarkdownEditor from "./components/MarkdownEditor";
import Preview from "./components/Preview";
import slugify from "./utils/slugify";
import generateFrontMatter from "./utils/generateFrontMatter";

// Minimal login component
const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Env variables (set locally or in Netlify)
    const ADMIN_USER = process.env.REACT_APP_ADMIN_USER;
    const ADMIN_PASS = process.env.REACT_APP_ADMIN_PASS;

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      onLogin(); // unlock editor
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  // Metadata state
  const [meta, setMeta] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().slice(0, 10),
    slug: "",
    image: "",
    tags: "",
    categories: ""
  });

  // Markdown content
  const [content, setContent] = useState("");

  // Update slug automatically when title changes
  useEffect(() => {
    setMeta(prev => ({ ...prev, slug: slugify(prev.title) }));
  }, [meta.title]);

  // Save post to backend
 const handleSave = async () => {
  const frontmatter = generateFrontMatter(meta);

  const payload = {
    slug: meta.slug,
    front: frontmatter,
    content: content,
    image: meta.image
  };

  const apiUrl = process.env.REACT_APP_API_URL;

  const res = await fetch(`${apiUrl}/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (res.ok) {
    alert("Sačuvano!");
  } else {
    const err = await res.json();
    alert("Error: " + (err.error || "Unknown error"));
  }
};


  // If not logged in, show login form
  if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;

  return (
    <div className="app-grid">
      <h1>HUGO BLOG EDITOR</h1>

      <MetadataForm meta={meta} setMeta={setMeta} />
      <MarkdownEditor meta={meta} content={content} setContent={setContent} />
      <Preview content={content} />

      <button className="save-button" onClick={handleSave}>
        Save
      </button>

      <footer>
        &copy; {new Date().getFullYear()} <a href="https://github.com/Kiconii13" target="_blank" rel="noreferrer">Kiconii13</a> All rights reserved.
      </footer>
    </div>
  );
}

export default App;
