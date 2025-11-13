$excel = [Runtime.Interopservices.Marshal]::GetActiveObject("Excel.Application")

$workbook = $excel.ActiveWorkbook

if ($null -eq $workbook) {
    Write-Host "Nothing Workbook is active."
    exit
}

$vbCode = Get-Content "E:\Code\PS1\VBA.txt" -Raw

$vbModule = $workbook.VBProject.VBComponents.Add(1)   # 1 = Standard Module

Write-Host "Workbook is run"
$vbModule.CodeModule.AddFromString($vbCode)

$excel.Run("VBAFUNCTION")
