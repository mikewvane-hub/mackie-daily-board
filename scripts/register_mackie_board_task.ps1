$action = New-ScheduledTaskAction -Execute "C:\Program Files\nodejs\node.exe" -Argument "server/server.cjs" -WorkingDirectory "c:\Users\micha\OneDrive\Desktop\ANTIGRAVITY PROJECTS\Mackie Mom Board"
$trigger = New-ScheduledTaskTrigger -AtLogOn
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -RestartCount 5 -RestartInterval (New-TimeSpan -Minutes 1)
Register-ScheduledTask -TaskName "MackieMomBoardServer" -Action $action -Trigger $trigger -Settings $settings -Force
Write-Host "MackieMomBoardServer registered successfully."
