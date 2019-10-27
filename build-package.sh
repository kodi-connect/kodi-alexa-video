#!/bin/bash -xe

root_dir="$(cd $(dirname $0) && pwd -P)"
package_filepath="${root_dir}/package.zip"

rm -fv "${package_filepath}"

tmpdir="$(mktemp -d)"

cp -v "${root_dir}/package.json" "${tmpdir}"
cp -v "${root_dir}/yarn.lock" "${tmpdir}"
cp -v "${root_dir}/src/index.js" "${tmpdir}"

pushd "${tmpdir}"

NODE_ENV=production yarn install

zip -r "${package_filepath}" .

popd

rm -r "${tmpdir}"
