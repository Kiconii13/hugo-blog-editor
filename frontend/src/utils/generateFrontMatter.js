export default function generateFrontMatter(meta) {

    // Convert comma-separated tags into a quoted YAML list
    const tags = meta.tags.split(",").map(t => `"${t.trim()}"`).join(", ");

    // Convert comma-separated categories into a quoted YAML list
    const categories = meta.categories.split(",").map(c => `"${c.trim()}"`).join(", ");

    // Return formatted YAML front matter block
    return `---
title: "${meta.title}"
description: "${meta.description}"
date: "${meta.date}"
draft: false
tags: [${tags}]
categories: [${categories}]
image: "${meta.image}"
---
`;
}
