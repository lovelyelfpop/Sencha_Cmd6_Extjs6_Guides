# sencha


## sencha ant

Invokes the embedded version of Apache Ant providing the `cmd.dir` property to
access Sencha Cmd using the following `taskdef`:

    <taskdef resource="com/sencha/ant/antlib.xml"
             classpath="${cmd.dir}/sencha.jar"
             loaderref="senchaloader"/>

This command recognizes the `-Dproperty=value` syntax for properties used by
Ant, even though this does not conform to normal Sencha Cmd parameter syntax.
Similar to directly invoking Ant, this command defaults to `"build.xml"` for
the script file basing its search on the current directory or the value of the
`-cwd` switch passed to `sencha`.

For example, the following command uses `"../build.xml"` as the script and
passes in the `foo` property as "42" when executing the default target (since
no target was specified).

    sencha -cwd=.. ant -Dfoo=42


### Options
  * `--debug`, `-d` - Enables Ant debug level messages
  * `--file`, `-f` - The Ant file to execute (default is build.xml)
  * `--props`, `-p` - One or more properties for the Ant script (name=value,...)
  * `--target`, `-t` - The target(s) to execute from the Ant script (comma separated)
  * `--verbose`, `-v` - Enables Ant verbose level messages

### Syntax

    sencha ant [options] targets...

### Where:

  * `targets` - The Ant script targets to execute


## sencha app

This category contains various commands for application management.


### Commands
  * `build` - Executes the build process for an application
  * `clean` - Cleans the application for a build
  * `emulate` - Builds the application via a Packager then executes in the simulator/emulator
  * `explain` - Resolves a reference path from the application's entry file to the specified symbol
  * `prepare` - Builds the application then the Packager prepares the app for native build (cordova only)
  * `publish` - Publishes an application version to Sencha Space.
  * `refresh` - Updates the application metadata (aka "bootstrap") file
  * `run` - Builds the application via a Packager then executes the on a device
  * `upgrade` - Upgrade the current application to the specified SDK
  * `watch` - Watches an application for file system changes and rebuilds.

## sencha app build

This command builds the current application.

    sencha app build [production|testing|native|package]

This will build your application in its current configuration and generate the
build output in the `"build/<environment>"` folder. This location and many
other properties can be configured in your application's configuration file
`".sencha/app/sencha.cfg"` or the provided build script `"build.xml"`.

For locally overriding build properties, the build script loads an optional
properties file called `"local.properties"` if present in your app folder. The
purpose of this file is to define build properties that are in some way special
to the local environment (that is, the local machine). As such, this file is
not intended to be tracked in source control.

#### Using Ant

This command is equivalent to running the provided Ant script directly using
the following command:

    sencha ant [production|testing|native|package] build

To tune the process, start by looking at the generated `"build.xml"` in your
app folder. The actual build logic is located in `".sencha/app/build-impl.xml"`.

The `"build.xml"` script can be used by many Continuous Integration (CI) systems
if they understand Apache Ant (most do). If not, the Sencha Cmd command line
can be used as you would during development. If the CI system understands Ant,
however, it is often more convenient to use that integration rather than using
a command line invocation.


### Options
  * `--archive`, `-a` - The directory path where all previous builds were stored.
  * `--build`, `-build` - Selects the name of the build specified in the 'builds' app.json set to use for the build
  * `--clean`, `-c` - Remove previous build output prior to executing build
  * `--destination`, `-des` - The directory to which the build output is written
  * `--development`, `-dev` - Sets the build environment to: development
  * `--environment`, `-e` - The build environment, either 'development', 'testing' or 'production'
  * `--locale`, `-l` - Selects the app.locale setting to use for the build
  * `--production`, `-pr` - Sets the build environment to: production
  * `--run`, `-r` - Enables automatically running builds with the native packager
  * `--testing`, `-te` - Sets the build environment to: testing
  * `--theme`, `-th` - Selects the app.theme setting to use for the build

### Syntax

    sencha app build [options] [theme|locale|build]... [environment]

## sencha app clean



### Syntax

    sencha app clean [theme|locale|build]...

## sencha app emulate



### Options
  * `--archive`, `-a` - The directory path where all previous builds were stored.
  * `--build`, `-build` - Selects the name of the build specified in the 'builds' app.json set to use for the build
  * `--clean`, `-c` - Remove previous build output prior to executing build
  * `--destination`, `-des` - The directory to which the build output is written
  * `--development`, `-dev` - Sets the build environment to: development
  * `--environment`, `-e` - The build environment, either 'development', 'testing' or 'production'
  * `--locale`, `-l` - Selects the app.locale setting to use for the build
  * `--production`, `-pr` - Sets the build environment to: production
  * `--run`, `-r` - Enables automatically running builds with the native packager
  * `--testing`, `-te` - Sets the build environment to: testing
  * `--theme`, `-th` - Selects the app.theme setting to use for the build

### Syntax

    sencha app emulate [options] [theme|locale|build]... [environment]

## sencha app explain



### Options
  * `--build`, `-build` - Selects the name of the build specified in the 'builds' app.json set to use for the build
  * `--development`, `-d` - Sets the build environment to: development
  * `--environment`, `-e` - The build environment, either 'development', 'testing' or 'production'
  * `--locale`, `-l` - Selects the app.locale setting to use for the build
  * `--production`, `-pr` - Sets the build environment to: production
  * `--target-name`, `-ta` - The target symbol name to use when resolving the reference path
  * `--testing`, `-te` - Sets the build environment to: testing
  * `--theme`, `-th` - Selects the app.theme setting to use for the build

### Syntax

    sencha app explain [options] [theme|locale|build]... [targetName]

## sencha app prepare



### Options
  * `--archive`, `-a` - The directory path where all previous builds were stored.
  * `--build`, `-build` - Selects the name of the build specified in the 'builds' app.json set to use for the build
  * `--clean`, `-c` - Remove previous build output prior to executing build
  * `--destination`, `-des` - The directory to which the build output is written
  * `--development`, `-dev` - Sets the build environment to: development
  * `--environment`, `-e` - The build environment, either 'development', 'testing' or 'production'
  * `--locale`, `-l` - Selects the app.locale setting to use for the build
  * `--production`, `-pr` - Sets the build environment to: production
  * `--run`, `-r` - Enables automatically running builds with the native packager
  * `--testing`, `-te` - Sets the build environment to: testing
  * `--theme`, `-th` - Selects the app.theme setting to use for the build

### Syntax

    sencha app prepare [options] [theme|locale|build]... [environment]

## sencha app publish

This command will publish the contents of the application's build directory as a new
version of a Sencha Space application using `sencha space version create`.

Configuration for this command should be provided by the `space` key in `app.json`:

    "space": {
        "id": 12345,
        "host": "https://api.space.sencha.com/json.rpc",
        "file": "${app.output.base}",

        "apiKey": "...",
        "secret": "..."
    }

It is **not recommended** to store the `apiKey` or `secret` in `app.json` but instead to
store them in a file local to this machine (such as ~/.sencha/cmd/sencha.cfg). For
example:

    app.space.apiKey=...
    app.space.secret=...

This will avoid placing credentials in a shared source repository.


### Options
  * `--archive`, `-a` - The directory path where all previous builds were stored.
  * `--build`, `-build` - Selects the name of the build specified in the 'builds' app.json set to use for the build
  * `--clean`, `-c` - Remove previous build output prior to executing build
  * `--destination`, `-des` - The directory to which the build output is written
  * `--development`, `-dev` - Sets the build environment to: development
  * `--environment`, `-e` - The build environment, either 'development', 'testing' or 'production'
  * `--locale`, `-l` - Selects the app.locale setting to use for the build
  * `--production`, `-pr` - Sets the build environment to: production
  * `--run`, `-r` - Enables automatically running builds with the native packager
  * `--testing`, `-te` - Sets the build environment to: testing
  * `--theme`, `-th` - Selects the app.theme setting to use for the build

