export class StringUtils {
	static convertToString(input: any): string {
		if (!input) {
			return "";
		}
		if (input instanceof Date) {
			// Format Date as yyyy-MM-dd HH:mm:ss.SSSSSS
			const year = input.getFullYear();
			const month = String(input.getMonth() + 1).padStart(2, '0');
			const day = String(input.getDate()).padStart(2, '0');
			const hours = String(input.getHours()).padStart(2, '0');
			const minutes = String(input.getMinutes()).padStart(2, '0');
			const seconds = String(input.getSeconds()).padStart(2, '0');
			// Extract microsecond precision (pad to 6 digits)
			const microseconds = String(input.getMilliseconds() * 1000).padStart(6, '0');
			return `${ year }-${ month }-${ day } ${ hours }:${ minutes }:${ seconds }.${ microseconds }`;
		} else {
			// For other types, convert to string
			return String(input);
		}
	}

	static camelToSnake(camelCaseString: string): string {
		if (!camelCaseString) {
			return null;
		}
		return camelCaseString.replace(/[A-Z]/g, match => `_${ match.toLowerCase() }`);
	}

	static snakeToCamel(snakeCaseString: string): string {
		if (!snakeCaseString) {
			return null;
		}
		return snakeCaseString.replace(/(_\w)/g, match => match[1].toUpperCase());
	}

}