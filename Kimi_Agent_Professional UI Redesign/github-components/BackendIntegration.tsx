import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Server, Key, FileText } from 'lucide-react';

export const BackendIntegration = () => {
  return (
    <section className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Backend Integration
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Connect your resume analyzer to a powerful backend for data persistence and advanced features.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Database className="w-8 h-8 mb-2 text-primary" />
            <CardTitle>Database Storage</CardTitle>
            <CardDescription>
              Store resume data, analysis results, and user profiles securely
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• PostgreSQL database</li>
              <li>• Automatic backups</li>
              <li>• Real-time data sync</li>
              <li>• Secure data encryption</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Server className="w-8 h-8 mb-2 text-primary" />
            <CardTitle>Edge Functions</CardTitle>
            <CardDescription>
              Run server-side code for AI analysis and processing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Serverless architecture</li>
              <li>• Auto-scaling</li>
              <li>• Low latency</li>
              <li>• Custom API endpoints</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Key className="w-8 h-8 mb-2 text-primary" />
            <CardTitle>Authentication</CardTitle>
            <CardDescription>
              Secure user authentication and authorization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Email/password login</li>
              <li>• OAuth providers</li>
              <li>• Row-level security</li>
              <li>• User sessions</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <FileText className="w-8 h-8 mb-2 text-primary" />
            <CardTitle>File Storage</CardTitle>
            <CardDescription>
              Store and manage resume files securely
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Secure file uploads</li>
              <li>• CDN delivery</li>
              <li>• Access control</li>
              <li>• Automatic optimization</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="text-center pt-8">
        <Button size="lg" className="text-lg px-8">
          Connect Backend
        </Button>
      </div>
    </section>
  );
};
