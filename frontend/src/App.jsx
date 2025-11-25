import React, { useState, useEffect } from "react";
import MetadataForm from "./components/MetadataForm";
import MarkdownEditor from "./components/MarkdownEditor";
import Preview from "./components/Preview";
import slugify from "./utils/slugify";
import generateFrontMatter from "./utils/generateFrontMatter";

// Jednostavna login komponenta
const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const ADMIN_USER = process.env.REACT_APP_ADMIN_USER;
    const ADMIN_PASS = process.env.REACT_APP_ADMIN_PASS;

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      onLogin(); // otključava editor
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

  // Stores all metadata fields for the post
  const [meta, setMeta] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().slice(0, 10),
    slug: "",
    image: "",
    tags: "",
    categories: ""
  });

  // Stores the markdown content
  const [content, setContent] = useState("");

  // Automatically regenerate slug when the title changes
  useEffect(() => {
    setMeta(prev => ({ ...prev, slug: slugify(prev.title) }));
  }, [meta.title]);

  // Saves the post to the backend
  const handleSave = async () => {
    const frontmatter = generateFrontMatter(meta);

    const payload = {
      slug: meta.slug,
      front: frontmatter,
      content: content
    };

    const apiUrl = process.env.REACT_APP_API_URL;

    await fetch(`${apiUrl}/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    alert("Sačuvano!");
  };

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div className="app-grid">
      <h1>HUGO BLOG EDITOR</h1>

      {/* Metadata inputs (title, description, etc.) */}
      <MetadataForm meta={meta} setMeta={setMeta} />

      {/* Markdown editor component */}
      <MarkdownEditor 
        meta={meta}
        content={content}
        setContent={setContent}
      />

      {/* Live preview of the markdown */}
      <Preview content={content} />

      {/* Save button */}
      <button className="save-button" onClick={handleSave}>
        Sačuvaj
      </button>

      {/* Footer */}
      <footer>
        &copy; {new Date().getFullYear()} <a href="https://github.com/Kiconii13" target="_blank" rel="noreferrer">Kiconii13</a> All rights reserved.
      </footer>
    </div>
  );
}

export default App;
