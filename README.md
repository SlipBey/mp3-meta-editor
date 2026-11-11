# 🎧 MP3 Meta Editor (CLI)

A simple and elegant **Node.js + TypeScript** command-line tool that lets you **view and edit MP3 metadata** (ID3 tags) directly from your terminal — without any external GUI software.

This project was built with love for developers who like to keep their tools minimal and efficient.

---

## ✨ Features

- 🔍 Automatically detects all `.mp3` files in the current directory  
- 🖼️ Supports adding a **cover image** (JPG or PNG)  
- 📝 Edit all key metadata fields:
  - Title  
  - Artist  
  - Album  
  - Year (auto-fills current year if empty)  
  - Genre  
  - Comment (with language and descriptor support)  
- 💾 Preserves existing data — just press **Enter** to keep the current value  
- ⚙️ Uses [`music-metadata`](https://github.com/Borewit/music-metadata) for reading and writing
- 🧩 Built entirely in **TypeScript**, ready for future expansion

---

## 🚀 Usage

### 1. Install dependencies

```bash
npm install
```

### 2. Build the project

```bash
npm run build
```

### 3. Run the editor

```bash
node dist/interactive.js
```

You’ll be guided step-by-step in the terminal to select your MP3 file and edit its metadata interactively.

---

## 🖋 Example

```
🎧 Mevcut metadata:
{
  title: "Küllerimden",
  artist: "Slipbey",
  album: "Sessizliğin Yankısı",
  genre: ["Rock"],
  year: 2025
}

⚠️ Ana dizinde kapak resmi (jpg/png) yok. Kapaksız devam edilecek.
√ Title (şarkı adı): ... Küllerimden
√ Artist (sanatçı): ... Slipbey
√ Album: ... Sessizliğin Yankısı
√ Year (örn: 2025): ... 2025
√ Genre (tür): ... Rock
√ Comment (not): ... test
√ Comment language (örn: eng): ... tr
√ Comment descriptor (opsiyonel): ... tst
√ Yazılsın mı? ... yes
✅ Meta veriler güncellendi.
```

---

## 🧠 Tech Stack

| Layer | Library |
|-------|----------|
| Metadata Reader | [`music-metadata`](https://www.npmjs.com/package/music-metadata) |
| Metadata Writer | [`music-metadata`](https://www.npmjs.com/package/music-metadata) |
| CLI Prompts | [`prompts`](https://www.npmjs.com/package/prompts) |
| Language | TypeScript |
| Runtime | Node.js |

---

## ⚙️ Project Structure

```
src/
├── interactive.ts  # CLI entry point (prompts, logic)
└── tagger.ts       # Metadata read/write utilities
```

Build output is generated under `dist/`.

---

## 💡 Developer Notes

- The script edits **ID3v2 tags** safely without damaging your MP3 file.
- You can keep your original files in place; the tool updates them directly.
- It’s lightweight — zero external dependencies beyond npm packages.

---

## 🛠️ Roadmap

- [ ] RESTful **API version** of the same functionality  
- [ ] Bulk edit support for multiple MP3s  
- [ ] Metadata templates & auto-fill (for albums or podcasts)  
- [ ] Optional JSON export/import for tag backups  

*(API support will come later — stay tuned!)*

---

## 🤝 Contributing

If you find a bug or have an idea to improve the tool, feel free to open a pull request or share feedback.

---

## 🧾 License

GPL-3.0 license © 2025 — Created by Slipbey  
Feel free to use, modify, and distribute with attribution.

---

> _"For those who love clean code and good music."_ 🎶

### Local editor integration

Requires Node.js 22 or newer. The reader and writer both use [`music-metadata`](https://github.com/Borewit/music-metadata) ^12.4.0. No local editor checkout or sibling package is needed; `music-metadata` handles both reading and writing directly.

Writes are awaited before reporting success or reading the updated metadata.
New tags use ID3v2.4; existing supported v2.4 fields are preserved. Legacy
ID3v2.2/v2.3 updates fail without replacing the original file, rather than
discarding unedited fields. Blank CLI answers retain existing fields; they do
not delete tags. Write failures exit with status 1.
