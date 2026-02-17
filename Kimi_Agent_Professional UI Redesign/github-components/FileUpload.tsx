import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isUploading?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isUploading = false }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or Word document (.pdf, .doc, .docx)",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }

      setUploadedFile(file);
      onFileUpload(file);
      toast({
        title: "File uploaded successfully",
        description: `${file.name} is ready for analysis`,
      });
    }
  }, [onFileUpload, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
    },
    multiple: false
  });

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-8">
        <div
          {...getRootProps()}
          className={`upload-zone cursor-pointer border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
            isDragActive 
              ? 'border-primary bg-primary/5 shadow-glow' 
              : 'border-border hover:border-primary hover:bg-primary/5'
          } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center space-y-4">
            {uploadedFile ? (
              <>
                <CheckCircle className="h-16 w-16 text-secondary animate-bounce" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">File Uploaded Successfully!</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <File className="h-4 w-4" />
                    {uploadedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Size: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </>
            ) : (
              <>
                <Upload className={`h-16 w-16 ${isDragActive ? 'text-primary animate-bounce' : 'text-muted-foreground'}`} />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    {isDragActive ? 'Drop your resume here' : 'Upload Your Resume'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Drag & drop your resume here, or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports PDF, DOC, DOCX files (max 10MB)
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
        
        {!uploadedFile && (
          <div className="mt-4 flex justify-center">
            <Button variant="professional" size="lg" className="w-full sm:w-auto">
              Choose File
            </Button>
          </div>
        )}
        
        {uploadedFile && (
          <div className="mt-4 flex justify-center">
            <Button 
              variant="outline" 
              onClick={() => {
                setUploadedFile(null);
                // Reset the upload
              }}
            >
              Upload Different File
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};