from setuptools import setup, find_packages

# Read requirements from requirements.txt
with open('requirements.txt') as f:
    requirements = [line.strip() for line in f if line.strip() and not line.startswith('#')]

# Manually specify packages to include the hyphenated directory
packages = find_packages() + ['sbackend.camplaint-analyzer']

setup(
    name="complaint-analyzer",
    version="0.1",
    packages=packages,
    install_requires=requirements,
    python_requires='>=3.9',
    include_package_data=True,
    package_data={
        '': ['*.txt', '*.json', '*.pkl', '*.h5'],
    },
    # Explicitly list package dependencies
    package_dir={'': '.'},
    # Add any scripts that should be in the PATH
    scripts=[],
)
