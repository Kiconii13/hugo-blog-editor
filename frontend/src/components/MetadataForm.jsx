import React, { useRef } from "react";

export default function MetadataForm({ meta, setMeta }) {
  const fileInputRef = useRef();

  const update = (key, value) => {
    setMeta({ ...meta, [key]: value });
  };

  // Convert uploaded PNG to Base64 and resize to 600x600
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "image/png") {
      alert("Only PNG images are allowed.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = 600;
        canvas.height = 600;
        const ctx = canvas.getContext("2d");
        // Fill background black if transparent
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, 600, 600);
        ctx.drawImage(img, 0, 0, 600, 600);
        const dataURL = canvas.toDataURL("image/png");
        update("image", dataURL);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="meta-panel">
      <h2>Meta informacije</h2>

      <div className="upper-meta-panel">
        <label>Naslov</label>
        <input value={meta.title} onChange={(e) => update("title", e.target.value)} />

        <label>Opis</label>
        <textarea value={meta.description} onChange={(e) => update("description", e.target.value)} />

        <label>Datum</label>
        <input type="date" value={meta.date} onChange={(e) => update("date", e.target.value)} />
      </div>

      <div className="lower-meta-panel">
        <label>Slug</label>
        <input value={meta.slug} onChange={(e) => update("slug", e.target.value)} />

        <label>Featured Image (PNG only)</label>
        <input
          type="file"
          accept="image/png"
          ref={fileInputRef}
          onChange={handleImageUpload}
        />

        <label>Tagovi (odvojeni zarezima)</label>
        <input value={meta.tags} onChange={(e) => update("tags", e.target.value)} />

        <label>Kategorije (odvojene zarezima)</label>
        <input value={meta.categories} onChange={(e) => update("categories", e.target.value)} />
      </div>
    </div>
  );
}
