"use client";

import { useState } from "react";
import { Copy, DownloadSimple, ShareNetwork } from "@phosphor-icons/react";

type ShareResultButtonProps = {
  summary: string;
  card?: {
    modeLabel: string;
    amount: string;
    billionaireName: string;
    fortune: string;
    result: string;
    resultLabel: string;
  };
};

function drawShareCard(card: NonNullable<ShareResultButtonProps["card"]>) {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 1500;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#f3efe6";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(17,16,14,0.08)";
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 72) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 72) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  ctx.fillStyle = "#d51f12";
  ctx.fillRect(92, 84, 10, 42);
  ctx.fillStyle = "#11100e";
  ctx.font = "700 28px Arial";
  ctx.fillText("L'ECART", 122, 116);

  ctx.font = "700 26px Arial";
  ctx.fillStyle = "#686058";
  ctx.fillText(card.modeLabel.toUpperCase(), 92, 248);
  ctx.font = "700 86px Arial";
  ctx.fillStyle = "#11100e";
  ctx.fillText(card.amount, 92, 340);

  ctx.fillStyle = "#d51f12";
  ctx.fillRect(96, 420, 6, 96);

  ctx.font = "700 26px Arial";
  ctx.fillStyle = "#686058";
  ctx.fillText(`FORTUNE ESTIMEE DE ${card.billionaireName}`.toUpperCase(), 92, 600);
  ctx.font = "700 88px Arial";
  ctx.fillStyle = "#d51f12";
  ctx.fillText(card.fortune, 92, 702);

  ctx.font = "700 28px Arial";
  ctx.fillStyle = "#686058";
  ctx.fillText("RESULTAT", 92, 860);
  ctx.font = "800 132px Arial";
  ctx.fillStyle = "#11100e";
  const resultLines = card.result.length > 18 ? card.result.split(" ") : [card.result];
  resultLines.slice(0, 3).forEach((line, index) => ctx.fillText(line, 92, 1000 + index * 124));

  ctx.font = "700 48px Arial";
  ctx.fillStyle = "#d51f12";
  ctx.fillText(card.resultLabel.toUpperCase(), 92, 1330);

  ctx.font = "600 30px Arial";
  ctx.fillStyle = "#686058";
  ctx.fillText("lecart.fr", 92, 1424);

  return canvas;
}

async function createShareImage(card: NonNullable<ShareResultButtonProps["card"]>) {
  const canvas = drawShareCard(card);
  if (!canvas) return null;

  return new Promise<File | null>((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve(null);
        return;
      }
      resolve(new File([blob], "lecart-comparaison.png", { type: "image/png" }));
    }, "image/png");
  });
}

export function ShareResultButton({ summary, card }: ShareResultButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function share() {
    if (card) {
      const image = await createShareImage(card);
      if (image && navigator.canShare?.({ files: [image] })) {
        await navigator.share({ title: "L'Écart", text: summary, files: [image] });
        return;
      }
    }
    if (navigator.share) {
      await navigator.share({ title: "L'Écart", text: summary, url: window.location.href });
      return;
    }
    await copy();
  }

  async function downloadImage() {
    if (!card) {
      await copy();
      return;
    }

    const image = await createShareImage(card);
    if (!image) return;
    const url = URL.createObjectURL(image);
    const link = document.createElement("a");
    link.href = url;
    link.download = image.name;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-2 sm:flex sm:flex-wrap">
      <button
        type="button"
        onClick={copy}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--panel)] px-5 text-sm font-semibold text-[var(--foreground)] transition hover:bg-white active:translate-y-px"
      >
        <Copy size={18} weight="bold" />
        {copied ? "Résumé copié" : "Copier le résumé"}
      </button>
      <button
        type="button"
        onClick={share}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--accent-dark)] active:translate-y-px"
      >
        <ShareNetwork size={18} weight="bold" />
        Partager
      </button>
      {card ? (
        <button
          type="button"
          onClick={downloadImage}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/16 bg-white/8 px-5 text-sm font-semibold text-white transition hover:bg-white/14 active:translate-y-px"
        >
          <DownloadSimple size={18} weight="bold" />
          Image
        </button>
      ) : null}
    </div>
  );
}
