 // ✅ Inicializar Supabase ANTES de usarla
 const SUPABASE_URL = "https://tbzgewjnfcjviexmgnsq.supabase.co";  // Reemplaza con tu URL de Supabase
 const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiemdld2puZmNqdmlleG1nbnNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MTkyMjAsImV4cCI6MjA1NzI5NTIyMH0.aGbANeeHSe-MskK3U6z-DJI-x6TSAryHoS6mKonCF6w";  // Reemplaza con tu Anon Key
 const supabase = window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

 // ✅ Esperar a que el DOM cargue completamente antes de asignar eventos
 document.addEventListener("DOMContentLoaded", function () {
     document.getElementById("uploadBtn").addEventListener("click", handleUpload);
 });

 // ✅ Definir la función para subir archivos
 async function handleUpload() {
     const fileInput = document.getElementById("fileInput");
     const status = document.getElementById("status");
     const fileUrl = document.getElementById("fileUrl");

     if (fileInput.files.length === 0) {
         status.innerText = "Selecciona un archivo primero.";
         return;
     }

     const file = fileInput.files[0];
     const filePath = `uploads/${file.name}`;

     // Subir archivo a Supabase Storage
     const { data, error } = await supabase.storage.from("test").upload(filePath, file, { upsert: false });

     if (error) {
         status.innerText = "Error al subir el archivo: " + error.message;
         return;
     }

     // Obtener la URL pública del archivo
     const { data: publicUrl } = supabase.storage.from("test").getPublicUrl(filePath);

     status.innerText = "Archivo subido con éxito.";
     fileUrl.href = publicUrl.publicUrl;
     fileUrl.innerText = publicUrl.publicUrl;
 }