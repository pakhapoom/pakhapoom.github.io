---
title: Linux basics
date: 2023-05-28 13:00:00 +0700
categories: [linux, hands-on]
tags: [linux, linux commands]
math: true
mermaid: true
img_path: /linux/basics/
render_with_liquid: false
---

This is my note from the course: [Hands-on Introduction to Linux Commands and Shell Scripting](https://www.coursera.org/learn/hands-on-introduction-to-linux-commands-and-shell-scripting).

## Operating system (OS)
* manage computer hardware and resources.
* allow interaction with hardware to performa tasks.
* Unix: a family of OS, such as Oracle Solaris, FreeBSD, HP-UX, IBM AIX, and Apple MacOS.
* Linux: a family of Unix-like OS which is
    * free and opensource.
    * secured.
    * portable.
    * multi-tasking.

## Brief history of Linux
* 1980s: GNU
* 1991: Linux kernel
* 1992: Linux OS
* 1996: Tux
* Nowadays, it is used in android, supercomputers, data centers, and cloud services.

## High-level architecture
* application: software that performs a task, such as
    * system daemons
    * shells
    * user apps
    * tools
* operating system
    * control projects and programs vital to health and stability.
    * assign hardware to user.
    * help detect errors and prevent failures.
    * perform file management tasks.
* kernel: lowest-level software in the system.
    * start on boot and remain in memory.
    * bridge between apps and hardware.
    * be responsible for memory mangement, process management, device drivers, system calls and security.
* hardware: physical electronic devices on PC.
    * Central processing unit (CPU): execute calculations.
    * Random access memory (RAM): store temporary memory that an application needs to run.
    * Storage
    * Screen
    * USB devices

## Linux file system
* a collection of files in a machine.
* begins at root directory (`/`).
* provides tree-like structure.
* directory examples are as follows.
    * `/bin`: user binary files.
    * `/usr`: user program.
    * `/home`: working directory.
    * `/boot`: sustem boot.
    * `/media`: temporary storage, such as CD, USB drive.

## Linux distribution (Distro)
* specific flavor of Linux OS.
* each distro has its own unique functionality that may be different in terms of
    * system utilities.
    * GUI.
    * shell commands.
    * support types (community/enterprise, long-term support (LTS)/rolling release).
* some distro examples are Debian, Ubuntu, Red hat, Fedora, SUSE Enterprise (SLE), and Arch.

## Linux shell
* shell is an OS-level application that interprets commands, such as
    * move and copy files.
    * write and read files.
    * export and filter data.
    * search for data.
* examples of shell are `bash` and `zsh`.

## Linux terminal
* application that interacts with Linux shell.
* user enters commands and receives output from them.
* user -> terminal -> shell (kernel) -> hardware.
* displayed as a command line containing
    * current working directory.
    * `$` as a separator.
    * command prompt.

```bash
/home/Documents $ <command prompt>
```

## Special paths
* `~`: home directory.
* `/`: root directory.
* `..`: parent of current directory.
* `.`: current directory.

> Tips for more productivity.
* Tab completion: autocomplete a command or path.
* Command history: press up/down arrow key to switch to the next/previous command.
{: .prompt-info}

## Text editors
* Command-line text editors
    * GNU nano: `nano <filename>` 
        * use `ctrl` + `key` as a shortcut.
    * vi
    * vim: `vim <filename>`
        * press `i` to enter insert mode.
        * press `ESC` to exit insert mode.
        * all changes is stored in text buffer.
        * in command mode, use 
            * `:w` to write the buffer to the file.
            * `:q` to quit `vim`.
            * `:q!` to quit without saving the file.

* GUI-based text editors
    * gedit (pronouced as "g-edit")
    * emacs (both cli and gui)

## Example use case of `nano`
* `cd ~`: change directory to home directory.
* `nano example.py`: access a file or create a file if it does not exist.
* `print("Hello World!")`: type a classic command in the editor.
* press `ctrl` + `x` to exit.
* press `y` to confirm overwriting.
* press `enter` to confirm filename.
* `python3 example.py`: execute the python file.

## Packages
* archive files of software updates and software installation.
* there are two major kinds of packages, which are
    * deb files: for Debian-based distros.
    * rpm files: for Red hat-based distros.

```bash
# converting rpm to deb
alien <package name>.rpm

# converting deb to rpm
alien -r <package name>.deb
```

## Package managers
* manage the download nad installation of packages.
    * `apt`: for deb-based Linux.
    * `yum`: for rpm-based Linux.

```bash
# fetch all updates to find if any packages can be upgraded.
sudo apt update

# upgrade all updates.
sudo apt upgrade
sudo apt upgrade <package name>

# install a package.
sudo apt install <package name>

# note: replace `apt` with `yum` when working with rpm-based Linux.
```

## Shell
* user interface for running commands.
* can be both interactive and scripting langauges.
* default is `bash` (Bourne again shell).
* other available shells are `sh`, `ksh`, `tcsh`, `zsh`, and `fish`.
* `printenv SHELL`: return a path to default shell.
* `bash`: switch the shell to `bash`.

### Getting information

| Command | Description |
|---------|:------------|
| `whoami` | username |
| `id` | user id and group id |
| `id -u` | numerical user id |
| `id -u -n` | username |
| `uname` | operating system name |
| `uname -a` | all information |
| `uname -r` | kernel version |
| `uname -s -r` | OS name and version |
| `uname -v` | version infomration |
| `ps` | running prosesses |
| `ps -u root` | shows running processes in root owned by the current user |
| `ps -e ` | shows all running processes |
| `top` | resource usage, press `q` or `ctrl` + `c` to exit |
| `top -n 3` | shows the first 3 running tasks and thier resource usage |
| `top -3` | shows the first 3 running tasks and thier resource usage |
| `df` | mounted file system |
| `df -h` | make output human-readable |
| `man <command>` | reference manual |
| `<command> --help` | reference manual |
| `date` | today's date |
| `date -r <file>` | access datetime of the modified date of `file` |
| `date "+%j day of %Y"` | print date of the format `112 day of 2023` |

#### `top` (table of processes)
when `top` is running, press the following keys to sort the results
* `M`: Memory usage.
* `P`: CPU usage.
* `N`: Process ID (PID).
* `T`: Running time

#### Date format in `date`
* `"+%D"`: show date in `mm/dd/yy`.
* `%d`: day of month (from `01` to `31`).
* `%h`: abbreviation of month (from `Jan` to `Dec`).
* `%m`: month of year (from `01` to `12`).
* `%Y`: 4-digit year (e.g., `2023`).
* `%T`: time in 24-hour format.
* `%H`: hour

### Working with files

| Command | Description |
|---------|:------------|
| `cp <path> <destination>` | copy a file from `path` to `destination` |
| `cp <path> <destination>/<newname>` | copy a file from `path` to `destination` with name changed |
| `cp -r <dir1> <dir2>` | copy entire directory from `dir1` to `dir2` |
| `mv <path> <destination>` | change filename or path |
| `mv Notes Scripts Documents` | move `Notes` and `Scripts` to `Documents` |
| `rm <filename>` | remove file |
| `rm -i <filename>` | remove file by asking for confirmation first |
| `rm -r <path>` | remove entire directory in `path` |
| `touch <filenmae>` | create an empty file, or update file's timestamp |
| `chmod <option> <file>` | modify file permission |
| `wc <file>` | get count of lines, words, and characters in a file |
| `wc -l <file>` | get count of lines in a file |
| `wc -w <file>` | get count of words in a file |
| `wc -c <file>` | get count of characters in a file |
| `grep <string> <file>` | return lines in `file` matching pattern `string` |
| `cut -c 2-9 test.txt` | slice text in each line by getting from the second to the ninth characters of the original text |
| `cut -c 2- test.txt` | slice text in each line by getting from the second character to the end of the original text |
| `cut -d ' ' test.txt` | equivalent to `text.split(" ")[1]` |
| `paste -d ',' <file1> <file2> <file3>` | concatenate text from different files line-by-line using `,` as delimiter (default is `\t`) |
| `tr <option> <target character> <replacement character>` | replace character in input text |
| `echo "Hello World" | tr "aeiou" "_"` | return `H_ll_ W_rld` |
| `echo "Hello World" | tr -c "aeiou" "_"` | return `_e__o__o___` (`-c`: complement) |

#### `mv`
```bash
# create an empty text file.
touch example.txt

# rename a file to `another.txt`.
mv example.txt another.txt

# option1: move to `tmp` directory.
mv another.txt /tmp

# option2: move to `tmp` directory and change filename to `newname.txt`
mv another.txt /tmp/newname.txt
```

#### `cp`
```bash
# copy a file (if the destination does not contain `path`, it refers to the current directory).
cp /tmp/another.txt another.txt

# copy with renaming a file.
cp /tmp/another.txt newname.txt
```

#### `chmod`
* `ls -l <file>`: access permission of a file (`ls -ld <file>` for a directory).
* it should return `-??? ??? ???`, such as `-rw-r--r--`.
    * the first `-` indicates that it is a file (if it is a directory, it will return `d`).
    * the next 3 digits refer to the read, write, and execute permission of owner.
    * the second chuck of 3 digits refers to group's permission.
    * the last chuck refer to permission for others.

| Command | Description |
|---------|:------------|
| `r`, `w`, `x` | read, write, execute permission |
| `u`, `g`, `o` | user categories: owner, group, otheres |
| `+`, `-` | grant or revoke permission |
| `chmod -r <file>` | revoke read permission to all user categories |
| `chmod u+x <file>` | grant execute permission to owner |

#### `wc`
```bash
# assuming there are several lines of text
wc pets.txt

# this returns <#lines> <#words> <#characters> <file>
# for example: 7 7 7 28 pets.txt
# note that <#characters> include special characters like `\n`.
```

#### `grep` (global regular expression pring)

| Command | Description |
|---------|:------------|
| `grep -n <string> <file>` | print matching lines with line numbers |
| `grep -c <string> <file>` | count of matching lines |
| `grep -i <string> <file>` | ignore case sensitive |
| `grep -v <string> <file>` | print all lines which do not contain the matching pattern |
| `grep -w <string> <file>` | match if the pattern matches the whole pattern |

### Navigating and wokring with directories

| Command | Description |
|---------|:------------|
| `ls <path>` | list files and directories in `path` (default is `.`) |
| `ls -l <path>` | list all files and show permission, modified date, and etc. |
| `ls -a <path>` | list all files |
| `ls -d <path>` | list directories only |
| `ls -h <path>` | list all files and print size in Kb, Mb, Gb |
| `ls -S <path>` | sort the file list with size, largest first |
| `ls -t <path>` | sort the file list with modified date, newest first |
| `ls -r <path>` | reverse sort order |
| `ls -l -a <path>` | stacking several options |
| `ls -ltr <path>` | another variation to stack several options (list files in ascending by date) |
| `ls /bin/b*` | list all files in `/bin` that starts with `b` |
| `ls /bin/*b` | list all files in `/bin` that ends with `b` |
| `find <path> -name <filename>` | find a file in directory tree of `path` |
| `find . -name "a.txt"` | find a file named `a.txt` in the current directory tree |
| `find . -iname "a.txt"` | ignroe case sensitive when searching for a file |
| `pwd` | print present working directory |
| `mkdir <path>` | create a directory |
| `cd <path>` | change directory to `path` (can be an absolute or relative path) |
| `rmdir <path>` | remove entire directory |

### Printing file and string contents

| Command | Description |
|---------|:------------|
| `cat <file>` | print entire file contents (catenate) |
| `more <file>` | print file contents page-by-page (use `space` to go next page)|
| `head <file>` | show the first N lines of a file (default is 10 lines) |
| `head -3 <file>` | show the first 3 lines of a file |
| `tail <file>` | show the last N lines of a file |
| `echo "Hello world"` | print `Hello world` |
| `echo $PATH` | print value of the variable named `PATH` (use `$` to access variable value) |
| `sort <file>` | sort lines in file alphabetically (a-z) |
| `sort -r <file>` | sort lines in file alphabetically (z-a) |
| `uniq <file>` | remove repeated strings in consecutive liens |

### Compression and archiving 
* archives
    * store rarely used information and preserve it.
    * a collection of data files and directories stored as a single file.
    * make the collection more portable and secure as a backip in case of loss or corruption.
* file compression
    * reduce file size by reducing information redundancy.
    * preserve storage space.
    * speed up data transfer.
    * reduce bandwidth load.

> The following `<placeholder>` explicitly specifies file extension outside the placeholder.
{: .prompt-info}

| Command | Description |
|---------|:------------|
| `tar` | archive a set of files (tape archiver) |
| `tar -cvf <archive name>.tar <file or path>` | verbosely (`-v`) create (`-c`) an archive file or path named `archive name` (`-f`)|
| `tar -czvf <archive name>.tar.gz <file or path>` | compress (`-z`) the archive |
| `tar -tf <archive name>.tar` | list files in an archive |
| `tar -xf <archive name>.tar <destination>` | extract an archive file (default destination is `./<archive name>`)|
| `tar -xzf <archive name>.tar.gz <destination>` | extract and decompose a compressed archive file |
| `zip <zip name>.zip <file>` | compress a file |
| `zip -r <zip name>.zip <path>` | compress entire directory |
| `unzip <zipname>.zip` | extract files from a compressed zip archive |
| `unzip -l <zipname>.zip` | list files of an archive |
| `unzip -o <zipname>.zip` | force overwrite |

> The difference between `tar` and `zip` is that
* `tar`: bundle -> compress.
* `zip`: compress -> bundle.
{: .prompt-info}

### Networking

| Command | Description |
|---------|:------------|
| `hostname` | print hostname |
| `hostname -s` | print hostname without suffix `.local` |
| `hostname -i` | print hostname's ip address |
| `ifconfig` | display or configure system network interfaces (interface configuration) |
| `ifconfig eth0` | display ethernet adapter information |
| `ping <URL>` | send ICMP packets to URL and print response (press `ctrl` + `c` to terminate) |
| `ping -c 5 <URL>` | send 5 ICMP packets to URL and print responses. |
| `curl <URL>` | display contents of file at a URL (Client URL) |
| `curl www.google.com -o google.txt` | load data and save it to a file |
| `curl -O www.google.com` | load data and save it to the current directory |
| `wget <URL>` | download file from URL to the corrent directory (web get) |

## Shell scripting
* script is a list of commands interpretedd by a scripting language.
* scripting language is interpreted at runtime.
* scripting is slow to run, but faster to develop.
* used for automated processes, such as ETL jobs, file backups, and web apps.
* shell script is an executable text file with an interpreter directive, aka `shebang directive`.
* the syntax is `#!interpreter [optional argument]`.
    * shell script directives:
        * `#!/bin/sh`
        * `#!/bin/bash`
    * python script directive
        * `#!/usr/bin/env python3`
* use `which bash` to print interpreter path to input in the shebang directive.

```bash
# create an empty file.
touch hello_word.sh # file extension of shell script is sh.

# specify shebang directive.
echo '#!/bin/bash' >> hello_world.sh

# check execute permission.
ls -l hello_world.sh

# grant execute permission for owner.
chmod u+x hello_world.sh

# run the shell (bash) script.
./hello_world.sh # . refers to the current directory.

# another way to run the bash script.
bash hello_world.sh
```

## Chain commands
### Filters
* shell commands that 
    * takes input from standard input.
    * sends output to standard output.
    * transforms input data to output data.
    * for example, `wc`, `cat`, `more`, `head`, `sort`, etc.

### Pipeline
* chain filter commands, meaning the output of `command1` is the input of `command2`.
* syntax: `command 1 | command 2`.
* ex: `ls | sort -r` -> sort all filenames.
* ex: `sort pets.txt | uniq` -> find distinct values in the file.


## Variables
```bash
# this is equivalent to `input` in python.
echo -n "enter name: "
read name
echo "Hi, $name"
```
### Shell variables
* `set`: list all shell variables.
* `set | head -4`: list the first 4 shell variables.
* define a shell variable by `var_name=value` without `space`.
* ex: `my_var="hello"`.

### Environment variables
* variables that belong to not only the current shell, but also entire environment.
* they persist in any child processes spawned by the shell in which they originate.
* `export var_name`: make a shell variable become an environmenet variable.
* `env`: list all environment variables.

## Miscellaneous
### Metacharacters
* `#`: preceed a comment.
* `;`: command separator (ex: `echo "Hello"; whoami`).
* `*`: filename extension wildcard (ex: `ls /bin/ba*`).
* `?`: single character wildcard (ex: `ls /bin/?ash`).

### Quoting
* `\`: escape special character interpretation.
    * ex: `echo "\$1 each"` -> `$1 each`
* `"<expression>"`: interpret literally, but evaluate metacharacters.
    * ex: `echo "$1 each"` -> ` each` (treat `$1` as a variable)
* `'<expression>'`: interpret literally.
    * ex: `echo '$1 each'` -> `$1 each`

### I/O redirection
* `>`: redirect output to file.
* `>>`: append output to file.
* `2>`: redirect error to file.
* `2>>`: append error to file

```bash
echo "line1" > ex.txt
# -> `ex.txt` contains 1 line of string "line1".

echo "line2" >> ex.txt
# -> `ex.txt` contains additional line of string "line2".

# list all error message.
garbage

garbage 2> err.txt
# -> store error in `err.txt`.

tr "[a-z]" "[A-Z]" < output.txt
# -> show result from `output.txt` in terminal and every character is in uppercase.
```

### Command substitution
* use `$(<command>)` or ``` `command` ```.
* ex: `here=$(pwd)` means that `here` stores the value of the current directory.
* ex: ```ls -l `which cat` ``` gets path from `cat` and feed it in `ls -l` command.

### Command line arguments
* program arguments specified on the command line.
* a way to pass arguments to a shell script.

```bash
# in bash script
#! /bin/bash
echo "Hi $1 $2"
# refer arguments in shell script with indices.
# save it to `test.sh`.

# in command prompt
./test.sh John Snow
# $1=John and $2=Snow
```

```bash
# in bash script
#! /bin/bash
dircount=$(find $1 -type d|wc -l)
echo "There are $dircount directories in $1"
# save it to `test.sh`.

# in command prompt
./test.sh /tmp
# -> #directories in the given directory
```

## Job scheduling
* shedule jobs to run automatically at certain times.
* `cron`: a service that runs jobs. 
* `crond`: interprets `crontab files` and submits jobs to `cron`.
* `crontab`: a table of jobs anad schedule job.
* `crontab command`: invoke text editor to edit a `crontab file`.

| Command | Description |
|---------|:------------|
| `crontab -l | tail -6` | list all jobs (print only last 6 lines) |
| `crontab -e` | open editor |
| `crontab -r` | delete all cron jobs |
| `service cron start` | start `cron` |
| `service cron stop` | stop `cron` |

### Create a job
* syntax for a job: `m h dom mon dow command`.

| Command | Description |
|---------|:------------|
| `m` | minute (0-59) |
| `h` | hour (0-23; 0=midnight) |
| `dom` | day (1-31) |
| `mon` | month (1-12) |
| `dow` | weekday (0-6; 0=Sunday) |

```bash
crontab -e

# create a job to append datetime at 15:30 every Sunday to `x.txt`.
30 15 * * 0 date >> x.txt

# run an etl job at midnight every day.
0 0 * * * /jobs/etl.sh
```