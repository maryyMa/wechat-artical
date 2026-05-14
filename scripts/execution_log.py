from __future__ import annotations

import sys
import traceback
from contextlib import redirect_stderr, redirect_stdout
from datetime import datetime
from pathlib import Path
from typing import Callable, TextIO


class TeeStream:
    def __init__(self, primary: TextIO, secondary: TextIO) -> None:
        self._primary = primary
        self._secondary = secondary
        self.encoding = getattr(primary, "encoding", "utf-8")
        self.errors = getattr(primary, "errors", "strict")

    def write(self, data: str) -> int:
        self._primary.write(data)
        self._secondary.write(data)
        return len(data)

    def flush(self) -> None:
        self._primary.flush()
        self._secondary.flush()

    def isatty(self) -> bool:
        return self._primary.isatty()

    def writable(self) -> bool:
        return True


def run_with_execution_log(main: Callable[[], object], script_name: str) -> int:
    log_path = _next_log_path(script_name)

    with log_path.open("w", encoding="utf-8") as log_file:
        stdout = TeeStream(sys.stdout, log_file)
        stderr = TeeStream(sys.stderr, log_file)
        with redirect_stdout(stdout), redirect_stderr(stderr):
            try:
                result = main()
            except SystemExit as exc:
                return _system_exit_code(exc)
            except BaseException:
                traceback.print_exc()
                return 1

    return result if isinstance(result, int) else 0


def _next_log_path(script_name: str) -> Path:
    repo_root = _repo_root()
    log_dir = repo_root / "log"
    log_dir.mkdir(exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
    return log_dir / f"{script_name}_{timestamp}.log"


def _repo_root() -> Path:
    path = Path(__file__).resolve()
    for parent in path.parents:
        if (parent / ".git").exists():
            return parent
    return path.parents[4]


def _system_exit_code(exc: SystemExit) -> int:
    if exc.code is None:
        return 0
    if isinstance(exc.code, int):
        return exc.code

    print(exc.code, file=sys.stderr)
    return 1