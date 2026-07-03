import { NextRequest, NextResponse } from "next/server";

import { getSession } from "@/shared/auth/auth-session";
import { uploadImageToCloudinary } from "@/shared/storage/cloudinary-storage";

const ALLOWED_FOLDERS = ["profiles/avatars", "organizations/logos"] as const;
type AllowedFolder = (typeof ALLOWED_FOLDERS)[number];

function isAllowedFolder(folder: string): folder is AllowedFolder {
  return (ALLOWED_FOLDERS as readonly string[]).includes(folder);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = formData.get("folder");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Arquivo inválido" }, { status: 400 });
  }
  if (typeof folder !== "string" || !isAllowedFolder(folder)) {
    return NextResponse.json({ error: "Destino inválido" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Envie apenas arquivos de imagem" }, { status: 400 });
  }

  const result = await uploadImageToCloudinary(file, `marca-jogo/${folder}/${session.id}`);

  return NextResponse.json({ url: result.url });
}
