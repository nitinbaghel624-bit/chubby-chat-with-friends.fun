import React, { useState } from 'react';
import { FLUTTER_CODEBASE } from '../../data/flutterCodebase';
import { KOTLIN_CODEBASE, KotlinFile } from '../../data/kotlinCodebase';
import { FlutterFile } from '../../types';
import {
  Code,
  Copy,
  Check,
  Download,
  FileCode,
  FolderTree,
  Flame,
  Shield,
  Layers,
  Terminal,
  ExternalLink,
  Sparkles,
  Smartphone
} from 'lucide-react';
import JSZip from 'jszip';
import confetti from 'canvas-confetti';

type FrameworkTab = 'kotlin_compose' | 'flutter_dart';

export const CodeViewer: React.FC = () => {
  const [framework, setFramework] = useState<FrameworkTab>('kotlin_compose');
  const [selectedKotlinFile, setSelectedKotlinFile] = useState<KotlinFile>(KOTLIN_CODEBASE[0]);
  const [selectedFlutterFile, setSelectedFlutterFile] = useState<FlutterFile>(FLUTTER_CODEBASE[0]);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const currentFile = framework === 'kotlin_compose' ? selectedKotlinFile : selectedFlutterFile;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();

      // Populate Flutter files
      FLUTTER_CODEBASE.forEach((file) => {
        zip.file(`flutter/${file.path}`, file.code);
      });

      // Populate Kotlin Compose files
      KOTLIN_CODEBASE.forEach((file) => {
        zip.file(`android_kotlin/${file.path}`, file.code);
      });

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'chubby_chat_complete_source.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Trigger celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6C3BFF', '#FF3B80', '#00D1FF', '#FFD700']
      });
    } catch (e) {
      console.error('Failed to create zip', e);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0E0720] text-white rounded-3xl border border-[#6C3BFF]/30 overflow-hidden shadow-[0_0_50px_rgba(108,59,255,0.25)] font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header Bar */}
      <div className="p-4 bg-[#170D38] border-b border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-[#6C3BFF] text-white shadow-[0_0_15px_rgba(108,59,255,0.5)]">
            <Code className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2 font-['Syne',sans-serif] tracking-tight">
              SOURCE CODE VIEWER
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#00D1FF]/20 text-[#00D1FF] font-mono font-black border border-[#00D1FF]/40 uppercase">
                v2.0.0
              </span>
            </h2>
            <p className="text-xs text-white/60 font-medium">
              Kotlin + Jetpack Compose & Flutter with Firestore Membership + Gift backend
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Framework Switcher */}
          <div className="flex items-center p-1 bg-black/40 rounded-2xl border border-white/10">
            <button
              onClick={() => setFramework('kotlin_compose')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                framework === 'kotlin_compose'
                  ? 'bg-[#6C3BFF] text-white shadow-[0_0_12px_rgba(108,59,255,0.5)]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Kotlin + Compose</span>
            </button>
            <button
              onClick={() => setFramework('flutter_dart')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                framework === 'flutter_dart'
                  ? 'bg-[#6C3BFF] text-white shadow-[0_0_12px_rgba(108,59,255,0.5)]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Flutter Dart</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-black uppercase tracking-wider text-white border border-white/10 flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-[#00D1FF] stroke-[2.5]" /> : <Copy className="w-4 h-4 text-[#00D1FF] stroke-[2.5]" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>

          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#6C3BFF] to-[#FF3B80] hover:opacity-95 text-white text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(108,59,255,0.5)] flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-40"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>{isZipping ? 'Generating...' : 'Download (.ZIP)'}</span>
          </button>
        </div>
      </div>

      {/* Code Editor & File Tree Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar File Tree */}
        <div className="w-full md:w-72 bg-[#0E0720] border-r border-white/10 flex flex-col shrink-0 overflow-y-auto max-h-48 md:max-h-full">
          <div className="p-3 text-[10px] font-black text-white/50 uppercase tracking-widest flex items-center gap-1.5 border-b border-white/5">
            <FolderTree className="w-3.5 h-3.5 text-[#00D1FF]" />
            {framework === 'kotlin_compose' ? 'Kotlin Jetpack Files' : 'Flutter Dart Files'}
          </div>

          <div className="p-2 space-y-1">
            {framework === 'kotlin_compose'
              ? KOTLIN_CODEBASE.map((file) => {
                  const isSelected = selectedKotlinFile.path === file.path;
                  return (
                    <button
                      key={file.path}
                      onClick={() => setSelectedKotlinFile(file)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 transition-all ${
                        isSelected
                          ? 'bg-[#6C3BFF]/20 text-[#00D1FF] font-black border border-[#6C3BFF]/50 shadow-sm'
                          : 'text-white/70 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#00D1FF]' : 'text-white/40'}`} />
                      <span className="truncate">{file.filename}</span>
                    </button>
                  );
                })
              : FLUTTER_CODEBASE.map((file) => {
                  const isSelected = selectedFlutterFile.path === file.path;
                  return (
                    <button
                      key={file.path}
                      onClick={() => setSelectedFlutterFile(file)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2 transition-all ${
                        isSelected
                          ? 'bg-[#6C3BFF]/20 text-[#00D1FF] font-black border border-[#6C3BFF]/50 shadow-sm'
                          : 'text-white/70 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#00D1FF]' : 'text-white/40'}`} />
                      <span className="truncate">{file.filename}</span>
                    </button>
                  );
                })}
          </div>
        </div>

        {/* Code Viewer Main Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#070312]">
          {/* File Meta Header */}
          <div className="px-4 py-2.5 bg-[#170D38] border-b border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-white font-bold">{currentFile.path}</span>
              <span className="text-[9px] px-2 py-0.5 rounded bg-white/10 text-white/60 font-mono font-black uppercase">
                {currentFile.language}
              </span>
            </div>
            <span className="text-[11px] text-white/50 italic hidden sm:inline font-medium">
              {currentFile.description}
            </span>
          </div>

          {/* Syntax Code Editor */}
          <div className="flex-1 overflow-auto p-4 font-['JetBrains_Mono',monospace] text-xs text-white/90 bg-[#070312] leading-relaxed">
            <pre className="whitespace-pre">
              <code>{currentFile.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
