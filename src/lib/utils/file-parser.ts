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
  requiresManualMapping?: boolean;
  detectedColumns?: string[];
  columnMapping?: Record<string, string>; // colonne CSV → champ système
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Dictionnaire multilingue pour la détection automatique des colonnes
const FIELD_MAPPINGS = {
  name: {
    fr: ["nom", "name", "prenom nom", "nom complet", "full name", "participant", "candidat"],
    en: ["name", "full name", "nom", "participant name", "candidate", "participant"],
  },
  email: {
    fr: ["email", "mail", "courriel", "e-mail", "adresse email"],
    en: ["email", "mail", "e-mail", "email address"],
  },
  phone: {
    fr: ["telephone", "phone", "tel", "portable", "mobile", "numero", "numéro"],
    en: ["phone", "telephone", "tel", "mobile", "cell", "phone number"],
  },
  profession: {
    fr: ["profession", "job", "metier", "poste", "titre", "fonction"],
    en: ["profession", "job", "title", "position", "role", "occupation"],
  },
} as const;

type FieldKey = keyof typeof FIELD_MAPPINGS;

function normalizeName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

// Détecte le champ correspondant à une colonne avec score de confiance
function detectField(columnName: string): { field: FieldKey | null; score: number } {
  const normalized = normalizeName(columnName);
  let bestMatch: { field: FieldKey | null; score: number } = { field: null, score: 0 };

  for (const [field, translations] of Object.entries(FIELD_MAPPINGS)) {
    // Test français
    for (const term of translations.fr) {
      const normalizedTerm = normalizeName(term);
      if (normalized === normalizedTerm) {
        return { field: field as FieldKey, score: 1.0 }; // Match exact - retour immédiat
      }
      if (normalized.includes(normalizedTerm) || normalizedTerm.includes(normalized)) {
        if (bestMatch.score < 0.8) {
          bestMatch = { field: field as FieldKey, score: 0.8 }; // Match partiel
        }
      }
    }
    // Test anglais
    for (const term of translations.en) {
      const normalizedTerm = normalizeName(term);
      if (normalized === normalizedTerm) {
        return { field: field as FieldKey, score: 1.0 }; // Match exact - retour immédiat
      }
      if (normalized.includes(normalizedTerm) || normalizedTerm.includes(normalized)) {
        if (bestMatch.score < 0.8) {
          bestMatch = { field: field as FieldKey, score: 0.8 }; // Match partiel
        }
      }
    }
  }

  return bestMatch;
}

export function detectFileType(file: File): "csv" | "xlsx" | "unknown" {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension === "csv") return "csv";
  if (extension === "xlsx" || extension === "xls") return "xlsx";
  return "unknown";
}

export async function parseParticipantFile(
  file: File,
  customMapping?: Record<string, string>
): Promise<ParseResult> {
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
      return await parseCSV(file, customMapping);
    } else {
      return await parseExcel(file, customMapping);
    }
  } catch (error) {
    return {
      success: false,
      participants: [],
      errors: [`Erreur lors du parsing: ${error instanceof Error ? error.message : "Erreur inconnue"}`],
    };
  }
}

// Fonction helper pour parser avec un mapping personnalisé
export async function parseWithMapping(
  file: File,
  mapping: Record<string, string>
): Promise<ParseResult> {
  return parseParticipantFile(file, mapping);
}

