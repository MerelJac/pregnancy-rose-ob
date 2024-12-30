const getRecipeContent = (recipeContent) => {
    try {
        const sections = {
            name: null,
            ingredients: null,
            instructions: null,
            notes: null,
        };

        // Use regex to match each section
        const nameMatch = recipeContent.match(/recipe:\s*(.+)/i); // Updated to match "recipe:"
        const ingredientsMatch = recipeContent.match(/ingredients:\s*([\s\S]*?)instructions:/i);
        const instructionsMatch = recipeContent.match(/instructions:\s*([\s\S]*?)notes:/i);
        const notesMatch = recipeContent.match(/notes:\s*([\s\S]*)/i);

        // Assign matches to the respective sections
        if (nameMatch) sections.name = nameMatch[1].trim();
        if (ingredientsMatch) sections.ingredients = ingredientsMatch[1].trim();
        if (instructionsMatch) sections.instructions = instructionsMatch[1].trim();
        if (notesMatch) sections.notes = notesMatch[1].trim();

        console.log("Parsed Sections:", sections); // Debugging log

        return sections;
    } catch (error) {
        console.error("Error:", error.message);
        throw new Error("Failed to extract recipe content");
    }
};

module.exports = { getRecipeContent };
