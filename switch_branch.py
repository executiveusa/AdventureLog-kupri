import subprocess
import os

project_dir = '/vercel/share/v0-project'

try:
    print(f'Switching to {project_dir}...')
    os.chdir(project_dir)
    print(f'Current dir: {os.getcwd()}')
    
    print('\nFetching from origin...')
    result = subprocess.run(['git', 'fetch', 'origin'], capture_output=True, text=True)
    print(result.stdout if result.stdout else result.stderr)
    
    print('\nChecking out main...')
    result = subprocess.run(['git', 'checkout', 'main'], capture_output=True, text=True)
    print(result.stdout if result.stdout else result.stderr)
    
    print('\nCurrent branch:')
    result = subprocess.run(['git', 'branch', '--show-current'], capture_output=True, text=True)
    print(f'Branch: {result.stdout.strip()}')
    print('\n✓ Branch switched successfully!')
    
except Exception as e:
    print(f'Error: {e}')
    import traceback
    traceback.print_exc()