### Syntax

    sencha app publish [options] [theme|locale|build]... [environment]

## sencha app refresh

This command regenerates the metadata file containing "bootstrap" data for the
dynamic loader and class system.

This must be done any time a class is added, renamed or removed.

This command can also update any required packages if you have added package
requirements to your application. To refresh required packages (which may
download those packages from remote repositories), do this:

    sencha app refresh --packages

The additional parameters are seldom used.


### Options
  * `--base-path`, `-ba` - The base path to use to calculate relative path information. Defaults to index.html directory
  * `--build`, `-build` - Selects the name of the build specified in the 'builds' app.json set to use for the build
  * `--development`, `-d` - Sets the build environment to: development
  * `--environment`, `-e` - The build environment, either 'development', 'testing' or 'production'
  * `--locale`, `-l` - Selects the app.locale setting to use for the build
  * `--metadata-file`, `-m` - The output filename for the js file containing the manifest metadata
  * `--packages`, `-pac` - Update required packages from remote repositories
  * `--production`, `-pr` - Sets the build environment to: production
  * `--testing`, `-te` - Sets the build environment to: testing
  * `--theme`, `-th` - Selects the app.theme setting to use for the build

### Syntax

    sencha app refresh [options] [theme|locale|build]... [metadata-file]

## sencha app run



### Options
  * `--archive`, `-a` - The directory path where all previous builds were stored.
  * `--build`, `-build` - Selects the name of the build specified in the 'builds' app.json set to use for the build
  * `--clean`, `-c` - Remove previous build output prior to executing build
  * `--destination`, `-des` - The directory to which the build output is written
  * `--development`, `-dev` - Sets the build environment to: development
  * `--environment`, `-e` - The build environment, either 'development', 'testing' or 'production'
  * `--locale`, `-l` - Selects the app.locale setting to use for the build
  * `--production`, `-pr` - Sets the build environment to: production
  * `--run`, `-r` - Enables automatically running builds with the native packager
  * `--testing`, `-te` - Sets the build environment to: testing
  * `--theme`, `-th` - Selects the app.theme setting to use for the build

### Syntax

    sencha app run [options] [theme|locale|build]... [environment]

## sencha app upgrade

This command upgrades the current application (based on current directory) to a
specified new framework.

    sencha app upgrade /path/to/sdk
    
To download and extract an appropriate framework from the Sencha package
repository, the framework may also be specified by name:

    sencha app upgrade -ext

or by name and version, separated by an '@' character:

    sencha app upgrade -ext@5.0.0.647

NOTE: This will upgrade the framework used by the current application in the
current workspace. This will effect any other applications in this workspace
using the same framework (i.e., "ext" or "touch").

To upgrade just the generate scaffolding of your application to a new version
of Sencha Cmd and not the framework in use, either omit the path to the 
framework:

    sencha app upgrade
    
or use the --noframework option:

    sencha app upgrade --noframework


### Options
  * `--backup`, `-b` - Make a backup of application before upgrade
  * `--noappjs`, `-noa` - Disable upgrade of app.js
  * `--noframework`, `-nof` - Upgrade only the Sencha Cmd scaffolding and not the SDK
  * `--path`, `-p` - The path to the framework to which to upgrade

### Syntax

    sencha app upgrade [options] [path]

## sencha app watch

This command watches the current application's source code for changes and
and rebuild the necessary outputs to support "dev mode".

    sencha app watch
    
This will run an initial pass over the ant targets specified by the
build.trigger.targets ant property. During this pass, the compiler will 
be instrumented to capture the files used as inputs for the build
(JavaScript, Sass and page resources).

A subset of Ant build targets will be re-triggered each time a file in one
if the directories being monitored is created, deleted, or modified. 

A web server is automatically started and hosts the application at the
default port of 1841.

The high-level logic of the watch process is implemented in Ant. For 
details, see `".sencha/app/watch-impl.xml."`.
    
For information regarding the set of available Ant properties that
control the the watch process, see `".sencha/app/defaults.properties"`.


### Syntax

    sencha app watch [theme|locale|build]...

## sencha audit

This command scans the local file system starting at the current directory and
reports on the instances of Ext JS and their license.

For example:

    sencha audit

This searches for folders containing "ext-all.js" and the license shipped with
the product. Versions prior to 4.0.2 did not contain the license text in this
file but did ship with a separate "license.txt" file. If these files have not
been preserved then this report may be incomplete.


### Syntax

    sencha audit Object[]...

## sencha build

This command is used to execute a legacy JSB-based build.

**NOTE** - Sencha Cmd applications use `sencha app build` instead of this command.


### Options
  * `--deploy-dir`, `-d` - The directory into which the all-classes.js file will be generated
  * `--nocompress`, `-n` - Disable compression for this build
  * `--project-file`, `-p` - The jsb that contains all your project files

### Syntax

    sencha build [options] 

## sencha compile

This command category provides JavaScript compilation commands. The `compile`
category maintains compilation state across its sub-commands so using `and` to
connect sub-commands can provide significant time savings compared to making
repeated calls.


### Options
  * `--classpath`, `-cl` - Add one or more folders to the classpath
  * `--debug`, `-d` - Enable the debug option for the js directive parser
  * `--ignore`, `-ig` - Ignore files in the classpath with names containing substrings (comma separated)
  * `--options`, `-o` - Sets options for the js directive parser (name:value,...)
  * `--prefix`, `-p` - The file with header or license prefix to remove from source files
  * `--temp-directory`, `-t` - controls the temp directory root location used by page and app commands

### Commands
  * `concatenate` - Produce output file by concatenating the files in the current set
  * `exclude` - Exclude files from the current set matching given criteria
  * `explain` - Resolves a reference chain (if available) between two source files
  * `include` - Add files to the current set matching given criteria
  * `intersect` - Intersect specified saved sets to produce a new set
  * `metadata` - Generates information about the classes and files in the classpath
  * `page` - Compiles the content of a page of markup (html, jsp, php, etc)
  * `pop` - Pops the current set back to the most recently pushed set from the stack
  * `push` - Pushes the current set on to a stack for later pop to restore the current set
  * `require` - Adds external file to file reference information to the js compile context
  * `restore` - Restores the enabled set of files from a previously saved set
  * `save` - Stores the currently enabled set of files by a given name
  * `show-ignored` - Shows any files being ignored in the classpath
  * `union` - Similar to include but selects only the files that match the given criteria

## sencha compile concatenate

This command writes the current set to the specified output file.


### Options
  * `--append`, `-a` - Appends output to output file instead of overwriting output file
  * `--beautify`, `-b` - enables / disables beautification of sources after compilation
  * `--closure`, `-cl` - Compress generate file using Closure Compiler
  * `--compress`, `-co` - Compress generated file using default compressor (YUI)
  * `--output-file`, `-ou` - The output file name (or $ for stdout)
  * `--remove-text-references`, `-remove-t` - enables / disables reference optimization by converting string classnames to static references
  * `--strip-comments`, `-st` - Strip comments from the generated file
  * `--yui`, `-y` - Compress generated file using YUI Compressor

### Syntax

    sencha compile concatenate [options] output-file

## sencha compile exclude

This command removes from the current set any files matching the criteria.


