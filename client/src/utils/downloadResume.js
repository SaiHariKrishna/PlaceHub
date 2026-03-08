export default async function downloadResume(url, filename = 'resume.pdf') {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
