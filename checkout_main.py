import subprocess
import os

try:
    print('Checking current directory...')
    print(f'CWD: {os.getcwd()}')
    print(f'Files: {os.listdir(".")}')
    
    print('\nFetching from origin...')
    result = subprocess.run(['git', 'fetch', 'origin'], capture_output=True, text=True, cwd='.')
    print('STDOUT:', result.stdout)
    print('STDERR:', result.stderr)
    print('Return code:', result.returncode)
    
    print('\nChecking out main...')
    result = subprocess.run(['git', 'checkout', 'main'], capture_output=True, text=True, cwd='.')
    print('STDOUT:', result.stdout)
    print('STDERR:', result.stderr)
    print('Return code:', result.returncode)
    
    print('\nCurrent branch:')
    result = subprocess.run(['git', 'branch', '--show-current'], capture_output=True, text=True, cwd='.')
    print('Current:', result.stdout.strip())
    
except Exception as e:
    print(f'Error: {e}')
    import traceback
    traceback.print_exc()
