from setuptools import setup, find_packages

def read_requirements():
    with open('requirements.txt') as f:
        requirements = []
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            # Skip direct URLs and install them separately
            if line.startswith(('http://', 'https://', 'git+')):
                continue
            requirements.append(line)
    return requirements

# Manually specify packages to include
try:
    packages = find_packages() + ['sbackend.camplaint-analyzer']
except Exception as e:
    print(f"Warning: Could not find packages: {e}")
    packages = find_packages()

setup(
    name="complaint_analyzer",
    version="0.1",
    packages=packages,
    install_requires=read_requirements(),
    python_requires='>=3.9',
    include_package_data=True,
    package_data={
        '': ['*.txt', '*.json', '*.pkl', '*.h5', '*.md'],
    },
    package_dir={'': '.'},
    scripts=[],
)
