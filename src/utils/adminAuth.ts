export interface AdminCredentials {
  username: string;
  password: string;
  updatedAt?: string;
}

const STORAGE_KEY = 'hatipoglu_admin_credentials_v1';

export const DEFAULT_ADMIN_CREDENTIALS: AdminCredentials = {
  username: 'admin',
  password: '1234',
};

export const normalizeAuthString = (val: string): string => {
  return val
    .trim()
    .toLowerCase()
    .replace(/[ıİiI]/g, 'i')
    .replace(/[ğĞgG]/g, 'g')
    .replace(/[üÜuU]/g, 'u')
    .replace(/[şŞsS]/g, 's')
    .replace(/[öÖoO]/g, 'o')
    .replace(/[çÇcC]/g, 'c');
};

export const getAdminCredentials = (): AdminCredentials => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.username === 'string' && typeof parsed.password === 'string') {
        return parsed;
      }
    }
  } catch {
    // fallback to default
  }
  return DEFAULT_ADMIN_CREDENTIALS;
};

export const saveAdminCredentials = (credentials: AdminCredentials): void => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      username: credentials.username.trim(),
      password: credentials.password.trim(),
      updatedAt: new Date().toISOString(),
    })
  );
};

export const resetAdminCredentials = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const verifyAdminLogin = (inputUser: string, inputPass: string): boolean => {
  const current = getAdminCredentials();
  const cleanInputUser = normalizeAuthString(inputUser);
  const cleanTargetUser = normalizeAuthString(current.username);

  const cleanInputPass = inputPass.trim();
  const cleanTargetPass = current.password.trim();

  // If custom credentials have been set
  if (cleanInputUser === cleanTargetUser && cleanInputPass === cleanTargetPass) {
    return true;
  }

  // If default credentials are in effect, also accept standard aliases
  const isDefault =
    current.username === DEFAULT_ADMIN_CREDENTIALS.username &&
    current.password === DEFAULT_ADMIN_CREDENTIALS.password;

  if (isDefault) {
    const isUserMatch =
      cleanInputUser === 'admin' ||
      cleanInputUser === 'hatipoglu' ||
      cleanInputUser === 'yonetici' ||
      cleanInputUser === 'acal4551@gmail.com' ||
      cleanInputUser === '';
    const isPassMatch =
      cleanInputPass === '1234' ||
      cleanInputPass === 'admin' ||
      cleanInputPass === '123456' ||
      cleanInputPass === '0000' ||
      normalizeAuthString(cleanInputPass) === 'hatipoglu';

    if (isUserMatch && isPassMatch) return true;
  }

  return false;
};
