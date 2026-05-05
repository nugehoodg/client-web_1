const fs = require('fs');
const path = require('path');

const filePath = path.join('c:/Users/Nuge/Documents/gita-web/src/app/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace specific opacities first
content = content.replace(/bg-\[#f5ead3\]\/90/g, 'bg-[var(--bg-color-90)]');
content = content.replace(/border-\[#2449a6\]\/20/g, 'border-[var(--primary-color-20)]');
content = content.replace(/bg-\[#2449a6\]\/10/g, 'bg-[var(--primary-color-10)]');
content = content.replace(/text-\[#2449a6\]\/80/g, 'text-[var(--primary-color-80)]');
content = content.replace(/text-\[#2449a6\]\/70/g, 'text-[var(--primary-color-70)]');
content = content.replace(/border-\[#2449a6\]\/10/g, 'border-[var(--primary-color-10)]');
content = content.replace(/border-\[#ed4024\]\/30/g, 'border-[var(--accent-color-30)]');

// Replace the raw hex codes with var() everywhere else
content = content.replace(/#f5ead3/g, 'var(--bg-color)');
content = content.replace(/#2449a6/g, 'var(--primary-color)');
content = content.replace(/#ed4024/g, 'var(--accent-color)');

// Now let's insert the theme extraction and <style> block
const themeExtract = `
  const page = tinaData?.page || {};
  const links = page.links || {};
  const services = page.services || [];

  const theme = page.theme || {};
  const bgColor = theme.backgroundColor || '#f5ead3';
  const primaryColor = theme.primaryColor || '#2449a6';
  const accentColor = theme.accentColor || '#ed4024';

  const dotRef = useRef<HTMLDivElement>(null);`;

content = content.replace(`
  const page = tinaData?.page || {};
  const links = page.links || {};
  const services = page.services || [];

  const dotRef = useRef<HTMLDivElement>(null);`, themeExtract);

const styleBlock = `
  // Loading state
  if (!tinaData) return <div className="min-h-screen bg-[var(--bg-color)] flex items-center justify-center text-[var(--primary-color)] font-bold">Loading...</div>;

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: \`
        :root {
          --bg-color: \${bgColor};
          --primary-color: \${primaryColor};
          --accent-color: \${accentColor};
          --bg-color-90: \${bgColor}E6;
          --primary-color-10: \${primaryColor}1A;
          --primary-color-20: \${primaryColor}33;
          --primary-color-70: \${primaryColor}B3;
          --primary-color-80: \${primaryColor}CC;
          --accent-color-30: \${accentColor}4D;
        }
      \`}} />
      <div className="min-h-screen flex flex-col selection:bg-[var(--accent-color)] selection:text-white relative z-0 bg-[var(--bg-color)]">`;

content = content.replace(`
  // Loading state
  if (!tinaData) return <div className="min-h-screen bg-[var(--bg-color)] flex items-center justify-center text-[var(--primary-color)] font-bold">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col selection:bg-[var(--accent-color)] selection:text-white relative z-0">`, styleBlock);

// Also handle the wrapper div replacement properly because the original text didn't have var() before script runs
// Wait, the order of replacements means that by the time we do content.replace(...) for the return block, the hex codes are ALREADY var()
// Yes! I updated the strings in replace() to use var(--...) for the search pattern.

// Fix one edge case: the wrapper div originally was:
// <div className="min-h-screen flex flex-col selection:bg-[var(--accent-color)] selection:text-white relative z-0 bg-[var(--bg-color)]">
// Oh wait, in the original it was: <div className="min-h-screen flex flex-col selection:bg-[#ed4024] selection:text-white relative z-0">
// After hex replacement it becomes: <div className="min-h-screen flex flex-col selection:bg-[var(--accent-color)] selection:text-white relative z-0">
// And I need to add bg-[var(--bg-color)] to it, which I did in the styleBlock replacement string. Wait! The original didn't have bg-[#f5ead3] on that div!
// It was: <div className="min-h-screen flex flex-col selection:bg-[#ed4024] selection:text-white relative z-0">
// So my replacement search string is correct.

// Let's also fix the closing tag for the new Fragments
content = content.replace(`
      <div ref={ringRef} className="hidden md:block fixed top-0 left-0 w-10 h-10 border-2 border-[var(--primary-color)] rounded-full pointer-events-none z-[9999] transform -translate-x-1/2 -translate-y-1/2 magic-ring-transition"></div>
    </div>
  );`, `
      <div ref={ringRef} className="hidden md:block fixed top-0 left-0 w-10 h-10 border-2 border-[var(--primary-color)] rounded-full pointer-events-none z-[9999] transform -translate-x-1/2 -translate-y-1/2 magic-ring-transition"></div>
    </div>
    </>
  );`);

fs.writeFileSync(filePath, content);
console.log('Done');
