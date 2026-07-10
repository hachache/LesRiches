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
    imageSrc?: string;
  };
};

const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1350;

function splitLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number) {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth || !current) {
      current = candidate;
      continue;
    }

    lines.push(current);
    current = word;
    if (lines.length === maxLines - 1) break;
  }

  if (current && lines.length < maxLines) lines.push(current);
  return lines;
}

function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
) {
  const lines = splitLines(ctx, text, maxWidth, maxLines);
  lines.forEach((line, index) => ctx.fillText(line, x, y + index * lineHeight));
  return y + lines.length * lineHeight;
}

function loadCanvasImage(src: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

async function drawShareCard(card: NonNullable<ShareResultButtonProps["card"]>) {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  await document.fonts?.ready;
  const displayFont = getComputedStyle(document.documentElement).getPropertyValue("--font-display").trim() || "Arial Narrow";

  ctx.fillStyle = "#f3efe6";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(17,16,14,0.08)";
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 54) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 54) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  ctx.fillStyle = "#d51f12";
  ctx.fillRect(72, 70, 10, 42);
  ctx.fillStyle = "#11100e";
  ctx.font = `700 24px ${displayFont}, Arial, sans-serif`;
  ctx.fillText("L'ÉCART", 102, 102);

  ctx.font = "700 22px Arial, sans-serif";
  ctx.fillStyle = "#686058";
  ctx.fillText(card.modeLabel.toUpperCase(), 72, 212);
  ctx.font = `500 74px ${displayFont}, Arial, sans-serif`;
  ctx.fillStyle = "#11100e";
  const amountBottom = drawWrappedText(ctx, card.amount, 72, 288, 930, 86, 2);

  ctx.fillStyle = "#d51f12";
  ctx.fillRect(76, amountBottom + 28, 6, 78);

  ctx.font = "700 20px Arial, sans-serif";
  ctx.fillStyle = "#686058";
  drawWrappedText(ctx, `FORTUNE ESTIMÉE DE ${card.billionaireName}`.toUpperCase(), 72, amountBottom + 168, 900, 28, 2);
  ctx.font = `500 64px ${displayFont}, Arial, sans-serif`;
  ctx.fillStyle = "#d51f12";
  const fortuneBottom = drawWrappedText(ctx, card.fortune, 72, amountBottom + 248, 900, 76, 2);

  ctx.font = "700 20px Arial, sans-serif";
  ctx.fillStyle = "#686058";
  ctx.fillText("L'ÉCART", 72, fortuneBottom + 86);
  ctx.font = `500 108px ${displayFont}, Arial, sans-serif`;
  ctx.fillStyle = "#11100e";
  const resultBottom = drawWrappedText(ctx, card.result.toUpperCase(), 72, fortuneBottom + 198, 930, 112, 3);

  ctx.font = `500 44px ${displayFont}, Arial, sans-serif`;
  ctx.fillStyle = "#d51f12";
  drawWrappedText(ctx, card.resultLabel.toUpperCase(), 72, resultBottom + 30, 900, 52, 2);

  const panelTop = 1082;
  ctx.fillStyle = "#11100e";
  ctx.fillRect(0, panelTop, canvas.width, canvas.height - panelTop);

  const portrait = card.imageSrc ? await loadCanvasImage(card.imageSrc) : null;
  if (portrait) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(128, panelTop + 112, 54, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(portrait, 74, panelTop + 58, 108, 108);
    ctx.restore();
  }

  ctx.fillStyle = "#f3efe6";
  ctx.font = "700 22px Arial, sans-serif";
  ctx.fillText("FORTUNE DE RÉFÉRENCE", portrait ? 216 : 72, panelTop + 92);
  ctx.font = `500 44px ${displayFont}, Arial, sans-serif`;
  drawWrappedText(ctx, card.billionaireName.toUpperCase(), portrait ? 216 : 72, panelTop + 146, 700, 52, 2);
  ctx.fillStyle = "#d51f12";
  ctx.font = "700 23px Arial, sans-serif";
  ctx.fillText("lecart.fr", 72, panelTop + 230);

  return canvas;
}

async function createShareImage(card: NonNullable<ShareResultButtonProps["card"]>) {
  const canvas = await drawShareCard(card);
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
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-black/15 bg-white/72 px-5 text-sm font-semibold text-[var(--foreground)] transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-white active:translate-y-px"
        >
          <DownloadSimple size={18} weight="bold" />
          Image
        </button>
      ) : null}
    </div>
  );
}
