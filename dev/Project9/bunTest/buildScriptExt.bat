for /r script/ext %%f in (*) do (
    bun tsc %%f -m esnext --outDir dist
)
