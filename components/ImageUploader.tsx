
import React, { useRef } from 'react';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  previewUrl: string | null;
  disabled: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, previewUrl, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <div 
      className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 group ${
        disabled ? 'bg-gray-50 border-gray-200 cursor-not-allowed' : 
        previewUrl ? 'border-indigo-400 bg-indigo-50/30' : 'border-gray-300 hover:border-indigo-400 bg-white hover:bg-indigo-50/10 cursor-pointer'
      }`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => !disabled && fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleChange} 
        accept="image/*"
        disabled={disabled}
      />

      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        {previewUrl ? (
          <div className="relative">
            <img 
              src={previewUrl} 
              alt="Upload preview" 
              className="max-h-64 rounded-xl shadow-md object-contain border-4 border-white" 
            />
            {!disabled && (
              <div className="absolute -top-3 -right-3 bg-indigo-600 text-white p-2 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                <i className="fas fa-exchange-alt"></i>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="w-16 h-16 mb-4 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
              <i className="fas fa-cloud-upload-alt text-2xl"></i>
            </div>
            <p className="text-lg font-semibold text-gray-800">Drop your character here</p>
            <p className="text-sm text-gray-500 mt-1 italic">JPG, PNG or WebP</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
