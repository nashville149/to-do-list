import { useState } from 'react';
import { Upload, File, Image, FileText, X, Download, Eye } from 'lucide-react';

const TaskAttachments = ({ taskId, attachments = [], onUpload, onDelete }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files) => {
    setUploading(true);
    const fileArray = Array.from(files);
    
    for (const file of fileArray) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        continue;
      }

      // Create file object
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileData = {
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          url: reader.result,
          uploadedAt: new Date()
        };
        onUpload(fileData);
      };
      reader.readAsDataURL(file);
    }
    
    setUploading(false);
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <Image size={24} style={{ color: 'var(--accent)' }} />;
    if (type.includes('pdf')) return <FileText size={24} style={{ color: 'var(--error)' }} />;
    return <File size={24} style={{ color: 'var(--textSecondary)' }} />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h4 style={{ color: 'var(--textPrimary)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Upload size={20} style={{ color: 'var(--accent)' }} />
        Attachments & Proof of Completion
      </h4>

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragActive ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: '8px',
          padding: '30px',
          textAlign: 'center',
          background: dragActive ? 'rgba(255, 138, 101, 0.1)' : 'var(--cardBg)',
          cursor: 'pointer',
          marginBottom: '20px',
          transition: 'all 0.3s ease'
        }}
      >
        <input
          type="file"
          id={`file-upload-${taskId}`}
          multiple
          onChange={handleChange}
          style={{ display: 'none' }}
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
        <label htmlFor={`file-upload-${taskId}`} style={{ cursor: 'pointer' }}>
          <Upload size={48} style={{ color: 'var(--accent)', marginBottom: '10px' }} />
          <div style={{ color: 'var(--textPrimary)', marginBottom: '5px', fontWeight: '500' }}>
            {uploading ? 'Uploading...' : 'Drop files here or click to upload'}
          </div>
          <div style={{ color: 'var(--textSecondary)', fontSize: '12px' }}>
            Supports: Images, PDF, Documents (Max 10MB)
          </div>
        </label>
      </div>

      {/* Attachments List */}
      {attachments.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {attachments.map((file) => (
            <div
              key={file.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                border: '2px solid var(--border)',
                borderRadius: '8px',
                background: 'var(--cardBg)',
                gap: '12px'
              }}
            >
              {getFileIcon(file.type)}
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  color: 'var(--textPrimary)',
                  fontWeight: '500',
                  fontSize: '14px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {file.name}
                </div>
                <div style={{ color: 'var(--textSecondary)', fontSize: '12px' }}>
                  {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {file.type.startsWith('image/') && (
                  <button
                    onClick={() => setPreviewFile(file)}
                    style={{
                      padding: '6px',
                      background: 'var(--accent)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title="Preview"
                  >
                    <Eye size={16} />
                  </button>
                )}
                
                <a
                  href={file.url}
                  download={file.name}
                  style={{
                    padding: '6px',
                    background: 'var(--success)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none'
                  }}
                  title="Download"
                >
                  <Download size={16} />
                </a>

                <button
                  onClick={() => onDelete(file.id)}
                  style={{
                    padding: '6px',
                    background: 'var(--error)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Delete"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Preview Modal */}
      {previewFile && (
        <div
          onClick={() => setPreviewFile(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '20px'
          }}
        >
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }}>
            <button
              onClick={() => setPreviewFile(null)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={20} />
            </button>
            <img
              src={previewFile.url}
              alt={previewFile.name}
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                borderRadius: '8px'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskAttachments;