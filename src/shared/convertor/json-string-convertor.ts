import {BadRequestException} from "@nestjs/common";

/**
 * Parses a JSON string into the specified type.
 * @param {string} data - The JSON string to parse.
 * @returns {T} - The parsed JSON object of generic type T.
 * @throws {BadRequestException} - Throws a BadRequestException if the input data is empty or if there is an error parsing the JSON.
 */
export function parseJson<T>(data:string): T{
    // Check if the data is empty
    if(!data?.length){
        throw new BadRequestException("Empty value to parse");
    }
    try{
        // Attempt to parse the JSON string
        return JSON.parse(data) as T;
    }catch (error){
        // Handle parsing errors
        if (error instanceof SyntaxError) {
            // If it's a SyntaxError, the JSON format is invalid
            throw new BadRequestException("Error in parsing string to JSON: Invalid JSON format");
        } else {
            // For other errors, throw a generic parsing error
            throw new BadRequestException("Error in parsing string to JSON", error.message || error);
        }
    }
}