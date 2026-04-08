import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import plcLogo from "@assets/plc-logo.jpg";

interface CertificateProps {
  staffName: string;
  community: string;
  scorePercent: number;
  score: number;
  totalQuestions: number;
  completedAt: string;
  certificateId: string;
}

export function CompletionCertificate({
  staffName,
  community,
  scorePercent,
  score,
  totalQuestions,
  completedAt,
  certificateId,
}: CertificateProps) {
  const certRef = useRef<HTMLDivElement>(null);

  const dateStr = new Date(completedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  function handlePrint() {
    const el = certRef.current;
    if (!el) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificate - ${staffName}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'DM Sans', sans-serif; background: white; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
          @media print { body { margin: 0; } @page { size: landscape; margin: 0; } }
          .cert { width: 1056px; height: 728px; position: relative; background: white; overflow: hidden; }
          .border-frame { position: absolute; inset: 16px; border: 3px solid #1a6b6a; border-radius: 8px; }
          .inner-frame { position: absolute; inset: 22px; border: 1px solid #1a6b6a40; border-radius: 4px; }
          .corner-accent { position: absolute; width: 60px; height: 60px; }
          .corner-accent.tl { top: 28px; left: 28px; border-top: 3px solid #1a6b6a; border-left: 3px solid #1a6b6a; }
          .corner-accent.tr { top: 28px; right: 28px; border-top: 3px solid #1a6b6a; border-right: 3px solid #1a6b6a; }
          .corner-accent.bl { bottom: 28px; left: 28px; border-bottom: 3px solid #1a6b6a; border-left: 3px solid #1a6b6a; }
          .corner-accent.br { bottom: 28px; right: 28px; border-bottom: 3px solid #1a6b6a; border-right: 3px solid #1a6b6a; }
          .content { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 60px 80px; text-align: center; }
          .logo { width: 64px; height: 64px; border-radius: 12px; object-fit: cover; margin-bottom: 12px; }
          .org-name { font-size: 12px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: #1a6b6a; margin-bottom: 24px; }
          .cert-title { font-family: 'Playfair Display', Georgia, serif; font-size: 36px; font-weight: 600; color: #1a1a1a; margin-bottom: 6px; }
          .cert-subtitle { font-size: 14px; color: #666; margin-bottom: 28px; }
          .recipient { font-family: 'Playfair Display', Georgia, serif; font-size: 32px; font-weight: 700; color: #1a6b6a; padding: 8px 0; border-bottom: 2px solid #1a6b6a30; margin-bottom: 20px; min-width: 400px; }
          .desc { font-size: 14px; color: #555; line-height: 1.7; max-width: 600px; margin-bottom: 28px; }
          .score-badge { display: inline-flex; align-items: center; gap: 8px; background: #f0faf9; border: 1px solid #1a6b6a30; border-radius: 999px; padding: 6px 20px; font-size: 13px; color: #1a6b6a; font-weight: 600; margin-bottom: 28px; }
          .footer { display: flex; justify-content: space-between; align-items: flex-end; width: 100%; max-width: 600px; }
          .footer-item { text-align: center; }
          .footer-label { font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px; }
          .footer-value { font-size: 13px; color: #333; font-weight: 500; }
          .divider-line { width: 100px; border-bottom: 1px solid #ccc; margin: 0 auto 4px; }
        </style>
      </head>
      <body>
        ${el.innerHTML}
        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }

  async function handleShare() {
    const shareData = {
      title: `DiningRD Certification - ${staffName}`,
      text: `${staffName} has successfully completed the Priority Life Care DiningRD Training Platform assessment with a score of ${scorePercent}%. Certificate ID: ${certificateId}`,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareData.text);
        alert("Certificate details copied to clipboard!");
      } catch {
        // fallback
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* Certificate visual */}
      <div className="overflow-x-auto">
        <div
          ref={certRef}
          className="mx-auto"
          style={{ width: "100%", maxWidth: "792px", aspectRatio: "11/7.5" }}
        >
          <div className="cert relative bg-white rounded-lg shadow-lg overflow-hidden w-full h-full">
            {/* Border frame */}
            <div className="absolute inset-3 border-[2.5px] border-[#1a6b6a] rounded-md" />
            <div className="absolute inset-[18px] border border-[#1a6b6a40] rounded-sm" />
            {/* Corner accents */}
            <div className="absolute top-5 left-5 w-10 h-10 border-t-[2.5px] border-l-[2.5px] border-[#1a6b6a]" />
            <div className="absolute top-5 right-5 w-10 h-10 border-t-[2.5px] border-r-[2.5px] border-[#1a6b6a]" />
            <div className="absolute bottom-5 left-5 w-10 h-10 border-b-[2.5px] border-l-[2.5px] border-[#1a6b6a]" />
            <div className="absolute bottom-5 right-5 w-10 h-10 border-b-[2.5px] border-r-[2.5px] border-[#1a6b6a]" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-10 py-8 lg:px-16 lg:py-10 text-center">
              <img src={plcLogo} alt="PLC" className="w-12 h-12 lg:w-14 lg:h-14 rounded-lg object-cover mb-2" />
              <div className="text-[10px] lg:text-xs font-semibold tracking-[3px] uppercase text-[#1a6b6a] mb-4">
                Priority Life Care
              </div>

              <h2 className="font-serif text-xl lg:text-2xl font-semibold text-gray-900 mb-1"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Certificate of Completion
              </h2>
              <p className="text-[10px] lg:text-xs text-gray-500 mb-4">DiningRD Training Platform Assessment</p>

              <div className="text-lg lg:text-2xl font-bold text-[#1a6b6a] pb-1.5 border-b-2 border-[#1a6b6a30] mb-3 min-w-[250px] lg:min-w-[320px]"
                   style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                   data-testid="cert-name">
                {staffName}
              </div>

              {community && (
                <div className="text-[10px] lg:text-xs text-gray-500 mb-2 tracking-wide uppercase">
                  {community}
                </div>
              )}

              <p className="text-[10px] lg:text-xs text-gray-600 leading-relaxed max-w-[420px] mb-4">
                Has successfully demonstrated proficiency in the DiningRD platform,
                covering menu management, meal card operations, tableside ordering,
                and person-centered dining practices for Priority Life Care communities.
              </p>

              <div className="inline-flex items-center gap-2 bg-[#f0faf9] border border-[#1a6b6a30] rounded-full px-4 py-1 text-[11px] lg:text-xs text-[#1a6b6a] font-semibold mb-4">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Score: {scorePercent}% ({score}/{totalQuestions})
              </div>

              <div className="flex justify-between items-end w-full max-w-[400px]">
                <div className="text-center">
                  <div className="w-20 border-b border-gray-300 mb-1 mx-auto" />
                  <div className="text-[8px] lg:text-[9px] text-gray-400 uppercase tracking-wider mb-0.5">Date</div>
                  <div className="text-[10px] lg:text-xs text-gray-700 font-medium">{dateStr}</div>
                </div>
                <div className="text-center">
                  <div className="w-20 border-b border-gray-300 mb-1 mx-auto" />
                  <div className="text-[8px] lg:text-[9px] text-gray-400 uppercase tracking-wider mb-0.5">Certificate ID</div>
                  <div className="text-[10px] lg:text-xs text-gray-700 font-medium">{certificateId}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button variant="outline" size="sm" onClick={handlePrint} data-testid="button-print-cert">
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Print / Save PDF
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare} data-testid="button-share-cert">
          <Share2 className="w-3.5 h-3.5 mr-1.5" />
          Share
        </Button>
      </div>
    </div>
  );
}
