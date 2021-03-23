import prettier from 'prettier';

export default async function(req, res) {
  try {
    const { script, framework } = JSON.parse(req.body || '{}');

    if (!framework) {
      throw new Error('No framework defined');
    }

    if (!script) {
      throw new Error('No script defined');
    }

    const parser = {
      react: 'babel',
      svg: 'babel',
      vue: 'vue',
      angular: 'babel'
    }[framework];

    const code = prettier.format(script, { parser });
    res.status(200).send({ code });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
}