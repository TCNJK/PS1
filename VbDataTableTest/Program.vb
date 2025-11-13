Imports System

Module Program
    Sub Main(args As String())
        Dim keep as String = "false"
        Dim currentKeep as String = ""
        Dim isDifferent As Boolean = False
        If keep.Equals("true", StringComparison.OrdinalIgnoreCase) And Not currentKeep.Equals("Y", StringComparison.OrdinalIgnoreCase) Then
            isDifferent = True
        End If

        Console.WriteLine("Is Different: " & isDifferent.ToString())
    End Sub
End Module

