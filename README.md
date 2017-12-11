# CLI file search utility

**Installation**:
* _npm install filesearch-package_ — a command that will install the npm package from the npm repository
 
* _npm install https://github.com/mr-sychevskyi/filesearch-package/tarball/master_ — a command that will install the npm package from the master branch of github repository

**Parameters**(order is not strict): 
* --DIR (required)	- base lookup directory
* --TYPE (optional)	- [D|F] D - directory, F - file
* --PATTERN (optional)	- regular expression to test file/directory name
* --MIN-SIZE (optional)	- minimum file size [B|K|M|G], should be skipped for directories
* --MAX-SIZE (optional)	- maximum file size [B|K|M|G], should be skipped for directories
<br /> (B - bytes, K - kilobytes, M - megabytes, G = gigabytes)

**Usage examples**: 
* index.js --DIR="/Users/Files" --PATTERN=\\.png
* index.js --DIR="/Users/Files" --TYPE=D
* index.js --DIR="/Users/Files" --PATTERN=\\.js --TYPE=F --MIN-SIZE=4K
