import React from 'react';
import { X, Feather, Scroll, ShieldCheck, Key } from 'lucide-react';

interface CodexArtifact {
  title: string;
  subtitle: string;
  latinMotto: string;
  chapter: string;
  provenance: string;
  curatorNotes: string[];
  transcription: string;
}

interface CodexModalProps {
  isOpen: boolean;
  artifact: CodexArtifact | null;
  onClose: () => void;
}

export const CodexModal: React.FC<CodexModalProps> = ({ isOpen, artifact, onClose }) => {
  if (!isOpen || !artifact) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-[#141414] border-2 border-[#800A16]/80 rounded-2xl shadow-[0_12px_48px_rgba(0,0,0,0.8)] overflow-hidden text-[#F4ECD8] max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Ornate Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#181818] border-b border-[#2C4233]/70">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#800A16]" />
            <span className="text-xs font-cinzel tracking-[0.2em] text-[#EADBB6] uppercase font-bold">
              {artifact.chapter} · The Wallachian Vellum
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#EADBB6]/70 hover:text-white hover:bg-[#111111] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          
          {/* Header */}
          <div className="space-y-1.5 text-center pb-4 border-b border-[#2C4233]/40">
            <span className="text-[11px] font-cinzel tracking-[0.25em] text-[#800A16] uppercase font-bold">
              {artifact.provenance}
            </span>
            <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-[#F4ECD8]">
              {artifact.title}
            </h2>
            <p className="text-xs font-cinzel italic text-[#EADBB6]/70">
              "{artifact.latinMotto}"
            </p>
          </div>

          {/* Manuscript Transcription Box (Parchment Styled) */}
          <div className="p-5 rounded-xl bg-[#F5EFEB] text-[#181818] border border-[#D5C9BE] space-y-2 shadow-inner">
            <div className="flex items-center gap-2 text-[10px] font-cinzel text-[#800A16] uppercase tracking-widest font-bold">
              <Scroll className="w-3.5 h-3.5" />
              <span>Codex Manuscript Transcription</span>
            </div>
            <p className="font-editorial italic text-base leading-relaxed text-[#2B2B2B]">
              "{artifact.transcription}"
            </p>
          </div>

          {/* Curators Annotations */}
          <div className="space-y-3">
            <h3 className="text-xs font-cinzel tracking-[0.18em] text-[#EADBB6] uppercase font-bold">
              Archival Curatorial Annotations:
            </h3>
            <div className="space-y-2">
              {artifact.curatorNotes.map((note, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-[#181818] border border-[#2C4233]/60 text-xs font-editorial text-[#EADBB6]/90 flex items-start gap-3"
                >
                  <span className="text-[#800A16] font-cinzel font-bold text-xs shrink-0 mt-0.5">
                    0{idx + 1}.
                  </span>
                  <span>{note}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 px-6 bg-[#111111] border-t border-[#2C4233]/40 flex items-center justify-between text-xs font-cinzel text-[#EADBB6]/60">
          <span>Sealed in the High Vault of Curtea de Argeș</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-[#800A16] hover:bg-[#6A040F] text-[#F4ECD8] text-xs font-cinzel uppercase tracking-wider"
          >
            Close Codex
          </button>
        </div>

      </div>
    </div>
  );
};
