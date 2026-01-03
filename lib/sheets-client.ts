/**
 * Google Sheets Database Client
 * 
 * This provides a Supabase-compatible interface that uses Google Sheets as the backend.
 * Replace SHEETS_API_URL with your deployed Google Apps Script Web App URL.
 */

const SHEETS_API_URL = process.env.NEXT_PUBLIC_SHEETS_API_URL || '';

interface SheetResponse<T> {
  data: T | null;
  error: { message: string } | null;
}

/**
 * Query builder that mimics Supabase syntax
 */
class SheetsQueryBuilder<T = any> {
  private sheetName: string;
  private filters: Record<string, any> = {};
  private selectFields: string[] = [];

  constructor(sheetName: string) {
    this.sheetName = sheetName;
  }

  select(fields: string = '*'): this {
    if (fields !== '*') {
      this.selectFields = fields.split(',').map(f => f.trim());
    }
    return this;
  }

  eq(column: string, value: any): this {
    this.filters[column] = value;
    return this;
  }

  async single(): Promise<SheetResponse<T>> {
    const result = await this.execute();
    if (result.error) return result as SheetResponse<T>;
    
    const data = Array.isArray(result.data) ? result.data[0] : result.data;
    return { data: data || null, error: null };
  }

  async execute(): Promise<SheetResponse<T[]>> {
    try {
      const url = new URL(SHEETS_API_URL);
      url.searchParams.set('sheet', this.sheetName);
      
      // Add filter params
      Object.entries(this.filters).forEach(([key, value]) => {
        url.searchParams.set(key, String(value));
      });

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      let data = await response.json();

      // Apply filters on client side (since Apps Script doesn't support complex queries)
      if (Object.keys(this.filters).length > 0 && Array.isArray(data)) {
        data = data.filter((row: any) => {
          return Object.entries(this.filters).every(([key, value]) => row[key] === value);
        });
      }

      // Apply field selection
      if (this.selectFields.length > 0 && Array.isArray(data)) {
        data = data.map((row: any) => {
          const filtered: any = {};
          this.selectFields.forEach(field => {
            if (row[field] !== undefined) {
              filtered[field] = row[field];
            }
          });
          return filtered;
        });
      }

      return { data, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { message: error instanceof Error ? error.message : 'Unknown error' } 
      };
    }
  }

  // Alias for execute
  then<TResult>(
    onfulfilled?: ((value: SheetResponse<T[]>) => TResult | PromiseLike<TResult>) | null
  ): Promise<TResult> {
    return this.execute().then(onfulfilled);
  }
}

/**
 * Insert builder
 */
class SheetsInsertBuilder<T = any> {
  private sheetName: string;
  private data: Partial<T> | Partial<T>[];

  constructor(sheetName: string, data: Partial<T> | Partial<T>[]) {
    this.sheetName = sheetName;
    this.data = data;
  }

  async select(): Promise<SheetResponse<T>> {
    try {
      const response = await fetch(SHEETS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          sheet: this.sheetName,
          data: this.data
        })
      });

      const result = await response.json();
      
      if (result.error) {
        return { data: null, error: { message: result.error } };
      }

      return { data: result as T, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { message: error instanceof Error ? error.message : 'Insert failed' } 
      };
    }
  }
}

/**
 * Update builder
 */
class SheetsUpdateBuilder<T = any> {
  private sheetName: string;
  private updateData: Partial<T>;
  private filters: Record<string, any> = {};

  constructor(sheetName: string, data: Partial<T>) {
    this.sheetName = sheetName;
    this.updateData = data;
  }

  eq(column: string, value: any): this {
    this.filters[column] = value;
    return this;
  }

  async select(): Promise<SheetResponse<T>> {
    try {
      const response = await fetch(SHEETS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          sheet: this.sheetName,
          data: { ...this.updateData, ...this.filters }
        })
      });

      const result = await response.json();
      
      if (result.error) {
        return { data: null, error: { message: result.error } };
      }

      return { data: result as T, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: { message: error instanceof Error ? error.message : 'Update failed' } 
      };
    }
  }
}

/**
 * Main Sheets client - Supabase-compatible interface
 */
export const sheetsDb = {
  from<T = any>(tableName: string) {
    return {
      select(fields: string = '*') {
        return new SheetsQueryBuilder<T>(tableName).select(fields);
      },
      insert(data: Partial<T> | Partial<T>[]) {
        return new SheetsInsertBuilder<T>(tableName, data);
      },
      update(data: Partial<T>) {
        return new SheetsUpdateBuilder<T>(tableName, data);
      },
      upsert(data: Partial<T>, options?: { onConflict?: string }) {
        // For sheets, upsert = insert (Apps Script handles duplicates)
        return new SheetsInsertBuilder<T>(tableName, data);
      }
    };
  }
};

/**
 * Check if Sheets API is configured
 */
export function isSheetsConfigured(): boolean {
  return !!SHEETS_API_URL && SHEETS_API_URL.includes('script.google.com');
}

/**
 * Test connection to Sheets API
 */
export async function testSheetsConnection(): Promise<{ connected: boolean; error?: string }> {
  if (!isSheetsConfigured()) {
    return { connected: false, error: 'NEXT_PUBLIC_SHEETS_API_URL not configured' };
  }

  try {
    const url = new URL(SHEETS_API_URL);
    url.searchParams.set('sheet', 'Vehicles');
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    await response.json();
    return { connected: true };
  } catch (error) {
    return { 
      connected: false, 
      error: error instanceof Error ? error.message : 'Connection failed' 
    };
  }
}

// Default export for drop-in replacement
export default sheetsDb;
