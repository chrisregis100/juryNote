import Papa from "papaparse";
import * as XLSX from "xlsx";
import { invitedParticipantSchema } from "@/lib/validations/participant";

export interface ParsedParticipant {
  name: string;
  email?: string;
  phone?: string;
  profession?: string;
}

export interface ParseResult {
  success: boolean;
  participants: ParsedParticipant[];
  errors: string[];
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function normalizeName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function detectFileType(file: File): "csv" | "xlsx" | "unknown" {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension === "csv") return "csv";
  if (extension === "xlsx" || extension === "xls") return "xlsx";
  return "unknown";
}

export async function parseParticipantFile(file: File): Promise<ParseResult> {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      participants: [],
      errors: [`Le fichier est trop volumineux. Taille maximale: ${MAX_FILE_SIZE / 1024 / 1024}MB`],
    };
  }

  const fileType = detectFileType(file);
  if (fileType === "unknown") {
    return {
      success: false,
      participants: [],
      errors: ["Format de fichier non supporté. Utilisez CSV ou Excel (.xlsx)"],
    };
  }

  try {
    if (fileType === "csv") {
      return await parseCSV(file);
    } else {
      return await parseExcel(file);
    }
  } catch (error) {
    return {
      success: false,
      participants: [],
      errors: [`Erreur lors du parsing: ${error instanceof Error ? error.message : "Erreur inconnue"}`],
    };
  }
}

async function parseCSV(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => {
        // Normalize header names (case-insensitive, handle accents)
        const normalized = normalizeName(header);
        if (normalized.includes("nom") || normalized.includes("name")) return "name";
        if (normalized.includes("email") || normalized.includes("mail")) return "email";
        if (normalized.includes("telephone") || normalized.includes("phone") || normalized.includes("tel")) return "phone";
        if (normalized.includes("profession") || normalized.includes("job") || normalized.includes("metier")) return "profession";
        return header;
      },
      complete: (results) => {
        const errors: string[] = [];
        const participants: ParsedParticipant[] = [];

        if (!results.data || results.data.length === 0) {
          resolve({
            success: false,
            participants: [],
            errors: ["Le fichier est vide ou ne contient aucune donnée"],
          });
          return;
        }

        // Check if 'name' column exists
        const firstRow = results.data[0] as Record<string, unknown>;
        if (!firstRow.name && !firstRow.nom) {
          resolve({
            success: false,
            participants: [],
            errors: ['Le fichier doit contenir une colonne "nom" ou "name"'],
          });
          return;
        }

        results.data.forEach((row: unknown, index: number) => {
          const rowData = row as Record<string, unknown>;
          const participant = {
            name: (rowData.name || rowData.nom || "").toString().trim(),
            email: rowData.email ? rowData.email.toString().trim() : undefined,
            phone: rowData.phone ? rowData.phone.toString().trim() : undefined,
            profession: rowData.profession ? rowData.profession.toString().trim() : undefined,
          };

          // Validate name is not empty
          if (!participant.name) {
            errors.push(`Ligne ${index + 2}: Le nom est requis`);
            return;
          }

          // Validate with Zod schema
          const validation = invitedParticipantSchema.safeParse(participant);
          if (!validation.success) {
            errors.push(
              `Ligne ${index + 2}: ${validation.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")}`
            );
            return;
          }

          participants.push(validation.data);
        });

        if (participants.length === 0) {
          resolve({
            success: false,
            participants: [],
            errors: errors.length > 0 ? errors : ["Aucun participant valide trouvé dans le fichier"],
          });
          return;
        }

        resolve({
          success: errors.length === 0,
          participants,
          errors,
        });
      },
      error: (error) => {
        resolve({
          success: false,
          participants: [],
          errors: [`Erreur CSV: ${error.message}`],
        });
      },
    });
  });
}

async function parseExcel(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

        if (!jsonData || jsonData.length === 0) {
          resolve({
            success: false,
            participants: [],
            errors: ["Le fichier est vide ou ne contient aucune donnée"],
          });
          return;
        }

        const errors: string[] = [];
        const participants: ParsedParticipant[] = [];

        // Normalize headers
        const normalizedData = jsonData.map((row: unknown) => {
          const rowData = row as Record<string, unknown>;
          const normalized: Record<string, unknown> = {};
          Object.keys(rowData).forEach((key) => {
            const normalizedKey = normalizeName(key);
            if (normalizedKey.includes("nom") || normalizedKey.includes("name")) {
              normalized.name = rowData[key];
            } else if (normalizedKey.includes("email") || normalizedKey.includes("mail")) {
              normalized.email = rowData[key];
            } else if (normalizedKey.includes("telephone") || normalizedKey.includes("phone") || normalizedKey.includes("tel")) {
              normalized.phone = rowData[key];
            } else if (normalizedKey.includes("profession") || normalizedKey.includes("job") || normalizedKey.includes("metier")) {
              normalized.profession = rowData[key];
            }
          });
          return normalized;
        });

        // Check if name column exists
        if (!normalizedData[0]?.name) {
          resolve({
            success: false,
            participants: [],
            errors: ['Le fichier doit contenir une colonne "nom" ou "name"'],
          });
          return;
        }

        normalizedData.forEach((row, index) => {
          const participant = {
            name: (row.name || "").toString().trim(),
            email: row.email ? row.email.toString().trim() : undefined,
            phone: row.phone ? row.phone.toString().trim() : undefined,
            profession: row.profession ? row.profession.toString().trim() : undefined,
          };

          if (!participant.name) {
            errors.push(`Ligne ${index + 2}: Le nom est requis`);
            return;
          }

          const validation = invitedParticipantSchema.safeParse(participant);
          if (!validation.success) {
            errors.push(
              `Ligne ${index + 2}: ${validation.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")}`
            );
            return;
          }

          participants.push(validation.data);
        });

        if (participants.length === 0) {
          resolve({
            success: false,
            participants: [],
            errors: errors.length > 0 ? errors : ["Aucun participant valide trouvé dans le fichier"],
          });
          return;
        }

        resolve({
          success: errors.length === 0,
          participants,
          errors,
        });
      } catch (error) {
        resolve({
          success: false,
          participants: [],
          errors: [`Erreur Excel: ${error instanceof Error ? error.message : "Erreur inconnue"}`],
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        participants: [],
        errors: ["Erreur lors de la lecture du fichier"],
      });
    };

    reader.readAsArrayBuffer(file);
  });
}
