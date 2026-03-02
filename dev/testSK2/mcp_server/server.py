#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FastMCP 測試用 MCP 伺服器：讀寫本地檔案

提供工具：
- read_file(file_path)：讀取檔案內容
- list_dir(relative_path)：列出目錄
- write_file(file_path, content)：寫入或覆寫檔案（僅允許在 DATA_DIR 內）

預設根目錄為 /data，所有操作僅限該目錄下（安全限制）。

執行：MCP_SSE=1 python server.py  (SSE，供 Docker/SK 連線)
"""
import os
from pathlib import Path

from fastmcp import FastMCP

# 允許讀取的根目錄（可透過環境變數 DATA_DIR 覆寫）
DATA_DIR = Path(os.environ.get("DATA_DIR", "/data")).resolve()

mcp = FastMCP(name="Local File Reader MCP")


@mcp.tool
def read_file(file_path: str) -> str:
    """
    讀取本地檔案內容。
    file_path 為相對於資料目錄的路徑（例如 readme.txt、subdir/file.txt），
    或絕對路徑（僅允許在資料目錄內）。
    若檔案不存在或無法讀取，回傳錯誤訊息。
    """
    path = Path(file_path)
    if not path.is_absolute():
        path = DATA_DIR / path
    path = path.resolve()
    try:
        if not path.is_file():
            return f"[錯誤] 不是檔案或不存在: {path}"
        if not str(path).startswith(str(DATA_DIR)):
            return f"[錯誤] 僅允許讀取 {DATA_DIR} 目錄下的檔案。"
        return path.read_text(encoding="utf-8", errors="replace")
    except PermissionError:
        return f"[錯誤] 無權限讀取: {path}"
    except Exception as e:
        return f"[錯誤] {type(e).__name__}: {e}"


@mcp.tool
def list_dir(relative_path: str = "") -> str:
    """
    列出資料目錄下某路徑的檔案與資料夾（一層）。
    relative_path 為空則列出根目錄。
    """
    dir_path = DATA_DIR / relative_path.strip().strip("/") if relative_path else DATA_DIR
    dir_path = dir_path.resolve()
    try:
        if not dir_path.is_dir():
            return f"[錯誤] 不是目錄或不存在: {dir_path}"
        if not str(dir_path).startswith(str(DATA_DIR)):
            return f"[錯誤] 僅允許列出 {DATA_DIR} 目錄下。"
        items = sorted(dir_path.iterdir(), key=lambda p: (not p.is_dir(), p.name))
        lines = [f"{'[dir] ' if p.is_dir() else ''}{p.name}" for p in items]
        return "\n".join(lines) if lines else "(空)"
    except PermissionError:
        return f"[錯誤] 無權限: {dir_path}"
    except Exception as e:
        return f"[錯誤] {type(e).__name__}: {e}"


def _path_in_data_dir(file_path: str) -> Path | None:
    """將路徑解析為 DATA_DIR 內的絕對路徑，若超出範圍則回傳 None。"""
    path = Path(file_path)
    if not path.is_absolute():
        path = DATA_DIR / path
    path = path.resolve()
    if not str(path).startswith(str(DATA_DIR)):
        return None
    return path


@mcp.tool
def write_file(file_path: str, content: str) -> str:
    """
    寫入或覆寫本地檔案。
    file_path 為相對於資料目錄的路徑（例如 note.txt、subdir/note.txt），
    僅允許寫入資料目錄內。若上層目錄不存在會自動建立。
    回傳成功訊息或錯誤說明。
    """
    path = _path_in_data_dir(file_path)
    if path is None:
        return f"[錯誤] 僅允許寫入 {DATA_DIR} 目錄下的檔案。"
    try:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        return f"已寫入: {path} ({len(content)} 字元)"
    except PermissionError:
        return f"[錯誤] 無權限寫入: {path}"
    except Exception as e:
        return f"[錯誤] {type(e).__name__}: {e}"


if __name__ == "__main__":
    if os.environ.get("MCP_SSE", "").lower() in ("1", "true", "yes"):
        port = int(os.environ.get("MCP_PORT", "8000"))
        mcp.run(transport="sse", host="0.0.0.0", port=port)
    else:
        mcp.run()
