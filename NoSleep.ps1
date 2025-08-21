# Description: This script prevents the system from entering sleep mode by setting the thread execution state.
# Usage: Run this script in PowerShell. It will keep the system awake until you stop it manually.
# Commands: powershell -ExecutionPolicy Bypass -File .\NoSleep.ps1
# Note: Use Ctrl+C to stop the script and allow the system to enter sleep mode again

# copy con NoSleep.ps1
# Paste the following code into the PowerShell script file
# Save the file and run it in PowerShell to prevent sleep mode

# NoSleep.ps1
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
