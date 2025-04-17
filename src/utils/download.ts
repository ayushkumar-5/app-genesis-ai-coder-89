
export const downloadAsZip = async (files: { name: string; content: string }[]) => {
  // Dynamic import JSZip only when needed
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();

  // Add all files to the zip
  files.forEach(file => {
    zip.file(file.name, file.content);
  });

  // Generate the zip file
  const content = await zip.generateAsync({ type: "blob" });
  
  // Create a download link and trigger download
  const url = window.URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.download = "code-examples.zip";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
