import JSZip from 'jszip';
import { GoldItem, StoreConfig } from '../types';
import {
  generateIOSExpoAppCode,
  generateIOSPackageJson,
  generateIOSAppJson,
  generateCodemagicYaml,
  generateIOSEasJson,
  generateExportOptionsPlist,
  generatePrepareExportOptionsScript,
  generateHKMonogramSvg,
} from './mobileExport';

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string;
}

/**
 * Validate token and get user profile
 */
export async function validateGitHubToken(token: string): Promise<GitHubUser> {
  const cleanToken = token.trim();
  const res = await fetch('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${cleanToken}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Geçersiz GitHub Token. Lütfen token bilginizi kontrol edin.');
    }
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || `GitHub Bağlantı Hatası (HTTP ${res.status})`);
  }

  return await res.json();
}

/**
 * Get or create repository
 */
export async function getOrCreateRepo(
  token: string,
  owner: string,
  repoName: string,
  isPrivate = false
): Promise<{ full_name: string; html_url: string; default_branch: string }> {
  const cleanToken = token.trim();
  const cleanRepo = repoName.trim().replace(/^.*github\.com\//, '').replace(/\.git$/, '');
  const repoSlug = cleanRepo.includes('/') ? cleanRepo.split('/')[1] : cleanRepo;

  // Check if exists
  const checkRes = await fetch(`https://api.github.com/repos/${owner}/${repoSlug}`, {
    headers: {
      Authorization: `Bearer ${cleanToken}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (checkRes.ok) {
    return await checkRes.json();
  }

  // Create repository if not found
  const createRes = await fetch('https://api.github.com/user/repos', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cleanToken}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: repoSlug,
      description: 'Hatipoğlu Kuyumculuk Canlı Altın Takip ve iOS Mobil Uygulaması',
      private: isPrivate,
      auto_init: true,
    }),
  });

  if (!createRes.ok) {
    const errData = await createRes.json().catch(() => ({}));
    throw new Error(errData.message || `Depo oluşturulamadı (HTTP ${createRes.status})`);
  }

  return await createRes.json();
}

/**
 * Convert string to UTF-8 base64
 */
function toBase64Utf8(str: string): string {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => {
    return String.fromCharCode(parseInt(p1, 16));
  }));
}

/**
 * Upload or update a single file in repository
 */
async function uploadFileToGitHub(
  token: string,
  owner: string,
  repo: string,
  path: string,
  content: string,
  commitMessage: string,
  branch = 'main'
): Promise<void> {
  const cleanToken = token.trim();
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;

  // Check existing file SHA
  let existingSha: string | undefined;
  try {
    const getRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    if (getRes.ok) {
      const data = await getRes.json();
      existingSha = data.sha;
    }
  } catch {
    // File doesn't exist yet
  }

  const putRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${cleanToken}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: commitMessage,
      content: toBase64Utf8(content),
      branch: branch,
      ...(existingSha ? { sha: existingSha } : {}),
    }),
  });

  if (!putRes.ok) {
    const errData = await putRes.json().catch(() => ({}));
    throw new Error(`"${path}" yüklenemedi: ${errData.message || putRes.statusText}`);
  }
}

/**
 * Compile-time raw source file map using Vite's import.meta.glob.
 * This guarantees zero runtime HTTP calls to the Vite dev server, completely
 * preventing dependency pre-bundling collisions or Node.js binary loader errors.
 */
const sourceFilesRecord = import.meta.glob(
  [
    '../*.{ts,tsx,css}',
    '../components/**/*.{ts,tsx}',
    '../utils/**/*.{ts,tsx}',
    '../data/**/*.{ts,tsx}',
  ],
  { query: '?raw', import: 'default', eager: true }
) as Record<string, string>;

/**
 * Collect all essential project files to push to GitHub
 */
export async function collectProjectFiles(
  storeConfig: StoreConfig,
  items: GoldItem[]
): Promise<Record<string, string>> {
  const files: Record<string, string> = {};

  // Standard static configuration files
  files['package.json'] = JSON.stringify({
    name: 'hatipoglu-gold-ios',
    private: true,
    version: '1.0.0',
    main: 'App.js',
    scripts: {
      dev: 'vite --port=3000 --host=0.0.0.0',
      build: 'vite build',
      preview: 'vite preview',
      lint: 'tsc --noEmit',
      start: 'npx react-native start',
      ios: 'npx react-native run-ios',
      'build:codemagic': 'codemagic-cli build',
      'prebuild:ios': 'npx expo prebuild --platform ios',
      'pod:install': 'cd ios && pod install',
      postinstall: 'node scripts/prepare-export-options.js',
    },
    dependencies: {
      '@tailwindcss/vite': '^4.1.14',
      '@vitejs/plugin-react': '^5.0.4',
      jszip: '^3.10.2',
      'lucide-react': '^0.546.0',
      motion: '^12.23.24',
      react: '^19.0.1',
      'react-dom': '^19.0.1',
      expo: '~52.0.30',
      'expo-status-bar': '~2.0.1',
      'react-native': '0.76.6',
      'react-native-safe-area-context': '4.12.0',
      'expo-build-properties': '~0.13.2',
    },
    devDependencies: {
      '@types/node': '^22.14.0',
      '@types/react': '^19.0.10',
      '@types/react-dom': '^19.0.4',
      tailwindcss: '^4.1.14',
      typescript: '~5.8.2',
      vite: '^6.2.3',
    },
  }, null, 2);

  files['index.html'] = `<!doctype html>
<html lang="tr">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/hk-monogram.svg" />
    <link rel="apple-touch-icon" href="/hk-monogram.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>${storeConfig.brandName} ${storeConfig.subtitle} - Canlı Altın & Döviz</title>
  </head>
  <body class="bg-[#02050E] text-slate-100 antialiased select-none">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;

  files['vite.config.ts'] = `import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
`;

  files['tsconfig.json'] = JSON.stringify({
    compilerOptions: {
      target: 'ES2022',
      useDefineForClassFields: true,
      lib: ['ES2022', 'DOM', 'DOM.Iterable'],
      module: 'ESNext',
      skipLibCheck: true,
      moduleResolution: 'bundler',
      allowImportingTsExtensions: true,
      isolatedModules: true,
      moduleDetection: 'force',
      noEmit: true,
      jsx: 'react-jsx',
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true,
    },
    include: ['src'],
  }, null, 2);

  files['.gitignore'] = `node_modules/
dist/
build/
.DS_Store
*.log
.env
.env.local
`;

  files['README.md'] = `# ⚜️ ${storeConfig.brandName} ${storeConfig.subtitle}
> Canlı Altın, Ziynet ve Döviz Fiyat Takip & Codemagic.io Tabanlı iOS Mobil Uygulaması

Bu proje **Hatipoğlu Kuyumculuk** için tasarlanmış modern web panosu ve **Codemagic.io CI/CD (Apple App Store / TestFlight)** destekli iOS mobil uygulamasını içerir.

## 🚀 Web Kurulumu ve Çalıştırma
\`\`\`bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
\`\`\`

## 📱 Codemagic.io ile Apple TestFlight / App Store Dağıtımı
Proje kök dizininde **\`codemagic.yaml\`** dosyası hazırdır:
1. **https://codemagic.io** adresine GitHub hesabınızla giriş yapın.
2. Bu depoyu ekleyin (Add application).
3. Codemagic \`codemagic.yaml\` dosyasını otomatik algılar.
4. App Store Connect API anahtarınızı tanımlayın ve **"Start new build"** butonuna basın.
5. Buluttaki Mac Mini M2 sunucularında derlenip otomatik olarak **TestFlight** ve **App Store Connect**'e gönderilir.

## 💻 Mac'te Yerel Test
\`\`\`bash
npm install
npx expo prebuild --platform ios
cd ios && pod install && cd ..
npx react-native run-ios
\`\`\`

## 🛠️ Yönetici Paneli
Yönetici paneli üzerinden Kapalıçarşı çarpan formülleri, alarm seviyeleri ve WhatsApp bültenleri anlık olarak yönetilebilir.
`;

  // Populate source code files from compile-time raw bundles
  for (const [key, content] of Object.entries(sourceFilesRecord)) {
    // Convert '../App.tsx' -> 'src/App.tsx'
    const targetPath = key.replace(/^\.\.\//, 'src/');
    if (content) {
      files[targetPath] = content;
    }
  }

  // Application metadata
  files['metadata.json'] = JSON.stringify(
    {
      name: `${storeConfig.brandName} ${storeConfig.subtitle}`,
      description: 'Kapalıçarşı Canlı Altın, Ziynet ve Döviz Fiyat Takip Sistemi',
    },
    null,
    2
  );

  // Root codemagic.yaml (MANDATORY for Codemagic.io CI/CD Cloud Builds)
  files['codemagic.yaml'] = generateCodemagicYaml(storeConfig);

  // GitHub Actions Workflow (Fixes 'Dependencies lock file is not found' and validates build)
  files['.github/workflows/main.yml'] = `name: EAS Build

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build:
    name: Install and Build
    runs-on: ubuntu-latest
    steps:
      - name: Check out repository
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm install --legacy-peer-deps

      - name: Validate & Build Project
        run: npm run build
`;

  // Apple Export Options for Codemagic CI/CD (Resolves /Users/builder/export_options.plist missing error)
  files['export_options.plist'] = generateExportOptionsPlist();
  files['scripts/prepare-export-options.js'] = generatePrepareExportOptionsScript();

  // Authentic 3D Gold HK Monogram vector SVG from user photo
  files['public/hk-monogram.svg'] = generateHKMonogramSvg();

  // Root app.json (Apple Bundle ID & iOS configuration)
  files['app.json'] = generateIOSAppJson(storeConfig);

  // Root entrypoint forwarder
  files['App.js'] = `import { registerRootComponent } from 'expo';\nimport App from './ios-codemagic/App';\n\nregisterRootComponent(App);\n\nexport default App;\n`;

  // Backward compatibility fallback for EAS if needed
  files['eas.json'] = generateIOSEasJson();

  // Add iOS Codemagic standalone project in a dedicated folder
  files['ios-codemagic/App.tsx'] = generateIOSExpoAppCode(storeConfig, items);
  files['ios-codemagic/package.json'] = generateIOSPackageJson(storeConfig);
  files['ios-codemagic/app.json'] = generateIOSAppJson(storeConfig);
  files['ios-codemagic/codemagic.yaml'] = generateCodemagicYaml(storeConfig);
  files['ios-codemagic/README.md'] = `#  ${storeConfig.brandName} - Codemagic iOS Paketi\n\nCodemagic.io (Mac Mini M2 / Xcode 16 / iOS 18 SDK) uyumludur.\n\n1. \`https://codemagic.io\` sitesinde GitHub deponuzu bağlayın.\n2. \`codemagic.yaml\` otomatik algılanır ve TestFlight için derleme başlar.\n3. Yerel çalıştırma: \`npx expo prebuild --platform ios && cd ios && pod install && npx react-native run-ios\``;

  // Also maintain ios-expo/ folder as symlink/alias to prevent any broken links
  files['ios-expo/App.tsx'] = generateIOSExpoAppCode(storeConfig, items);
  files['ios-expo/package.json'] = generateIOSPackageJson(storeConfig);
  files['ios-expo/app.json'] = generateIOSAppJson(storeConfig);
  files['ios-expo/codemagic.yaml'] = generateCodemagicYaml(storeConfig);

  return files;
}

/**
 * Direct push all files to GitHub repository
 */
export async function pushProjectToGitHub(
  token: string,
  owner: string,
  repo: string,
  storeConfig: StoreConfig,
  items: GoldItem[],
  commitMessage = 'feat: Hatipoğlu Kuyumculuk iOS & Web Projesi Güncellemesi',
  branch = 'main',
  onProgress?: (message: string, percent: number) => void
): Promise<{ repoUrl: string; totalFiles: number }> {
  onProgress?.('Proje dosyaları taranıyor ve toplanıyor...', 5);
  const files = await collectProjectFiles(storeConfig, items);
  const fileEntries = Object.entries(files);
  const total = fileEntries.length;

  onProgress?.(`Toplam ${total} dosya tespit edildi, GitHub deposu hazırlanıyor...`, 15);

  let current = 0;
  for (const [path, content] of fileEntries) {
    current++;
    const pct = Math.round(15 + (current / total) * 80);
    onProgress?.(`[${current}/${total}] "${path}" GitHub'a yükleniyor...`, pct);
    await uploadFileToGitHub(token, owner, repo, path, content, commitMessage, branch);
  }

  onProgress?.('Tüm dosyalar başarıyla GitHub deposuna aktarıldı!', 100);

  return {
    repoUrl: `https://github.com/${owner}/${repo}`,
    totalFiles: total,
  };
}

/**
 * Trigger download of full GitHub-ready project ZIP
 */
export async function downloadGitHubProjectZip(storeConfig: StoreConfig, items: GoldItem[]) {
  const zip = new JSZip();
  const files = await collectProjectFiles(storeConfig, items);

  for (const [path, content] of Object.entries(files)) {
    zip.file(path, content);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'hatipoglu-kuyumculuk-github-repo.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
