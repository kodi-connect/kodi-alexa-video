#!/bin/bash -xe

root_dir="$(cd $(dirname $0) && pwd -P)"
version="$(cat "${root_dir}/version")"
package_filepath="${root_dir}/kodi-alexa-video-package-${version}.zip"

rm -fv "${package_filepath}"

tmpdir="$(mktemp -d)"

cp -v "${root_dir}/package.json" "${tmpdir}"
cp -v "${root_dir}/yarn.lock" "${tmpdir}"
cp -v "${root_dir}/src/index.js" "${tmpdir}"

sed_replace_cmd="s/<version>/${version}/g"
sed -i "${sed_replace_cmd}" "${tmpdir}/index.js"

pushd "${tmpdir}"

NODE_ENV=production yarn install

zip -r "${package_filepath}" .

popd

rm -r "${tmpdir}"
