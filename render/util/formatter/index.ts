import prettier from 'prettier';

export const Formatter = (script: string, framework = 'react') => {
	console.log('AAA', { script, framework });
	try {
		if (!framework) {
			throw new Error('No framework defined');
		}

		if (!script) {
			throw new Error('No script defined');
		}

		/* eslint-disable */
		const parser: any = {
			react: 'babel',
			svg: 'babel',
			vue: 'vue',
			angular: 'babel',
		}[framework];

		const done = prettier.format(script, { parser });
		return done;
	} catch (error: any) {
		console.log('ERR', { message: error.message });
	}
};

export default Formatter;