### Options
  * `--all`, `-a` - Select all files in global cache (ignores other options)
  * `--class`, `-c` - Selects files according to the specified class names
  * `--file`, `-f` - Selects the specified file names (supports glob patterns)
  * `--include-uses`, `-i` - Enables / disables inclusion of 'uses' dependencies in transitive scan (-recursive)
  * `--namespace`, `-na` - Selects all files with class definitions in the given namespace(s)
  * `--not`, `-no` - Inverts the matching criteria
  * `--recursive`, `-r` - Enable traversal of dependency relationships when selecting files
  * `--set`, `-s` - Selects files from on a previously saved set (ignores other options)
  * `--tag`, `-t` - Selects all files with the specified '//@tag' values

### Syntax

    sencha compile exclude [options] 

## sencha compile explain



### Options
  * `--start-name`, `-s` - Sets the name of the symbol to use as the starting point of the reference path.
  * `--target-name`, `-t` - Sets the name of the symbol to use as the end point of the reference path.

### Syntax

    sencha compile explain [options] startName \
                                     targetName

## sencha compile include

This command adds the files matching the criteria to the current set.


### Options
  * `--all`, `-a` - Select all files in global cache (ignores other options)
  * `--class`, `-c` - Selects files according to the specified class names
  * `--file`, `-f` - Selects the specified file names (supports glob patterns)
  * `--include-uses`, `-i` - Enables / disables inclusion of 'uses' dependencies in transitive scan (-recursive)
  * `--namespace`, `-na` - Selects all files with class definitions in the given namespace(s)
  * `--not`, `-no` - Inverts the matching criteria
  * `--recursive`, `-r` - Enable traversal of dependency relationships when selecting files
  * `--set`, `-s` - Selects files from on a previously saved set (ignores other options)
  * `--tag`, `-t` - Selects all files with the specified '//@tag' values

### Syntax

    sencha compile include [options] 

## sencha compile intersect

This command produces as in the current set the files that are contained in all
of the specified input sets. Alternatively, this command can include files that
are present in a certain minimum number of sets.

This command only operates on saved sets (unlike most other set operations).


### Options
  * `--min-match`, `-m` - The minimum number of sets containing a file to cause a match (-1 = all)
  * `--name`, `-n` - The name by which to save the intersection as a set
  * `--sets`, `-s` - The sets to include in the intersection

### Syntax

    sencha compile intersect [options] 

## sencha compile metadata

This command generates various forms of metadata extracted from the current set
of files. This data can be exported in various formats (e.g., JSON or JSONP).


### Options

#### Data Type
Choose one of the following options

  * `--alias`, `-ali` - Generate class name to alias information
  * `--alternates`, `-alt` - Generate class alternate name information
  * `--definitions`, `-d` - Generate symbol information
  * `--filenames`, `-f` - Generate source file name information
  * `--loader-paths`, `-l` - Generate dynamic loader path information
  * `--manifest`, `-m` - Generate a class definition manifest file
  * `--packages`, `-p` - Generate the list of required packages

#### Format
Choose one of the following options

  * `--json`, `-json` - Generate data in JSON format
  * `--jsonp`, `-jsonp` - Generate data in JSONP format using the given function
  * `--tpl`, `-t` - The line template for generating filenames as text (e.g. <script src="{0}"></script>)

#### Misc

  * `--append`, `-ap` - Appends output to output file instead of overwriting output file
  * `--base-path`, `-ba` - Set the base path for relative path references
  * `--boot-relative`, `-bo` - Indicates paths are relative to the bootstrap file
  * `--exclude-disabled`, `-e` - Indicates only enabled js source files should be processed
  * `--info-type`, `-i` - Selects the info type to operate on for this metadata command.
    Supported Values:
    * Alias : Class name to alias information
    * Alternates : Alternate class name information
    * Filenames : File name information for currently selected source files
    * LoaderPaths : Path configurations for the dynamic loader (Ext.Loader)
    * Manifest : Class definition manifest information
    * Definitions : Symbol information
    * Packages : Required packages and produces package name / version info
    * LoadOrder : Load order metadata for the class Loader
    * PackageManifest : Manifest of all package requirements
    * AppManifest : App manifest to be consumed by the v5 microloader
    * Dependencies : File to file dependency data

  * `--output-file`, `-o` - The output file name (or $ for stdout)
  * `--separator`, `-s` - The delimiter character used to separate multiple templates

### Syntax

    sencha compile metadata [options] 

## sencha compile page

This command processes a markup file as input and generates an output file with
certain sections rewritten.

If the `-name` option is specified, the dependency graph of all required files
is saved as a file set with that name (see also the `save` command).

If the `-name` option is not specified, all required files are instead written
to the "all-classes.js" file.


### Options
  * `--append`, `-ap` - Appends output to output file instead of overwriting output file
  * `--beautify`, `-b` - enables / disables beautification of sources after compilation
  * `--classes-file`, `-cla` - the name of the js file containing the concatenated output
  * `--closure`, `-clo` - Compress generate file using Closure Compiler
  * `--compress`, `-co` - Compress generated file using default compressor (YUI)
  * `--input-file`, `-i` - the html page to process
  * `--name`, `-n` - sets a reference name for the page
  * `--output-page`, `-ou` - the output html page
  * `--remove-text-references`, `-remove-t` - enables / disables reference optimization by converting string classnames to static references
  * `--scripts`, `-sc` - inject the given script path into the generated markup ahead of the all classes file
  * `--strip-comments`, `-str` - Strip comments from the generated file
  * `--yui`, `-y` - Compress generated file using YUI Compressor

### Syntax

    sencha compile page [options] output-page

## sencha compile pop

This command restores the current set of files from the "stack". This state was
previously put on the "stack" using the `push` command.

    sencha compile ... \
                and push \
                and ... \
                and pop
                and ...

Between the `push` and `pop` commands the current file set can be adjusted as
needed and then restored for subsequent commands.


### Syntax

    sencha compile pop 

## sencha compile push

This command saves the current set of files on a "stack" to easily save and
restore state.

    sencha compile ... \
                and push \
                and ... \
                and pop
                and ...

Between the `push` and `pop` commands the current file set can be adjusted as
needed and then restored for subsequent commands.


### Syntax

    sencha compile push 

## sencha compile require



### Options
  * `--allow-unmet-dependencies`, `-a` - Allows this requirement to produce no resulting file-to-file dependencies
  * `--file-name`, `-f` - Indicates that the name specified by the -source argument is a single file path.
  * `--requires`, `-r` - The name being required by the files denoted by the -source argument.
  * `--source-name`, `-so` - The set of files (class, @tag, or file) on which to add the requirement.
  * `--uses`, `-u` - Indicates that this reference is a 'uses' level reference.

### Syntax

    sencha compile require [options] 

## sencha compile restore



### Syntax

    sencha compile restore String

## sencha compile save



### Syntax

    sencha compile save String

## sencha compile show-ignored

Displays a list of all files found in the `classpath` but matching an `-ignore`
criteria.


### Syntax

    sencha compile show-ignored 

## sencha compile union

This command adds files matching the criteria to the current set. This is
similar to the `include` command except that this command first removes all
files from the current set. In other words, this command makes the current set
equal to only those files that match the criteria.


### Options
  * `--all`, `-a` - Select all files in global cache (ignores other options)
  * `--class`, `-c` - Selects files according to the specified class names
  * `--file`, `-f` - Selects the specified file names (supports glob patterns)
  * `--include-uses`, `-i` - Enables / disables inclusion of 'uses' dependencies in transitive scan (-recursive)
  * `--namespace`, `-na` - Selects all files with class definitions in the given namespace(s)
  * `--not`, `-no` - Inverts the matching criteria
  * `--recursive`, `-r` - Enable traversal of dependency relationships when selecting files
  * `--set`, `-s` - Selects files from on a previously saved set (ignores other options)
  * `--tag`, `-t` - Selects all files with the specified '//@tag' values

### Syntax

    sencha compile union [options] 

## sencha config

This command can be used to either set configuration options singly or load a
configuration file to set multiple options.

