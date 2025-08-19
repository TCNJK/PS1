Add-Type @"
using System;
using System.Runtime.InteropServices;
public class NoSleep {
    [DllImport("kernel32.dll", CharSet = CharSet.Auto, SetLastError = true)]
    public static extern uint SetThreadExecutionState(uint esFlags);
}
"@

$ES_CONTINUOUS       = [uint32]::Parse("80000000", "AllowHexSpecifier")
$ES_SYSTEM_REQUIRED  = [uint32]1
$ES_DISPLAY_REQUIRED = [uint32]2

[NoSleep]::SetThreadExecutionState($ES_CONTINUOUS -bor $ES_SYSTEM_REQUIRED -bor $ES_DISPLAY_REQUIRED)

Write-Host "Ctrl+C to stop the script and allow sleep mode."
while ($true) { Start-Sleep -Seconds 60 }
