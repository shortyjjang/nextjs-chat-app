export default function useFileUpload(socket: WebSocket | undefined) {
  const uploadFile = async (files: File[]) => {
    if (!files) return;

    const formData = new FormData();
    for (const file of files) {
      formData.append("file", file);
    }

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.url && socket) {
        socket.send(JSON.stringify({ type: "file", url: data.url }));
      }
    } catch (error) {
      console.error("파일 업로드 실패:", error);
    }
  };

  return { uploadFile };
}