Because these configuration options are only held for the current execution of
Sencha Cmd, you will almost always use `then` to chain commands that will now
be executed with the modified configuration.

For example, to change the theme of an Ext JS application for a build:

    sencha config -prop app.theme=ext-theme-neptune then app build

Multiple properties can be loaded from a properties file:

    sencha config -file neptune.properties then app build

The content of `"neptune.properties"` might be something like this:

    app.theme=ext-theme-neptune
    app.build.dir=${app.dir}/build/neptune

In this case, an alternative would be to set `app.dir` in the applications's
`"sencha.cfg"` file like so:

    app.build.dir=${app.dir}/build/${app.theme}


### Options
  * `--file`, `-f` - The properties file to load
  * `--prop`, `-p` - One or more property names and values to set

### Syntax

    sencha config [options] 

## sencha cordova

This command will be deprecated in a future version of CMD. Please see information on setting up a multi-build via app.json instead of running these commands.

Sencha Cmd works together with the Cordova CLI to package your application for native platforms.

    // Initialize Cordova Support 
    sencha cordova init {APP_ID} {APP_NAME}

    // Build the application and attempt to run it on a Device or in the Emulator
    sencha app build -run native

For more information on using Sencha Cmd with Cordova, consult the guides found here:

http://docs.sencha.com/touch/2.3.0/#!/guide/cordova


### Commands
  * `init` - Adds Cordova support to your application

## sencha cordova init

This will add Cordova CLI support to your application. Cordova CLI support will
allow for native application building locally for multiple platforms.  

    sencha cordova init {APP_ID} {APP_NAME}

{APP_ID} is optional and contains the Application ID used in the native app. This
will default to foo.bar.{APP_NAME}

{APP_NAME} is optional and contains the Application Name used in the native app. This
will default to the name of your sencha touch application.

For more information on using Sencha Cmd with Cordova, consult the guides found here:

http://docs.sencha.com/touch/2.3.0/#!/guide/cordova

### Syntax

    sencha cordova init Object[]...

## sencha diag

This command category allows you to perform diagnostic operations with Sencha Cmd, useful
to debug problems during the execution of other commands.

### Commands
  * `export` - Generates a zip file that contains metadata about the build environment for diagnostic purposes
  * `show-props` - Show configuration and environment properties

## sencha diag export



### Syntax

    sencha diag export 

## sencha diag show-props



### Syntax

    sencha diag show-props 

## sencha fs

This category provides commands for manipulating files.


### Categories
  * `mirror` - Commands for making mirror images for RTL languages

### Commands
  * `concatenate` - Concatenate multiple files into one
  * `difference` - Generates deltas between two files in JSON format
  * `minify` - Minify a JavaScript file
  * `slice` - Generates image slices from a given image directed by a JSON manifest

## sencha fs concatenate

This command combines multiple input files into a single output file.

    sencha fs concat -to=output.js input1.js input2.js input3.js


### Options
  * `--from`, `-f` - List of files to concatenate, comma-separated
  * `--to`, `-t` - The destination file to write concatenated content

### Syntax

    sencha fs concatenate [options] files...

## sencha fs difference

This command produces a delta (or "patch") file between input files.

    sencha fs diff -from=base.js -to=modified.js -delta=patch


### Syntax

    sencha fs difference 

## sencha fs minify

This command produced minified files using various back-end compressors.

    sencha fs minify -yui -from=in.js -to=out.js

    sencha fs minify -closure -from=in.js -to=out.js

The legacy syntax is also supported:

    sencha fs minify -compressor=yuicompressor -from=in.js -to=out.js

    sencha fs minify -compressor=closurecompiler -from=in.js -to=out.js


### Options
  * `--closure`, `-cl` - Enable the Google Closure Compiler
  * `--from`, `-f` - The input js file to minify
  * `--generate-source-map`, `-g` - Enable SourceMap generation (only when used in conjunction with the closure compiler)
  * `--to`, `-t` - The destination filename for minified output.
  * `--yui`, `-y` - Enable the YUI Compressor

### Syntax

    sencha fs minify [options] 

## sencha fs mirror

Commands for create horizontal mirror of images and sprites for RTL locales.

This family of commands is intended for automated production of "derivative"
images based on hand maintained and designed image assets authored in the more
familiar, left-to-right (LTR) form.


### Commands
  * `all` - Horizontally flip a folder of images and sprites based on naming convention
  * `image` - Horizontally flip an image
  * `sprite` - Horizontally flip a "sprite" (multi-cell image)

## sencha fs mirror all

This command creates horizontal mirror images of a folder of images and/or
sprites. This command requires some name consistency in order to differentiate
output files from input files and the geometry of sprites.

Sprites must have a name segment that looks like "4x3" to define its geometry.
This is understood as "columns" x "rows" or, in this example, 4 columns and 3
rows.

The following examples all fit this pattern:

 * tools-2x12.png
 * sprite_12x3.gif
 * some-3x5-sprite.png

The input files and output files are separated by a suffix that must be given.
The output files will be produced from the input files applying the suffix. By
default, the output files are written to the same folder as the input files.
This can be changed by specifying "-out".

For example:

    sencha fs mirror all -r -suffix=-rtl /path/to/images

The above command performs the following:

 * Scans `"/path/to/images"` (and all sub folders due to `-r`) for images.
 * Any image not ending in `"-rtl"` is considered an input file.
 * Any input image with sprite geometry in its name has its cells flipped.
 * Other input images are entirely flipped.
 * The input files are written using their original name plus the suffix.
 * Up-to-date checks are made but can be skipped by passing `-overwrite`.
 * Files are written to `"/path/to/images"`.

By passing the `-format` switch, the format of the output images can be set
to be other than the same format as the original file. For example, one could
convert PNG files to GIF by passing `-format=gif`. This does only basic image
conversion and no advanced image processing. Simple color quantization can be
enabled using `-quantize`.

For example:

    sencha fs mirror all all -format=gif -ext=png -quantize -out=/out/dir \
         -suffix=-rtl /some/pngs

The above command will process all `"png"` images and will write out their
`"gif"` versions (using color quantization) to a different folder.



### Options
  * `--dry-run`, `-d` - When set no images will be saved but all normal work is still done
  * `--extensions`, `-e` - Comma-separated list of image extensions (default is "gif,png")
  * `--format`, `-f` - The image format to write all output files (e.g., "-f=png")
  * `--output-dir`, `-ou` - The output folder for generated images (defaults to input folder)
  * `--overwrite`, `-ov` - Disable up-to-date check and always generate output file
  * `--quantize`, `-q` - Enable basic color quantization (useful with -format=gif)
  * `--recurse`, `-r` - Process the input folder recursively (i.e., include sub-folders)
  * `--suffix`, `-s` - The suffix of output files (e.g., "-rtl")

### Syntax

    sencha fs mirror all [options] File

### Where:

  * `File` - The input folder to process


## sencha fs mirror image

This command create a horizontal mirror image of a given input file.

For example

    sencha fs mirror image foo.png foo-rtl.png

The above command creates `"foo-rtl.png"` from `"foo.png"`.


### Syntax

    sencha fs mirror image File \
                           File

## sencha fs mirror sprite

This command create a horizontal mirror image of the cells in a given sprite.

For example

    sencha fs mirror sprite -rows=2 -cols=4 sprite.png sprite-rtl.png

The above command horizontally flips each cell in the 2x4 sprite `"sprite.png"`
and produces `"sprite-rtl.png"`.

`NOTE`: The number of rows and columns are required.


### Options
  * `--columns`, `-c` - The number of columns in the sprite.
  * `--rows`, `-r` - The number of rows in the sprite.

### Syntax

    sencha fs mirror sprite [options] File \
                                      File

## sencha fs slice

