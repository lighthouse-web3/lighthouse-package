import read, { Options } from 'read'

/*
  Function to read input from command line
  * @return string containing cli input.
  * @param {object} object containing options for read.

  example:
  const options = {
    prompt: "Set a password for your wallet:",
    silent: true,
  };
  
*/
export default async (options: Options) => {
  return new Promise(function (resolve, reject) {
    read(options, async (err, result) => {
      result ? resolve(result.trim()) : reject(err)
    })
  })
}
