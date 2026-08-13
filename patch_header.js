const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');
code = code.replace("import { CapaQrModal } from './CapaQrModal';", "import { CapaQrModal } from './CapaQrModal';\nimport { PoloEgyptLogo } from './PoloEgyptLogo';");
code = code.replace(
  '<img src="/assets/polo-egypt-logo.png" alt="Polo Egypt" className="h-10 sm:h-12 w-auto object-contain" onError={(e) => { e.currentTarget.style.display = \'none\'; }} />',
  '<PoloEgyptLogo size="sm" lightMode={true} />'
);
fs.writeFileSync('src/components/Header.tsx', code);