This command performs image slicing and manipulation driven by the contents of
a JSON manifest file. The manifest file contains an array of image area
definitions that further contain a set of "slices" to make.

This file and the corresponding image are typically produced for a Theme as
part of the theme package build. For details on this process, consult this
guide:

http://docs.sencha.com/ext-js/4-2/#!/guide/command_slice


### Options
  * `--format`, `-f` - The image format to save - either "png" or "gif" (the default)
  * `--image`, `-i` - The image to slice
  * `--manifest`, `-m` - The slicer manifest (JSON) file
  * `--out-dir`, `-o` - The root folder to which sliced images are written
  * `--quantized`, `-q` - Enables image quantization (default is true)
  * `--tolerate-conflicts`, `-t` - Tolerate conflicts in slice manifest

### Syntax

    sencha fs slice [options] 

## sencha generate

This category contains code generators used to generate applications as well
as add new classes to the application.

### Commands
  * `app` - Generates a starter application
  * `controller` - Generates a Controller for the current application
  * `form` - Generates a Form for the current application (Sencha Touch Specific)
  * `model` - Generates a Model for the current application
  * `package` - Generates a starter package
  * `profile` - Generates a Profile for the current application (Sencha Touch Specific)
  * `theme` - Generates a theme page for slice operations (Ext JS Specific)
  * `view` - Generates a View for the current application (Ext JS Specific)
  * `workspace` - Initializes a multi-app workspace

## sencha generate app

This command generates an empty application given a name and target folder.

The application can be extended using other `sencha generate` commands (e.g.,
`sencha generate model`).

Other application actions are provided in the `sencha app` category (e.g.,
`sencha app build`).

Sencha Cmd can also automatically download and extract a framework by
specifying the name of the framework as an argument:

    sencha generate app -ext MyAppName ./MyAppPath

This will generate an application using the newest version available
for the specified framework.

For Ext JS 6, by default, this application will be a Universal Application.
To override this and select a particular toolkit, you can use either of
these variations:

    sencha generate app -ext -classic MyAppName ./MyAppPath
    sencha generate app -ext -modern MyAppName ./MyAppPath


### Options
  * `--controller-name`, `-c` - The name of the default Controller
  * `--library`, `-l` - the pre-built library to use (core or all). Default: core
  * `--name`, `-n` - The name of the application to generate
  * `--path`, `-p` - The path for the generated application
  * `--refresh`, `-r` - Set to false to skip the "app refresh" of the generated app
  * `--starter`, `-s` - Overrides the default Starter App template directory
  * `--template`, `-te` - The name of the template to use
  * `--theme-name`, `-th` - The name of the default Theme
  * `--view-name`, `-v` - The name of the default View

### Syntax

    sencha generate app [options] name \
                                  path

## sencha generate controller

This command generates a new Controller and adds it to the current application.


### Options
  * `--name`, `-n` - The name of the Controller to generate

### Syntax

    sencha generate controller [options] name

## sencha generate form

This command generates a new form and adds it to the current application.


### Options
  * `--fields`, `-f` - Comma separated list of "name:type" field pairs
  * `--name`, `-n` - The name of the Form to generate
  * `--xtype`, `-x` - The xtype for the form. Defaults to the lowercase form of the name.

### Syntax

    sencha generate form [options] name \
                                   fields \
                                   [xtype]

## sencha generate model

This command generates a new Model class and adds it to the current application.


### Options
  * `--base`, `-b` - The base class of the Model (default: Ext.data.Model)
  * `--fields`, `-f` - Comma separated list of "name:type" field pairs
  * `--name`, `-n` - The name of the Model

### Syntax

    sencha generate model [options] name \
                                    fields

## sencha generate package

This command generates a new Sencha Cmd Package. A package is in many ways like
an application in that it contains any of the following pieces:

  * JavaScript source
  * SASS styles
  * Arbitrary resources

All of these are integrated by a build process using `sencha package build`.

For example:

    sencha generate package foo

If this command is run from an application directory, the package will be added
automatically to the requires array in the `"app.json"` file. To avoid this use
the `-require` switch:

    sencha generate package -require foo

To use this package in other applications (or packages), you just add the name
of the package to the requires array in the `"app.json"` or `"package.json"`
file:

    requires: [
        'foo'
    ]

All packages reside in the `"./packages"` folder of the workspace (which is
often the same folder as your application).


### Options
  * `--extend`, `-e` - The theme (package) to extend from (For theme type packages on Ext JS 4.2+ only)
  * `--framework`, `-f` - The framework this package will use (i.e., "ext" or "touch")
  * `--name`, `-n` - The name of the package to generate
  * `--require`, `-r` - Whether to automatically add the generated package to the current app (for non-theme packages only)
  * `--theme`, `-th` - The theme (package) this package will use (i.e., "ext-theme-classic", "ext-theme-crisp", "ext-theme-neptune", etc.)
  * `--toolkit`, `-to` - The toolkit this theme will use (For theme type packages on Ext JS 6.x+ only)
  * `--type`, `-ty` - The type of the package to generate (i.e., "code" or "theme")
    Supported Values:
    * CODE : A library of code
    * EXTENSION : An extension to Sencha Cmd
    * FRAMEWORK : A framework
    * THEME : A user interface theme or skin
    * TEMPLATE : A library of one or more templates
    * TOOLKIT : A library of components / widgets
    * LOCALE : Localization overrides / styling
    * OTHER : Unspecified type


### Syntax

    sencha generate package [options] name

## sencha generate profile

This command generates a new Profile and adds it to the current application.

NOTE: Sencha Touch only.


### Options
  * `--name`, `-n` - The name of the Profile to generate

### Syntax

    sencha generate profile [options] name

## sencha generate theme

This command generates a new Theme. For Ext JS 4.1, themes are "owned" by an
application. In Ext JS 4.2 and beyond, themes are Packages.

In Ext JS 4.2, theme packages can extend other themes. By default, generated
themes extend "ext-theme-classic". This can be overridden using `--extend`.

To generate a stand-alone Theme in Ext JS 4.2, follow these steps. Generate a
workspace (with `"ext"` folder) using Ext JS 4.2 SDK unzipped on your system:

    sencha -sdk /path/to/ext-4.2.0 generate workspace MyWorkspace
    cd MyWorkspace

From inside the workspace, use the `"ext"` folder to generate the theme package:

    sencha -sdk ext generate theme --extend ext-theme-neptune MyTheme

The above could equivalently have used the SDK used to create the workspace.

The `-sdk` switch is used here to indicate the framework on which the theme is
based. This is not needed if the command is run from an Ext JS application
folder.

`NOTE:` Does not apply to Sencha Touch.


### Options
  * `--extend`, `-e` - The name of the theme package to extend (Ext JS 4.2+ only)
  * `--name`, `-n` - The name of the Theme to generate
  * `--toolkit`, `-t` - The name of the toolkit this theme applies to (Ext JS 6.x+ only)

### Syntax

    sencha generate theme [options] name

## sencha generate view

This command generates a new View class and adds it to the current application.


### Options
  * `--base-class`, `-b` - Specifies the base class for the view (default: 'Ext.panel.Panel')
  * `--name`, `-n` - The name of the View to generate

### Syntax

    sencha generate view [options] name

## sencha generate workspace

This command generates a workspace for managing shared code across pages or
applications.


### Options
  * `--force`, `-fo` - Forces re-extraction of framework into workspace.
  * `--path`, `-p` - Sets the target path for the workspace

### Syntax

    sencha generate workspace [options] [path]

## sencha help

This command displays help for other commands.

### Example

    sencha help generate app


### Syntax

    sencha help command...

### Where:

  * `command` - The command path for which to display help (e.g., "generate app")


## sencha js

