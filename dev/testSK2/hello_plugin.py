# -*- coding: utf-8 -*-
"""
Hello Plugin：提供 say_hello 給 planner（function calling）使用。
"""
from typing import Annotated

from semantic_kernel.functions import kernel_function


class HelloPlugin:
    """簡單的問候 plugin，讓 AI 透過 function calling 決定何時呼叫。"""

    @kernel_function(
        name="say_hello",
        description="向某人說你好／Hello。可傳入名字，若未傳則用「大家」或「World」。",
    )
    def say_hello(
        self,
        name: Annotated[str, "要打招呼的對象名字，例如 World 或使用者名稱"] = "World",
    ) -> str:
        return f"Hello, {name}!"
