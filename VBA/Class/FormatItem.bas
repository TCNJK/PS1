' Class Module: FormatItem
Public pFormat As Collection
Public pNewFormat As String
Public pTypeName As String

Public Sub Init(ByVal FormatVal As String, ByVal NewFormatVal As String, ByVal TypeNameVal As String)
    Dim parts() As String
    Dim i As Long

    Set pFormat = New Collection
    parts = Split(FormatVal, " ")
    For i = LBound(parts) To UBound(parts)
        If Len(parts(i)) > 0 Then pFormat.Add parts(i)
    Next i

    pNewFormat = NewFormatVal
    pTypeName = TypeNameVal
End Sub

