export default function slugify(text) {
    return text
        .toLowerCase()                                     // convert to lowercase
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")  // remove diacritics/accents
        .replace(/[^a-z0-9]+/g, "-")                       // replace non-alphanumeric chars with hyphens
        .replace(/^-+|-+$/g, "");                          // trim leading/trailing hyphens
}
