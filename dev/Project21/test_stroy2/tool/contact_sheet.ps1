param(
  [Parameter(Mandatory = $true)][string]$Manifest,
  [Parameter(Mandatory = $true)][string]$Out,
  [int]$Cell = 340,
  [int]$Cols = 6,
  [int]$LabelHeight = 22
)

Add-Type -AssemblyName System.Drawing

$items = Get-Content -Raw -LiteralPath $Manifest | ConvertFrom-Json
if ($items.Count -eq 0) { throw "manifest is empty" }

$rows = [Math]::Ceiling($items.Count / $Cols)
$cellH = $Cell + $LabelHeight
$sheetW = $Cols * $Cell
$sheetH = $rows * $cellH

$bmp = New-Object System.Drawing.Bitmap($sheetW, $sheetH)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.Clear([System.Drawing.Color]::FromArgb(24, 24, 24))
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$font = New-Object System.Drawing.Font("Consolas", 11)
$brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(230, 230, 230))

for ($i = 0; $i -lt $items.Count; $i++) {
  $col = $i % $Cols
  $row = [Math]::Floor($i / $Cols)
  $x = $col * $Cell
  $y = $row * $cellH
  $item = $items[$i]

  if ($item.path -and (Test-Path -LiteralPath $item.path)) {
    try {
      $img = [System.Drawing.Image]::FromFile((Resolve-Path -LiteralPath $item.path))
      $scale = [Math]::Min($Cell / $img.Width, $Cell / $img.Height)
      $w = [int]($img.Width * $scale)
      $h = [int]($img.Height * $scale)
      $dx = $x + [int](($Cell - $w) / 2)
      $dy = $y + [int](($Cell - $h) / 2)
      $g.DrawImage($img, $dx, $dy, $w, $h)
      $img.Dispose()
    } catch {
      $g.DrawString("unreadable", $font, $brush, $x + 4, $y + 4)
    }
  } else {
    $g.DrawString("missing", $font, $brush, $x + 4, $y + 4)
  }

  $g.DrawString($item.label, $font, $brush, $x + 4, $y + $Cell + 3)
}

$outDir = Split-Path -Parent $Out
if ($outDir -and -not (Test-Path -LiteralPath $outDir)) {
  New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}
$bmp.Save($Out, [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
Write-Output "$Out ($($items.Count) tiles, ${sheetW}x${sheetH})"
