placebo-npm
===========
`placebo-npm` is a utility that *installs* all dependencies declared in a
`package-lock.json` file of an [NPM](https://npmjs.com) project in their correct
locations in the `node_modules/` directory tree, but only *obtains* the
dependencies from local file locations specified in a so-called
`package-placebo.json` model. It also makes all necessary *modifications* to
make the dependencies work.

This procedure prevents `npm install` from re-downloading/re-obtaining them
from their original remote locations.

This tool can be useful for a variety of purposes, such as:
* Working with a custom local cache in which all dependencies have been
  pre-downloaded by the user or a custom script.
* Performing offline installations in which dependencies are provided by external
  storage media, such as USB flash drives
* Delegating the dependency management responsibility of NPM to an
  external/general purpose package manager, such as
  [Nix](https://nixos.org/nix) -- a general purpose package manager that can
  take care of the deployment of an entire system including the NPM dependencies
  that a system may require.

Background
==========
NPM is a very instrumental tool in the deployment lifecycle of many systems.
It acts both as a dependency and build manager for NPM projects -- it can *obtain
dependencies* from a variety of sources, such as Git repositories, arbitrary
HTTP locations, local directories and the NPM registry, and perform build tasks
through *build scripts* that can do things like linting, testing and compiling.

Although NPM's dependency management features are quite useful, for reasons
explained in the introduction, it may be desirable to bypass them (but still
retain NPM's build management features).

Bypass NPM's dependency management has become quite complicated:
* Since NPM 5.0.0 it is no longer possible to manually unpack or copy a
  dependency into the `node_modules/` tree. If certain hidden metadata
  properties in the dependencies' `package.json` files have not been configured,
  NPM will attempt to redownload/reobtain the dependencies from their original
  locations.
* When there is no network connection, NPM has the option to perform offline
  installations by obtaining the required source artifacts from a local cache,
  but this cache has a number of limitations.
* NPM projects can also have dependencies on NPM projects stored on the local
  file system. Recent versions of NPM package create symlinks to these
  directories rather than copying them, making it difficult to reproduce the
  same installation on a different system in which the dependencies can not be
  stored in the exact same locations.

NPM's offline cache is not completely location-agnostic. For example, the
following dependency: `async`, may have been configured as follows in a
`package-lock.json` file:

```json
{
    "async": {
      "version": "3.2.1",
      "resolved": "https://registry.npmjs.org/async/-/async-3.2.1.tgz",
      "integrity": "sha512-XdD5lRO/87udXCMC9meWdYiR+Nq6ZjUfXidViUZGu2F1MO4T3XwZ1et0hb2++BgLfhyJwy44BGB/yx80ABx8hg=="
    }
}
```

As can be seen, the integrity hash of the tarball file is:
`sha512-XdD5lRO/87udXCMC9meWdYiR+Nq6ZjUfXidViUZGu2F1MO4T3XwZ1et0hb2++BgLfhyJwy44BGB/yx80ABx8hg==`

A nice property of an integrity hash is that it should not matter from where
we have obtained the tarball file. In the above example it is obtained from the
NPM registry, but it should be obtainable from anywhere -- as long as the
integrity hash is the same, then we should always have exactly the same tarball
file with the same contents.

Unfortunately, NPM's cache is unable to exploit the full advantage of this property.
In some cases, e.g. inserting a local file, suffices to also facilitate an offline
deployment of a dependency from the registry, but this does not always work.

For example, if we manually add an entry for `async` to a cache that downloads
the exact same file (with same output hash) from a different URL:

```bash
$ npm cache add http://mylocalcache/async-3.2.1.tgz
```

and perform an offline installation of the project:

```bash
$ npm install --offline
npm ERR! code ENOTCACHED
npm ERR! request to https://registry.npmjs.org/async/-/async-3.2.1.tgz failed: cache mode is 'only-if-cached' but no cached response available.

npm ERR! A complete log of this run can be found in:
npm ERR!     /home/sander/.npm/_logs/2021-08-26T13_50_15_137Z-debug.log
```

the NPM installation fails, because NPM still tries to obtain it from its
original location, which fails in offline mode (the reason why this happens
in because NPM cache only computes the SHA1 hash of the tarball, so that
it cannot link the SHA512 hash in the `package-lock.json` file to it).

However, when we obtain the tarball from its original location (the NPM registry)
through the cache:

```bash
$ npm cache add async@3.2.1
```

Makes the offline installation succeed:

```bash
$ npm install --offline
```

`placebo-npm` can work around location-agnostic limitations by completely
bypassing the cache -- by augmenting the `package.json` files of all
dependencies in the `node_modules/` tree with the required hidden properties
(such as the integrity hash) to trick NPM that they have been obtained from
their original locations.

Another major annoyance is dependencies on locations on the local filesystem.
For example, declaring a dependency: `../../mydep` creates a symlink to the
corresponding directory in the `node_modules` folder.

When it is desired to deploy a project to another machine, we must also install
the directory dependencies in their exact same locations, which may not always
be possible. `placebo-npm` allows you to conveniently change directory
dependencies.

Usage
=====
`placebo-npm` is straight forward to use as a local cache provider.

Take the following example project with the following `package.json`
configuration:

```json
{
  "name": "exampleproject",
  "version": "0.0.1",
  "dependencies": {
    "async": "*",
    "nijs": "prom2cb",
    "mylocaldep": "../mylocaldep"
  }
}
```

and a `package-lock.json` file that freezes the entire dependency tree.

For example, we can manually obtain the required dependencies (declared in the
`package-lock.json` file) of the example project ourselves:

```bash
$ cd /home/sander/mycache
$ wget https://registry.npmjs.org/async/-/async-3.2.1.tgz
$ git clone https://github.com/svanderburg/prom2cb
```

Then we can write a placebo config (`package-placebo.json`), that has the
following structure:

```json
{
   "integrityHashToFile": {
     "sha512-XdD5lRO/87udXCMC9meWdYiR+Nq6ZjUfXidViUZGu2F1MO4T3XwZ1et0hb2++BgLfhyJwy44BGB/yx80ABx8hg==": "/home/sander/mycache/async-3.2.1.tgz"
   },
   "versionToFile": {
     "github:svanderburg/prom2cb#fab277adce1af3bc685f06fa1e43d889362a0e34": "/home/sander/mycache/prom2cb"
   },
   "versionToDirectoryCopyLink": {
     "file:../dep": "/home/sander/alternatedir/dep"
   }
}
```

The placebo config maps dependencies in a `package-lock.json` file to local file
references:

* `integrityHashToFile` maps dependencies with an `integrity` hash to local
  files which is useful for HTTP/HTTPS dependencies, registry dependencies, and
  local file dependencies
* `versionToFile` maps dependencies with a `version` property to a local
  directories. This is useful for Git dependencies
* `versionToDirectoryCopyLink`: specifies directories that need to be copied
  into a shadow directory named: `placebo_node_dirs` and creates symlinks to the
  shadow directories in the `node_modules/` folder. This is useful for
  installing directory dependencies from arbitrary locations.

In the deployment procedure of an NPM project, we should run the following
command before we intend to run `npm install`:

```bash
$ placebo-npm package-placebo.json
```

The above command will install all dependencies in their correct locations in
the `node_modules/` tree, while obtaining the sources from the
`package-placebo.json` file.

Finally, if we run the following command:

```bash
$ npm install --offline
```

NPM will no longer install any dependencies, because they are already present,
but it will still perform its build management tasks.

Integrations
============
Although this tool may be useful for manually configuring dependencies and
composing a `package-placebo.json` file, it is often more useful when it is
combined with an external package manager in the construction of a package from
an NPM project.

The package manager should process a project's `package-lock.json` file, obtain
all its dependencies and generate the corresponding `package-placebo.json` file
with the locations where the downloaded files have been stored.

Finally, the package manager can execute `npm install` to perform any required
build management task.

License
=======
This package is [MIT licensed](http://opensource.org/licenses/MIT)
