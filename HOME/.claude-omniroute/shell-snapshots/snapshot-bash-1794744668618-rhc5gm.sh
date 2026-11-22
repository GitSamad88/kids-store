# Snapshot file
# Unset all aliases to avoid conflicts with functions
unalias -a 2>/dev/null || true
shopt -s expand_aliases
# Check for rg availability
if ! hash rg 2>/dev/null && ! typeset -f rg >/dev/null 2>&1; then
  function rg {
  local _cc_bin="${CLAUDE_CODE_EXECPATH:-}"
  [[ -x $_cc_bin ]] || _cc_bin=/c/Users/hp/.local/bin/claude.exe
  if [[ ! -x $_cc_bin ]]; then command rg ${1+"$@"}; return; fi
  if [[ -n ${ZSH_VERSION:-} ]]; then
    ARGV0=rg "$_cc_bin" ${1+"$@"}
  elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then
    ARGV0=rg "$_cc_bin" ${1+"$@"}
  else
    (exec -a rg "$_cc_bin" ${1+"$@"})
  fi
}
fi
# Shadow pkill to refuse patterns matching the CLI process
unalias pkill 2>/dev/null || true
function pkill {
  if [ -n "${CLAUDE_PID:-}" ] && [ -r "/proc/${CLAUDE_PID}/comm" ]; then
    local _cc_skip="" _cc_a
    local -a _cc_probe=()
    for _cc_a in ${1+"$@"}; do
      if [ -n "$_cc_skip" ]; then _cc_skip=""; continue; fi
      case "$_cc_a" in
        --signal) _cc_skip=1 ;;
        --signal=*|-e|--echo) ;;
        -[0-9]*) ;;
        -[PUGOF]?*) _cc_probe+=("$_cc_a") ;;
        -[ABCDEFGHIJKLMNOPQRSTUVWXYZ][ABCDEFGHIJKLMNOPQRSTUVWXYZ0-9]*) ;;
        *) _cc_probe+=("$_cc_a") ;;
      esac
    done
    if command pgrep ${_cc_probe[@]+"${_cc_probe[@]}"} 2>/dev/null | command grep -qx "${CLAUDE_PID}"; then
      printf 'pkill: refusing to run — this pattern matches the Claude CLI process (PID %s). Narrow the pattern, or target your own children with `pkill -P $$ ...`.\n' "${CLAUDE_PID}" >&2
      return 1
    fi
  fi
  command pkill ${1+"$@"}
}
export PATH='/c/Users/hp/bin:/mingw64/bin:/usr/local/bin:/usr/bin:/bin:/mingw64/bin:/usr/bin:/c/Users/hp/bin:/c/Program Files (x86)/Common Files/Oracle/Java/javapath:/c/Users/hp/anaconda3/Lib:/c/Program Files (x86)/fastText-main:/c/Users/hp/Downloads/fastText-0.9.2:/c/Program Files/CMake/bin:/c/Users/shtosh/anaconda3/Library/mingw-w64/bin:/c/Users/shtosh/anaconda3:/c/Users/shtosh/anaconda3/Library/usr/bin:/c/Users/shtosh/anaconda3/Scripts:/c/Users/shtosh/anaconda3/Library/bin:/c/Windows/System32:/c/Program Files/Docker/Docker/resources/bin:/c/Program Files/nodejs:/c/Users/hp/AppData/Local/Programs/Python/Python312/Scripts:/c/Users/hp/AppData/Local/Programs/Python/Python312:/c/Users/hp/AppData/Local/Programs/Python/Launcher:/c/Users/hp/scoop/shims:/c/Users/hp/anaconda3_2023:/c/Users/hp/anaconda3_2023/Library/mingw-w64/bin:/c/Users/hp/anaconda3_2023/Library/usr/bin:/c/Users/hp/anaconda3_2023/Library/bin:/c/Users/hp/anaconda3_2023/Scripts:/c/Users/hp/anaconda3:/c/Users/hp/anaconda3/Library/mingw-w64/bin:/c/Users/hp/anaconda3/Library/usr/bin:/c/Users/hp/anaconda3/Library/bin:/c/Users/hp/anaconda3/Scripts:/c/Users/hp/AppData/Local/Programs/Python/Python311/Scripts:/c/Users/hp/AppData/Local/Programs/Python/Python311:/c/Users/Conda3:/c/Users/Conda3/Library/mingw-w64/bin:/c/Users/Conda3/Library/usr/bin:/c/Users/Conda3/Library/bin:/c/Users/Conda3/Scripts:/c/Users/hp/AppData/Local/Microsoft/WindowsApps:/c/Users/hp/AppData/Local/Pandoc:/c/Users/hp/AppData/Local/Programs/Python/Python311:/c/Users/hp/AppData/Local/Packages/PythonSoftwareFoundation.Python.3.10_qbz5n2kfra8p0/LocalCache/local:/c/Users/hp/AppData/Local/GitHubDesktop/bin:/c/Users/hp/Downloads/Documents/ffmpeg-6.0:/c/Users/hp/Downloads/Documents/ffmpeg-6.0/doc/ffmpeg.txt:/c/Users/hp/AppData/Local/Programs/Microsoft VS Code/bin:/c/Users/hp/.detaspace/bin:/c/Users/hp/AppData/Local/Programs/cursor/resources/app/bin:/c/Users/hp/AppData/Local/Programs/Ollama:/c/Users/hp/AppData/Roaming/npm:/c/Users/hp/AppData/Local/Programs/Microsoft VS Code/bin/copilot-shim:/c/Users/hp/.local/bin:/usr/bin/vendor_perl:/usr/bin/core_perl'
