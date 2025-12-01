Function CreatePADKeyDict() As Object
    Dim dict As Object
    Set dict = CreateObject("Scripting.Dictionary")
    
    dict.Add "Ctrl", "Control"
    dict.Add "Shift", "Shift"
    dict.Add "Alt", "Alt"
    dict.Add "Win", "Win"
    dict.Add "Enter", "Enter"
    dict.Add "Tab", "Tab"
    dict.Add "Space", "Space"
    dict.Add "Back", "Backspace"
    dict.Add "Delete", "Delete"
    dict.Add "Esc", "Escape"
    dict.Add "End", "End"
    dict.Add "Home", "Home"
    dict.Add "Left", "Left"
    dict.Add "Right", "Right"
    dict.Add "Up", "Up"
    dict.Add "Down", "Down"
    
    Set CreatePADKeyDict = dict
End Function


Function ParseNestedHotkeyWithDict(inputStr As String) As String
    Dim result As String, keyStack As New Collection
    Dim i As Long, ch As String, buffer As String, blockContent As String
    
    ' Mapping dictionary for PAD keys
    Dim dict As Object
    Set dict = CreatePADKeyDict
    
    result = ""
    buffer = ""
    
    i = 1
    Do While i <= Len(inputStr)
        ch = Mid$(inputStr, i, 1)
        
        If ch = "[" Then
            ' Flush buffer before block
            If buffer <> "" Then
                result = result & buffer
                buffer = ""
            End If
            
            ' Find closing bracket
            Dim j As Long
            j = InStr(i, inputStr, "]")
            If j = 0 Then Exit Do
            
            ' Extract block content
            blockContent = Mid$(inputStr, i + 1, j - i - 1)
            Dim pos As Long: pos = 1
            
            ' Process each command in block
            Do While pos <= Len(blockContent)
                Dim cmd As String, typ As String, keyName As String
                cmd = Mid$(blockContent, pos)
                
                ' Regex to match d(...), k(...), u(...)
                Dim regEx As Object, m As Object
                Set regEx = CreateObject("VBScript.RegExp")
                regEx.Pattern = "^[duk]\([^\)]+\)"
                regEx.IgnoreCase = True
                regEx.Global = False
                
                If regEx.Test(cmd) Then
                    Set m = regEx.Execute(cmd)(0)
                    cmd = m.Value
                    typ = Left(cmd, 1)
                    keyName = Mid(cmd, 3, Len(cmd) - 3)
                    
                    ' Map key through dictionary if exists
                    If dict.Exists(keyName) Then keyName = dict(keyName)
                    
                    ' Handle command type
                    Select Case typ
                        Case "d" ' Key down ? open level
                            result = result & "{" & keyName & "}("
                            keyStack.Add keyName
                        Case "k" ' Key press ? insert directly
                            result = result & "{" & keyName & "}"
                        Case "u" ' Key up ? close level
                            If keyStack.Count > 0 Then
                                keyStack.Remove keyStack.Count
                                result = result & ")"
                            End If
                    End Select
                    
                    pos = pos + Len(m.Value)
                Else
                    pos = pos + 1
                End If
            Loop
            
            i = j ' Move after closing bracket
        Else
            ' Accumulate normal text
            buffer = buffer & ch
        End If
        
        i = i + 1
    Loop
    
    ' Flush remaining text
    If buffer <> "" Then result = result & buffer
    
    ParseNestedHotkeyWithDict = result
End Function

Sub TestParseNestedHotkeyDict()
    Dim s As String
    s = "[d(Ctrl)d(Shift)]abc[u(Shift)u(Ctrl)]"
    
    Debug.Print ParseNestedHotkeyWithDict(s)
End Sub