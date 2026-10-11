function normalizeTags (tags) {
    if (!Array.isArray(tags)) {
        return [];
    }

    const normalizedTags = [];
    const knownTags = new Set();

    for (const tag of tags) {
        const cleanedTag = String(tag || "")
            .trim()
            .replace(/\s+/g, "");
        if (cleanedTag === "") {
            continue;
        }
        
        const comparisonValue =
            cleanedTag.toLocaleLowerCase("de-DE");

        if (knownTags.has(comparisonValue)) {
            continue;
        }

        knownTags.add(comparisonValue);
        normalizedTags.push(cleanedTag);

    }

    return normalizedTags;
}

module.exports = {
    normalizeTags
};