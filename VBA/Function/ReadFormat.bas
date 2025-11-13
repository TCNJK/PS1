Public Sub ReadFormatCollection()
    Dim ws As Worksheet
    Dim lastRow As Long
    Dim i As Long
    Dim item As FormatItem
    
    Set formatItems = New Collection
    
    Set ws = ThisWorkbook.Sheets("FormatData")
    lastRow = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row
    
    For i = 2 To lastRow
        Set item = New FormatItem
        item.Init Trim(ws.Cells(i, "A").Value), _
                  Trim(ws.Cells(i, "B").Value), _
                  Trim(ws.Cells(i, "C").Value)
        formatItems.Add item
    Next i
End Sub