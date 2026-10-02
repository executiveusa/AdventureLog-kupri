import subprocess
import os

# Change to the project directory
os.chdir('/vercel/share/v0-project')
print(f"Current directory: {os.getcwd()}")

try:
    print('Fetching latest changes...')
    result = subprocess.run(['git', 'fetch', 'origin'], capture_output=True, text=True)
    print(result.stdout)
    if result.stderr:
        print('STDERR:', result.stderr)
    
    print('\nSwitching to main branch...')
    result = subprocess.run(['git', 'checkout', 'main'], capture_output=True, text=True)
    print(result.stdout)
    if result.stderr:
        print('STDERR:', result.stderr)
    
    # Verify the branch
    result = subprocess.run(['git', 'branch', '--show-current'], capture_output=True, text=True)
    current_branch = result.stdout.strip()
    print(f'\nCurrent branch: {current_branch}')
    
    if current_branch == 'main':
        print('✓ Successfully switched to main branch!')
    else:
        print(f'✗ Failed to switch. Still on: {current_branch}')
except Exception as e:
    print(f'Error: {e}')
    import traceback
    traceback.print_exc()
