export const isValidFileName = (fileName: string): boolean => {
    // File name should not be empty and should be at least 1 character long
    if (!fileName || fileName.trim().length === 0) return false;

    // File name should not exceed a certain length (e.g., 255 characters)
    if (fileName.length > 255) return false;

    // File name should not contain invalid characters
    const validChars = /[^a-zA-Z0-9. -]/;
    if (validChars.test(fileName)) return false;

    return true;
};
