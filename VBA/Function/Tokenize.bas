Option Explicit

Sub TestTokenize()
    Dim codeStr As String
    codeStr = "Path.GetFileNameWithoutExtension(IO.Path.GetFullPath(filePath & ""_"" & If(isTemp, ""tmp"", ""final"") & ""_"" & (42 + 8).ToString())).ToUpper().Trim().StartsWith(""ABC"").Length.Count"
    
    Dim toks As Collection
    Set toks = ConvertTokenize(codeStr)
    
    Dim t As token
    For Each t In toks
        Debug.Print t.TypeName & ": " & t.Value
    Next
End Sub

Function ConvertTokenize(code As String) As Collection
    Dim tokens As New Collection
    Dim pos As Long: pos = 1
    Dim ch As String
    Dim tok As token
    
    Do While pos <= Len(code)
        ch = Mid(code, pos, 1)

        If ch = " " Or ch = vbTab Or ch = vbCr Or ch = vbLf Then
            pos = pos + 1
            GoTo NextChar
        End If

        If ch Like "[A-Za-z_]" Then
            Dim startPos As Long: startPos = pos
            Do While pos <= Len(code) And Mid(code, pos, 1) Like "[A-Za-z0-9_]"
                pos = pos + 1
            Loop
            Set tok = New token
            tok.Init "identifier", Mid(code, startPos, pos - startPos)
            tokens.Add tok
            GoTo NextChar
        End If

        If ch Like "[0-9]" Then
            startPos = pos
            Do While pos <= Len(code) And Mid(code, pos, 1) Like "[0-9]"
                pos = pos + 1
            Loop
            Set tok = New token
            tok.Init "number_literal", Mid(code, startPos, pos - startPos)
            tokens.Add tok
            GoTo NextChar
        End If

        If ch = """" Then
            startPos = pos
            pos = pos + 1
            Do While pos <= Len(code)
                If Mid(code, pos, 1) = """" Then
                    If pos + 1 <= Len(code) And Mid(code, pos + 1, 1) = """" Then
                        pos = pos + 2 ' escape ""
                    Else
                        pos = pos + 1
                        Exit Do
                    End If
                Else
                    pos = pos + 1
                End If
            Loop
            Set tok = New token
            tok.Init "string_literal", Mid(code, startPos, pos - startPos)
            tokens.Add tok
            GoTo NextChar
        End If
        
        If InStr("&+-*/.=,", ch) > 0 Then
            Set tok = New token
            tok.Init "operator", ch
            tokens.Add tok
            pos = pos + 1
            GoTo NextChar
        End If
        
        If InStr("()", ch) > 0 Then
            Set tok = New token
            tok.Init "punctuation", ch
            tokens.Add tok
            pos = pos + 1
            GoTo NextChar
        End If
    
        Set tok = New token
        tok.Init "unknown", ch
        tokens.Add tok
        pos = pos + 1
        
NextChar:
    Loop
    
    Set ConvertTokenize = tokens
End Function

Public Function MergeFormatTokens(toks As Collection)
    Dim i As Long, j As Long
    Dim item As FormatItem
    Dim match As Boolean
    Dim mergedValue As String
    Dim k As Long
    
    i = 1
    Do While i <= toks.Count
        Dim bestMatchItem As FormatItem
        Dim bestMatchLength As Long
        bestMatchLength = 0
        
        Set bestMatchItem = Nothing
        
        For Each item In formatItems
            Dim lenPF As Long
            lenPF = item.pFormat.Count
            
            If i + lenPF - 1 <= toks.Count Then
                match = True
                For j = 1 To lenPF
                    If UCase(toks(i + j - 1).Value) <> UCase(item.pFormat(j)) Then
                        match = False
                        Exit For
                    End If
                Next j
                
                If match And lenPF > bestMatchLength Then
                    bestMatchLength = lenPF
                    Set bestMatchItem = item
                End If
            End If
        Next item
        
        If Not bestMatchItem Is Nothing Then
            mergedValue = ""
            For k = 1 To bestMatchLength
                mergedValue = mergedValue & toks(i).Value
                If k > 1 Then toks.Remove i + 1
            Next k
            
            toks(i).TypeName = bestMatchItem.pTypeName
            toks(i).Value = bestMatchItem.pNewFormat
            i = i + 1
        Else
            i = i + 1
        End If
    Loop
End Function

Function ProcessSpecialTokens(toks As Collection)
    Dim prevToken As token
    Dim token As token
    Dim i As Long
    
    For i = 1 To toks.Count
        Set token = toks(i)
        
        Select Case token.Value
            Case "("
                If i > 1 Then Set prevToken = toks(i - 1) Else Set prevToken = Nothing
                
                If Not prevToken Is Nothing And prevToken.TypeName = "Variable" Then
                    token.TypeName = "Function"
                    token.Value = "Item"
                Else
                    token.TypeName = "OpenBucket"
                End If
                
            Case ")"
                token.TypeName = "CloseBucket"
                
            Case "&"
                token.TypeName = "operator"
                token.Value = "+"
                
            Case Else
        End Select
    Next i
End Function

