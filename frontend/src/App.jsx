import React, { useState, useEffect } from "react";
import MetadataForm from "./components/MetadataForm";
import MarkdownEditor from "./components/MarkdownEditor";
import Preview from "./components/Preview";
import slugify from "./utils/slugify";
import generateFrontMatter from "./utils/generateFrontMatter";

function App() {

    // Stores all metadata fields for the post
    const [meta, setMeta] = useState({
        title: "",
        description: "",
        date: new Date().toISOString().slice(0, 10),
        slug: "",
        featured_image: "",
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

        await fetch("http://localhost:5000/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        alert("Sačuvano!");
    };

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
                &copy; {new Date().getFullYear()} <a href="https://github.com/Kiconii13" target="_blank">Kiconii13</a> All rights reserved.
            </footer>

        </div>
    );
}

export default App;
