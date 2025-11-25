import React, { useState, useEffect } from "react";
import MetadataForm from "./components/MetadataForm";
import MarkdownEditor from "./components/MarkdownEditor";
import Preview from "./components/Preview";
import slugify from "./utils/slugify";
import generateFrontMatter from "./utils/generateFrontMatter";

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const apiUrl = process.env.REACT_APP_API_URL;

        try {
            const res = await fetch(`${apiUrl}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();
            if (data.success) onLogin();
            else setError(data.error || "Login failed");
        } catch {
            setError("Cannot reach server");
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Login</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [meta, setMeta] = useState({
        title: "",
        description: "",
        date: new Date().toISOString().slice(0, 10),
        slug: "",
        image: "",
        tags: "",
        categories: ""
    });
    const [content, setContent] = useState("");

    useEffect(() => setMeta(prev => ({ ...prev, slug: slugify(prev.title) })), [meta.title]);

    const handleSave = async () => {
        const frontmatter = generateFrontMatter(meta);
        const payload = {
            slug: meta.slug,
            front: frontmatter,
            content,
            image: meta.image
        };

        const apiUrl = process.env.REACT_APP_API_URL;
        try {
            const res = await fetch(`${apiUrl}/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) alert("Sačuvano!");
            else {
                const err = await res.json();
                alert("Error: " + (err.error || "Unknown error"));
            }
        } catch {
            alert("Cannot reach server");
        }
    };

    if (!loggedIn) return <Login onLogin={() => setLoggedIn(true)} />;

    return (
        <div className="app-grid">
            <h1>HUGO BLOG EDITOR</h1>
            <MetadataForm meta={meta} setMeta={setMeta} />
            <MarkdownEditor meta={meta} content={content} setContent={setContent} />
            <Preview content={content} />
            <button className="save-button" onClick={handleSave}>Save</button>
            <footer>
                &copy; {new Date().getFullYear()} <a href="https://github.com/Kiconii13" target="_blank" rel="noreferrer">Kiconii13</a> All rights reserved.
            </footer>
        </div>
    );
}

export default App;
