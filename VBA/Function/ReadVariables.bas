Public Sub ReadVariablesIntoDictionary()
    Dim ws As Worksheet
    Dim lastRow As Long
    Dim i As Long
    Dim varName As String
    Dim varType As String
    
    Set dicVariable = CreateObject("Scripting.Dictionary")
    
    Set ws = ThisWorkbook.Sheets("Variables")
    
    lastRow = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row
    
    For i = 2 To lastRow
        varName = Trim(ws.Cells(i, 1).Value)
        varType = "Variable"
        
        If Len(varName) > 0 Then
            dicVariable(varName) = varType
        End If
    Next i
End Sub

