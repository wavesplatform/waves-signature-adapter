rm -rf dist
./node_modules/.bin/tsc --downlevelIteration true -m commonjs -t es6 --outDir tmp
./node_modules/.bin/browserify -o=./dist/index.js --entry=./tmp --no-bundle-external
rm -rf tmp
