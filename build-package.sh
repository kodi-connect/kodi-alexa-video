#!/bin/bash -xe

root_dir="$(cd $(dirname $0) && pwd -P)"
package_filepath="${root_dir}/package.zip"

rm -fv "${package_filepath}"

tmpdir="$(mktemp -d)"

(cd "${root_dir}" && yarn build)

cp -r "${root_dir}/package.json" "${tmpdir}"
cp -r "${root_dir}/yarn.lock" "${tmpdir}"
cp -r "${root_dir}/build/"* "${tmpdir}"

pushd "${tmpdir}"

NODE_ENV=production yarn install

zip -r "${package_filepath}" . -x "__test__" -x "*/*.test.js"

popd

rm -r "${tmpdir}"