This command loads and executes the specified JavaScript source file or files.

    sencha js file.js[,file2.js,...] [arg1 [arg2 ...] ]

#### Files

The first argument to this command is the file or files to execute. If there
are multiple files, separate them with commas. In addition to the command line
technique of specifying files, this command also recognizes the following
directive:

    //@require ../path/to/source.js

This form of `require` directive uses a relative path based on the file that
contains the directive. Any given file will only be executed once, in much the
same manner as the compiler.

#### Context

A primitive `console` object with the following methods is provided to the
JavaScript execution context:

 * `log`
 * `debug`
 * `info`
 * `warn`
 * `error`
 * `dir`
 * `trace`
 * `time` / `timeEnd`

Arguments beyond the first can be accessed in JavaScript with the global `$args`
array. The current directory can be accessed with `$curdir`.

The Sencha Cmd object can be accessed with `sencha`. This object has a `version`
property and a `dispatch` method.

    if (sencha.version.compareTo('3.0.0.210') < 0) {
        console.warn('Some message');
    } else {
        // dispatch any command provided by Cmd:
        sencha.dispatch([ 'app', 'build', $args[1] ]);
    }

Beyond the above, the executing JavaScript has full access to the JRE using
the `importPackage` and `importClass` methods.

For example:

    importPackage(java.io);

    var f = new File('somefile.txt');  // create a java.io.File object

For further details on the JavaScript engine provided by Java, consult the
Java Scripting guide:

http://docs.oracle.com/javase/6/docs/technotes/guides/scripting/programmer_guide/index.html


### Syntax

    sencha js String \
              String[]...

## sencha manager

This category provides commands for interacting with Sencha Web Application Manager

### Categories
  * `version` - Commands for managing application versions.

## sencha manager version

This category provides commands to manage application versions

### Commands
  * `create` - Create a new application version in Sencha Web Application Manager.

## sencha manager version create

Provisions a new version of a specified application in Sencha Web Application Manager.

This command accepts a path to either a zip file or a directory, and will
publish the content to Sencha Web Application Manager as a new application version.


### Options
  * `--api-key`, `-a` - The API key used to communicate with the Sencha Web Application Manager server.
  * `--file`, `-f` - Path to a zip file or folder to publish as a new application version.
  * `--host`, `-h` - The host URL for the Sencha Space server.
  * `--id`, `-i` - The id of the Sencha Space application.
  * `--name`, `-n` - The name of the version to create.
  * `--secret`, `-s` - The shared secred used to encrypt traffic to the Sencha Web Application Manager server.

### Syntax

    sencha manager version create [options] 

## sencha manifest

This category provides commands to manage application manifests.


### Commands
  * `create` - Generate a list of metadata for all classes found in the given directories

## sencha manifest create

This command generates a list of metadata for all classes.


### Options
  * `--output-path`, `-o` - The file path to write the results to in JSON format.
  * `--path`, `-p` - The directory path(s) that contains all classes

### Syntax

    sencha manifest create [options] output-path

## sencha package

These commands manage packages in the local repository.

These commands are not typically used directly because application requirements
are automatically used by `sencha app build` and `sencha app refresh --packages`
to handle these details.

#### Using Packages

The most common commands needed to use packages are those that connect your
local package repository to remote repositories. By default, the local repo has
one remote repository defined that points at Sencha's package repository.

To add, remove or display these connections see:

    sencha help package repo

#### Authoring Packages

When authoring packages for others to use in their applications, however, these
commands are involved. In particular, you must first initialize your local
package repository. This is because the local repository is automatically
initialized "anonymously". In this state, the local repository can only be used
to retrieve and cache other packages. To create and publish packages, the local
repository must be initialized with a name and an optional email address.

This name is not required to be globally unique, but it is a good idea to use a
name that is unique and meaningful as a package author.

    sencha repository init -name "My Company, Inc."

    sencha repository init -name mySenchaForumId

For details see:

    sencha help repository init


### Commands
  * `add` - Adds a package file (.pkg) to the local repository
  * `build` - Builds the current package
  * `extract` - Extracts the contents of a package to an output folder
  * `get` - Get a package from a remote repository
  * `install` - Installs a Sencha Cmd extension package
  * `list` - Lists packages in the repository
  * `remove` - Removes a package from the local repository
  * `upgrade` - Upgrades the current package

## sencha package add

Adds a new package file (`"*.pkg"`) to the local repository. These packages will
be signed automatically if their `creator` property matches the `name` associated
with the local repository.

Once a package is added to the local repository, any repository that points to
this repository as a remote repository will be able to download the package.

The `sencha package build` process generates an appropriate `".pkg"` file in the
`workspace.build.dir`.


### Syntax

    sencha package add pkgFile

### Where:

  * `pkgFile` - The path to the package file (e.g., path/file.pkg)


## sencha package build

This command invokes the build process for the current package. Similar to an
application and `sencha app build`, this command builds the current package (as
defined by the current folder).

    sencha package build


### Options
  * `--build`, `-build` - Selects the name of the build specified in the 'builds' package.json set to use for the build
  * `--clean`, `-c` - Remove previous build output prior to executing build
  * `--locale`, `-l` - Selects the package.locale setting to use for the build
  * `--theme`, `-t` - Selects the package.theme setting to use for the build

### Syntax

    sencha package build [options] [theme|locale|build]...

## sencha package extract

This command extracts a package or packages from the repository. If necessary
the packages will be downloaded from remote repositories and cached locally for
future use.

`NOTE:` This is `not` typically executed manually but is handle automatically
as part of the build process based on the "requires" found in `"app.json"` and/or
`"package.json"`.

To extract a package named "foo" at version "1.2" to a specified location:

    sencha package extract -todir=/some/path foo@1.2

This will create `"/some/path/foo"`. To recursively extract packages required
by "foo", you would do this:

    sencha package extract -recurse -todir=/some/path foo@1.2

When complete, "foo" and all of its required packages will reside in the folder
specified.

`NOTE:` It is recommended to use `-todir` and allow the package name to be used
as the immediate subdirectory of that folder. The `-outdir` option allows you to
strip off this directory but prevents recursive extraction as a result.


### Options
  * `--clean`, `-c` - Delete any files in the output folder before extracting
  * `--force`, `-f` - Ignore local copy and fetch from remote repository
  * `--outdir`, `-o` - The output folder for the extracted package contents
  * `--recurse`, `-r` - Also get all required packages recursively
  * `--todir`, `-t` - The output folder for the extracted package folder

### Syntax

    sencha package extract [options] packages...

### Where:

  * `packages` - The names/versions of the packages to extract


## sencha package get

This command ensures that a specified package is locally available. This does
`not` extract the package to a particular location, but rather, enables apps or
other packages to get the package from the local repository (that is, without
downloading it).

For example, to ensure that `"foo"` and `"bar"` are available locally:

    sencha package get foo bar

To get all packages required by those specified packages:

    sencha package get -recursive foo bar


### Options
  * `--force`, `-f` - Ignore local copy and (re)fetch from remote repository
  * `--recurse`, `-r` - Also get all required packages recursively

### Syntax

    sencha package get [options] packages...

### Where:

  * `packages` - One or more packages/versions to fetch locally


## sencha package install



### Options
  * `--clean`, `-c` - Delete any files in the output folder before extracting
  * `--force`, `-f` - Ignore local copy and fetch from remote repository

### Syntax

    sencha package install [options] String[]...

### Where:

  * `String[]` - The names/versions of the packages to install


## sencha package list

This command lists packages in the repository. To list available packages
simply execute:

    sencha package list

To list locally available packages (no download required), do this:

    sencha package list .

Otherwise, you can specify the names of package repositories to list:

    sencha package list sencha

The above will list the contents of the Sencha Cmd Package Repository.


