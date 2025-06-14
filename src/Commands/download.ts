import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';
import ProgressBar from 'progress';
import lighthouse from '../Lighthouse';
import { gray, green, red, yellow } from 'kleur';
import { fetchWithTimeout } from '../Lighthouse/utils/util';
import { lighthouseConfig } from '../lighthouse.config';

interface DownloadOptions {
  output?: string;
  concurrent?: number;
  encrypted?: boolean;
}

async function download(cid: string, options: DownloadOptions) {
  try {
    if (!cid) {
      console.error(red('Error: CID is required'));
      process.exit(1);
    }

    const outputPath = options.output || process.cwd();
    const concurrentDownloads = options.concurrent || 3;

    await fs.ensureDir(outputPath);
    console.log(gray(`Output directory: ${outputPath}`));

    console.log(gray(`\nFetching file information for CID: ${cid}`));

    try {
      const fileInfo = await lighthouse.getFileInfo(cid);
      console.log(gray(`File info received: ${JSON.stringify(fileInfo.data, null, 2)}`));
      
      if (fileInfo.data.encryption) {
        console.log(yellow('\nThis file is encrypted. Please use the decrypt-file command instead.'));
        process.exit(1);
      }

      const progressBar = new ProgressBar('Downloading [:bar] :percent :etas', {
        complete: '=',
        incomplete: ' ',
        width: 30,
        total: 100
      });

      console.log(gray(`\nDownloading from: ${lighthouseConfig.lighthouseGateway}/api/v0/cat/${cid}`));
      const response = await fetchWithTimeout(
        `${lighthouseConfig.lighthouseGateway}/api/v0/cat/${cid}`,
        {
          method: 'POST',
          timeout: 7200000,
          headers: {
            'Accept': '*/*'
          },
          onProgress: (progress) => {
            progressBar.update(progress / 100);
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log(gray('\nProcessing downloaded data...'));
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      console.log(gray(`Downloaded data size: ${buffer.length} bytes`));

      const fileName = fileInfo.data.fileName || cid;
      const filePath = path.join(outputPath, fileName);
      console.log(gray(`Saving to: ${filePath}`));

      await fs.writeFile(filePath, new Uint8Array(buffer));
      
      const stats = await fs.stat(filePath);
      console.log(gray(`File saved successfully. Size: ${stats.size} bytes`));

      console.log(green(`\nFile downloaded successfully to: ${filePath}`));
    } catch (error: any) {
      console.error(red(`\nError downloading file: ${error.message}`));
      if (error.stack) {
        console.error(yellow('Stack trace:'));
        console.error(gray(error.stack));
      }
      process.exit(1);
    }
  } catch (error: any) {
    console.error(red(`\nError: ${error.message}`));
    if (error.stack) {
      console.error(yellow('Stack trace:'));
      console.error(gray(error.stack));
    }
    process.exit(1);
  }
}

export default function downloadCommand(program: Command) {
  program
    .command('download')
    .description('Download a file from Lighthouse storage')
    .argument('<cid>', 'Content ID (CID) of the file to download')
    .option('-o, --output <path>', 'Output directory path')
    .option('-c, --concurrent <number>', 'Number of concurrent downloads', '3')
    .option('-e, --encrypted', 'Download encrypted file')
    .action(download);
} 