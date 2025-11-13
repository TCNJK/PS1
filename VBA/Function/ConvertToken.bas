Public Sub ProcessTokens()
    Dim toks As Collection
    Dim token As token
    Dim varDict As Object
    
    ' --- Step 1: Read sheet ---
    ReadVariablesIntoDictionary
    ReadFormatCollection
    
    ' --- Step 2: Tokenize ---
    Dim codeStr As String
    codeStr = "Path.GetFileNameWithoutExtension(System.IO.Path.GetFileNameWithoutExtension(filePath & ""_"" & isTemp & ""_"" & (42 + 8).ToString())).ToUpper().Trim().StartsWith(""ABC"").Length.Count + dic(""abc"")"
    
    Set toks = ConvertTokenize(codeStr)
    
    ' --- Step 3: identifier variable ---
    For Each token In toks
        If token.TypeName = "identifier" And dicVariable.Exists(token.Value) Then
            token.TypeName = "Variable"
        End If
    Next token
    ' --- Step 4: MergeFormatTokens ---
    MergeFormatTokens toks
    
    ' --- Step 5: SpecialTokens ---
    ProcessSpecialTokens toks

    ' --- Step *: Log ---
    For Each token In toks
        Debug.Print token.TypeName & ": " & token.Value
    Next token
End Sub

