Set WshShell = CreateObject("WScript.Shell")
strDir = "c:\Users\micha\OneDrive\Desktop\ANTIGRAVITY PROJECTS\Mackie Mom Board"
WshShell.CurrentDirectory = strDir
WshShell.Run "cmd /c node server/server.cjs", 0, False
