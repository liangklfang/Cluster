//process.env的类型是如下的形式：
/*
{ ACLOCAL_PATH: '/mingw32/share/aclocal:/usr/share/aclocal',
  ALLUSERSPROFILE: 'C:\\ProgramData',
  APPDATA: 'C:\\Users\\Administrator\\AppData\\Roaming',
  CLASSPATH: 'C:\\Program Files\\Java\\jdk1.6.0_01\\lib\\tools.jar;C:\\Program F
iles\\Java\\jdk1.6.0_01\\lib\\dt.jar;',
  COMMONPROGRAMFILES: 'C:\\Program Files\\Common Files',
  COMPUTERNAME: 'WIN7-20140901YQ',
  COMSPEC: 'C:\\Windows\\system32\\cmd.exe',
  DISPLAY: 'needs-to-be-defined',
  EXEPATH: 'C:\\Program Files\\Git',
  FP_NO_HOST_CHECK: 'NO',
  HOME: 'C:\\Users\\Administrator',
  HOMEDRIVE: 'C:',
  HOMEPATH: '\\Users\\Administrator',
  HOSTNAME: 'WIN7-20140901YQ',
  INFOPATH: '/usr/local/info:/usr/share/info:/usr/info:/share/info:',
  JAVA_HOME: 'C:\\Program Files\\Java\\jdk1.6.0_01;',
  LANG: 'zh_CN.UTF-8',
  LOCALAPPDATA: 'C:\\Users\\Administrator\\AppData\\Local',
  LOGONSERVER: '\\\\WIN7-20140901YQ',
  MANPATH: '/mingw32/share/man:/usr/local/man:/usr/share/man:/usr/man:/share/man
:',
  MSYSTEM: 'MINGW32',
  NUMBER_OF_PROCESSORS: '2',
  OPENSSL_CONF: 'C:\\OpenSSL-Win32\\bin\\openssl.cfg',
  OS: 'Windows_NT',
  PATH: 'C:\\Users\\Administrator\\bin;C:\\Program Files\\Git\\mingw32\\bin;C:\\
Program Files\\Git\\usr\\local\\bin;C:\\Program Files\\Git\\usr\\bin;C:\\Program
 Files\\Git\\usr\\bin;C:\\Program Files\\Git\\mingw32\\bin;C:\\Program Files\\Gi
t\\usr\\bin;C:\\Users\\Administrator\\bin;C:\\Windows\\system32;C:\\Windows;C:\\
Windows\\System32\\Wbem;C:\\Windows\\System32\\WindowsPowerShell\\v1.0;C:\\Progr
am Files\\Java\\jdk1.6.0_01\\bin;C:\\Program Files\\Java\\jre1.6.0_01\\bin;C:\\P
rogram Files\\Microsoft SQL Server\\100\\Tools\\Binn;C:\\Program Files\\Microsof
t SQL Server\\100\\DTS\\Binn;C:\\Program Files\\Microsoft SQL Server\\100\\Tools
\\Binn\\VSShell\\Common7\\IDE;C:\\Program Files\\Microsoft Visual Studio 9.0\\Co
mmon7\\IDE\\PrivateAssemblies;C:\\Program Files\\MySQL\\MySQL Server 5.5\\bin;C:
\\Program Files\\nodejs;C:\\Users\\Administrator\\AppData\\Roaming\\npm;C:\\Prog
ram Files\\Git\\usr\\bin\\vendor_perl;C:\\Program Files\\Git\\usr\\bin\\core_per
l',
  PATHEXT: '.COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH;.MSC',
  PKG_CONFIG_PATH: '/mingw32/lib/pkgconfig:/mingw32/share/pkgconfig',
  PLINK_PROTOCOL: 'ssh',
  PRINTER: '\\\\510SERVER\\Canon LBP2900',
  PROCESSOR_ARCHITECTURE: 'x86',
  PROCESSOR_IDENTIFIER: 'x86 Family 15 Model 4 Stepping 7, GenuineIntel',
  PROCESSOR_LEVEL: '15',
  PROCESSOR_REVISION: '0407',
  ProgramData: 'C:\\ProgramData',
  PROGRAMFILES: 'C:\\Program Files',
  PS1: '\\[\\033]0;$TITLEPREFIX:${PWD//[^[:ascii:]]/?}\\007\\]\\n\\[\\033[32m\\]
\\u@\\h \\[\\033[35m\\]$MSYSTEM \\[\\033[33m\\]\\w\\[\\033[36m\\]`__git_ps1`\\[\
\033[0m\\]\\n$ ',
  PSModulePath: 'C:\\Windows\\system32\\WindowsPowerShell\\v1.0\\Modules\\',
  PUBLIC: 'C:\\Users\\Public',
  PWD: '/c/Users/Administrator/Desktop/Cluster',
  SESSIONNAME: 'Console',
  SHELL: 'C:\\Program Files\\Git\\usr\\bin\\bash',
  SHLVL: '1',
  SSH_ASKPASS: '/mingw32/libexec/git-core/git-gui--askpass',
  SYSTEMDRIVE: 'C:',
  SYSTEMROOT: 'C:\\Windows',
  TEMP: 'C:\\Users\\ADMINI~1\\AppData\\Local\\Temp',
  TERM: 'xterm',
  TMP: 'C:\\Users\\ADMINI~1\\AppData\\Local\\Temp',
  TMPDIR: 'C:\\Users\\ADMINI~1\\AppData\\Local\\Temp',
  USERDOMAIN: 'WIN7-20140901YQ',
  USERNAME: 'Administrator',
  USERPROFILE: 'C:\\Users\\Administrator',
  WINDIR: 'C:\\Windows',
  windows_tracing_flags: '3',
  windows_tracing_logfile: 'C:\\BVTBin\\Tests\\installpackage\\csilogfile.log',
  _: '/usr/bin/winpty' }

*/
console.log(process.env.NODE_UNIQUE_ID);
//如果process.env.NODE_UNIQUE_ID是undefined那么就是主线程