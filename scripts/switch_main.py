import subprocess
import os

os.chdir('/vercel/share/v0-project')

try:
    print('Fetching latest changes...')
    subprocess.run(['git', 'fetch', 'origin'], check=True)
    
    print('Switching to main branch...')
    subprocess.run(['git', 'checkout', 'main'], check=True)
    
    print('Successfully switched to main branch!')
except subprocess.CalledProcessError as e:
    print(f'Error switching branch: {e}')
    exit(1)
