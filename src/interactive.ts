import fs from "fs";
import path from "path";
import prompts from "prompts";
import { readMetadata, writeTags, TagInput } from "./tagger";
import NodeID3 from "node-id3";

function norm(v: unknown): string {
    if (v == null) return "";
    if (Array.isArray(v)) return v.filter(Boolean).map(String).join(", ").trim();
    return String(v).trim();
}

function listRootMp3(): string[] {
    return fs.readdirSync(process.cwd())
        .filter(f => f.toLowerCase().endsWith(".mp3"))
        .map(f => path.resolve(f));
}

function listRootImages(): string[] {
    return fs.readdirSync(process.cwd())
        .filter(f => /\.(jpe?g|png)$/i.test(f))
        .map(f => path.resolve(f));
}

async function main() {
    const mp3s = listRootMp3();
    if (mp3s.length === 0) {
        console.error("Ana dizinde .mp3 bulunamadı. Lütfen mp3 dosyanızı ana dizine koyun.");
        process.exit(1);
    }

    const images = listRootImages();

    const { file } = await prompts({
        type: "select",
        name: "file",
        message: "Hangi MP3 düzenlenecek?",
        choices: mp3s.map(p => ({ title: path.basename(p), value: p }))
    });
    if (!file) process.exit(0);

    let before: any = {};
    try {
        before = await readMetadata(file);
        console.log("\n🎧 Mevcut metadata:");
        console.log(before);
    } catch (e: any) {
        console.warn("Metadata okunamadı:", e.message);
    }

    let coverPath: string | undefined;
    if (images.length > 0) {
        const { wantCover } = await prompts({
            type: "toggle",
            name: "wantCover",
            message: "Kapak resmi eklemek ister misin?",
            initial: false,
            active: "Evet",
            inactive: "Hayır"
        });
        if (wantCover) {
            const { cover } = await prompts({
                type: "select",
                name: "cover",
                message: "Kapak resmi seç (ana dizinden):",
                choices: images.map(p => ({ title: path.basename(p), value: p }))
            });
            coverPath = cover;
        }
    } else {
        console.log("⚠️ Ana dizinde kapak resmi (jpg/png) yok. Kapaksız devam edilecek.");
    }

    const currentYear = String(new Date().getFullYear());

    const answers = await prompts([
        { type: "text", name: "title", message: "Title (şarkı adı):", initial: norm(before.title) },
        { type: "text", name: "artist", message: "Artist (sanatçı):", initial: norm(before.artist) },
        { type: "text", name: "album", message: "Album:", initial: norm(before.album) },
        { type: "text", name: "year", message: "Year (örn: 2025):", initial: norm(before.year) || currentYear },
        { type: "text", name: "genre", message: "Genre (tür):", initial: norm(before.genre) },
    ]);

    const payload: TagInput = {};
    const title = norm(answers.title);
    const artist = norm(answers.artist);
    const album = norm(answers.album);
    const yearValue = norm(answers.year) || currentYear;
    const genreValue = norm(answers.genre);

    if (title) payload.title = title;
    if (artist) payload.artist = artist;
    if (album) payload.album = album;
    payload.year = yearValue;
    if (genreValue) payload.genre = genreValue;

    if (coverPath) payload.coverPath = coverPath;

    const { confirm } = await prompts({
        type: "confirm",
        name: "confirm",
        message: "Yazılsın mı?",
        initial: true
    });
    if (!confirm) {
        console.log("İptal edildi.");
        process.exit(0);
    }

    const ok = writeTags(file, payload);
    console.log(ok ? "✅ Meta veriler güncellendi." : "❌ Yazım başarısız.");

    const raw = NodeID3.read(file);
    console.log("\n🧾 ID3 (node-id3) raw yorum:", raw.comment);

    try {
        const after = await readMetadata(file);
        console.log("\n📦 Son metadata:");
        console.log(after);
    } catch (e: any) {
        console.warn("Son metadata okunamadı:", e.message);
    }
}

main().catch(e => {
    console.error("Beklenmeyen hata:", e);
    process.exit(1);
});
