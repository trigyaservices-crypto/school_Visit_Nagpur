#!/bin/bash
echo "===================================================="
echo "🚀 Running NAGPUR SCHOOL VISIT Locally"
echo "===================================================="
node build.js
if command -v python3 &>/dev/null; then
    echo "Serving via Python 3 on http://localhost:8000 ..."
    cd dist && python3 -m http.server 8000
elif command -v npx &>/dev/null; then
    echo "Serving via npx serve on http://localhost:8000 ..."
    npx serve dist -p 8000
else
    echo "Opening dist/index.html in default browser..."
    xdg-open dist/index.html || open dist/index.html
fi
