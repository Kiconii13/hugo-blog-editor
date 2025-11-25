import React from "react";

export default function MetadataForm({ meta, setMeta }) {

    // Helper function for updating any metadata field
    const update = (key, value) => {
        setMeta({ ...meta, [key]: value });
    };

    return (
        <div className="meta-panel">
            <h2>Meta informacije</h2>

            {/* Top section: title, description, date */}
            <div className="upper-meta-panel">

                <label>Naslov</label>
                {/* Title input */}
                <input 
                    value={meta.title}
                    onChange={e => update("title", e.target.value)}
                />

                <label>Opis</label>
                {/* Description textarea */}
                <textarea
                    value={meta.description}
                    onChange={e => update("description", e.target.value)}
                />

                <label>Datum</label>
                {/* Date selector */}
                <input
                    type="date"
                    value={meta.date}
                    onChange={e => update("date", e.target.value)}
                />
            </div>

            {/* Bottom section: slug, image, tags, categories */}
            <div className="lower-meta-panel">

                <label>Slug</label>
                {/* Slug input */}
                <input
                    value={meta.slug}
                    onChange={e => update("slug", e.target.value)}
                />

                <label>Featured image URL</label>
                {/* Image URL input */}
                <input
                    value={meta.featured_image}
                    onChange={e => update("featured_image", e.target.value)}
                />

                <label>Tagovi (odvojeni zarezima)</label>
                {/* Tags input */}
                <input
                    value={meta.tags}
                    onChange={e => update("tags", e.target.value)}
                />

                <label>Kategorije (odvojene zarezima)</label>
                {/* Categories input */}
                <input
                    value={meta.categories}
                    onChange={e => update("categories", e.target.value)}
                />
            </div>
        </div>
    );
}
