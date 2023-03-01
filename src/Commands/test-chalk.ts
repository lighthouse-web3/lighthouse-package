import chalk from 'chalk';

export default async () => {
  try {
    console.log(chalk.blue('Hello', 'World!', 'Foo', 'bar', 'biz', 'baz'));

    // Nest styles
    console.log(chalk.red('Hello', chalk.underline.bgBlue('world') + '!'));

    // Nest styles of the same type even (color, underline, background)
    console.log(
      chalk.green(
        'I am a green line ' + chalk.blue.underline.bold('with a blue substring') + ' that becomes green again!',
      ),
    );

    console.log('data:', chalk.blue('Hello world!'));
  } catch (err: any) {
    console.log(err.message);
  }
};
