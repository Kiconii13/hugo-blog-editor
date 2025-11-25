import React from "react";

export default function MetadataForm({ meta, setMeta }) {

    const update = (key, value) => setMeta({ ...meta, [key]: value });

    return (
        <div className="meta-panel">
            <h2>Meta informacije</h2>

            <div className="upper-meta-panel">
                <label>Naslov</label>
                <input value={meta.title} onChange={e => update("title", e.target.value)} />

                <label>Opis</label>
                <textarea value={meta.description} onChange={e => update("description", e.target.value)} />

                <label>Datum</label>
                <input type="date" value={meta.date} onChange={e => update("date", e.target.value)} />
            </div>

            <div className="lower-meta-panel">
                <label>Slug</label>
                <input value={meta.slug} onChange={e => update("slug", e.target.value)} />

                <label>Featured image (PNG only)</label>
                <input
                    type="file"
                    accept="image/png"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => {
                            setMeta({ ...meta, image: reader.result });
                        };
                        reader.readAsDataURL(file);
                    }}
                />

                <label>Tagovi (odvojeni zarezima)</label>
                <input value={meta.tags} onChange={e => update("tags", e.target.value)} />

                <label>Kategorije (odvojene zarezima)</label>
                <input value={meta.categories} onChange={e => update("categories", e.target.value)} />
            </div>
        </div>
    );
}
