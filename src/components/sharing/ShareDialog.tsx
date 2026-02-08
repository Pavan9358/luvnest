import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Share2,
  Copy,
  MessageCircle,
  Instagram,
  Download,
  QrCode,
  Check,
  ExternalLink,
} from "lucide-react";

interface ShareDialogProps {
  slug: string;
  title: string;
}

export function ShareDialog({ slug, title }: ShareDialogProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const pageUrl = `${window.location.origin}/love/${slug}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const message = encodeURIComponent(
      `💕 ${title}\n\nI made something special for you! Check it out:\n${pageUrl}`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const shareInstagram = () => {
    // Instagram doesn't support direct sharing via URL, so we copy the link
    navigator.clipboard.writeText(pageUrl);
    toast.success("Link copied! Share it in your Instagram story or bio.");
  };

  const downloadQRCode = () => {
    const svg = document.getElementById("love-page-qr");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `love-page-qr-${slug}.png`;
      link.href = pngUrl;
      link.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
    toast.success("QR code downloaded!");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Your Love Page
          </DialogTitle>
          <DialogDescription>
            Share this page with your special someone
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Copy Link */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Page Link</label>
            <div className="flex gap-2">
              <Input value={pageUrl} readOnly className="text-sm" />
              <Button
                variant="outline"
                size="icon"
                onClick={copyLink}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                asChild
                className="shrink-0"
              >
                <a href={pageUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Share via</label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="justify-start gap-2"
                onClick={shareWhatsApp}
              >
                <MessageCircle className="h-4 w-4 text-green-600" />
                WhatsApp
              </Button>
              <Button
                variant="outline"
                className="justify-start gap-2"
                onClick={shareInstagram}
              >
                <Instagram className="h-4 w-4 text-pink-600" />
                Instagram
              </Button>
            </div>
          </div>

          {/* QR Code */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              QR Code
            </label>
            <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-xl border">
              <QRCodeSVG
                id="love-page-qr"
                value={pageUrl}
                size={160}
                level="H"
                includeMargin
                fgColor="#e11d48"
                bgColor="#ffffff"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={downloadQRCode}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download QR Code
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
