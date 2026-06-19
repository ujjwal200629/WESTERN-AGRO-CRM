function GenerateDoc() {
  const docAppUrl = process.env.REACT_APP_DOC_AUTO_URL || "http://localhost:5173";
  const username = localStorage.getItem("username") || "";
  
  return (
    <div style={{ width: '100%', height: '100vh', margin: '-20px' }}>
      <iframe 
        src={`${docAppUrl}?created_by=${encodeURIComponent(username)}`}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Document Generation"
      />
    </div>
  );
}

export default GenerateDoc;