### Syntax

    sencha package list names...

### Where:

  * `names` - The repos to list (blank for all, or remote names or "." for local)


## sencha package remove

Removes one or more packages from the local repository.

Removes version 1.2 of the package "foo":

    sencha package remove foo@1.2

Remove all versions of "foo"

    sencha package remove foo@...


### Syntax

    sencha package remove packageNames...

### Where:

  * `packageNames` - One or more packages/versions to remove


## sencha package upgrade

Upgrades the current package to a newer SDK or Sencha Cmd version.

This command must be run from the desired package's folder.


### Syntax

    sencha package upgrade 

## sencha phonegap

This command will be deprecated in a future version of CMD. Please see information on setting up a multi-build via app.json instead of running these commands.

Sencha Cmd works together with the PhoneGap CLI to package your application for native platforms.
PhoneGap CLI allows native application building locally and remotely via PhoneGap Build. You can
find more information on PhoneGap Build here
    
    https://build.phonegap.com/

To add PhoneGap support to your application simply run the following command within your application directory

    // Initialize PhoneGap Support 
    sencha phonegap init {APP_ID} {APP_NAME}

    // Build the application and attempt to run it on a Device or in the Emulator
    sencha app build -run native

For more information on using Sencha Cmd with PhoneGap, consult the guides found here:

http://docs.sencha.com/touch/2.3.0/#!/guide/cordova


### Commands
  * `init` - Adds PhoneGap support to your application

## sencha phonegap init

This will add PhoneGap CLI support to your application. PhoneGap CLI support will
allow for native application building locally and remotely for multiple platforms.  

    sencha phonegap init {APP_ID} {APP_NAME}

{APP_ID} is optional and contains the Application ID used in the native app. This
will default to foo.bar.{APP_NAME}

{APP_NAME} is optional and contains the Application Name used in the native app. This
will default to the name of your sencha touch application.

For more information on using Sencha Cmd with PhoneGap, consult the guides found here:

http://docs.sencha.com/touch/2.3.0/#!/guide/cordova

### Syntax

    sencha phonegap init Object[]...

## sencha repository

These commands manage the local repository and its connections to remote
repositories.

#### Remote Repositories

The primary role of the local repository is as a cache of packages that it
downloads from one or more specified remote repositories. By default, Sencha
Cmd adds the Sencha package repository as a remote repository. Using these
commands you can manage these connections.

This command adds a remote repository connection named `"foo"`:

    sencha repo add foo http://coolstuff.foo/packages

Following this command, any packages contained in this repository will be
available. Typically these packages are used by adding their name (and possibly
version) to your application's `"app.json"` in its `requires` array.

    {
        requires: [
            'cool-package@2.1'
        ]
    }

Then:

    sencha app build

The above addition will require version 2.1 of `"cool-package"`. The remote
repository added above will be checked for this package, and if found, it is
downloaded to the local repository and cached there as well as extracted to
your app's`"packages/cool-package"` folder and automatically integrated in to
your build.

#### Authoring Packages

To author packages for others to use in their applications, you will need to
initialize your local repository with your name:

    sencha repo init -name "My Company, Inc."

See these for more details:

    sencha help package
    sencha help repo init


### Commands
  * `add` - Add a remote repository connection
  * `init` - Initializes the local package repository
  * `list` - List remote repository connections
  * `remove` - Remove a remote repository connection
  * `show` - Show details for a repository
  * `sync` - Clears caches to force refetching for a remote repository

## sencha repository add

Adds a remote repository connection. Once added, packages from that repository
will be available to applications for use.

    sencha repo add foo http://foo.bar/pkgs


### Options
  * `--address`, `-a` - The address (or URL) for the remote repository
  * `--beta`, `-b` - Indicates that this new repository contains beta packages
  * `--name`, `-n` - The name for the remote connection

### Syntax

    sencha repository add [options] name \
                                    address

## sencha repository init

Initializes the local repository. The local repository is used to cache local
copies of packages (potentially for multiple versions).

`NOTE:` This step is not typically necessary because the local repository is
automatically initialized in "anonymous" mode. This command is needed only if
you want to publish packages for others to use in their application. To publish
packages you must initial the local repository and provide a name:

    sencha repository init -name "My Company, Inc." -email me@foo.com

Beyond initializing the repository file structures, this command also generates
a public/private key pair and stores these in the local repository. The private
key is used to sign packages added to this local repository.

For details on adding packages:

    sencha help package add

#### Private Key

Packages added to the local repository with a `creator` property equal to the
name given to `sencha repository init` will be signed using the private key
stored in the local repository.

In this release of Sencha Cmd, these signatures are only used to test package
integrity. You can backup this key if desired, but a new key can be regenerated
by running `sencha repo init` at any time. In future versions it may be more
important to backup your private key.

#### Remote Access

Making the local package repository available as a remote repository for others
to access requires some knowledge of the disk structure of the repository. By
default, Sencha Cmd creates the local repository adjacent to its installation
folder. For example, given the following location of Sencha Cmd:

    /Users/myself/bin/Sencha/Cmd/3.1.0.200/

The local respository is located at:

    /Users/myself/bin/Sencha/Cmd/repo

This is to allow your local repository to be used by newer versions of Sencha
Cmd. The folder to publish to others as an HTTP URL is:

    /Users/myself/bin/Sencha/Cmd/repo/pkgs

`IMPORTANT:` Do `NOT` expose the parent folder of `"pkgs"` - that folder holds
private information (such as your private key). Further, Sencha Cmd will not
recognize the structure as a valid remote repository.

If you want to host the repository on a public server, simply copy the `"pkgs"`
folder to a web server and share the HTTP address.


### Options
  * `--email`, `-em` - The email address for the owner of the local repository
  * `--expiration`, `-ex` - The number of years before the key pair becomes invalid
  * `--keybits`, `-k` - The number of bits for the public/private key pair
  * `--name`, `-n` - The name for the owner of the local repository

### Syntax

    sencha repository init [options] 

## sencha repository list

Lists all remote repository connections.


### Syntax

    sencha repository list 

## sencha repository remove

Remove a remote repository from the local repository's list of remote
repositories. For example, if a remote was previously added:

    sencha repo add foo http://foo.bar/pkgs

This command will remove it:

    sencha repo remove foo

`NOTE:` This command does not remove packages that you may have downloaded from
this remote as they are now cached in the local repository.


### Options
  * `--name`, `-n` - The name for the remote connection

### Syntax

    sencha repository remove [options] name

## sencha repository show

Shows information about a remote repository.

To show information about the local repository:

    sencha repo show .

To show information about a specific remote repository:

    sencha repo show some-remote

The name given should match the name previously given to:

    sencha repo add some-remote ...


### Options
  * `--all`, `-a` - Include all details about the repository

### Syntax

    sencha repository show [options] names...

### Where:

  * `names` - The name(s) of remote repositories (or "." for local)


## sencha repository sync

Forces (re)synchronization with a remote repository catalog. Normally this is
done periodically and does not need to be manually synchronized. This command
may be needed if there something known to have been added to a remote repo but
has not yet shown up in the catalog on this machine.

    sencha repo sync someremote

To resynchronize with all remote repositories:

    sencha repo sync


### Options
  * `--name`, `-n` - The name for the remote connection (blank for all)

### Syntax

    sencha repository sync [options] [name]

## sencha switch

This command allows you to switch between Sencha Cmd versions present in the parent 
directory of the last installed Sencha Cmd.
    
To see a list of locally available versions use the "list" switch, this command will
also show the path where versions are expected to be present:

    sencha switch --list

To switch to the latest locally available version, run the command with no arguments:

    sencha switch
    
To switch to a specific version, pass it as an argument:

    sencha switch {version}

### Options
  * `--list`, `-l` - List the available versions

