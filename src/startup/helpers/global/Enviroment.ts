export class Enviroment {

	public static getNodeEnv(): string {
		return process.env.NODE_ENV || 'development';
	}
}
