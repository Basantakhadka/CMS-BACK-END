/**
 * This method cleans up a given string by: 
    ** Replacing multiple spaces with a single space.
    ** Removing any leading or trailing spaces.
 * @param title title from the request
 * @returns removes the unwanted the spaces between the title
 */
export function normalizeStringUtil(title: string): string {
    // Remove extra spaces using regular expression
    return title.replace(/\s+/g, " ").trim();
}