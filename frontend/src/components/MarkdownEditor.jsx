import React, { useEffect, useRef } from "react";
import SimpleMDE from "simplemde";
import "simplemde/dist/simplemde.min.css";

export default function MarkdownEditor({ content, setContent }) {

    // Stores the SimpleMDE editor instance
    const editorRef = useRef(null);

    useEffect(() => {
        // Initialize SimpleMDE editor
        editorRef.current = new SimpleMDE({
            element: document.getElementById("simplemde-editor"), // textarea to convert into editor
            initialValue: content, // initial editor value
            spellChecker: false,   // disable spell checker
            autosave: {            // enable autosave
                enabled: true,
                delay: 1000,
                uniqueId: "hugo-editor"
            },
            toolbar: [             // visible toolbar buttons
                "bold", "italic", "heading", "|",
                "unordered-list", "ordered-list",
                "|", "link", "image"
            ]
        });

        // Listen for content changes and update parent state
        editorRef.current.codemirror.on("change", () => {
            setContent(editorRef.current.value());
        });

        // Cleanup: destroy editor when component unmounts
        return () => {
            editorRef.current.toTextArea();
            editorRef.current = null;
        };
    }, []);

    useEffect(() => {
        // If external content changes, sync it with the editor
        if (editorRef.current && editorRef.current.value() !== content) {
            editorRef.current.value(content);
        }
    }, [content]);

    return (
        <div className="editor-panel">
            <h2>Sadržaj</h2>
            {/* The textarea SimpleMDE will attach to */}
            <textarea id="simplemde-editor"></textarea>
        </div>
    );
}
