import fs from 'fs';
import path from 'path';

export interface LookbookItem {
  id: string;
  image: string;
  title: string;
  productSlug?: string;
  productTitle?: string;
  orientation: 'portrait' | 'landscape';
}

const LOOKBOOK_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'lookbook.json');

export function getLookbookItems(): LookbookItem[] {
  try {
    if (!fs.existsSync(LOOKBOOK_FILE_PATH)) {
      return [];
    }
    const rawData = fs.readFileSync(LOOKBOOK_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(rawData);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('[lookbookStore] Error reading lookbook.json:', error);
    return [];
  }
}

export function saveLookbookItems(items: LookbookItem[]): boolean {
  try {
    const dir = path.dirname(LOOKBOOK_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOOKBOOK_FILE_PATH, JSON.stringify(items, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('[lookbookStore] Error writing to lookbook.json:', error);
    return false;
  }
}

export function addLookbookItem(item: Omit<LookbookItem, 'id'> & { id?: string }): LookbookItem {
  const items = getLookbookItems();
  const newItem: LookbookItem = {
    id: item.id || `look-${Date.now()}`,
    image: item.image,
    title: item.title,
    productSlug: item.productSlug || 'xsign-flex-tee',
    productTitle: item.productTitle || 'X-SIGN Flex Tee',
    orientation: item.orientation || 'portrait',
  };

  items.unshift(newItem); // Add new model shots to the top
  saveLookbookItems(items);
  return newItem;
}

export function deleteLookbookItem(id: string): boolean {
  const items = getLookbookItems();
  const filtered = items.filter((item) => item.id !== id);
  if (filtered.length === items.length) {
    return false;
  }
  return saveLookbookItems(filtered);
}
