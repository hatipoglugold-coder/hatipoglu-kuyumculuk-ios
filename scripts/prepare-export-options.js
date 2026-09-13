import fs from 'fs';
import path from 'path';

const plistContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>destination</key>
    <string>export</string>
    <key>signingStyle</key>
    <string>automatic</string>
    <key>stripSwiftSymbols</key>
    <true/>
    <key>uploadSymbols</key>
    <true/>
    <key>compileBitcode</key>
    <false/>
</dict>
</plist>
`;

// 1. Root export_options.plist
try {
  const rootPlist = path.resolve(process.cwd(), 'export_options.plist');
  fs.writeFileSync(rootPlist, plistContent, 'utf8');
  console.log('[Codemagic Prep] Root export_options.plist ready.');
} catch (err) {
  console.warn('[Codemagic Prep] Could not write root export_options.plist:', err);
}

// 2. Codemagic builder default path: /Users/builder/export_options.plist
try {
  if (fs.existsSync('/Users/builder')) {
    fs.writeFileSync('/Users/builder/export_options.plist', plistContent, 'utf8');
    console.log('[Codemagic Prep] /Users/builder/export_options.plist created successfully for Codemagic!');
  }
} catch {
  // Safe to ignore if not on Codemagic macOS runner
}

// 3. ios/ folder if exists
try {
  const iosDir = path.resolve(process.cwd(), 'ios');
  if (fs.existsSync(iosDir)) {
    fs.writeFileSync(path.join(iosDir, 'export_options.plist'), plistContent, 'utf8');
    console.log('[Codemagic Prep] ios/export_options.plist created.');
  }
} catch {
  // Safe to ignore
}
