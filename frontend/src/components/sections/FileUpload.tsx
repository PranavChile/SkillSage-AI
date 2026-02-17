import { useCallback, useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, CheckCircle, X, FileText, Loader2, Shield, Zap, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import gsap from 'gsap';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isUploading?: boolean;
  uploadProgress?: number;
}

export const FileUpload = ({ 
  onFileUpload, 
  isUploading = false,
}: FileUploadProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([leftPanelRef.current, rightPanelRef.current], {
        opacity: 0,
        y: 40,
      });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gsap.to(leftPanelRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: 'expo.out',
              });
              gsap.to(rightPanelRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.7,
                delay: 0.2,
                ease: 'expo.out',
              });
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );

      if (sectionRef.current) {
        observer.observe(sectionRef.current);
      }

      return () => observer.disconnect();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
      ];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload a PDF or Word document (.pdf, .doc, .docx)',
          variant: 'destructive',
        });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please upload a file smaller than 10MB',
          variant: 'destructive',
        });
        return;
      }

      setUploadedFile(file);
      onFileUpload(file);
      toast({
        title: 'File uploaded successfully',
        description: `${file.name} is ready for analysis`,
      });
    }
  }, [onFileUpload, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
    },
    multiple: false,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze your resume in seconds',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and never shared with third parties',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get comprehensive analysis and suggestions immediately',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: CheckCircle,
      title: 'Free Forever',
      description: 'All core features available at no cost',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.pdf')) return <FileText className="h-8 w-8 text-red-500" />;
    return <FileText className="h-8 w-8 text-blue-500" />;
  };

  return (
    <section ref={sectionRef} id="upload-section" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Upload Your Resume
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start your career analysis by uploading your resume. Our AI will analyze it and provide comprehensive insights.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Panel - Upload Zone */}
          <div ref={leftPanelRef}>
            <Card className="overflow-hidden border-2 border-dashed border-border/50 hover:border-primary/50 transition-colors duration-300">
              <CardContent className="p-0">
                <div
                  {...getRootProps()}
                  className={`
                    relative p-8 sm:p-12 text-center cursor-pointer transition-all duration-300
                    ${isDragActive || isDragging ? 'bg-primary/5' : 'bg-card'}
                    ${isUploading ? 'pointer-events-none' : ''}
                  `}
                >
                  <input {...getInputProps()} />
                  
                  {/* Upload Content */}
                  <div className="space-y-6">
                    {isUploading ? (
                      <div className="space-y-4">
                        <div className="relative w-20 h-20 mx-auto">
                          <Loader2 className="w-20 h-20 text-primary animate-spin" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold">Uploading...</h3>
                          <Progress value={65} className="w-full max-w-xs mx-auto" />
                          <p className="text-sm text-muted-foreground">Processing...</p>
                        </div>
                      </div>
                    ) : uploadedFile ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center">
                          <div className="relative">
                            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                              <CheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFile();
                              }}
                              className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold text-foreground">File Ready!</h3>
                          <div className="flex items-center justify-center gap-2 text-muted-foreground">
                            {getFileIcon(uploadedFile.name)}
                            <span className="font-medium">{uploadedFile.name}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Size: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className={`
                          w-24 h-24 mx-auto rounded-2xl flex items-center justify-center transition-all duration-300
                          ${isDragActive ? 'bg-primary/20 scale-110' : 'bg-primary/10'}
                        `}>
                          <Upload className={`
                            w-12 h-12 transition-all duration-300
                            ${isDragActive ? 'text-primary animate-bounce' : 'text-primary/60'}
                          `} />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold text-foreground">
                            {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
                          </h3>
                          <p className="text-muted-foreground">
                            or click to browse files
                          </p>
                          <p className="text-sm text-muted-foreground/70">
                            Supports PDF, DOC, DOCX (Max 10MB)
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Ripple Effect on Drag */}
                  {(isDragActive || isDragging) && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute inset-0 border-2 border-primary rounded-lg animate-pulse" />
                    </div>
                  )}
                </div>

                {/* File Type Indicators */}
                {!uploadedFile && !isUploading && (
                  <div className="px-6 py-4 bg-muted/50 border-t border-border">
                    <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-red-500" />
                        <span>PDF</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <span>DOC</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span>DOCX</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Note */}
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Lock className="w-4 h-4" />
              <span>Your resume is securely processed and never stored permanently</span>
            </div>
          </div>

          {/* Right Panel - Features */}
          <div ref={rightPanelRef} className="space-y-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group card-hover border-border/50 overflow-hidden"
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`
                      p-3 rounded-xl ${feature.bgColor} transition-transform duration-300 group-hover:scale-110
                    `}>
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FileUpload;
