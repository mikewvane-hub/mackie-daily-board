Set WshShell = CreateObject("WScript.Shell")
strDir = "c:\Users\micha\OneDrive\Desktop\ANTIGRAVITY PROJECTS\Mackie Mom Board"
WshShell.CurrentDirectory = strDir
WshShell.Run "cmd /c start_mackie_board_24x7.cmd", 0, False
