import type { NextApiResponse } from "next";
import multer from "multer";
import { GridFSBucket, GridFSFile } from "mongodb";
import { connectNative } from "@/lib/db";

const upload = multer({ storage: multer.memoryStorage() });

function runMiddleware(req: any, res: any, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: any, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await runMiddleware(req, res, upload.single("video"));

  try {
    const db = await connectNative();
    const bucket = new GridFSBucket(db, { bucketName: "uploads" });

    const { buffer, originalname } = req.file;

    const uploadStream = bucket.openUploadStream(originalname);
    uploadStream.end(buffer);

    uploadStream.on("finish", (file: GridFSFile) => {
      res.status(200).json({ fileId: file._id, filename: file.filename });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
}


// app/api/upload/route.ts
// import { NextResponse } from "next/server";
// import { GridFSBucket } from "mongodb";
// import { connectNative } from "@/lib/db";

// // 🚨 IMPORTANT: turn off Next.js body parsing
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export async function POST(req: Request) {
//   try {
//     const db = await connectNative();
//     const bucket = new GridFSBucket(db, { bucketName: "uploads" });

//     // get raw stream from the request
//     const reader = req.body?.getReader();
//     if (!reader) {
//       return NextResponse.json({ error: "No file data" }, { status: 400 });
//     }

//     const uploadStream = bucket.openUploadStream(`video-${Date.now()}.webm`);

//     // pump request body into GridFS stream
//     async function pump() {
//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;
//         uploadStream.write(value);
//       }
//       uploadStream.end();
//     }

//     pump();

//     return new Promise((resolve, reject) => {
//       uploadStream.on("finish", (file) => {
//         resolve(
//           NextResponse.json({
//             fileId: file._id,
//             filename: file.filename,
//           })
//         );
//       });

//       uploadStream.on("error", (err) => {
//         console.error("Upload error:", err);
//         reject(
//           NextResponse.json({ error: "Upload failed" }, { status: 500 })
//         );
//       });
//     });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: "Upload failed" }, { status: 500 });
//   }
// }
