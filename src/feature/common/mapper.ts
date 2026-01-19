export const MapSnakeCaseToCamelCase = (data: any): any => {
	if (!data) {
		return data;
	}

	if (Array.isArray(data)) {
		return data.map((obj) => MapSnakeCaseToCamelCase(obj));
	}

	const result: any = {};
	for (const [key, value] of Object.entries(data)) {
		const camelCaseKey = key.replace(/_([a-zA-Z0-9])/g, (match, p1) =>
			p1.toUpperCase()
		);
		result[camelCaseKey] = value;
	}
	
	return result;
};

export const ArraySnakeCaseToCamelCase = (data: string[] | string): string => {
	if (!data) {
		return data.toString();
	}

	if (typeof data === 'string') {
		data = data.split(",");
	}

	const result: string[] = []
	for (const row of data) {
		const camelCaseKey = row.replace(/_([a-zA-Z])/g, (match, p1) =>
			p1.toUpperCase()
		);
		result.push(camelCaseKey)
	}
	
	return result.toString();
};

export const MapSnakeCaseToCamelCaseWithFieldMap = (data: any, fieldMap: Map<string, string>): any => {
	if (!data) {
		return data;
	}
	if (!fieldMap) {
		fieldMap = new Map();
	}

	if (Array.isArray(data)) {
		return data.map((obj) => MapSnakeCaseToCamelCaseWithFieldMap(obj, fieldMap));
	}

	const result: any = {};
	for (const [key, value] of Object.entries(data)) {
		if (fieldMap?.get(key)) {
			result[fieldMap?.get(key)] = value;
		} else {
			const camelCaseKey = key.replace(/_([a-z])/g, (match, p1) =>
				p1.toUpperCase()
			);
			result[camelCaseKey] = value;
		}
	}
	return result;
};