async function parseCSV(file: File, customMapping?: Record<string, string>): Promise<ParseResult> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
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

        // Récupérer les colonnes originales
        const firstRow = results.data[0] as Record<string, unknown>;
        const originalColumns = Object.keys(firstRow);
        
        // Détecter ou utiliser le mapping personnalisé
        let columnMapping: Record<string, string> = {};
        let requiresManualMapping = false;

        if (customMapping) {
          // Utiliser le mapping personnalisé fourni
          columnMapping = customMapping;
        } else {
          // Détection automatique
          const detectedMapping: Record<string, string> = {};
          let nameFieldDetected = false;

          for (const col of originalColumns) {
            const detection = detectField(col);
            if (detection.field && detection.score >= 0.7) {
              detectedMapping[col] = detection.field;
              if (detection.field === "name") {
                nameFieldDetected = true;
              }
            }
          }

          columnMapping = detectedMapping;

          // Si le champ name n'est pas détecté, mapping manuel requis
          if (!nameFieldDetected) {
            requiresManualMapping = true;
          }
        }

        // Si mapping manuel requis et pas de mapping personnalisé fourni
        if (requiresManualMapping && !customMapping) {
          resolve({
            success: false,
            participants: [],
            errors: ['Impossible de détecter automatiquement la colonne "nom". Mapping manuel requis.'],
            requiresManualMapping: true,
            detectedColumns: originalColumns,
            columnMapping: {},
          });
          return;
        }

        // Parser les données avec le mapping
        results.data.forEach((row: unknown, index: number) => {
          const rowData = row as Record<string, unknown>;
          const participant: Partial<ParsedParticipant> = {};

          // Mapper chaque colonne vers le champ système
          for (const [csvColumn, systemField] of Object.entries(columnMapping)) {
            if (systemField && systemField !== "ignore" && rowData[csvColumn] !== undefined) {
              const value = rowData[csvColumn]?.toString().trim();
              if (value) {
                participant[systemField as keyof ParsedParticipant] = value as never;
              }
            }
          }

          // Vérifier que le nom est présent
          if (!participant.name) {
            errors.push(`Ligne ${index + 2}: Le nom est requis`);
            return;
          }

          // Valider avec le schéma Zod
          const validation = invitedParticipantSchema.safeParse(participant);
          if (!validation.success) {
            errors.push(
              `Ligne ${index + 2}: ${validation.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")}`
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
            detectedColumns: originalColumns,
            columnMapping,
          });
          return;
        }

        resolve({
          success: errors.length === 0,
          participants,
          errors,
          detectedColumns: originalColumns,
          columnMapping,
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

async function parseExcel(file: File, customMapping?: Record<string, string>): Promise<ParseResult> {
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

        // Récupérer les colonnes originales
        const firstRow = jsonData[0] as Record<string, unknown>;
        const originalColumns = Object.keys(firstRow);

        // Détecter ou utiliser le mapping personnalisé
        let columnMapping: Record<string, string> = {};
        let requiresManualMapping = false;

        if (customMapping) {
          // Utiliser le mapping personnalisé fourni
          columnMapping = customMapping;
        } else {
          // Détection automatique
          const detectedMapping: Record<string, string> = {};
          let nameFieldDetected = false;

          for (const col of originalColumns) {
            const detection = detectField(col);
            if (detection.field && detection.score >= 0.7) {
              detectedMapping[col] = detection.field;
              if (detection.field === "name") {
                nameFieldDetected = true;
              }
            }
          }

          columnMapping = detectedMapping;

          // Si le champ name n'est pas détecté, mapping manuel requis
          if (!nameFieldDetected) {
            requiresManualMapping = true;
          }
        }

        // Si mapping manuel requis et pas de mapping personnalisé fourni
        if (requiresManualMapping && !customMapping) {
          resolve({
            success: false,
            participants: [],
            errors: ['Impossible de détecter automatiquement la colonne "nom". Mapping manuel requis.'],
            requiresManualMapping: true,
            detectedColumns: originalColumns,
            columnMapping: {},
          });
          return;
        }

        // Parser les données avec le mapping
        jsonData.forEach((row: unknown, index: number) => {
          const rowData = row as Record<string, unknown>;
          const participant: Partial<ParsedParticipant> = {};

          // Mapper chaque colonne vers le champ système
          for (const [csvColumn, systemField] of Object.entries(columnMapping)) {
            if (systemField && systemField !== "ignore" && rowData[csvColumn] !== undefined) {
              const value = rowData[csvColumn]?.toString().trim();
              if (value) {
                participant[systemField as keyof ParsedParticipant] = value as never;
              }
            }
          }

          // Vérifier que le nom est présent
          if (!participant.name) {
            errors.push(`Ligne ${index + 2}: Le nom est requis`);
            return;
          }

          // Valider avec le schéma Zod
          const validation = invitedParticipantSchema.safeParse(participant);
          if (!validation.success) {
            errors.push(
              `Ligne ${index + 2}: ${validation.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")}`
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
            detectedColumns: originalColumns,
            columnMapping,
          });
          return;
        }

        resolve({
          success: errors.length === 0,
          participants,
          errors,
          detectedColumns: originalColumns,
          columnMapping,
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