### Syntax

    sencha switch [options] [version=""]

## sencha template

This category provides commands to work with templates

### Commands
  * `apply` - Apply a template to produce its output
  * `info` - This command displays all available information about a template
  * `list` - This command lists all existing templates in the current workspace
  * `read` - Read a JSON file to supply data for a template

## sencha template apply



### Options
  * `--data`, `-d` - Set a name/value pair (can also use -Dname=value)
  * `--name`, `-n` - The name of the template
  * `--output`, `-o` - The output directory

### Syntax

    sencha template apply [options] name

## sencha template info



### Options
  * `--name`, `-n` - The name of the template

### Syntax

    sencha template info [options] name

## sencha template list



### Syntax

    sencha template list 

## sencha template read



### Options
  * `--name`, `-n` - The name of the JSON file to load

### Syntax

    sencha template read [options] [name]

## sencha theme

This category contains low-level commands for managing themes. Typically these
operations are handled by `sencha app build` and/or `sencha package build`.


### Commands
  * `build` - Builds a custom theme from a given page
  * `capture` - Capture an image and slicer manfiest for a theme
  * `slice` - Generates image slices from a given image directed by a JSON manifest

## sencha theme build

This command will build the specified theme's image sprites.

`IMPORTANT`: This command should only be used for Ext JS 4.1 applications. For
Ext JS 4.2 applications, themes are now `packages` and should be managed using
the `sencha package build` process.


### Options
  * `--environment`, `-en` - The build environment (e.g., production or testing)
  * `--output-path`, `-o` - The destination path for the sliced images
  * `--page`, `-p` - The page to slice
  * `--theme-name`, `-t` - The name of the theme to build

### Syntax

    sencha theme build [options] [theme-name] \
                                 [environment]

## sencha theme capture

This command will capture an image and slice manifest for a specified page.

It is rarely necessary to call this command directly as it is part of the theme
build process. In Ext JS 4.2 applications or theme packages, this command is
called by the build script's `slice` step. In Ext JS 4.1 applications this is
called for each application theme or directly by the 'sencha theme build`
command.

For example, this is roughly the command performed by the `slice` step for a
theme package:

    sencha theme capture -page sass/example/theme.html \
                         -image build/theme-capture.png \
                         -manifest build/theme-capture.json

Once the image and slicer manifest are produced, the `sencha fs slice` command
extracts the background images and sprites required for Internet Explorer.


### Options
  * `--image-file`, `-i` - The output image (e.g. "theme-capture.png")
  * `--manifest`, `-m` - The output slice manifest (e.g. "theme-capture.json")
  * `--page`, `-p` - The page to load for capturing theme contents

### Syntax

    sencha theme capture [options] 

## sencha theme slice

This command performs image slicing and manipulation driven by the contents of
a JSON manifest file. The manifest file contains an array of image area
definitions that further contain a set of "slices" to make.

This file and the corresponding image are typically produced for a Theme as
part of the theme package build. For details on this process, consult this
guide:

http://docs.sencha.com/ext-js/4-2/#!/guide/command_slice


### Options
  * `--format`, `-f` - The image format to save - either "png" or "gif" (the default)
  * `--image`, `-i` - The image to slice
  * `--manifest`, `-m` - The slicer manifest (JSON) file
  * `--out-dir`, `-o` - The root folder to which sliced images are written
  * `--quantized`, `-q` - Enables image quantization (default is true)
  * `--tolerate-conflicts`, `-t` - Tolerate conflicts in slice manifest

### Syntax

    sencha theme slice [options] 

## sencha upgrade

This command downloads and installs the current version of Sencha Cmd. Or you
can specify the version you want to install as part of the command.

The following command downloads and installs the current version of Sencha Cmd:

    sencha upgrade

This command downloads a particular version:

    sencha upgrade 3.0.2.288

If the version requested is the already installed then this command will, by
default, do nothing. This can be forced using `--force`:

    sencha upgrade --force

If the version requested is the version in the `PATH`, the command will exit
with a message saying that the current version cannot be upgraded. In this case
the `--force` option is ignored.


### Options
  * `--beta`, `-b` - Check for the latest beta or RC version (vs stable release)
  * `--check`, `-c` - Only check for an upgrade but do not install it
  * `--force`, `-f` - Force a (re)install even if the version is already installed
  * `--nojre`, `-n` - Windows and Mac only: Use the installer without a bundled JRE (keeps the current JRE in use)
  * `--unattended`, `-u` - Runs installer in silent / unattended mode

### Syntax

    sencha upgrade [options] [version=""]

## sencha web

This category provides commands to manage a simple HTTP file server based on
`Jetty` (see http://www.eclipse.org/jetty/).

The following command is the simplest form:

    sencha web start

This starts the web server on the default port and "mounts" the current
directory as the web root. This command will block the terminal so you can use
CTRL+C to end the process.

If this is started as a background process, you can use this command to stop
the server from another terminal:

    sencha web stop

The port used can be specified on the command line or using the configuration
property `cmd.web.port`. For example:

    sencha web -port 8080 start

And to stop the above:

    sencha web -port 8080 stop

For details on the web root, console help on `sencha web start`:

    sencha help web start

**NOTE:** These are low-level commands that do not relate to the current
application. For applications, consider the `web-start` target using
`sencha ant web-start` and `sencha ant web-stop`.

When using the `sencha app watch` command, a web server will be started 
automatically, so neither the `sencha web start` or `sench ant web-start` 
commands are necessary


### Options
  * `--port`, `-p` - Set the port for the web server

### Commands
  * `start` - Starts a static file Web Server on a port
  * `stop` - Stops the local web server on the specific port

## sencha web start

This command starts the Web server and routes requests to the specified files.
For example:

    sencha web start

This will "mount" the current directory as the web root at the default port.
The port can be specified if needed:

    sencha web -port 8000 start

To stop the server, press CTRL+C or you can use these commands (from another
terminal), respectively:

    sencha web stop

    sencha web -port 8000 stop

#### The Web Root

By default, `sencha web start` mounts the current directory so that all files
and folders are available at the root of the web server's URL. Sometimes you
may need to connect various folders into a common web root. To do this, use
the `-map` switch like so:

    sencha web start -map foo=/path/to/foo,bar=/another/path

Given the above, the following URL entered in a browser will display the files
in `"/path/to/foo"`:

    http://localhost:8000/foo

And this URL will display the files in `"/another/path"`:

    http://localhost:8000/bar

For more details regarding the `Sencha Cmd` web server, run this command:

    sencha help web

*NOTE:* These are low-level commands that do not relate to the current
application. For applications, consider the `web-start` target using
`sencha ant web-start` and `sencha ant web-stop`.


### Options
  * `--cmd-mount`, `-c` - Enables mapping the cmd install dir as /~cmd.
  * `--mappings`, `-m` - List of local folders (ex: [sub=]/path/to/folder)

### Syntax

    sencha web start [options] 

## sencha web stop

This command stops the Web server previously started by `sencha web start`.

If the server was started with this command:

    sencha web start

This command will stop that server:

    sencha web stop

If you are using a custom port, these must match. For example:

    sencha web -port 8000 start

From another terminal or console, this will stop the server:

    sencha web -port 8000 stop

*NOTE:* These are low-level commands that do not relate to the current
application. For applications, consider the `web-start` target using
`sencha ant web-start` and `sencha ant web-stop`.


### Syntax

    sencha web stop 

## sencha which

This command display the location of Sencha Cmd.

    sencha which
    C:\Users\Me\bin\Sencha\Cmd\3.1.0.220


### Options
  * `--output`, `-o` - Name of an output property file to write the location as a property
  * `--property`, `-p` - Name of the property to write to the output property file for the location

### Syntax

    sencha which [options] 
