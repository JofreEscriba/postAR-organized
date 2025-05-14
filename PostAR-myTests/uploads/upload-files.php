<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Subir Archivo a Supabase</title>

    <!-- ✅ Cargar Supabase primero -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

    <style>
        body { font-family: Arial, sans-serif; text-align: center; margin: 50px; }
        #fileInput { margin: 10px; }
    </style>
</head>
<body>
    <h2>Subir Archivo a Supabase Storage</h2>
    <input type="file" id="fileInput">
    <button id="uploadBtn">Subir Archivo</button>
    <p id="status"></p>
    <p><strong>URL del archivo:</strong> <a id="fileUrl" target="_blank"></a></p>

    <script src="upload-files-functionality.js">
       
    </script>
</body>
</html>
