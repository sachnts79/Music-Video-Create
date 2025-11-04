
import React, { useRef, useState } from 'react';
import { UploadIcon, MusicIcon, CheckCircleIcon } from './IconComponents';

interface FileUploaderProps {
  id: string;
  label: string;
  accept: string;
  onFileChange: (file: File | null) => void;
  file: File | null;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ id, label, accept, onFileChange, file }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isImage = accept.startsWith('image/');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileChange(e.target.files[0]);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileChange(e.dataTransfer.files[0]);
      if (inputRef.current) {
        inputRef.current.files = e.dataTransfer.files;
      }
    }
  };

  return (
    <div className="bg-brand-surface p-6 rounded-2xl shadow-lg border border-brand-secondary h-full">
      <h3 className="text-lg font-semibold text-brand-accent mb-4">{label}</h3>
      <label
        htmlFor={id}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${isDragging ? 'border-brand-primary bg-brand-primary/10' : 'border-brand-secondary hover:border-brand-accent hover:bg-brand-bg'}`}
      >
        {file ? (
          <div className="text-center p-4">
            {isImage && file ? (
              <img src={URL.createObjectURL(file)} alt="Preview" className="max-h-36 rounded-lg mx-auto mb-2" />
            ) : (
              <MusicIcon className="w-16 h-16 mx-auto text-brand-primary mb-2" />
            )}
            <div className="flex items-center justify-center gap-2 text-green-400">
                <CheckCircleIcon className="w-5 h-5"/>
                <p className="text-sm font-medium break-all">{file.name}</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onFileChange(null);
                if (inputRef.current) {
                  inputRef.current.value = "";
                }
              }}
              className="mt-2 text-xs text-brand-text-secondary hover:text-brand-accent"
            >
              (Click to change)
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
            <UploadIcon className="w-10 h-10 mb-3 text-brand-text-secondary" />
            <p className="mb-2 text-sm text-brand-text-secondary">
              <span className="font-semibold text-brand-accent">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-brand-text-secondary">{isImage ? 'PNG, JPG, WEBP' : 'MP3, WAV, AAC'}</p>
          </div>
        )}
        <input ref={inputRef} id={id} type="file" className="hidden" accept={accept} onChange={handleFileChange} />
      </label>
    </div>
  );
};
   