from setuptools import setup, find_packages

setup(
    name="complaint-analyzer",
    version="0.1",
    packages=find_packages(),
    install_requires=open('requirements.txt').readlines(),
    python_requires='>=3.9',
)
