import fs from "fs";
import path from "path";
import type { TagPatch } from "music-metadata" with { "resolution-mode": "import" };

export type TagInput = {
    title?: string;
    artist?: string;
    album?: string;
    year?: string | number;
    genre?: string;
    coverPath?: string;
};

export async function readMetadata(filePath: string) {
    const { parseFile } = await import("music-metadata");
    const meta = await parseFile(filePath);
    return meta.common;
}

export async function writeTags(filePath: string, input: TagInput): Promise<boolean> {
    const tags: TagPatch = {};

    if (input.title) tags.title = String(input.title);
    if (input.artist) tags.artist = String(input.artist);
    if (input.album) tags.album = String(input.album);
    if (input.year) tags.date = String(input.year);
    if (input.genre) tags.genre = String(input.genre);

    if (input.coverPath) {
        const abs = path.resolve(input.coverPath);
        if (fs.existsSync(abs)) {
            const buf = fs.readFileSync(abs);
            tags.picture = [{
                format: abs.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg",
                type: "Cover (front)",
                description: "Cover",
                data: buf
            }];
        } else {
            console.warn(`⚠️ Kapak bulunamadı: ${abs}`);
        }
    }

    const { updateFile } = await import("music-metadata");
    await updateFile(filePath, tags);
    return true;
}
