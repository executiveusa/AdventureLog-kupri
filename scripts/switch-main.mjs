import { execSync } from 'child_process';
import { chdir } from 'process';

chdir('/vercel/share/v0-project');

try {
  console.log('Fetching latest changes...');
  execSync('git fetch origin', { stdio: 'inherit' });
  
  console.log('Switching to main branch...');
  execSync('git checkout main', { stdio: 'inherit' });
  
  console.log('Successfully switched to main branch!');
} catch (error) {
  console.error('Error switching branch:', error.message);
  process.exit(1);
}
