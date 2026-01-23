#!/usr/bin/env python3
"""
Check if all required packages are installed
"""

required_packages = [
    'fastapi',
    'uvicorn',
    'llama_index.core',
    'llama_index.llms.dashscope',
    'llama_index.embeddings.dashscope'
]

print("Checking required packages...")
all_good = True

for package in required_packages:
    try:
        if package.startswith('llama_index'):
            if package == 'llama_index.core':
                import llama_index.core
            elif package == 'llama_index.llms.dashscope':
                import llama_index.llms.dashscope
            elif package == 'llama_index.embeddings.dashscope':
                import llama_index.embeddings.dashscope
        else:
            __import__(package)
        print(f"✅ {package}")
    except ImportError:
        print(f"❌ {package} - NOT FOUND")
        all_good = False

if all_good:
    print("\n🎉 All packages are installed! You can run: python index.py")
else:
    print("\n⚠️  Some packages are missing. Run: pip install -r requirements.txt")
