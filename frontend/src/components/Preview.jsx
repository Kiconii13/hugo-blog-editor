import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Preview({ content }) {
    return (
        <div className="preview-panel">
            <h2>Pregled</h2>
            <div className="preview-box">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                </ReactMarkdown>
            </div>
        </div>
    );
}
