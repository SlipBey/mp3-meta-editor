import fs from "fs";
import path from "path";
import mm from "music-metadata";
import NodeID3, { Tags } from "node-id3";

export type TagInput = {
    title?: string;
    artist?: string;
    album?: string;
    year?: string | number;
    genre?: string;
    coverPath?: string;
};

export async function readMetadata(filePath: string) {
    const meta = await mm.parseFile(filePath);
    return meta.common;
}

export function writeTags(filePath: string, input: TagInput): boolean {
    const tags: Tags = {};

    if (input.title) tags.title = String(input.title);
    if (input.artist) tags.artist = String(input.artist);
    if (input.album) tags.album = String(input.album);
    if (input.year) tags.year = String(input.year);
    if (input.genre) tags.genre = String(input.genre);

    if (input.coverPath) {
        const abs = path.resolve(input.coverPath);
        if (fs.existsSync(abs)) {
            const buf = fs.readFileSync(abs);
            tags.image = {
                mime: abs.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg",
                type: { id: 3, name: "front cover" },
                description: "Cover",
                imageBuffer: buf
            };
        } else {
            console.warn(`⚠️ Kapak bulunamadı: ${abs}`);
        }
    }

    const result = NodeID3.update(tags, filePath);
    if (result instanceof Error) {
        console.error("❌ Tag yazılırken hata:", result.message);
        return false;
    }
    return result;
}