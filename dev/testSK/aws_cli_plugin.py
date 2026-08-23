#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Semantic Kernel Plugin：呼叫本地 AWS CLI

提供 run_aws_cli 函數，在本地執行 aws 指令並回傳 stdout/stderr。
需已安裝並設定 AWS CLI（aws --version、aws configure）。
"""

import shutil
import subprocess
from typing import Annotated

from semantic_kernel.functions.kernel_function_decorator import kernel_function


class AwsCliPlugin:
    """呼叫本地 AWS CLI 的 Plugin，供 AI 助手執行 aws 指令。"""

    @kernel_function(
        name="run_aws_cli",
        description="在本地執行 AWS CLI 指令。傳入「子指令與參數」（不含 aws 本身），例如：sts get-caller-identity、s3 ls、s3 ls s3://bucket-name。回傳指令的 stdout 與 stderr。",
    )
    def run_aws_cli(
        self,
        sub_command_and_args: Annotated[
            str,
            "aws 後面的子指令與參數，例如：sts get-caller-identity、s3 ls、ec2 describe-instances",
        ],
    ) -> str:
        """執行 aws <sub_command_and_args>，回傳合併後的輸出。"""
        aws_path = shutil.which("aws")
        if not aws_path:
            return "[錯誤] 找不到 AWS CLI，請先安裝並確認 aws 在 PATH 中。"
        full_cmd = ["aws"] + sub_command_and_args.strip().split()
        try:
            result = subprocess.run(
                full_cmd,
                capture_output=True,
                text=True,
                timeout=30,
            )
            out = (result.stdout or "").strip()
            err = (result.stderr or "").strip()
            if result.returncode != 0:
                return f"[exit code {result.returncode}]\nstdout:\n{out}\nstderr:\n{err}"
            return err + "\n" + out if err else (out or "(無輸出)")
        except subprocess.TimeoutExpired:
            return "[錯誤] AWS CLI 執行逾時（30 秒）。"
        except Exception as e:
            return f"[錯誤] 執行失敗: {e}"
