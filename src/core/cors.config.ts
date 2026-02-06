import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

export const corsOptions: CorsOptions = {
	origin: [
		"https://127.0.0.1:5000",
		"http://127.0.0.1:3001",
		"http://127.0.0.1:3000",
		"http://localhost:3000",
		"http://localhost:3003",
		"http://localhost:3001",
		"http://localhost:3001",
		"http://localhost:3000",
		"http://192.168.137.185:3000",
		"http://192.168.137.185:3001",
		"http://192.168.1.61:3000",
		"http://192.168.1.79:3000",
		"http://192.168.1.79:3000/",
		"http://172.16.16.201:3000/",
		"http://192.168.1.83:3001/",
		"http://192.168.1.96:3001/",
		"http://localhost:5173"
	],
	methods: ["GET", "POST", "PUT", "OPTIONS", "DELETE"],
	exposedHeaders: ["X-XSRF-TOKEN"],
};
