import axios from 'axios';
import { lighthouseConfig } from '../../lighthouse.config';
import FormData from 'form-data';
import mime from 'mime-types';
import { readdir, createReadStream, lstatSync, stat } from 'fs-extra';
import basePathConverter from 'base-path-converter';

export async function walk(dir: string) {
  let results: string[] = [];

  const files = await readdir(dir);

  for (const file of files) {
    const filePath = `${dir}/${file}`;
    const _stat = await stat(filePath);

    if (_stat.isDirectory()) {
      results = results.concat(await walk(filePath));
    } else {
      results.push(filePath);
    }
  }

  return results;
}

/*
  This function is used to deploy a file to the Lighthouse server.
  It takes the following parameters:
  @param {string} sourcePath - The path of file/folder.
  @param {string} apiKey - The api key of the user.
*/

export default async (sourcePath: string, apiKey: string) => {
  const token = 'Bearer ' + apiKey;

  try {
    const endpoint = lighthouseConfig.lighthouseNode + '/api/v0/add';
    const stats = lstatSync(sourcePath);

    if (stats.isFile()) {
      //we need to create a single read stream instead of reading the directory recursively
      const data = new FormData();
      const mimeType = mime.lookup(sourcePath);

      data.append('file', createReadStream(sourcePath));

      const response = await axios.post(endpoint, data, {
        withCredentials: true,
        maxContentLength: Infinity, //this is needed to prevent axios from erroring out with large directories
        maxBodyLength: Infinity,
        headers: {
          'Content-type': `multipart/form-data; boundary= ${data.getBoundary()}`,
          Encryption: 'false',
          'Mime-Type': `${mimeType}`,
          Authorization: token,
        },
      });

      return { data: response.data };
    } else {
      const files = await walk(sourcePath);
      const data = new FormData();
      files.forEach((file: any) => {
        //for each file stream, we need to include the correct relative file path
        data.append('file', createReadStream(file), {
          filepath: basePathConverter(sourcePath, file),
        });
      });

      const response = await axios.post(endpoint, data, {
        withCredentials: true,
        maxContentLength: Infinity,
        maxBodyLength: Infinity, //this is needed to prevent axios from erroring out with large directories
        headers: {
          'Content-type': `multipart/form-data; boundary= ${data.getBoundary()}`,
          Encryption: 'false',
          Authorization: token,
        },
      });
      const temp = response.data.split('\n');
      response.data = JSON.parse(temp[temp.length - 2]);

      /*
        {
          data: {
            Name: 'flow1.png',
            Hash: 'QmUHDKv3NNL1mrg4NTW4WwJqetzwZbGNitdjr2G6Z5Xe6s',
            Size: '31735'
          }
        }
      */
      return { data: response.data };
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};
